import axios from "axios";
import { API_BASE_URL } from "../config";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = "Something went wrong";

    if (error.response) {
      const { status, data } = error.response;
      errorMessage = data?.error || getDefaultMessage(status);

      if (status === 401) {
        window.dispatchEvent(new CustomEvent("unauthorized"));
      }
    } else if (error.request) {
      errorMessage = "Unable to connect to server";
    } else {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

function getDefaultMessage(status) {
  const messages = {
    400: "Invalid request",
    401: "Please login first",
    404: "Resource not found",
    409: "Resource already exists",
    500: "Server error, please try again later",
  };
  return messages[status] || "Something went wrong";
}

export default axiosClient;
