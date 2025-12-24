import axiosClient from "./axiosClient";

const authApi = {
  login(login_name, password) {
    return axiosClient.post("/admin/login", { login_name, password });
  },
  logout() {
    return axiosClient.post("/admin/logout");
  },
  register(userData) {
    return axiosClient.post("/user", userData);
  },
  checkAuth() {
    return axiosClient.get("/admin/check");
  },
};

export default authApi;
