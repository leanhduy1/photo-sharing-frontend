import axiosClient from "./axiosClient";

const photoApi = {
  getByUserId(userId) {
    return axiosClient.get(`/photo/photosOfUser/${userId}`);
  },
  addComment(photoId, commentData) {
    return axiosClient.post(`/photo/commentsOfPhoto/${photoId}`, { comment: commentData });
  },
  uploadPhoto(file) {
    const formData = new FormData();
    formData.append("photo", file);

    return axiosClient.post("/photo/new", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  toggleLike(photoId) {
    return axiosClient.post(`/photo/like/${photoId}`);
  },
  deleteComment(photoId, commentId) {
    return axiosClient.delete(`/photo/commentsOfPhoto/${photoId}/${commentId}`);
  },
  updateComment(photoId, commentId, commentText) {
    return axiosClient.put(`/photo/commentsOfPhoto/${photoId}/${commentId}`, {
      comment: commentText,
    });
  },
};

export default photoApi;
