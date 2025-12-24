import {
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Dialog,
  Button,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";

const EditProfileDialog = ({ open, onClose, onSubmit, currentUser }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    values: {
      first_name: currentUser.first_name || "",
      last_name: currentUser.last_name || "",
      location: currentUser.location || "",
      occupation: currentUser.occupation || "",
      description: currentUser.description || "",
    },
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
      await onSubmit(data);
      setSuccess(true);
      reset();
    } catch (error) {
      setApiError(error.message || "Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <TextField
            fullWidth
            label="First Name"
            margin="normal"
            {...register("first_name", {
              required: "First name is required",
              validate: (value) => value.trim() !== "" || "First name cannot be empty",
            })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Last Name"
            margin="normal"
            {...register("last_name", {
              required: "Last name is required",
              validate: (value) => value.trim() !== "" || "Last name cannot be empty",
            })}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Location"
            margin="normal"
            {...register("location")}
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Occupation"
            margin="normal"
            {...register("occupation")}
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            {...register("description")}
            disabled={isSubmitting}
          />

          {apiError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {apiError}
            </Typography>
          )}

          {success && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              Profile updated successfully!
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

export default EditProfileDialog;
