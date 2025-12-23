import { Typography, Card, CardMedia, CardContent, Divider, Box } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import photoApi from "../../api/photoApi";
import { IMAGES_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";
import CommentForm from "./CommentForm";

function UserPhotos() { 
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };
  
  const { userId } = useParams();
  const { photosRefesh } = useAuth();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return () => { cancelled = true; };
  }, [userId, photosRefesh]);

  const handleCommentSubmit = async (photoId, commentText) => {
    try {
      const newComment = await photoApi.addComment(photoId, commentText);

      setPhotos((prevPhotos) => 
        prevPhotos.map(photo => {
          if (photo._id === photoId) {
            return { 
              ...photo, 
              comments: [...(photo.comments || []), newComment] 
            };
          }
          return photo;
        })
      );
    } catch (error) {
      throw error; 
    }
  };

  if (loading) {
    return <Typography sx={{ p: 2 }}>Loading photos...</Typography>;
  }

  if (error) {
    return <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;
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

            {photo.comments && photo.comments.length > 0 && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6">Comments</Typography>
                
                <Divider sx={{ marginBottom: 2 }} />
                
                {photo.comments.map((comment) => (
                  <Box key={comment._id} sx={{ marginBottom: 2 }}>
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

              <CommentForm 
                photoId={photo._id} 
                onSubmitComment={handleCommentSubmit}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;