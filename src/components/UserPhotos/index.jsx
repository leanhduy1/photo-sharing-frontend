import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import photoApi from "../../api/photoApi";
import { IMAGES_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";
import CommentForm from "./CommentForm";
import EditCommentDialog from "./EditCommentDialog";
function UserPhotos() {
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const { userId } = useParams();
  const { user, photosRefesh } = useAuth();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteComment, setDeleteComment] = useState(null);
  const [editComment, setEditComment] = useState(null);
  const [deletePhoto, setDeletePhoto] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await photoApi.getByUserId(userId);
        if (!cancelled) setPhotos(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPhotos();
    return () => {
      cancelled = true;
    };
  }, [userId, photosRefesh]);

  const handleLike = async (photoId) => {
    try {
      const result = await photoApi.toggleLike(photoId);

      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) => {
          if (photo._id === photoId) {
            return {
              ...photo,
              likes: result.likes,
              isLiked: result.isLiked,
            };
          }
          return photo;
        })
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentSubmit = async (photoId, commentText) => {
    try {
      const newComment = await photoApi.addComment(photoId, commentText);

      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) => {
          if (photo._id === photoId) {
            return {
              ...photo,
              comments: [...(photo.comments || []), newComment],
            };
          }
          return photo;
        })
      );
    } catch (error) {
      throw error;
    }
  };

  const handleCommentDelete = async () => {
    if (!deleteComment) return;

    try {
      await photoApi.deleteComment(deleteComment.photoId, deleteComment.commentId);

      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) => {
          if (photo._id === deleteComment.photoId) {
            return {
              ...photo,
              comments: photo.comments.filter((c) => c._id !== deleteComment.commentId),
            };
          }
          return photo;
        })
      );
      setDeleteComment(null);
    } catch (error) {
      setDeleteComment(null);
      throw error;
    }
  };

  const handlePhotoDelete = async () => {
    if (!deletePhoto) return;

    try {
      await photoApi.deletePhoto(deletePhoto.photoId);

      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo._id !== deletePhoto.photoId));
      setDeletePhoto(null);
    } catch (error) {
      setDeletePhoto(null);
      throw error;
    }
  };

  const handleCommentEdit = async (newCommentText) => {
    if (!editComment) return;

    try {
      const editedComment = await photoApi.updateComment(
        editComment.photoId,
        editComment.commentId,
        newCommentText
      );

      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) => {
          if (photo._id === editComment.photoId) {
            return {
              ...photo,
              comments: photo.comments.map((c) =>
                c._id === editComment.commentId ? { ...c, ...editedComment } : c
              ),
            };
          }
          return photo;
        })
      );
    } catch (error) {
      throw error;
    }
  };

  const handleDownload = (photoId) => {
    const downloadUrl = photoApi.getDownloadUrl(photoId);
    window.open(downloadUrl, "_blank");
  };

  if (loading) {
    return <Typography sx={{ p: 2 }}>Loading photos...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        {error}
      </Typography>
    );
  }

  if (photos.length === 0) {
    return <Typography sx={{ p: 2 }}>No photos found for this user.</Typography>;
  }

  return (
    <div>
      {photos.map((photo) => (
        <Card key={photo._id} sx={{ marginBottom: 3 }}>
          <CardMedia
            component="img"
            image={`${IMAGES_BASE_URL}/${photo.file_name}`}
            alt={photo.file_name}
            sx={{ maxHeight: 400, maxWidth: "100%", objectFit: "contain", marginTop: 1 }}
          />

          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {formatDateTime(photo.date_time)}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 1 }}>
              <Button size="small" variant="outlined" onClick={() => handleDownload(photo._id)}>
                Download
              </Button>

              {user._id === photo.user_id && (
                <Button
                  variant="outlined"
                  onClick={() => setDeletePhoto({ photoId: photo._id })}
                  size="small"
                >
                  Delete Photo
                </Button>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Button
                onClick={() => handleLike(photo._id)}
                variant={photo.isLiked ? "contained" : "outlined"}
                size="small"
              >
                {photo.isLiked ? "Unlike" : "Like"}
              </Button>

              <Typography variant="body2">{photo.likes || 0} likes</Typography>
            </Box>

            {photo.comments && photo.comments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Comments</Typography>

                <Divider sx={{ marginBottom: 2 }} />

                {photo.comments.map((comment) => (
                  <Box key={comment._id} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <Link to={`/users/${comment.user._id}`} style={{ textDecoration: "none" }}>
                          {comment.user.first_name} {comment.user.last_name}
                        </Link>{" "}
                        - {formatDateTime(comment.date_time)}
                      </Typography>

                      {user._id === comment.user._id && (
                        <>
                          <Button
                            onClick={() =>
                              setDeleteComment({
                                photoId: photo._id,
                                commentId: comment._id,
                              })
                            }
                            size="small"
                            variant="contained"
                          >
                            Delete
                          </Button>
                          <Button
                            onClick={() =>
                              setEditComment({
                                photoId: photo._id,
                                commentId: comment._id,
                                currentComment: comment.comment,
                              })
                            }
                            size="small"
                            variant="contained"
                          >
                            Edit
                          </Button>
                        </>
                      )}
                    </Box>

                    <Typography variant="body2">{comment.comment}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ marginTop: 2 }}>
              <Divider sx={{ marginBottom: 1 }} />

              <CommentForm photoId={photo._id} onSubmitComment={handleCommentSubmit} />
            </Box>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!deleteComment} onClose={() => setDeleteComment(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>Are you sure you want to delete this comment?</DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteComment(null)} size="small">
            Cancel
          </Button>
          <Button onClick={handleCommentDelete} color="error" size="small">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deletePhoto} onClose={() => setDeletePhoto(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>Are you sure you want to delete this photo?</DialogContent>

        <DialogActions>
          <Button onClick={() => setDeletePhoto(null)} size="small">
            Cancel
          </Button>
          <Button onClick={handlePhotoDelete} color="error" size="small">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <EditCommentDialog
        open={!!editComment}
        onClose={() => setEditComment(null)}
        onSubmit={handleCommentEdit}
        currentComment={editComment?.currentComment || ""}
      />
    </div>
  );
}

export default UserPhotos;
