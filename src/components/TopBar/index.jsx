import { AppBar, Button, Toolbar, Typography, Box } from "@mui/material";
import { useLocation, matchPath, useNavigate } from "react-router-dom";
import "./styles.css";
import userApi from "../../api/userApi";
import authApi from "../../api/authApi";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import UploadPhotoDialog from "./UploadPhotoDialog";

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, refreshPhotos } = useAuth();
  const [contextTitle, setContextTitle] = useState("Photo Sharing");

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const buildTitle = async () => {
      const { pathname } = location;

      if (!user || pathname === "/login") {
        if (!cancelled) setContextTitle("Photo Sharing");
        return;
      }

      const photosMatch = matchPath("/photos/:userId", pathname);
      if (photosMatch) {
        try {
          const fetchedUser = await userApi.getById(photosMatch.params.userId);
          if (!cancelled) setContextTitle(`Photos of ${fetchedUser.first_name} ${fetchedUser.last_name}`);
        } catch {
          if (!cancelled) setContextTitle("Photos");
        }
        return;
      }

      const userMatch = matchPath("/users/:userId", pathname);
      if (userMatch) {
        try {
          const fetchedUser = await userApi.getById(userMatch.params.userId);
          if (!cancelled) setContextTitle(`${fetchedUser.first_name} ${fetchedUser.last_name}`);
        } catch {
          if (!cancelled) setContextTitle("User Detail");
        }
        return;
      }

      if (!cancelled) setContextTitle(pathname === "/users" ? "User List" : "Photo Sharing");
    };

    buildTitle();
  }, [location, user]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate("/login");
    }
  };

  const handleOpenUpload = () => {
    setUploadDialogOpen(true);
  };

  const handleCloseUpload = () => {
    setUploadDialogOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">
            {user ? `Hi ${user.first_name}` : "Please Login"}
          </Typography>

          <Typography variant="h6">{contextTitle}</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user && (
              <>
                <Button
                  color="inherit"
                  onClick={handleOpenUpload}
                  variant="outlined"
                  size="small"
                >
                  Upload Photo
                </Button>

                <Button color="inherit" onClick={handleLogout} variant="outlined" size="small">
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <UploadPhotoDialog
        open={uploadDialogOpen}
        onClose={handleCloseUpload}
        onUploadSuccess={refreshPhotos}
      />
    </>
      
  );
}