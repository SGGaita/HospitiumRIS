'use client';

import React, { memo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  useTheme
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';

const TrendAnalytics = memo(({ analyticsData, loading }) => {
  const theme = useTheme();

  return (
    <Box>
      {/* Page Title */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <TimelineIcon sx={{ fontSize: 32, color: '#8b6cbc' }} />
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            color: theme.palette.text.primary,
            mb: 0.5
          }}>
            Trend Analytics
          </Typography>
          <Typography variant="body1" sx={{ 
            color: theme.palette.text.secondary
          }}>
            Time-based analysis and forecasting of donation patterns
          </Typography>
        </Box>
      </Stack>

      {/* Coming Soon Card */}
      <Card sx={{ 
        borderRadius: 3,
        border: '2px dashed rgba(139, 108, 188, 0.3)',
        backgroundColor: 'rgba(139, 108, 188, 0.02)'
      }}>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <ConstructionIcon sx={{ 
            fontSize: 80, 
            color: 'rgba(139, 108, 188, 0.4)',
            mb: 3
          }} />
          
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2
          }}>
            Trend Analytics Coming Soon
          </Typography>
          
          <Typography variant="body1" sx={{ 
            color: theme.palette.text.secondary,
            mb: 3,
            maxWidth: 500,
            mx: 'auto'
          }}>
            Advanced time-based analysis including seasonal patterns, growth forecasting,
            anomaly detection, and predictive modeling for donation trends.
          </Typography>

          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            <Chip label="Seasonal Patterns" variant="outlined" color="primary" />
            <Chip label="Growth Forecasting" variant="outlined" color="primary" />
            <Chip label="Anomaly Detection" variant="outlined" color="primary" />
            <Chip label="Predictive Modeling" variant="outlined" color="primary" />
            <Chip label="Trend Alerts" variant="outlined" color="primary" />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
});

TrendAnalytics.displayName = 'TrendAnalytics';

export default TrendAnalytics;
