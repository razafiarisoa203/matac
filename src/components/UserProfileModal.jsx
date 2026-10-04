import React, { useEffect, useMemo } from 'react';
import { User } from 'lucide-react';

export const UserProfileModal = ({
  user,
  photoUrl,
  roles = [],
  rolesLoading = false,
  roleToAdd = '',
  setRoleToAdd,
  roleActionLoading = false,
  onClose,
  onRemoveRole,
  onAddRole,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const availableRoles = useMemo(() => {
    if (!Array.isArray(roles)) return [];
    const assignedIds = (user?.appUserRoles || [])
      .filter((ur) => ur?.role?.role_id !== undefined && ur?.role?.role_id !== null)
      .map((ur) => ur.role.role_id.toString());

    return roles.filter(
      (r) => r?.role_id !== undefined && !assignedIds.includes(r.role_id.toString())
    );
  }, [roles, user?.appUserRoles]);

  if (!user) return null;

  const userId = user.user_id || user.id;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-md w-full p-6 text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-slate-100">Détails de l'utilisateur</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold p-1 leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={user?.user_pseudo || 'Photo profil'}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-700"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <User className="h-8 w-8 text-slate-400" />
            </div>
          )}
          <div className="overflow-hidden">
            <p className="font-semibold text-lg text-slate-100 truncate">
              {user?.user_pseudo || user?.username || 'Non défini'}
            </p>
            <p className="text-sm text-slate-400 truncate">{user?.user_email || user?.email || 'N/A'}</p>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-y-3 text-sm border-t border-b border-slate-800 py-4 mb-4">
          <dt className="text-slate-400 font-medium">Téléphone</dt>
          <dd className="col-span-2 text-slate-200">{user?.user_phone || user?.phone || 'Non défini'}</dd>

          <dt className="text-slate-400 font-medium">ID Utilisateur</dt>
          <dd className="col-span-2 break-all text-slate-200 font-mono text-xs">{userId || 'N/A'}</dd>

          <dt className="text-slate-400 font-medium">Rôles actuels</dt>
          <dd className="col-span-2">
            {Array.isArray(user?.appUserRoles) && user.appUserRoles.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {user.appUserRoles.map((ur, idx) => {
                  const roleId = ur?.role?.role_id;
                  const roleName = ur?.role?.role_name || 'Inconnu';
                  if (!roleId) return null;

                  return (
                    <span
                      key={`modal-role-${roleId}-${idx}`}
                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800"
                    >
                      <span>{roleName}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveRole && onRemoveRole(userId, roleId)}
                        disabled={roleActionLoading}
                        className="flex items-center justify-center h-4 w-4 rounded-full text-emerald-400 hover:bg-emerald-900 hover:text-red-400 disabled:opacity-50"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">Aucun rôle attribué</span>
            )}
          </dd>
        </dl>

        <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Ajouter un rôle à cet utilisateur
          </label>
          <div className="flex gap-2">
            <select
              value={roleToAdd}
              onChange={(e) => setRoleToAdd && setRoleToAdd(e.target.value)}
              className="flex-1 text-sm px-2.5 py-1.5 border border-slate-600 rounded-md bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Sélectionner un rôle...</option>
              {rolesLoading ? (
                <option disabled>Chargement des rôles...</option>
              ) : availableRoles.length === 0 ? (
                <option disabled>Tous les rôles sont attribués</option>
              ) : (
                availableRoles.map((role) => (
                  <option key={`modal-opt-${role.role_id}`} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))
              )}
            </select>

            <button
              type="button"
              onClick={onAddRole}
              disabled={roleActionLoading || !roleToAdd}
              className="text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-md disabled:opacity-50 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};