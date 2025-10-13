'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Alert,
  Stack,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  AccountCircle as OrcidIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useThemeMode } from '../../components/ThemeProvider';
import { useAuth } from '../../components/AuthProvider';

// NoSSR wrapper component to prevent hydration mismatch
const NoSSR = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return children;
};

const LoginPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { isDarkMode, isClient } = useThemeMode();
  const { login: authLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setGeneralError('');
    setErrors({});
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Login successful:', data);
        
        // Update auth context with user data
        await authLogin({
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          givenName: data.user.givenName,
          familyName: data.user.familyName,
          orcidId: data.user.orcidId,
          orcidGivenNames: data.user.orcidGivenNames,
          orcidFamilyName: data.user.orcidFamilyName,
          primaryInstitution: data.user.primaryInstitution,
          accountType: data.user.accountType,
          role: data.user.role,
          emailVerified: data.user.emailVerified,
          status: data.user.status,
          createdAt: data.user.createdAt,
        });
        
        // Redirect to role-specific dashboard
        router.push(data.dashboardRoute);
      } else {
        // Handle different error scenarios
        if (data.needsActivation) {
          setGeneralError(data.message);
          // Optional: Auto-redirect to resend activation after a delay
          setTimeout(() => {
            if (data.redirectTo) {
              router.push(data.redirectTo);
            }
          }, 3000);
        } else if (data.field) {
          // Field-specific error
          setErrors({ [data.field]: data.message });
        } else {
          // General error
          setGeneralError(data.message);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setGeneralError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === 'ORCID') {
      handleOrcidLogin();
    } else {
      console.log(`Login with ${provider}`);
      // Implement other social login logic
    }
  };

  const handleOrcidLogin = () => {
    try {
      console.log('🚀 Initiating ORCID login...');

      // Clear any existing errors
      setGeneralError('');
      setErrors({});

      // Check for required environment variables
      const clientId = process.env.NEXT_PUBLIC_ORCID_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_ORCID_REDIRECT_URI;
      const scope = process.env.NEXT_PUBLIC_ORCID_SCOPE || '/authenticate';
      const orcidUrl = process.env.NEXT_PUBLIC_ORCID_SANDBOX_URL || 'https://sandbox.orcid.org/oauth/authorize';

      if (!clientId || !redirectUri) {
        setGeneralError('ORCID login is not properly configured. Please contact support.');
        return;
      }

      // Generate state parameter for CSRF protection
      const state = btoa(JSON.stringify({
        timestamp: Date.now(),
        random: Math.random().toString(36).substring(7)
      }));

      // Build ORCID authorization URL
      const authUrl = `${orcidUrl}?`
        + `client_id=${encodeURIComponent(clientId)}`
        + `&response_type=code`
        + `&scope=${encodeURIComponent(scope)}`
        + `&redirect_uri=${encodeURIComponent(redirectUri)}`
        + `&state=${encodeURIComponent(state)}`;

      console.log('🔗 ORCID Auth URL:', authUrl);

      // Store state in cookie for verification
      document.cookie = `orcid_state=${state}; path=/; max-age=600; secure=${process.env.NODE_ENV === 'production'}; samesite=strict`;
      
      // Redirect to ORCID
      window.location.href = authUrl;

    } catch (error) {
      console.error('❌ ORCID login error:', error);
      setGeneralError('Failed to initiate ORCID login. Please try again.');
    }
  };

  // Handle ORCID login errors from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('login');
    
    if (error) {
      setGeneralError(decodeURIComponent(error));
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (success === 'success') {
      // This would be handled by redirect, but just in case
      console.log('✅ Login successful via ORCID');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.mode === 'dark' ? '#404040' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <NoSSR
              fallback={
                <Image
                  src="/hospitium-logo.png"
                  alt="Hospitium RIS"
                  width={160}
                  height={36}
                  style={{ marginBottom: '16px' }}
                  priority
                />
              }
            >
              <Image
                src={isDarkMode ? "/hospitium-logo-dark.png" : "/hospitium-logo.png"}
                alt="Hospitium RIS"
                width={160}
                height={36}
                style={{ marginBottom: '16px' }}
                priority
              />
            </NoSSR>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Sign in to your account to continue
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* General Error Alert */}
            {generalError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {generalError}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {/* Remember Me and Forgot Password */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link
                href="/forgot-password"
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                mb: 3,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Divider */}
            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>

            {/* Social Login Buttons */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin('Google')}
                sx={{ py: 1.5 }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<OrcidIcon />}
                onClick={() => handleSocialLogin('ORCID')}
                sx={{ 
                  py: 1.5,
                  '& .MuiButton-startIcon': {
                    color: '#A6CE39', // ORCID brand color
                  },
                }}
              >
                ORCID
              </Button>
            </Stack>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>

            {/* Resend Activation Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Need to activate your account?{' '}
                <Link
                  href="/resend-activation"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Resend activation email
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage; 