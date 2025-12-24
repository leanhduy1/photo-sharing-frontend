import { Box, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";

function CommentForm({ photoId, onSubmitComment }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = async (data) => {
    setError("comment", null);
    try {
      await onSubmitComment(photoId, data.comment);
      reset();
    } catch (error) {
      setError("comment", { message: error.message });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
        <TextField
          fullWidth
          multiline
          size="small"
          placeholder="Add a comment..."
          {...register("comment", {
            required: "Comment cannot be empty",
            validate: (value) => value.trim() !== "" || "Comment cannot be empty",
          })}
          error={!!errors.comment}
          helperText={errors.comment?.message}
          disabled={isSubmitting}
          onBlur={() => clearErrors("comment")}
        />

        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ minWidth: "80px" }}>
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </Box>
    </Box>
  );
}

export default CommentForm;
