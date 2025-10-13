'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Stack,
  TextField,
  InputAdornment,
  LinearProgress,
  Tabs,
  Tab,
  alpha,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Assessment as FundOverviewIcon,
  SwapHoriz as FundManagementIcon,
  Receipt as TransactionsIcon,
} from '@mui/icons-material';
import PageHeader from '@/components/common/PageHeader';

const CentralFundPool = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fund data based on user requirements
  const fundData = {
    totalPool: 6000,
    available: 6000,
    monthlyInflow: 0,
    monthlyOutflow: 0,
    fundraisingFunds: {
      total: 6000,
      available: 6000,
      reserved: 0
    },
    grantFunds: {
      total: 0,
      available: 0,
      reserved: 0
    }
  };

  // Fund distribution data
  const fundSources = [
    {
      id: 1,
      name: 'Annual Golfing',
      type: 'Golfing',
      amount: 5000,
      available: 5000,
      reserved: 0,
      status: 'unrestricted',
      category: 'Fundraising'
    },
    {
      id: 2,
      name: 'Test Grant 1',
      type: 'Research Grants',
      amount: 3000,
      available: 3000,
      reserved: 0,
      status: 'restricted',
      category: 'Grants'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      {/* Full-width Page Header */}
      <Box sx={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
        <PageHeader
          title="Central Fund Pool"
          description="Consolidated fund management & allocation"
          icon={<AccountBalanceIcon sx={{ fontSize: 32 }} />}
          breadcrumbs={[
            { label: 'Foundation', path: '/foundation' },
            { label: 'Financial', path: '/foundation/financial' },
            { label: 'Central Fund Pool' }
          ]}
          gradient="linear-gradient(135deg, #8b6cbc 0%, #a084d1 50%, #b794f4 100%)"
        />
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Tabs */}
        <Paper sx={{ borderRadius: 3, mb: 4, overflow: 'hidden' }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              backgroundColor: alpha('#8b6cbc', 0.05),
              '& .MuiTab-root': {
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#8b6cbc'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#8b6cbc',
                height: 3
              }
            }}
          >
            <Tab label="Fund Overview" icon={<FundOverviewIcon />} />
            <Tab label="Fund Management" icon={<FundManagementIcon />} />
            <Tab label="Transactions" icon={<TransactionsIcon />} />
          </Tabs>
        </Paper>

        {/* Search and Export */}
        <Paper sx={{ borderRadius: 3, p: 3, mb: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
            <TextField
              fullWidth
              placeholder="Search funds, transactions, or allocations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<ExportIcon />}
              sx={{
                backgroundColor: '#8b6cbc',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  backgroundColor: '#7a5ba8',
                },
              }}
            >
              Export Report
            </Button>
          </Stack>
        </Paper>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Pool */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: 140 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AccountBalanceIcon sx={{ fontSize: 28, color: '#8b6cbc', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {formatCurrency(fundData.totalPool)}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                  Total Pool
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Consolidated funds
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Available */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: 140 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <MoneyIcon sx={{ fontSize: 28, color: '#2e7d32', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {formatCurrency(fundData.available)}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                  Available
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ready for allocation
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Inflow */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: 140 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 28, color: '#8b6cbc', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: '#8b6cbc' }}>
                  {formatCurrency(fundData.monthlyInflow)}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                  Monthly Inflow
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  New funds received
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Outflow */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: 140 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingDownIcon sx={{ fontSize: 28, color: '#ff9800', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: '#ff9800' }}>
                  {formatCurrency(fundData.monthlyOutflow)}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                  Monthly Outflow
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Funds disbursed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Fund Categories */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Fundraising Funds */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <MoneyIcon sx={{ fontSize: 24, color: '#2e7d32' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Fundraising Funds
                </Typography>
              </Stack>
              
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#2e7d32', mb: 1 }}>
                {formatCurrency(fundData.fundraisingFunds.total)}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Available
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(fundData.fundraisingFunds.available)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Reserved
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(fundData.fundraisingFunds.reserved)}
                  </Typography>
                </Grid>
              </Grid>

              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha('#2e7d32', 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#2e7d32',
                    borderRadius: 4
                  }
                }}
              />
            </Card>
          </Grid>

          {/* Grant Funds */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <AccountBalanceIcon sx={{ fontSize: 24, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Grant Funds
                </Typography>
              </Stack>
              
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#8b6cbc', mb: 1 }}>
                {formatCurrency(fundData.grantFunds.total)}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Available
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(fundData.grantFunds.available)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Reserved
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(fundData.grantFunds.reserved)}
                  </Typography>
                </Grid>
              </Grid>

              <LinearProgress
                variant="determinate"
                value={0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha('#1976d2', 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#1976d2',
                    borderRadius: 4
                  }
                }}
              />
            </Card>
          </Grid>
        </Grid>

        {/* Fund Distribution by Source */}
        <Paper sx={{ borderRadius: 3, p: 4 }}>
          <Typography variant="h6" sx={{ mb: 4, fontSize: '1.25rem' }}>
            Fund Distribution by Source
          </Typography>
          
          <Grid container spacing={3}>
            {fundSources.map((source) => (
              <Grid item xs={12} md={6} key={source.id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: 1,
                  border: `2px solid ${alpha(source.category === 'Fundraising' ? '#2e7d32' : '#1976d2', 0.2)}`,
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {source.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {source.type}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip 
                            label={source.status} 
                            size="small"
                            color={source.status === 'unrestricted' ? 'success' : 'info'}
                          />
                          <Chip 
                            label={source.category} 
                            size="small"
                            sx={{
                              backgroundColor: alpha(source.category === 'Fundraising' ? '#2e7d32' : '#1976d2', 0.1),
                              color: source.category === 'Fundraising' ? '#2e7d32' : '#1976d2'
                            }}
                          />
                        </Stack>
                      </Box>
                    </Stack>

                    <Typography variant="h5" sx={{ 
                      fontWeight: 600, 
                      color: source.category === 'Fundraising' ? '#2e7d32' : '#1976d2',
                      mb: 2 
                    }}>
                      {formatCurrency(source.amount)}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Available
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(source.available)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Reserved
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(source.reserved)}
                        </Typography>
                      </Grid>
                    </Grid>

                    <LinearProgress
                      variant="determinate"
                      value={source.category === 'Fundraising' ? 100 : 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: alpha(source.category === 'Fundraising' ? '#2e7d32' : '#1976d2', 0.1),
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: source.category === 'Fundraising' ? '#2e7d32' : '#1976d2',
                          borderRadius: 4
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default CentralFundPool;