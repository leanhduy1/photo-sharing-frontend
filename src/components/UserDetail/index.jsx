import { Typography, Button, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import userApi from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import EditUserDialog from "./EditProfileDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";

function UserDetail() {
  const { userId } = useParams();
  const { user: currentUser, login } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await userApi.getById(userId);
        if (!cancelled) setUser(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleEditProfile = async (userData) => {
    try {
      const updatedUser = await userApi.update(userData);
      setUser(updatedUser);
      login(updatedUser);
    } catch (err) {
      console.error("Failed to update user:", err);
      throw err;
    }
  };

  if (loading) {
    return <Typography sx={{ p: 2 }}>Loading user details...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h4" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        {currentUser && currentUser._id === user._id && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => setEditOpen(true)}>
              Edit Profile
            </Button>
            <Button variant="outlined" onClick={() => setChangePasswordOpen(true)}>
              Change Password
            </Button>
          </Box>
        )}
      </Box>
      {user.location && <Typography variant="body1">Location: {user.location}</Typography>}
      {user.occupation && <Typography variant="body1">Occupation: {user.occupation}</Typography>}
      {user.description && (
        <Typography variant="body1" paragraph>
          Description: {user.description}
        </Typography>
      )}
      <Button variant="contained" component={Link} to={`/photos/${user._id}`}>
        View Photos
      </Button>

      <EditUserDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        currentUser={user}
        onSubmit={handleEditProfile}
      />

      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </div>
  );
}

export default UserDetail;
