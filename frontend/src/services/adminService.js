import axios from "axios";

const API_URL = "http://localhost:5000/admins";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const adminService = {
  getAll: async () => {
    const res = await axios.get(API_URL, getAuthHeaders());
    return res.data;
  },

  create: async ({ name, email, password }) => {
    const res = await axios.post(API_URL, { name, email, password }, getAuthHeaders());
    return res.data;
  },

  update: async (id, { name, email, password }) => {
    const res = await axios.put(`${API_URL}/${id}`, { name, email, password }, getAuthHeaders());
    return res.data;
  },

  delete: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return res.data;
  },
};