import { Typography, Card, CardMedia, CardContent, Divider, Box, TextField, Button } from "@mui/material";
import "./styles.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import photoApi from "../../api/photoApi";
import { IMAGES_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

function UserPhotos () { 
    const formatDateTime = (dateTime) => {
      return new Date(dateTime).toLocaleString();
    }
    
    const { userId } = useParams();
    const { photosRefesh } = useAuth();

    const [photos, setPhotos] = useState([]);
    const [photoLoading, setPhotoLoading] = useState(true);
    const [photoError, setPhotoError] = useState(null);

    const [commentInputs, setCommentInputs] = useState({});
    const [commentLoading, setCommentLoading] = useState({});
    const [commentError, setCommentError] = useState({});

    useEffect(() => {
      let cancelled = false;

      const fetchPhotos = async () => {
        setPhotoLoading(true);
        setPhotoError(null);

        try {
          const data = await photoApi.getByUserId(userId);
          if (!cancelled) setPhotos(data);
        } catch (err) {
          if (!cancelled) setPhotoError(err.message);
        } finally {
          if (!cancelled) setPhotoLoading(false);
        }
      };

      fetchPhotos();
      return () => { cancelled = true; };
    }, [userId, photosRefesh]);
    
    const handleCommentChange = (photoId, value) => {
      setCommentInputs((prev) => ({ ...prev, [photoId]: value }));
      if (commentError[photoId]) {
        setCommentError((prev) => ({ ...prev, [photoId]: null }));
      }
    };

    const handleCommentSubmit = async (photoId) => {
      const commentText = commentInputs[photoId]?.trim();
      if (!commentText) {
        setCommentError((prev) => ({ ...prev, [photoId]: null }));
        return;
      }

      setCommentLoading((prev) => ({ ...prev, [photoId]: true }));
      setCommentError((prev) => ({ ...prev, [photoId]: null }));

      try {
        const newComment = await photoApi.addComment(photoId ,commentText)

        setPhotos((prevPhotos) => 
          prevPhotos.map(photo => {
            if (photo._id === photoId) {
              return { ...photo, comments: [...(photo.comments || []), newComment] }
            }
            return photo;
          })
        )
      } catch (error) {
        setCommentError((prev) => ({ ...prev, [photoId]: error.message }));
      } finally {
        setCommentLoading((prev) => ({ ...prev, [photoId]: false }));
      }

      setCommentInputs((prev) => ({ ...prev, [photoId]: '' }));
    }

    if (photoLoading) {
      return <Typography sx={{ p: 2 }}>Loading photos...</Typography>;
    }

    if (photoError) {
      return <Typography color="error" sx={{ p: 2 }}>{photoError}</Typography>;
    }

    if (photos.length === 0) {
      return <Typography sx={{ p: 2 }}>No photos found for this user.</Typography>;
    }

    return (
      <div>
        {photos.map((photo) => (
          <Card key={photo._id} sx={{ marginBottom: 3}} >
            <CardMedia 
              component="img"
              image={`${IMAGES_BASE_URL}/${photo.file_name}`}
              alt={photo.file_name}
              sx={{ maxHeight: 400, maxWidth: "100%", objectFit: "contain", marginTop: 1}}
            />

            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(photo.date_time)}
              </Typography>

              {photo.comments && photo.comments.length > 0 && (
                <Box sx={{ marginTop: 2}}>
                  <Typography variant="h6">Comments</Typography>
                  
                  <Divider sx={{ marginBottom: 2 }} />
                  
                  {photo.comments.map((comment) => (
                    <Box key={comment._id} sx={{ marginBottom: 2}}>
                      <Typography variant="body2" color="text.secondary">
                        <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none' }}>
                          {comment.user.first_name} {comment.user.last_name}
                        </Link> - {formatDateTime(comment.date_time)}
                      </Typography>
                      
                      <Typography variant="body2">
                        {comment.comment}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )} 

              <Box sx={{ marginTop: 2 }}>
                <Divider sx={{ marginBottom: 1 }} />

                <Box sx={{display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField 
                    fullWidth
                    multiline
                    size="small"
                    value={commentInputs[photo._id] || ''}
                    onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                    error={Boolean(commentError[photo._id])}
                    helperText={commentError[photo._id]}
                    disabled={commentLoading[photo._id]}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleCommentSubmit(photo._id)}
                    disabled={commentLoading[photo._id] || !(commentInputs[photo._id]?.trim())}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
    );
}

export default UserPhotos;
