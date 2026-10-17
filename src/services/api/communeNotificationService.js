// src/services/api/communeNotificationService.js
import axiosConfig from "./axios.config";
import { notificationService } from "./notificationService";
import { authService } from "./authService";

const COMMUNE_APP_ID = Number(import.meta.env.VITE_COMMUNE_APP_ID) || 15;
export const ROLE_SERVICE_TECHNIQUE = 50;

function extractRoleIds(user) {
  const ids = [];
  const push = (r) => {
    const role = r?.role || r;
    const id = role?.role_id ?? role?.id ?? role?.roleId;
    if (id != null && !Number.isNaN(Number(id))) ids.push(Number(id));
  };
  if (Array.isArray(user?.appUserRoles)) user.appUserRoles.forEach(push);
  if (Array.isArray(user?.roles)) user.roles.forEach(push);
  if (Array.isArray(user?.userRoles)) user.userRoles.forEach(push);
  return ids;
}

function getBearerToken() {
  // Même logique que axios interceptor — ne dépend pas de authService.getToken()
  // (qui refuse un token expiré et bloque tout)
  return (
    sessionStorage.getItem("app_jwt") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("app_jwt") ||
    null
  );
}

/**
 * Liste les user_id des agents Service Technique (rôle 50).
 */
export async function getServiceTechniqueUserIds({ municipalityId = null } = {}) {
  const token = getBearerToken();
  if (!token) {
    console.warn("[communeNotification] Pas de token disponible pour lister les ST");
    return [];
  }

  try {
    const { data } = await axiosConfig.get(
      `/serviceauth/users/application/${COMMUNE_APP_ID}`,
      {
        params: { page: 1, limit: 2000 },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const list = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
          ? data
          : [];

    console.log(
      "[communeNotification] Users app",
      COMMUNE_APP_ID,
      "→",
      list.length,
      "users"
    );

    const muni =
      municipalityId != null && String(municipalityId).trim() !== ""
        ? String(municipalityId).trim()
        : null;

    // 1) Tous les ST (sans filtre commune)
    const allSt = [];
    for (const u of list) {
      const roleIds = extractRoleIds(u);
      if (!roleIds.includes(ROLE_SERVICE_TECHNIQUE)) continue;
      const uid = u.user_id || u.id;
      if (uid) {
        allSt.push({
          userId: String(uid),
          municipality_id: String(u.municipality_id ?? u.municipalityId ?? ""),
          roles: roleIds,
          pseudo: u.user_pseudo || u.username || "",
        });
      }
    }

    console.log("[communeNotification] ST trouvés (tous):", allSt);

    if (allSt.length === 0) {
      // Debug : afficher un sample de rôles pour comprendre le mapping
      const sample = list.slice(0, 5).map((u) => ({
        id: u.user_id || u.id,
        roles: extractRoleIds(u),
        rawRoles: u.appUserRoles || u.roles || u.userRoles,
        muni: u.municipality_id,
      }));
      console.warn(
        "[communeNotification] Aucun user avec role_id=50. Sample rôles:",
        sample
      );
      return [];
    }

    // 2) Filtre commune si possible, sinon on garde tous les ST
    if (muni) {
      const filtered = allSt.filter(
        (u) => !u.municipality_id || u.municipality_id === muni
      );
      if (filtered.length > 0) {
        console.log(
          "[communeNotification] ST filtrés par municipality",
          muni,
          "→",
          filtered.length
        );
        return filtered.map((u) => u.userId);
      }
      console.info(
        "[communeNotification] Aucun ST pour municipality",
        muni,
        "→ on notifie tous les ST"
      );
    }

    return allSt.map((u) => u.userId);
  } catch (e) {
    console.warn(
      "[communeNotification] Erreur liste users:",
      e?.response?.status,
      e?.response?.data || e?.message
    );
    return [];
  }
}

/**
 * Notifie en interne tous les Service Technique.
 */
export async function notifyServiceTechniqueOnSubmission({
  message,
  domain = "alignement",
  dossierId = null,
  authorId = null,
}) {
  const userInfo = authService.getUserInfo() || {};
  const municipalityId =
    userInfo.municipality_id || userInfo.municipalityId || null;

  const resolvedAuthorId =
    authorId ||
    userInfo.id_citizen ||
    userInfo.user_id ||
    authService.getUserId() ||
    null;

  let targetIds = await getServiceTechniqueUserIds({ municipalityId });

  // Fallback admin
  const fallbackId =
    import.meta.env.VITE_ABBR_ADMIN_USER_ID ||
    import.meta.env.ABBR_ADMIN_USER_ID;
  if (targetIds.length === 0 && fallbackId) {
    console.info(
      "[communeNotification] Aucun ST → fallback admin",
      fallbackId
    );
    targetIds = [String(fallbackId)];
  }

  if (targetIds.length === 0) {
    console.warn("[communeNotification] Aucun destinataire Service Technique");
    return { notified: 0, userIds: [] };
  }

  console.log("[communeNotification] Envoi ST →", {
    domain,
    count: targetIds.length,
    userIds: targetIds,
    message,
  });

  const results = await Promise.allSettled(
    targetIds.map((userId) =>
      notificationService.broadcastNotification({
        userId,
        authorId: resolvedAuthorId,
        message,
        domain,
        dossier_id: dossierId,
        title:
          domain === "construction"
            ? "Nouvelle demande – Permis de construction"
            : "Nouvelle demande – Alignement",
        type: "new_submission",
      })
    )
  );

  const notified = results.filter((r) => r.status === "fulfilled").length;
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.warn(
        "[communeNotification] Échec notif",
        targetIds[i],
        r.reason?.response?.data || r.reason?.message
      );
    }
  });

  console.log(
    `[communeNotification] ${notified}/${targetIds.length} notifications envoyées`
  );
  return { notified, userIds: targetIds };
}