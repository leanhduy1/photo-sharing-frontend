import { useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import photoApi from "../../api/photoApi";

function UploadPhotoDialog({ open, onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef(null);

  const handleClose = () => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(false);
    onClose();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      await photoApi.uploadPhoto(selectedFile);
      setUploadSuccess(true);
      onUploadSuccess();
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Upload New Photo</DialogTitle>

      <DialogContent>
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileSelect}
        />

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Button variant="outlined" onClick={handleChooseFile} disabled={uploading}>
            Choose Photo
          </Button>

          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected File: {selectedFile.name}
            </Typography>
          )}
        </Box>

        {uploadError && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {uploadError}
          </Typography>
        )}

        {uploadSuccess && (
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Photo uploaded successfully!
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>

        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={uploading || !selectedFile || uploadSuccess}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadPhotoDialog;