'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';

const InstitutionDashboard = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        pt: 2, // Add top padding to account for fixed navbar
      }}
    >
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Welcome, Research Administrator!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your institution's research activities, researchers, and programs.
          </Typography>
        </Box>

        {/* Dashboard Cards */}
        <Grid container spacing={3}>
          {/* Institution Overview */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ backgroundColor: '#8b6cbc', mr: 2 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Institution Profile
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Institution information and settings
                </Typography>
                <Chip label="Profile Active" color="success" size="small" sx={{ mb: 2 }} />
                <Button variant="outlined" size="small" fullWidth>
                  Manage Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Researchers */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ backgroundColor: '#8b6cbc', mr: 2 }}>
                    <GroupIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Researchers
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Manage affiliated researchers
                </Typography>
                <Typography variant="h4" sx={{ color: '#8b6cbc', mb: 1 }}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Active Researchers
                </Typography>
                <Button variant="contained" size="small" fullWidth sx={{ backgroundColor: '#8b6cbc' }}>
                  Add Researcher
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Research Programs */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ backgroundColor: '#8b6cbc', mr: 2 }}>
                    <SchoolIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Research Programs
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Institutional research programs
                </Typography>
                <Typography variant="h4" sx={{ color: '#8b6cbc', mb: 1 }}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Active Programs
                </Typography>
                <Button variant="contained" size="small" fullWidth sx={{ backgroundColor: '#8b6cbc' }}>
                  New Program
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Projects Management */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ backgroundColor: '#8b6cbc', mr: 2 }}>
                    <AssignmentIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Project Management
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Institutional Projects
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Oversee and manage all research projects
                </Typography>
                <Button variant="outlined" fullWidth>
                  View All Projects
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Analytics & Reports */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ backgroundColor: '#8b6cbc', mr: 2 }}>
                    <AnalyticsIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Analytics & Reports
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Institutional Metrics
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Research performance and analytics
                </Typography>
                <Button variant="outlined" fullWidth>
                  Generate Reports
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ 
                        backgroundColor: '#8b6cbc',
                        py: 1.5,
                        '&:hover': { backgroundColor: '#7a5ba8' }
                      }}
                    >
                      Invite Researcher
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button variant="outlined" fullWidth sx={{ py: 1.5 }}>
                      Create Program
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button variant="outlined" fullWidth sx={{ py: 1.5 }}>
                      Review Projects
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button variant="outlined" fullWidth sx={{ py: 1.5 }}>
                      Export Data
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InstitutionDashboard;
