import api from "./api";

export const getSessions = () => api.get("/session");
export const startSession = (payload) => api.post("/session/start", payload);
export const endSession = (id) => api.post(`/session/end/${id}`);
export const deleteSession = (id) => api.delete(`/session/${id}`);
