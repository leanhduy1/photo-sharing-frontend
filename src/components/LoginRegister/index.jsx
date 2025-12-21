import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../api/authApi";
import { Alert, Button, TextField, Typography, Box, Paper } from '@mui/material'

function LoginRegister() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Login state
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Register state
  const [registerData, setRegisterData] = useState({
    login_name: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    location: '',
    description: '',
    occupation: ''
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  if (user) {
    return <Typography variant="h6">You already logged in</Typography>;
  }


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const userData = await authApi.login(loginName, loginPassword);
      login(userData);
      navigate(`/users/${userData._id}`);
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  }

  const handleRegisterChange = (field) => (e) => {
    setRegisterData((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
    setRegisterError(null);
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError(null);
    
    if (registerData.password !== registerData.confirm_password) {
      setRegisterError("Passwords do not match");
      return;
    }

    if (!registerData.login_name.trim()) {
      setRegisterError("Login name is required");
      return;
    }

    if (!registerData.password.trim()) {
      setRegisterError("Password is required");
      return;
    }

    if (!registerData.first_name.trim()) {
      setRegisterError("First name is required");
      return;
    }

    if (!registerData.last_name.trim()) {
      setRegisterError("Last name is required");
      return;
    }

    setRegisterLoading(true);

    try {
      const newUser = await authApi.register(registerData);
      await authApi.login(registerData.login_name, registerData.password);
      login(newUser);
      navigate(`/users/${newUser._id}`);
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setRegisterLoading(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center'}}>
      {/* Login Form */}
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5">Login</Typography>
        
        <form onSubmit={handleLogin}>
          <TextField 
            fullWidth
            label="Login Name"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField 
            fullWidth
            label="Password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            margin="normal"
            required
          />

          {loginError && <Alert severity="error" sx={{ mb: 1 }}>{loginError}</Alert>}

          <Button type="submit" fullWidth variant="contained" disabled={loginLoading || !loginName}>
            {loginLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>

      {/* Register Form */}
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5">Register</Typography>
        
        <form onSubmit={handleRegister}>
          <TextField 
            fullWidth
            label="Login Name"
            value={registerData.login_name}
            onChange={handleRegisterChange('login_name')}
            margin="normal"
            required
          />
          
          <TextField 
            fullWidth
            label="Password"
            type="password"
            value={registerData.password}
            onChange={handleRegisterChange('password')}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={registerData.confirm_password}
            onChange={handleRegisterChange('confirm_password')}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="First Name"
            value={registerData.first_name}
            onChange={handleRegisterChange('first_name')}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Last Name"
            value={registerData.last_name}
            onChange={handleRegisterChange('last_name')}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Location"
            value={registerData.location}
            onChange={handleRegisterChange('location')}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            value={registerData.description}
            onChange={handleRegisterChange('description')}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Occupation"
            value={registerData.occupation}
            onChange={handleRegisterChange('occupation')}
            margin="normal"
          />

          {registerError && <Alert severity="error" sx={{ mb: 1 }}>{registerError}</Alert>}

          <Button type="submit" fullWidth variant="contained" disabled={registerLoading || !registerData.login_name}>
            {registerLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default LoginRegister;