'use client';

import React, { memo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Chip,
  Stack,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  Breadcrumbs,
  Link,
  alpha,
  useTheme,
  Button,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  NotificationsOutlined as NotificationsIcon,
  SettingsOutlined as SettingsIcon,
  AccountCircle as AccountIcon,
  MenuOpen as MenuOpenIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';

const ProfessionalAnalyticsHeader = memo(({ 
  title = "Donations Analytics",
  subtitle = "Comprehensive insights into fundraising performance and donor behavior",
  onMenuClick,
  onSearch,
  onRefresh,
  onExport,
  onShare,
  lastUpdated,
  isLoading = false
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      onSearch?.(searchValue);
    }
  };

  const breadcrumbs = [
    {
      label: 'Home',
      icon: HomeIcon,
      path: '/'
    },
    {
      label: 'Foundation',
      icon: BusinessIcon,
      path: '/foundation'
    },
    {
      label: 'Donations',
      icon: TrendingUpIcon,
      path: '/foundation/donations'
    },
    {
      label: 'Analytics',
      icon: AnalyticsIcon,
      current: true
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'New Campaign Performance Report',
      message: 'Q4 campaign exceeded target by 15%',
      time: '2 hours ago',
      type: 'success'
    },
    {
      id: 2,
      title: 'Low Donor Retention Alert',
      message: 'Retention rate dropped to 18%',
      time: '4 hours ago',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Monthly Report Ready',
      message: 'December analytics report is available',
      time: '1 day ago',
      type: 'info'
    }
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, #8b6cbc 0%, #a084d1 50%, #b794f4 100%)`,
        borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 2, minHeight: 80 }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {/* Menu Toggle */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={onMenuClick}
            sx={{ 
              mr: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <MenuOpenIcon />
          </IconButton>

          {/* Title and Breadcrumbs */}
          <Box sx={{ flex: 1 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs 
              separator="›" 
              sx={{ 
                mb: 1,
                '& .MuiBreadcrumbs-separator': {
                  color: 'rgba(255,255,255,0.6)',
                  mx: 1
                }
              }}
            >
              {breadcrumbs.map((crumb, index) => (
                <Link
                  key={index}
                  underline="hover"
                  color={crumb.current ? "inherit" : "rgba(255,255,255,0.8)"}
                  href={crumb.path}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: '0.85rem',
                    fontWeight: crumb.current ? 600 : 400,
                    '&:hover': {
                      color: 'rgba(255,255,255,1)'
                    }
                  }}
                >
                  <crumb.icon sx={{ fontSize: 16 }} />
                  {crumb.label}
                </Link>
              ))}
            </Breadcrumbs>

            {/* Title */}
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                color: 'white',
                mb: 0.5
              }}
            >
              {title}
            </Typography>
            
            {/* Subtitle */}
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.9rem',
                maxWidth: 600
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Box>

        {/* Center Section - Search */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          mx: 3,
          minWidth: 300
        }}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
              width: '100%'
            }}
          >
            <Box sx={{
              padding: theme.spacing(0, 2),
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
            </Box>
            <InputBase
              placeholder="Search campaigns, donors, insights..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearch}
              sx={{
                color: 'white',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1.5, 1, 1.5, 0),
                  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                  width: '100%',
                  fontSize: '0.9rem',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.6)',
                    opacity: 1
                  }
                },
              }}
            />
          </Box>
        </Box>

        {/* Right Section */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* Last Updated */}
          {lastUpdated && (
            <Chip
              icon={<ScheduleIcon sx={{ fontSize: 14 }} />}
              label={`Updated ${lastUpdated}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontSize: '0.75rem',
                height: 28,
                display: { xs: 'none', sm: 'flex' },
                '& .MuiChip-icon': { color: 'rgba(255,255,255,0.8)' }
              }}
            />
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh Data">
              <IconButton
                onClick={onRefresh}
                disabled={isLoading}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  '&:disabled': { opacity: 0.5 }
                }}
              >
                <RefreshIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export Report">
              <IconButton
                onClick={onExport}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <DownloadIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Share Dashboard">
              <IconButton
                onClick={onShare}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <ShareIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ 
            borderColor: 'rgba(255,255,255,0.2)', 
            mx: 1 
          }} />

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationClick}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title="Account">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <Avatar sx={{ width: 32, height: 32, fontSize: '0.9rem' }}>
                FA
              </Avatar>
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }
          }}
        >
          <MenuItem onClick={handleProfileMenuClose}>
            <AccountIcon sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <SettingsIcon sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfileMenuClose}>
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 350,
              maxHeight: 400,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
          </Box>
          {notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleNotificationClose}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
});

ProfessionalAnalyticsHeader.displayName = 'ProfessionalAnalyticsHeader';

export default ProfessionalAnalyticsHeader;
