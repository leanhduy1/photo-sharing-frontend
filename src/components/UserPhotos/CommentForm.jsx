import { Box, TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";

function CommentForm({ photoId, onSubmitComment }) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm();
  const [submitError, setSubmitError] = useState(null);

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      await onSubmitComment(photoId, data.comment);
      reset(); // Clear input sau khi submit thành công
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(onSubmit)} 
      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <TextField 
          fullWidth
          multiline
          size="small"
          placeholder="Add a comment..."
          {...register('comment', { 
            required: 'Comment cannot be empty',
            validate: value => value.trim() !== '' || 'Comment cannot be empty'
          })}
          error={!!errors.comment}
          helperText={errors.comment?.message}
          disabled={isSubmitting}
        />
        
        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ minWidth: '80px' }}>
          {isSubmitting ? 'Adding...' : 'Add'}
        </Button>
      </Box>

      {submitError && (<Typography variant="body2" color="error">{submitError}</Typography>)}
    </Box>
  );
}

export default CommentForm;