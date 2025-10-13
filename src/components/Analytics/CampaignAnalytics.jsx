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
  Campaign as CampaignIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';

const CampaignAnalytics = memo(({ analyticsData, loading }) => {
  const theme = useTheme();

  return (
    <Box>
      {/* Page Title */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <CampaignIcon sx={{ fontSize: 32, color: '#8b6cbc' }} />
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            color: theme.palette.text.primary,
            mb: 0.5
          }}>
            Campaign Analytics
          </Typography>
          <Typography variant="body1" sx={{ 
            color: theme.palette.text.secondary
          }}>
            In-depth analysis of individual campaign performance and ROI
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
            Campaign Analytics Coming Soon
          </Typography>
          
          <Typography variant="body1" sx={{ 
            color: theme.palette.text.secondary,
            mb: 3,
            maxWidth: 500,
            mx: 'auto'
          }}>
            We're building comprehensive campaign analysis tools including performance tracking,
            ROI calculations, audience insights, and campaign comparison features.
          </Typography>

          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            <Chip label="Performance Tracking" variant="outlined" color="primary" />
            <Chip label="ROI Analysis" variant="outlined" color="primary" />
            <Chip label="Audience Insights" variant="outlined" color="primary" />
            <Chip label="A/B Testing" variant="outlined" color="primary" />
            <Chip label="Campaign Comparison" variant="outlined" color="primary" />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
});

CampaignAnalytics.displayName = 'CampaignAnalytics';

export default CampaignAnalytics;
