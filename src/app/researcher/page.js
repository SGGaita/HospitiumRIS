'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as WriteIcon,
  Assignment as ProposalIcon,
  Article as ArticleIcon,
  Work as ProjectIcon,
  Groups as CollaborationIcon,
  Hub as NetworkIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Create as CreateIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../components/AuthProvider';
import PageHeader from '../../components/common/PageHeader';
import KenyaNetworkVisualization from '../../components/KenyaNetworkVisualization';

const ResearcherDashboard = () => {
  const theme = useTheme();
  const { user, isLoading } = useAuth();
  const [currentDate, setCurrentDate] = useState('');
  const [greeting, setGreeting] = useState('');

  // Mock data for dashboard
  const [dashboardData] = useState({
    stats: {
      totalPublications: { value: 3, change: '+10%', trend: 'up' },
      ongoingProjects: { value: 0, change: '+0%', trend: 'neutral' },
      collaborations: { value: 0, change: '+20%', trend: 'up' },
      networkSize: { value: 3, change: '+16%', trend: 'up' },
      citationImpact: { value: 156, change: '+25%', trend: 'up' }
    },
    collaborativeWritings: [
      {
        id: 1,
        title: 'Machine Learning Applications in Medical Diagnosis',
        type: 'Research Paper',
        collaborators: ['Dr. Smith', 'Prof. Johnson'],
        status: 'Draft'
      },
      {
        id: 2,
        title: 'COVID-19 Impact on Healthcare Systems',
        type: 'Review Article',
        collaborators: ['Dr. Brown', 'Dr. Wilson'],
        status: 'Review'
      }
    ],
    recentPublications: [
      {
        id: 1,
        title: 'Neural Networks in Biomedical Applications',
        journal: 'Nature Medicine',
        year: 2024,
        citations: 45
      },
      {
        id: 2,
        title: 'Advances in Telemedicine Technologies',
        journal: 'JAMA',
        year: 2024,
        citations: 23
      },
      {
        id: 3,
        title: 'AI-Driven Drug Discovery Methods',
        journal: 'Science',
        year: 2023,
        citations: 88
      }
    ],
    analyticsData: {
      publicationsOverTime: [
        { month: 'Jan', count: 0 },
        { month: 'Feb', count: 1 },
        { month: 'Mar', count: 1 },
        { month: 'Apr', count: 0 },
        { month: 'May', count: 1 },
        { month: 'Jun', count: 0 }
      ]
    }
  });

  // Get time-appropriate greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  // Initialize date and greeting, and update greeting periodically
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString('en-US', options));
      setGreeting(getTimeBasedGreeting());
    };

    // Set initial values
    updateDateTime();

    // Update greeting every 30 minutes to catch time boundary changes
    const interval = setInterval(updateDateTime, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Get user's display name
  const getUserDisplayName = () => {
    if (isLoading) return 'User';
    if (!user) return 'User';
    
    // Try different name fields
    if (user.firstName) {
      return user.firstName;
    } else if (user.fullName) {
      return user.fullName.split(' ')[0]; // Get first name from full name
    } else if (user.name) {
      return user.name.split(' ')[0]; // Get first name from name
    } else if (user.email) {
      return user.email.split('@')[0]; // Use email username as fallback
    }
    return 'User';
  };

  const actionButtons = (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          fontWeight: 600,
          borderRadius: 2,
          px: 3,
          py: 1,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        New Collaborative Writing
      </Button>
      <Button
        variant="contained"
        startIcon={<ProposalIcon />}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          fontWeight: 600,
          borderRadius: 2,
          px: 3,
          py: 1,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        New Project Proposal
      </Button>
    </Stack>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        mt:8,
      }}
    >
      <PageHeader
        title={`${greeting}, ${getUserDisplayName()}!`}
        description={
          <>
            Here's what's happening with your research today
            <br />
            <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>
              {currentDate}
            </span>
          </>
        }
        actionButton={actionButtons}
        gradient="linear-gradient(135deg, #8b6cbc 0%, #a084d1 100%)"
      />
      
      {/* Dashboard Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Publications */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card elevation={2} sx={{ 
              background: 'linear-gradient(135deg, #8b6cbc 0%, #a084d1 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <ArticleIcon sx={{ fontSize: 24, opacity: 0.8 }} />
                  <Chip 
                    label={dashboardData.stats.totalPublications.change}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {dashboardData.stats.totalPublications.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Publications
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                  vs last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Ongoing Projects */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card elevation={2} sx={{ 
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <ProjectIcon sx={{ fontSize: 24, opacity: 0.8 }} />
                  <Chip 
                    label={dashboardData.stats.ongoingProjects.change}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {dashboardData.stats.ongoingProjects.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Ongoing Projects
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                  active projects
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Collaborations */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card elevation={2} sx={{ 
              background: 'linear-gradient(135deg, #4ECDC4 0%, #6ED4CC 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <CollaborationIcon sx={{ fontSize: 24, opacity: 0.8 }} />
                  <Chip 
                    label={dashboardData.stats.collaborations.change}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {dashboardData.stats.collaborations.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Collaborations
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                  active writings
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Network Size */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card elevation={2} sx={{ 
              background: 'linear-gradient(135deg, #45B7D1 0%, #67C3D6 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <NetworkIcon sx={{ fontSize: 24, opacity: 0.8 }} />
                  <Chip 
                    label={dashboardData.stats.networkSize.change}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {dashboardData.stats.networkSize.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Network Size
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                  researchers
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Citation Impact */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card elevation={2} sx={{ 
              background: 'linear-gradient(135deg, #F7B731 0%, #F9CA24 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 24, opacity: 0.8 }} />
                  <Chip 
                    label={dashboardData.stats.citationImpact.change}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {dashboardData.stats.citationImpact.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Citation Impact
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                  total citations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          </Grid>

        <Grid container spacing={4}>
          {/* Research Analytics */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card elevation={3}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BarChartIcon sx={{ color: '#8b6cbc' }} />
                    Research Analytics
                </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label="Trend" size="small" variant="outlined" />
                    <Chip label="Status" size="small" variant="outlined" />
                    <Chip label="Types" size="small" variant="outlined" />
                    <IconButton size="small" sx={{ color: '#8b6cbc' }}>
                      <AssessmentIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Simple Chart */}
                <Box sx={{ 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'end', 
                  justifyContent: 'space-around',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  p: 2,
                  mb: 2
                }}>
                  {dashboardData.analyticsData.publicationsOverTime.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box sx={{ 
                        width: 40,
                        height: (item.count * 50) + 20,
                        backgroundColor: '#8b6cbc',
                        borderRadius: 1,
                        mb: 1,
                        opacity: item.count === 0 ? 0.3 : 1
                      }} />
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {item.month}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#8b6cbc', fontWeight: 700 }}>3</Typography>
                    <Typography variant="caption">Total Publications</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#FF6B6B', fontWeight: 700 }}>0</Typography>
                    <Typography variant="caption">Published</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#4ECDC4', fontWeight: 700 }}>0</Typography>
                    <Typography variant="caption">In Progress</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
                  </Grid>

          {/* Active Work */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimelineIcon sx={{ color: '#8b6cbc' }} />
                    Active Work
                  </Typography>
                  <IconButton size="small" sx={{ color: '#8b6cbc' }}>
                    <AddIcon />
                  </IconButton>
                </Box>

                {/* Collaborative Writings */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WriteIcon fontSize="small" sx={{ color: '#8b6cbc' }} />
                      Collaborative Writings
                    </Typography>
                    <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem', py: 0.5 }}>
                      View All
                    </Button>
                  </Box>

                  <Typography variant="caption" sx={{ color: '#666', mb: 2, display: 'block' }}>
                    Sort by: Recent
                  </Typography>

                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <WriteIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No collaborative writings found
                    </Typography>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      startIcon={<CreateIcon />}
                      sx={{ fontSize: '0.8rem' }}
                    >
                      Start Writing
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Research Collaboration Network */}
          <Grid size={{ xs: 12 }}>
            <KenyaNetworkVisualization />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ResearcherDashboard;
