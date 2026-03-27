import axios from 'axios';
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: BASE });
export const fetchProfile = async (username) => {
  const { data } = await api.get(`/profile/${username}`);
  return data; // { cached: bool, data: reportObj }
};
export const fetchCompare = async (u1, u2) => {
  const { data } = await api.get(`/compare?u1=${u1}&u2=${u2}`);
  return data; // { data: [report1, report2] }
};
