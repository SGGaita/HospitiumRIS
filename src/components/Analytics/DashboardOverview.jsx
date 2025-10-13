'use client';

import React, { memo } from 'react';
import {
  Grid,
  Box,
  Typography,
  Stack,
  useTheme
} from '@mui/material';
import {
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

// Import professional components
import ProfessionalStatisticsCards from './ProfessionalStatisticsCards';
import { 
  ProfessionalCampaignChart, 
  ProfessionalCategoryChart, 
  ProfessionalTrendsChart 
} from './ProfessionalCharts';
import ProfessionalDataTable from './ProfessionalDataTable';

const DashboardOverview = memo(({ analyticsData, loading }) => {
  const theme = useTheme();

  // Define columns for top donors table
  const donorColumns = [
    {
      id: 'name',
      label: 'Donor',
      type: 'avatar',
      sortable: true,
      sticky: true,
      minWidth: 200
    },
    {
      id: 'totalAmount',
      label: 'Total Donated',
      type: 'currency',
      sortable: true,
      align: 'right',
      minWidth: 140,
      fontWeight: 600,
      color: (value) => value > 10000 ? '#4caf50' : theme.palette.text.primary
    },
    {
      id: 'donationCount',
      label: 'Donations',
      sortable: true,
      align: 'center',
      minWidth: 100
    },
    {
      id: 'averageAmount',
      label: 'Avg Amount',
      type: 'currency',
      sortable: true,
      align: 'right',
      minWidth: 120
    },
    {
      id: 'firstDonation',
      label: 'First Gift',
      type: 'date',
      sortable: true,
      minWidth: 120
    },
    {
      id: 'lastDonation',
      label: 'Recent Gift',
      type: 'date',
      sortable: true,
      minWidth: 120
    }
  ];

  // Define columns for campaign performance table
  const campaignColumns = [
    {
      id: 'name',
      label: 'Campaign',
      sortable: true,
      sticky: true,
      minWidth: 200,
      fontWeight: 600
    },
    {
      id: 'categoryName',
      label: 'Category',
      type: 'chip',
      sortable: true,
      minWidth: 120,
      getChipColor: (value) => {
        const colorMap = {
          'Education': 'primary',
          'Healthcare': 'success',
          'Environment': 'info',
          'Community': 'warning'
        };
        return colorMap[value] || 'default';
      }
    },
    {
      id: 'raised',
      label: 'Amount Raised',
      type: 'trend',
      sortable: true,
      align: 'right',
      minWidth: 150,
      fontWeight: 600
    },
    {
      id: 'donorCount',
      label: 'Donors',
      sortable: true,
      align: 'center',
      minWidth: 100
    },
    {
      id: 'completionPercentage',
      label: 'Progress',
      type: 'progress',
      sortable: true,
      align: 'center',
      minWidth: 120
    },
    {
      id: 'status',
      label: 'Status',
      type: 'chip',
      sortable: true,
      minWidth: 100,
      getChipColor: (value) => {
        const statusColors = {
          'Active': 'success',
          'Planning': 'warning',
          'Completed': 'info',
          'Paused': 'default'
        };
        return statusColors[value] || 'default';
      }
    }
  ];

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };

  const handleAction = (action, row) => {
    console.log('Action:', action, 'Row:', row);
  };

  return (
    <Box>
      {/* Page Title */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <AnalyticsIcon sx={{ fontSize: 32, color: '#8b6cbc' }} />
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            color: theme.palette.text.primary,
            mb: 0.5
          }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" sx={{ 
            color: theme.palette.text.secondary
          }}>
            Comprehensive overview of your fundraising performance and donor engagement
          </Typography>
        </Box>
      </Stack>

      {/* Key Performance Indicators */}
      <ProfessionalStatisticsCards 
        analyticsData={analyticsData} 
        loading={loading} 
      />

      {/* Charts Section */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Campaign Performance Chart */}
        <Grid item xs={12} lg={8}>
          <ProfessionalCampaignChart 
            analyticsData={analyticsData} 
            loading={loading} 
          />
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} lg={4}>
          <ProfessionalCategoryChart 
            analyticsData={analyticsData} 
            loading={loading} 
          />
        </Grid>

        {/* Monthly Trends */}
        <Grid item xs={12}>
          <ProfessionalTrendsChart 
            analyticsData={analyticsData} 
            loading={loading} 
          />
        </Grid>
      </Grid>

      {/* Data Tables Section */}
      <Grid container spacing={4}>
        {/* Top Donors Table */}
        <Grid item xs={12} lg={6}>
          <ProfessionalDataTable
            title="Top Donors"
            subtitle="Highest contributing donors by total donation amount"
            data={analyticsData?.topDonors || []}
            columns={donorColumns}
            loading={loading}
            pageSize={8}
            onRowClick={handleRowClick}
            onAction={handleAction}
            emptyMessage="No donor data available"
          />
        </Grid>

        {/* Campaign Performance Table */}
        <Grid item xs={12} lg={6}>
          <ProfessionalDataTable
            title="Campaign Performance"
            subtitle="Active and recent fundraising campaigns ranked by performance"
            data={analyticsData?.campaignPerformance || []}
            columns={campaignColumns}
            loading={loading}
            pageSize={8}
            onRowClick={handleRowClick}
            onAction={handleAction}
            emptyMessage="No campaign data available"
          />
        </Grid>
      </Grid>
    </Box>
  );
});

DashboardOverview.displayName = 'DashboardOverview';

export default DashboardOverview;
