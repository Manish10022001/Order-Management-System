import axios from "axios";

//base api
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default api;
