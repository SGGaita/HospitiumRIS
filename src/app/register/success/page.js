'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Fade,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useThemeMode } from '../../../components/ThemeProvider';

const RegisterSuccessPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode } = useThemeMode();
  
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      setUserEmail(decodeURIComponent(email));
    }
  }, [searchParams]);

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleResendEmail = () => {
    router.push('/resend-activation');
  };

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
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.mode === 'dark' ? '#404040' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 3 }}>
            <Image
              src={isDarkMode ? "/hospitium-logo-dark.png" : "/hospitium-logo.png"}
              alt="Hospitium RIS"
              width={160}
              height={36}
              style={{ marginBottom: '16px' }}
              priority
            />
          </Box>

          <Fade in={true}>
            <Box>
              {/* Success Icon */}
              <CheckCircleIcon 
                sx={{ 
                  fontSize: 64, 
                  color: theme.palette.success.main, 
                  mb: 2 
                }} 
              />
              
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, color: theme.palette.success.main }}>
                Registration Successful!
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 3, color: theme.palette.text.secondary }}>
                Welcome to Hospitium RIS
              </Typography>

              {/* Email Verification Alert */}
              <Alert 
                severity="info" 
                sx={{ mb: 3, textAlign: 'left' }}
                icon={<EmailIcon />}
              >
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Please check your email to activate your account</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We've sent an activation link to: <strong>{userEmail}</strong>
                </Typography>
              </Alert>

              {/* Instructions Card */}
              <Card sx={{ mb: 4, textAlign: 'left', backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                    📧 What's Next?
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Typography variant="body2" sx={{ 
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        flexShrink: 0,
                      }}>
                        1
                      </Typography>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Check your email inbox
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Look for an email from Hospitium RIS with your activation link
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Typography variant="body2" sx={{ 
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        flexShrink: 0,
                      }}>
                        2
                      </Typography>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Click the activation link
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Click "Activate My Account" button in the email to verify your account
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Typography variant="body2" sx={{ 
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        flexShrink: 0,
                      }}>
                        3
                      </Typography>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Login to your account
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          After activation, you can login and start using Hospitium RIS
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="body2">
                  <strong>Important:</strong> The activation link will expire in 24 hours. 
                  If you don't see the email, please check your spam/junk folder.
                </Typography>
              </Alert>

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleResendEmail}
                  startIcon={<RefreshIcon />}
                  sx={{ px: 3, py: 1.5 }}
                >
                  Resend Email
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleLoginClick}
                  startIcon={<LoginIcon />}
                  sx={{ px: 3, py: 1.5 }}
                >
                  Go to Login
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleHomeClick}
                  startIcon={<HomeIcon />}
                  sx={{ px: 3, py: 1.5 }}
                >
                  Back to Home
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                Having trouble? Contact our support team for assistance.
              </Typography>
            </Box>
          </Fade>

          {/* Footer */}
          <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Hospitium RIS - Research Information System
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterSuccessPage;
