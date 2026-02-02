import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  Snackbar,
  Alert,
  Fade,
} from '@mui/material';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);

  const handleSubmit = (e) => {
<<<<<<< HEAD
  e.preventDefault();

  if (username.trim() === 'admin' && password.trim() === 'password123') {
    localStorage.setItem('isHubLoggedIn', 'true');
    console.log('Login SUCCESS - flag set to true'); // for debugging

    // Force navigation + reload to ensure route protection sees the change
    navigate('/hub', { replace: true });
    window.location.href = '/hub'; // extra force reload (temporary for demo)
  } else {
    setErrorOpen(true);
    console.log('Login FAILED - wrong credentials');
  }
};
=======
    e.preventDefault();

    // Demo credentials check
    if (username.trim() === 'admin' && password.trim() === 'password123') {
      localStorage.setItem('isHubLoggedIn', 'true');
      navigate('/hub', { replace: true });
      setErrorOpen(false);
    } else {
      setErrorOpen(true);
    }
  };
>>>>>>> d99357b06c420c1ce4f436a6341d35b4ade5f133

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          "linear-gradient(rgba(10,14,23,0.85), rgba(10,14,23,0.85)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover no-repeat fixed",
        p: 3,
      }}
    >
      <Fade in timeout={600}>
        <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ width: '100%', maxWidth: 1000, px: 3 }}>
          {/* Left: Logo */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box component="img" src="/logo.png" alt="VeriLogistics Logo" sx={{ width: 280, maxWidth: '80%', display: 'block', mx: 'auto' }} />
          </Grid>

          {/* Right: Login card */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card
              sx={{
                width: '100%',
                maxWidth: 520,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                p: { xs: 4, sm: 6 },
                textAlign: 'center',
              }}
            >
              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorOpen) setErrorOpen(false);
                  }}
                  InputProps={{ style: { color: '#000000' } }} // Black text when typing
                  InputLabelProps={{ style: { color: '#334155' } }}
                />

                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorOpen) setErrorOpen(false);
                  }}
                  InputProps={{ style: { color: '#000000' } }} // Black text when typing
                  InputLabelProps={{ style: { color: '#334155' } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    background: 'linear-gradient(90deg, #07b85e, #058c45)',
                    color: '#fff',
                    py: 1.8,
                    borderRadius: 3,
                    fontWeight: 700,
                    '&:hover': { background: 'linear-gradient(90deg, #059669, #047857)' },
                  }}
                >
                  Submit
                </Button>

                {/* Centered Create an account link */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#334155' }}>
                    Not registered?{' '}
                    <Button
                      onClick={() => navigate('/seller')}
                      sx={{
                        textTransform: 'none',
                        color: '#00d4ff',
                        fontWeight: 600,
                        minWidth: 0,
                        p: 0,
                        '&:hover': { background: 'transparent', textDecoration: 'underline' },
                      }}
                    >
                      Create an account
                    </Button>
                  </Typography>
                </Box>

                {/* Demo credentials note */}
                <Typography variant="caption" sx={{ color: '#64748b', mt: 2, textAlign: 'center' }}>
                  Demo credentials: Username: admin | Password: password123
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Fade>

      {/* Error Snackbar */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
          Invalid credentials
        </Alert>
      </Snackbar>
    </Box>
  );
}