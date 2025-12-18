import axiosClient from './axiosClient';

const userApi = {
    getList() {
        return axiosClient.get('/user/list');
    },
    getById(id) {
        return axiosClient.get(`/user/${id}`);
    },
};

export default userApi;