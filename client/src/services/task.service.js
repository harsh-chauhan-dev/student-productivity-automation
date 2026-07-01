import api from "./api";

export const getTasks = () => api.get("/task/get/tasks");
export const createTask = (payload) => api.post("/task/create/task", payload);
export const updateTask = (id, payload) => api.put(`/task/update/task/${id}`, payload);
export const deleteTask = (id) => api.delete(`/task/delete/task/${id}`);
