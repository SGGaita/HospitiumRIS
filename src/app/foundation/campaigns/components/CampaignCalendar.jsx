'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
  Fade,
  IconButton
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Campaign as CampaignIcon,
  Event as EventIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const CampaignCalendar = ({
  campaigns = [],
  activities = [],
  loading = false,
  onSelectCampaign,
  onSelectActivity,
  height = 600,
  DASHBOARD_COLORS
}) => {
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDialog, setEventDialog] = useState(false);

  // Calendar helpers
  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay()); // Start from Sunday
  
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay())); // End on Saturday

  // Generate calendar events
  const calendarEvents = useMemo(() => {
    const events = [];
    
    // Add campaign start/end dates
    campaigns.forEach(campaign => {
      if (campaign.startDate) {
        events.push({
          type: 'campaign-start',
          date: new Date(campaign.startDate),
          title: `${campaign.name} Starts`,
          campaign,
          color: campaign.category?.color || DASHBOARD_COLORS.primary,
          icon: 'start'
        });
      }
      
      if (campaign.endDate) {
        events.push({
          type: 'campaign-end',
          date: new Date(campaign.endDate),
          title: `${campaign.name} Ends`,
          campaign,
          color: campaign.category?.color || DASHBOARD_COLORS.primary,
          icon: 'end'
        });
      }
    });
    
    // Add activities
    activities.forEach(activity => {
      if (activity.date) {
        events.push({
          type: 'activity',
          date: new Date(activity.date),
          title: activity.title,
          activity,
          campaign: activity.campaign,
          color: activity.campaign?.category?.color || DASHBOARD_COLORS.primary,
          phase: activity.phase,
          status: activity.status
        });
      }
    });
    
    return events;
  }, [campaigns, activities, DASHBOARD_COLORS.primary]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped = {};
    calendarEvents.forEach(event => {
      const dateKey = event.date.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [calendarEvents]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    let current = new Date(startDate);
    
    while (current <= endDate) {
      const dayEvents = eventsByDate[current.toDateString()] || [];
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === currentDate.getMonth(),
        isToday: current.toDateString() === today.toDateString(),
        events: dayEvents
      });
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [startDate, endDate, currentDate, today, eventsByDate]);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setEventDialog(true);
  };

  const getEventIcon = (event) => {
    switch (event.type) {
      case 'campaign-start':
        return '🚀';
      case 'campaign-end':
        return '🏁';
      case 'activity':
        return event.phase === 'Pre-Campaign' ? '📋' : '📊';
      default:
        return '📅';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4caf50';
      case 'Completed': return '#2196f3';
      case 'Planning': return '#757575';
      case 'Paused': return '#ff9800';
      case 'Cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <Card sx={{ height, borderRadius: 3 }}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Loading calendar...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Fade in timeout={600}>
        <Card sx={{ 
          height, 
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(139, 108, 188, 0.08)'
        }}>
          <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Calendar Header */}
            <Box sx={{ 
              p: 3, 
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              background: `linear-gradient(135deg, ${DASHBOARD_COLORS.primary} 0%, ${DASHBOARD_COLORS.primaryLight} 100%)`,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EventIcon />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Campaign Calendar
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => navigateMonth(-1)}
                    sx={{ color: 'white' }}
                    size="small"
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  
                  <Button
                    onClick={goToToday}
                    startIcon={<TodayIcon />}
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      minWidth: 100
                    }}
                  >
                    Today
                  </Button>
                  
                  <IconButton
                    onClick={() => navigateMonth(1)}
                    sx={{ color: 'white' }}
                    size="small"
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                mt: 1,
                textAlign: 'center'
              }}>
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Typography>
            </Box>
            
            {/* Days of Week Header */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)',
              borderBottom: '1px solid rgba(0,0,0,0.06)'
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Box key={day} sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  backgroundColor: 'rgba(139, 108, 188, 0.05)'
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600,
                    color: DASHBOARD_COLORS.primary
                  }}>
                    {day}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            {/* Calendar Grid */}
            <Box sx={{ 
              flex: 1,
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)',
              gridTemplateRows: 'repeat(6, 1fr)'
            }}>
              {calendarDays.map((day, index) => (
                <Box
                  key={index}
                  sx={{
                    border: '1px solid rgba(0,0,0,0.06)',
                    p: 1,
                    backgroundColor: !day.isCurrentMonth 
                      ? 'rgba(0,0,0,0.02)' 
                      : day.isToday 
                        ? 'rgba(139, 108, 188, 0.1)'
                        : 'transparent',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: day.events.length > 0 ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: day.events.length > 0 
                        ? 'rgba(139, 108, 188, 0.08)'
                        : 'rgba(0,0,0,0.02)'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ 
                    fontWeight: day.isToday ? 700 : day.isCurrentMonth ? 500 : 400,
                    color: day.isToday 
                      ? DASHBOARD_COLORS.primary 
                      : day.isCurrentMonth 
                        ? 'text.primary' 
                        : 'text.disabled',
                    mb: 0.5
                  }}>
                    {day.date.getDate()}
                  </Typography>
                  
                  {/* Events */}
                  <Stack spacing={0.5}>
                    {day.events.slice(0, 3).map((event, eventIndex) => (
                      <Tooltip 
                        key={eventIndex}
                        title={`${event.title} - ${event.type.replace('-', ' ')}`}
                        arrow
                      >
                        <Chip
                          label={event.title}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            backgroundColor: event.color + '20',
                            color: event.color,
                            border: `1px solid ${event.color}40`,
                            '& .MuiChip-label': {
                              px: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            },
                            '&:hover': {
                              backgroundColor: event.color + '30'
                            }
                          }}
                        />
                      </Tooltip>
                    ))}
                    
                    {day.events.length > 3 && (
                      <Typography variant="caption" sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.6rem'
                      }}>
                        +{day.events.length - 3} more
                      </Typography>
                    )}
                  </Stack>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* Event Details Dialog */}
      <Dialog
        open={eventDialog}
        onClose={() => setEventDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {selectedEvent && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: `linear-gradient(135deg, ${selectedEvent.color} 0%, ${selectedEvent.color}CC 100%)`,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">
                  {getEventIcon(selectedEvent)} {selectedEvent.title}
                </Typography>
              </Box>
              <IconButton 
                onClick={() => setEventDialog(false)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Event Type
                  </Typography>
                  <Chip 
                    label={selectedEvent.type.replace('-', ' ')} 
                    color="primary" 
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Grid>
                
                {selectedEvent.campaign && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Campaign
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        backgroundColor: selectedEvent.color 
                      }}>
                        <CampaignIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedEvent.campaign.name}
                        </Typography>
                        {selectedEvent.campaign.category && (
                          <Typography variant="caption" color="text.secondary">
                            {selectedEvent.campaign.category.name}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                )}
                
                {selectedEvent.activity && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Phase
                      </Typography>
                      <Chip 
                        label={selectedEvent.phase} 
                        size="small"
                        color={selectedEvent.phase === 'Pre-Campaign' ? 'warning' : 'info'}
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip 
                        label={selectedEvent.status} 
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(selectedEvent.status) + '20',
                          color: getStatusColor(selectedEvent.status),
                          border: `1px solid ${getStatusColor(selectedEvent.status)}40`
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setEventDialog(false)}>
                Close
              </Button>
              {selectedEvent.campaign && onSelectCampaign && (
                <Button 
                  variant="contained"
                  onClick={() => {
                    onSelectCampaign(selectedEvent.campaign);
                    setEventDialog(false);
                  }}
                >
                  View Campaign
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default CampaignCalendar;
