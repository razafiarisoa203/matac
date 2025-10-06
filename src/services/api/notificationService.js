import axiosConfig from "./axios.config";

// Service Notification (CORRIGÉ)
export const notificationService = {
  async getAllNotifications() {
    try {
      const response = await axiosConfig.get('/servicenotification/notifications');
      console.log('All notifications retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error.response?.data || error.message);
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await axiosConfig.patch(`/servicenotification/notifications/${notificationId}/read`);
      console.log('Notification marked as read:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error.response?.data || error.message);
      throw error;
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await axiosConfig.delete(`/servicenotification/notifications/${notificationId}`);
      console.log('Notification deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error.response?.data || error.message);
      throw error;
    }
  },

  async broadcastNotification(notificationData) {
    try {
      const response = await axiosConfig.post('/servicenotification/notifications/broadcast', notificationData);
      console.log('Broadcast notification posted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la notification de diffusion:', error.response?.data || error.message);
      throw error;
    }
  },

  //envoi notification envoyer admin
  async sendNotif({ to, subject, body, filePath = "" }) {
    try {
      const response = await axiosConfig.post(`/servicenotification/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, body, filePath }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de l'envoi de la notification: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de notifier l'admin:", error);
      throw error;
    }
  }

};