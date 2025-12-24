import axiosClient from "./axiosClient";

const userApi = {
  getList() {
    return axiosClient.get("/user/list");
  },
  getById(id) {
    return axiosClient.get(`/user/${id}`);
  },
  update(userData) {
    return axiosClient.put("/user/", userData);
  },
  changePassword(oldPassword, newPassword) {
    return axiosClient.put("/user/password", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },
  search(keyword) {
    return axiosClient.get(`/user/search?q=${encodeURIComponent(keyword)}`);
  },
};

export default userApi;
