import { useEffect, useState, useCallback, useRef } from "react";
import { notificationService } from "../services/api/notificationService";

/**
 * Hook de gestion des notifications via Polling REST
 * Contient des logs complets pour tester dans la console (F12)
 */
export const useNotificationSocket = (userId, pollingIntervalMs = 10000) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref pour comparer les notifications précédentes et détecter les nouvelles
  const prevCountRef = useRef(0);

  // 1. Récupération des notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      console.warn(" [NOTIFICATION TEST] Polling annulé : Aucun ID utilisateur fourni.");
      return;
    }

    try {
      console.log(` [NOTIFICATION TEST] Polling en cours pour userId: ${userId}...`);
      
      const data = await notificationService.getNotificationsByUser(userId);
      const list = Array.isArray(data) ? data : [];

      // Calcul du nombre de non lues
      const unreads = list.filter((n) => !n.isRead).length;

      // Log dans la console pour vérifier l'arrivée de données
      console.group(" [NOTIFICATION TEST] Données reçues du serveur");
      console.log("Total notifications reçues :", list.length);
      console.log("Nombre de non lues :", unreads);
      console.log("Liste des notifications :", list);
      console.groupEnd();

      // Détection visuelle si de nouvelles notifications sont arrivées
      if (unreads > prevCountRef.current) {
        console.log("%c [NOTIFICATION TEST] NOUVELLE NOTIFICATION REÇUE !", "color: #00ff00; font-weight: bold; font-size: 14px;");
      }
      prevCountRef.current = unreads;

      setNotifications(list);
      setUnreadCount(unreads);
      setError(null);
    } catch (err) {
      console.error(" [NOTIFICATION TEST] Erreur lors de la récupération des notifications :", err.message || err);
      setError(err.message || "Erreur de chargement");
    }
  }, [userId]);

  // 2. Marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    console.log(` [NOTIFICATION TEST] Tentative de marquer comme lue : ID=${notificationId}`);
    try {
      await notificationService.markAsRead(notificationId);
      console.log(` [NOTIFICATION TEST] Notification ${notificationId} marquée comme lue sur le serveur.`);

      // Mise à jour de l'état local
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(` [NOTIFICATION TEST] Échec du marquage comme lue pour ID=${notificationId} :`, err.message || err);
    }
  };

  // 3. Tout marquer comme lu
  const markAllAsRead = async () => {
    if (!userId) return;
    console.log(` [NOTIFICATION TEST] Tout marquer comme lu pour l'utilisateur ID=${userId}`);
    try {
      await notificationService.markAllAsReadByUser(userId);
      console.log(" [NOTIFICATION TEST] Toutes les notifications ont été marquées comme lues sur le serveur.");

      // Mise à jour de l'état local
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(" [NOTIFICATION TEST] Échec de 'Tout marquer comme lu' :", err.message || err);
    }
  };

  // 4. Effet de démarrage + Polling
  useEffect(() => {
    if (!userId) {
      console.log(" [NOTIFICATION TEST] Pas d'utilisateur connecté. Le hook est inactif.");
      return;
    }

    console.log(` [NOTIFICATION TEST] Initialisation du système de notification (Intervalle: ${pollingIntervalMs}ms)`);
    
    setIsLoading(true);
    fetchNotifications().finally(() => setIsLoading(false));

    // Polling régulier
    const intervalId = setInterval(fetchNotifications, pollingIntervalMs);

    return () => {
      console.log(" [NOTIFICATION TEST] Nettoyage du Polling (changement d'utilisateur ou démontage).");
      clearInterval(intervalId);
    };
  }, [userId, pollingIntervalMs, fetchNotifications]);

  return {
    isConnected: true,
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};