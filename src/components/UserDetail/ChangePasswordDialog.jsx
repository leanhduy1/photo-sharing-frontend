import { useState } from "react";
import { set, useForm } from "react-hook-form";
import userApi from "../../api/userApi";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Button,
} from "@mui/material";

const ChangePasswordDialog = ({ open, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm();

  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    reset();
    setApiError(null);
    setSuccess(false);
    onClose();
  };

  const onSubmit = async (data) => {
    setApiError(null);
    setSuccess(false);

    try {
      await userApi.changePassword(data.old_password, data.new_password);
      setSuccess(true);
      reset();
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            fullWidth
            label="Old Password"
            type="password"
            {...register("old_password", { required: "Old password is required" })}
            error={!!errors.old_password}
            helperText={errors.old_password?.message}
            disabled={isSubmitting}
            margin="normal"
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            {...register("new_password", {
              required: "New password is required",
              validate: (value) =>
                value.length >= 6 || "Password must be at least 6 characters long",
            })}
            error={!!errors.new_password}
            helperText={errors.new_password?.message}
            disabled={isSubmitting}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            {...register("confirm_password", {
              required: "Confirm password is required",
              validate: (value) => value === watch("new_password") || "Passwords do not match",
            })}
            error={!!errors.confirm_password}
            helperText={errors.confirm_password?.message}
            disabled={isSubmitting}
            margin="normal"
          />

          {apiError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {apiError}
            </Typography>
          )}

          {success && (
            <Typography color="success" sx={{ mt: 2 }}>
              Password changed successfully!
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordDialog;
