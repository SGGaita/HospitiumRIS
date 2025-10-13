'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const ActivatePage = () => {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Invalid activation link.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/activate?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setSuccess(true);
        } else {
          setError(data.message || 'Activation failed. Please try again.');
        }
      } catch (error) {
        setError('Network error. Please try again.');
      }

      setLoading(false);
    };

    activateAccount();
  }, [searchParams]);

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b6cbc 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(139, 108, 188, 0.2)',
            p: { xs: 3, sm: 4 },
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 4 }}>
            <Image
              src="/hospitium-logo.png"
              alt="Hospitium RIS"
              width={180}
              height={40}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>

          {/* Loading State */}
          {loading && (
            <Box>
              <CircularProgress 
                size={40} 
                sx={{ color: '#8b6cbc', mb: 3 }} 
              />
              <Typography variant="h5" sx={{ mb: 1 }}>
                Activating Your Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please wait...
              </Typography>
            </Box>
          )}

          {/* Success State */}
          {success && (
            <Box>
              <CheckCircleIcon 
                sx={{ 
                  fontSize: 60, 
                  color: theme.palette.success.main, 
                  mb: 2 
                }} 
              />
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: theme.palette.success.main }}>
                Account Activated!
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.secondary }}>
                Your account is now active. You can login and start using Hospitium RIS.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleLoginClick}
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: '#8b6cbc',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#7a5ba8',
                  },
                }}
              >
                Login Now
              </Button>
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Box>
              <ErrorIcon 
                sx={{ 
                  fontSize: 60, 
                  color: theme.palette.error.main, 
                  mb: 2 
                }} 
              />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: theme.palette.error.main }}>
                Activation Failed
              </Typography>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Button
                variant="outlined"
                onClick={() => router.push('/resend-activation')}
                sx={{ 
                  borderColor: '#8b6cbc',
                  color: '#8b6cbc',
                  '&:hover': {
                    borderColor: '#7a5ba8',
                    backgroundColor: 'rgba(139, 108, 188, 0.1)',
                  },
                }}
              >
                Get New Activation Link
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ActivatePage;
