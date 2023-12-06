import axios from "axios";
import { getCookie } from "../components/Authentication/authHelpers";

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = getCookie("_token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
