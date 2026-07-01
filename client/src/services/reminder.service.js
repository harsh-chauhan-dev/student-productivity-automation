import api from "./api";

export const getReminders = () => api.get("/reminder");
export const createReminder = (payload) => api.post("/reminder", payload);
export const deleteReminder = (id) => api.delete(`/reminder/${id}`);
