import api from "./api";

export const getNotifications = () => api.get("/notification");
export const markNotificationAsRead = (id) => api.patch(`/notification/${id}/read`);
export const deleteNotification = (id) => api.delete(`/notification/${id}`);
