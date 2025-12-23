import "./App.css";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return <Typography variant="h6">Loading...</Typography>;

  return (
    <Router>
      <TopBar />
      <div className="main-topbar-buffer" />

      {!user ? (
        <Box sx={{ px: 2 }}>
          <Routes>
            <Route path="/login" element={<LoginRegister />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ px: 2 }}>
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>

          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/" element={<Navigate to={`/users/${user._id}`} replace />} />
                <Route path="/users/:userId" element={<UserDetail />} />
                <Route path="/photos/:userId" element={<UserPhotos />} />
                <Route path="/login" element={<Typography variant="h6">You are already logged in</Typography>} />
                <Route path="*" element={<Typography variant="h6">Page not found</Typography>} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
