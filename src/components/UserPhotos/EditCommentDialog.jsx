import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";

const EditCommentDialog = ({ open, onClose, onSubmit, currentComment }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    values: { comment: currentComment || "" },
  });

  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    reset();
    setApiError(null);
    setSuccess(false);
    onClose();
  };

  const onFormSubmit = async (data) => {
    setApiError(null);
    setSuccess(false);

    try {
      await onSubmit(data.comment);
      setSuccess(true);
      reset();
    } catch (error) {
      setApiError(error.message || "Failed to update comment");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Edit Comment</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            {...register("comment", {
              required: "Comment cannot be empty",
              validate: (value) => value.trim() !== "" || "Comment cannot be empty",
            })}
            error={!!errors.comment}
            helperText={errors.comment?.message}
            disabled={isSubmitting}
          />

          {apiError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {apiError}
            </Typography>
          )}

          {success && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              Comment updated successfully!
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="contained">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCommentDialog;
