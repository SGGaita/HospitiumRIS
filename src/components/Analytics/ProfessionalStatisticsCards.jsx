'use client';

import React, { memo, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  alpha,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  InfoOutlined as InfoIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';

// Utility functions
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

const formatPercentage = (value) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Professional skeleton component
const ProfessionalStatisticsSkeleton = memo(() => (
  <Grid container spacing={3}>
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <Grid item xs={12} sm={6} lg={4} xl={2} key={index}>
        <Card sx={{ 
          borderRadius: 4, 
          height: '180px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={140} sx={{ borderRadius: 2 }} />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
));

// Enhanced statistic card component
const StatisticCard = memo(({ stat, index }) => {
  const theme = useTheme();
  const [hover, setHover] = useState(false);

  const getTrendIcon = (trend) => {
    const trendValue = parseFloat(trend.replace(/[^-\d.]/g, ''));
    if (trendValue > 0) return TrendingUpIcon;
    if (trendValue < 0) return TrendingDownIcon;
    return TrendingFlatIcon;
  };

  const getTrendColor = (trend) => {
    const trendValue = parseFloat(trend.replace(/[^-\d.]/g, ''));
    if (trendValue > 0) return '#4caf50';
    if (trendValue < 0) return '#f44336';
    return '#9e9e9e';
  };

  const TrendIcon = getTrendIcon(stat.trend);
  const trendColor = getTrendColor(stat.trend);

  return (
    <Card
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        borderRadius: 4,
        height: '180px',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
        border: `1px solid ${alpha(stat.color, 0.1)}`,
        boxShadow: hover 
          ? `0 8px 32px ${alpha(stat.color, 0.2)}`
          : `0 4px 20px ${alpha(stat.color, 0.08)}`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        transform: hover ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${stat.color}, ${alpha(stat.color, 0.6)})`,
          transition: 'all 0.3s ease'
        }
      }}
    >
      <CardContent sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Header with icon and info */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${stat.color}, ${alpha(stat.color, 0.8)})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${alpha(stat.color, 0.3)}`,
              transition: 'all 0.3s ease'
            }}
          >
            <stat.icon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Tooltip title={`More info about ${stat.title}`}>
            <IconButton size="small" sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Main value */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              color: theme.palette.text.primary,
              fontSize: { xs: '1.5rem', sm: '1.8rem', lg: '2rem' },
              lineHeight: 1.1,
              mb: 0.5
            }}
          >
            {typeof stat.value === 'string' ? stat.value : formatNumber(stat.value)}
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600, 
              color: theme.palette.text.primary,
              fontSize: '1rem',
              mb: 0.5
            }}
          >
            {stat.title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: '0.875rem'
            }}
          >
            {stat.subtitle}
          </Typography>
        </Box>

        {/* Trend and progress */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <TrendIcon sx={{ fontSize: 16, color: trendColor }} />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600, 
                color: trendColor,
                fontSize: '0.75rem'
              }}
            >
              {stat.trend}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: '0.7rem'
              }}
            >
              vs last period
            </Typography>
          </Stack>
          
          {stat.progress !== undefined && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={stat.progress}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: alpha(stat.color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${stat.color}, ${alpha(stat.color, 0.7)})`
                  }
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '0.7rem',
                  mt: 0.5
                }}
              >
                {stat.progress.toFixed(0)}% of target
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
});

const ProfessionalStatisticsCards = memo(({ analyticsData, loading }) => {
  const theme = useTheme();

  if (loading) {
    return <ProfessionalStatisticsSkeleton />;
  }

  const statistics = [
    {
      title: 'Total Raised',
      value: formatCurrency(analyticsData?.overview.totalAmount || 0),
      subtitle: 'Lifetime donations received',
      icon: MoneyIcon,
      color: '#4caf50',
      trend: '+12.5%',
      progress: 75
    },
    {
      title: 'Total Donations',
      value: analyticsData?.overview.totalDonations || 0,
      subtitle: 'Individual donation records',
      icon: AnalyticsIcon,
      color: '#2196f3',
      trend: '+8.3%'
    },
    {
      title: 'Unique Donors',
      value: analyticsData?.overview.uniqueDonors || 0,
      subtitle: 'Individual contributors',
      icon: PeopleIcon,
      color: '#9c27b0',
      trend: '+15.7%'
    },
    {
      title: 'Average Donation',
      value: formatCurrency(analyticsData?.overview.avgDonation || 0),
      subtitle: 'Per donation amount',
      icon: TrendingUpIcon,
      color: '#ff9800',
      trend: '+5.2%'
    },
    {
      title: 'Active Campaigns',
      value: analyticsData?.overview.campaigns || 0,
      subtitle: 'Running fundraising campaigns',
      icon: CampaignIcon,
      color: '#8b6cbc',
      trend: '+2'
    },
    {
      title: 'Retention Rate',
      value: `${analyticsData?.overview.retentionRate?.toFixed(1) || 0}%`,
      subtitle: 'Repeat donor percentage',
      icon: PeopleIcon,
      color: '#00bcd4',
      trend: '+3.8%',
      progress: analyticsData?.overview.retentionRate || 0
    }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: 3,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <AnalyticsIcon sx={{ color: '#8b6cbc' }} />
        Key Performance Indicators
      </Typography>
      
      <Grid container spacing={3}>
        {statistics.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={4} xl={2} key={index}>
            <StatisticCard stat={stat} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

StatisticCard.displayName = 'StatisticCard';
ProfessionalStatisticsSkeleton.displayName = 'ProfessionalStatisticsSkeleton';
ProfessionalStatisticsCards.displayName = 'ProfessionalStatisticsCards';

export default ProfessionalStatisticsCards;
