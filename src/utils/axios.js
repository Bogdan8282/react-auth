import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
<<<<<<< HEAD
  withCredentials: true,
=======
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
>>>>>>> c4f3df6db72cde81fa94afb116801004a0489691
});

export default instance;
