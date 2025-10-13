'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Stack,
  alpha,
  useTheme,
  Fade,
  Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Professional Components
import ProfessionalFoundationHeader from '@/components/Foundation/ProfessionalFoundationHeader';
import ProfessionalMetricsCards from '@/components/Foundation/ProfessionalMetricsCards';
import {
  ProfessionalFundingChart, 
  ProfessionalCampaignChart 
} from '@/components/Foundation/ProfessionalChartSection';
import ProfessionalActivityFeed from '@/components/Foundation/ProfessionalActivityFeed';
import ProfessionalQuickActions from '@/components/Foundation/ProfessionalQuickActions';

// Configure dayjs plugins
dayjs.extend(relativeTime);

const ProfessionalFoundationDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalFunds: 250000,
    availableFunds: 185000,
    totalDonations: 125000,
    totalCampaigns: 8,
    activeCampaigns: 5,
    totalDonors: 234,
    grantOpportunities: 3,
    activeGrants: 2,
    monthlyGrowth: 15.3,
    donationGrowth: 23.7,
    campaignSuccess: 87,
  });

  // Sample chart data for professional components
  const fundingChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    donations: [25000, 32000, 28000, 41000, 36000, 42500],
    grants: [15000, 18000, 22000, 20000, 25000, 28000]
  };

  const campaignChartData = {
    labels: ['Medical Research', 'Education', 'Community Development', 'Environmental', 'Healthcare'],
    values: [5, 3, 4, 2, 3],
    total: 17
  };

  // Event handlers
  const handleMenuClick = useCallback(() => {
    console.log('Menu clicked');
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    console.log('Search:', searchTerm);
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLastUpdated(dayjs().fromNow());
      setLoading(false);
    }, 2000);
  }, []);

  const handleExport = useCallback(() => {
    console.log('Export report');
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Foundation Dashboard',
        text: 'Check out our foundation performance',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, []);

  const handleCreateCampaign = useCallback(() => {
    console.log('Create new campaign');
  }, []);

  const handleActionClick = useCallback((action) => {
    console.log('Action clicked:', action.id);
    if (action.action) {
      action.action();
    }
  }, []);

  // Initialize last updated on mount
  useEffect(() => {
    setLastUpdated(dayjs().fromNow());
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: '100vh', backgroundColor: alpha('#f8f9fa', 0.3) }}>
        {/* Professional Header */}
        <ProfessionalFoundationHeader
          onMenuClick={handleMenuClick}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          onExport={handleExport}
          onShare={handleShare}
          onCreateCampaign={handleCreateCampaign}
          lastUpdated={lastUpdated}
          isLoading={loading}
        />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
          <Fade in timeout={500}>
            <Box>
              {/* Enhanced Metrics Cards */}
              <ProfessionalMetricsCards 
                dashboardData={dashboardData} 
                loading={loading}
              />

        {/* Charts Section */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {/* Funding Trends Chart */}
                <Grid item xs={12} lg={8}>
                  <ProfessionalFundingChart 
                    data={fundingChartData}
                    loading={loading}
            />
          </Grid>

                {/* Campaign Distribution Chart */}
                <Grid item xs={12} lg={4}>
                  <ProfessionalCampaignChart 
                    data={campaignChartData}
                    loading={loading}
            />
          </Grid>
        </Grid>

              {/* Activity Feed and Additional Content */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {/* Recent Activities */}
                <Grid item xs={12} lg={6}>
                  <ProfessionalActivityFeed 
                    loading={loading}
                    maxItems={6}
            />
          </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} lg={6}>
                  <Box sx={{ height: '100%' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 3,
                        color: theme.palette.text.primary
                      }}
                    >
                      Foundation Management
                    </Typography>
                    <ProfessionalQuickActions 
                      onActionClick={handleActionClick}
                    />
                  </Box>
          </Grid>
        </Grid>
            </Box>
          </Fade>
      </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default ProfessionalFoundationDashboard;