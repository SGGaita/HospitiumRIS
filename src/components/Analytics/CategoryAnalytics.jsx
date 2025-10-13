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
  Category as CategoryIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';

const CategoryAnalytics = memo(({ analyticsData, loading }) => {
  const theme = useTheme();

  return (
    <Box>
      {/* Page Title */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <CategoryIcon sx={{ fontSize: 32, color: '#8b6cbc' }} />
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            color: theme.palette.text.primary,
            mb: 0.5
          }}>
            Category Analytics
          </Typography>
          <Typography variant="body1" sx={{ 
            color: theme.palette.text.secondary
          }}>
            Performance analysis across different fundraising categories
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
            Category Analytics Coming Soon
          </Typography>
          
          <Typography variant="body1" sx={{ 
            color: theme.palette.text.secondary,
            mb: 3,
            maxWidth: 500,
            mx: 'auto'
          }}>
            Advanced category-based analysis including performance comparisons,
            seasonal trends, donor preferences, and category optimization insights.
          </Typography>

          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            <Chip label="Category Comparison" variant="outlined" color="primary" />
            <Chip label="Seasonal Trends" variant="outlined" color="primary" />
            <Chip label="Donor Preferences" variant="outlined" color="primary" />
            <Chip label="Performance Metrics" variant="outlined" color="primary" />
            <Chip label="Optimization Tips" variant="outlined" color="primary" />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
});

CategoryAnalytics.displayName = 'CategoryAnalytics';

export default CategoryAnalytics;
