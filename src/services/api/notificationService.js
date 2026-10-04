// src/services/api/notificationService.js
import axiosConfig from './axios.config';

const BASE_URL = '/servicenotification';

const logError = (message, error) => {
  console.error(message, error?.response?.data || error?.message);
};

export const notificationService = {
  async getAllNotifications() {
    try {
      const response = await axiosConfig.get(`${BASE_URL}/notifications`);
      return response.data;
    } catch (error) {
      logError('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  },

  // 🔹 Récupérer les notifications d'un utilisateur
  async getNotificationsByUser(userId) {
    try {
      const response = await axiosConfig.get(`${BASE_URL}/notifications/${userId}`);
      return response.data;
    } catch (error) {
      logError('Erreur lors de la récupération des notifications utilisateur:', error);
      throw error;
    }
  },

  // 🔹 Récupérer les notifications non lues d'un utilisateur
  async getUnreadNotificationsByUser(userId) {
    try {
      const response = await axiosConfig.get(`${BASE_URL}/notifications/${userId}/unread`);
      return response.data;
    } catch (error) {
      logError('Erreur lors de la récupération des notifications non lues:', error);
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await axiosConfig.post(
        `${BASE_URL}/notifications/${notificationId}/mark-as-read`
      );
      return response.data;
    } catch (error) {
      logError('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  },

  // 🔹 Tout marquer comme lu pour un utilisateur
  async markAllAsReadByUser(userId) {
    try {
      const response = await axiosConfig.post(
        `${BASE_URL}/notifications/mark-all-read/${userId}`
      );
      return response.data;
    } catch (error) {
      logError('Erreur lors du marquage global comme lu:', error);
      throw error;
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await axiosConfig.delete(`${BASE_URL}/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      logError('Erreur lors de la suppression de la notification:', error);
      throw error;
    }
  },

  async broadcastNotification(notificationData) {
    try {
      const response = await axiosConfig.post(
        `${BASE_URL}/notifications/broadcast`,
        notificationData
      );
      return response.data;
    } catch (error) {
      logError('Erreur lors de la création de la notification:', error);
      throw error;
    }
  },

  async sendNotif({ to, subject, body, fromName = 'MATAC2.0', fromEmail = 'no-reply@gmail.com' }) {
    try {
      const response = await axiosConfig.post(`${BASE_URL}/email/send`, {
        to,
        subject,
        body,
        fromName,
        fromEmail,
      });
      return response.data;
    } catch (error) {
      logError("Erreur lors de l'envoi de l'email:", error);
      throw error;
    }
  },
};