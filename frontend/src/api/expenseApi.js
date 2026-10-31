import api from "./client";

export const fetchExpenses = (category) =>
  api.get("/expenses", { params: category ? { category } : {} }).then((r) => r.data);
export const fetchSummary = (category) =>
  api.get("/expenses/summary", { params: category ? { category } : {} }).then((r) => r.data);
export const createExpense = (data) => api.post("/expenses", data).then((r) => r.data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data).then((r) => r.data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
