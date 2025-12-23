import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../api/authApi";
import { Alert, Button, TextField, Typography, Box, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useState } from "react";

function LoginRegister() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [loginApiError, setLoginApiError] = useState(null);
  const [registerApiError, setRegisterApiError] = useState(null);

  // Form cho Login
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting }
  } = useForm();

  // Form cho Register
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: registerSubmitting },
    watch
  } = useForm();

  if (user) {
    return <Typography variant="h6">You already logged in</Typography>;
  }

  const onLoginSubmit = async (data) => {
    setLoginApiError(null);
    try {
      const userData = await authApi.login(data.login_name, data.password);
      login(userData);
      navigate(`/users/${userData._id}`);
    } catch (error) {
      setLoginApiError(error.message);
    }
  };

  const onRegisterSubmit = async (data) => {
    setRegisterApiError(null);
    try {
      const newUser = await authApi.register(data);
      await authApi.login(data.login_name, data.password);
      login(newUser);
      navigate(`/users/${newUser._id}`);
    } catch (error) {
      setRegisterApiError(error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
      {/* Login Form */}
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>

        <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
          <TextField 
            fullWidth
            label="Login Name"
            margin="normal"
            {...loginRegister('login_name', { required: 'Login name is required' })}
            error={!!loginErrors.login_name}
            helperText={loginErrors.login_name?.message}
          />

          <TextField 
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...loginRegister('password', { required: 'Password is required' })}
            error={!!loginErrors.password}
            helperText={loginErrors.password?.message}
          />

          {loginApiError && <Alert severity="error" sx={{ mt: 2 }}>{loginApiError}</Alert>}
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={loginSubmitting}>
            {loginSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>

      {/* Register Form */}
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Register</Typography>
        
        <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
          <TextField 
            fullWidth
            label="Login Name"
            margin="normal"
            {...registerRegister('login_name', { required: 'Login name is required' })}
            error={!!registerErrors.login_name}
            helperText={registerErrors.login_name?.message}
          />

          <TextField 
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...registerRegister('password', { required: 'Password is required' })}
            error={!!registerErrors.password}
            helperText={registerErrors.password?.message}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            {...registerRegister('confirm_password', {
              required: 'Please confirm password',
              validate: value => value === watch('password') || 'Passwords do not match'
            })}
            error={!!registerErrors.confirm_password}
            helperText={registerErrors.confirm_password?.message}
          />

          <TextField
            fullWidth
            label="First Name"
            margin="normal"
            {...registerRegister('first_name', { required: 'First name is required' })}
            error={!!registerErrors.first_name}
            helperText={registerErrors.first_name?.message}
          />

          <TextField
            fullWidth
            label="Last Name"
            margin="normal"
            {...registerRegister('last_name', { required: 'Last name is required' })}
            error={!!registerErrors.last_name}
            helperText={registerErrors.last_name?.message}
          />

          <TextField fullWidth label="Location" margin="normal" {...registerRegister('location')} />
          
          <TextField fullWidth label="Description" margin="normal" {...registerRegister('description')} />
          
          <TextField fullWidth label="Occupation" margin="normal" {...registerRegister('occupation')} />

          {registerApiError && <Alert severity="error" sx={{ mt: 2 }}>{registerApiError}</Alert>}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={registerSubmitting}>
            {registerSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginRegister;