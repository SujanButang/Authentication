import axios from "axios";

const makeRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true,
});

makeRequest.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { makeRequest };
