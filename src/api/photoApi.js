import axiosClient from './axiosClient';

const photoApi = {
    getByUserId(userId) {
        return axiosClient.get(`/photo/photosOfUser/${userId}`);
    },
};

export default photoApi;