import api from "./api";

export const getSubjects = () => api.get("/subject/getall-subject");
export const createSubject = (payload) => api.post("/subject/create-subject", payload);
export const updateSubject = (id, payload) => api.put(`/subject/update-subject/${id}`, payload);
export const deleteSubject = (id) => api.delete(`/subject/delete-subject/${id}`);
