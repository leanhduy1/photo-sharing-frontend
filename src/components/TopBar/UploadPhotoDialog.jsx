import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import photoApi from "../../api/photoApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function UploadPhotoDialog({ open, onClose, onUploadSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm();

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      await photoApi.uploadPhoto(data.photo[0]);
      onUploadSuccess();
      handleClose();
      navigate(`/photos/${user._id}`);
    } catch (error) {
      setError("photo", { message: error.message });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload New Photo</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="file"
            accept="image/*"
            {...register("photo", { required: "Please select a photo" })}
            style={{ display: "block", marginTop: 16, marginBottom: 16 }}
          />
          {errors.photo && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {errors.photo.message}
            </Typography>
          )}
          <DialogActions>
            <Button onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPhotoDialog;
