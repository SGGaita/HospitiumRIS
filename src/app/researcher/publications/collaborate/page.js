'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,
  Popover,
  MenuList,
  Divider,
  Container,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Alert,
  CircularProgress,
  Skeleton,
  Badge,
  Tooltip,
  CardActions,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemAvatar,
  Stepper,
  Step,
  StepLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Fade,
  Zoom,
  Slide,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Create as CreateIcon,
  Description as DescriptionIcon,
  Assignment as ProposalIcon,
  TrendingUp as TrendingUpIcon,
  PlayArrow as PlayArrowIcon,
  MoreVert as MoreVertIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  FilterList as FilterListIcon,
  Groups as GroupsIcon,
  Timeline as TimelineIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  ManageAccounts as ManageAccountsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Person as PersonIcon,
  MenuBook as MenuBookIcon,
  Science as ScienceIcon,
  DragIndicator as DragIndicatorIcon,
  Restore as RestoreIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  RocketLaunch as RocketLaunchIcon,
  Category as CategoryIcon,
  Title as TitleIcon,
  PersonSearch as PersonSearchIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  Article as ArticleIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useAuth } from '../../../../components/AuthProvider';
import PageHeader from '../../../../components/common/PageHeader';
import OrcidCollaboratorInvite from '../../../../components/Manuscripts/OrcidCollaboratorInvite';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

// Dynamic imports for DND components
const DragDropContextComponent = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.DragDropContext),
  { ssr: false }
);

const DroppableComponent = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.Droppable),
  { ssr: false }
);

const DraggableComponent = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.Draggable),
  { ssr: false }
);

// Constants from reference
const MEDICAL_FIELDS = [
  'Cardiology',
  'Neurology',
  'Oncology',
  'Pediatrics',
  'Immunology',
  'Endocrinology',
  'Genetics',
  'Public Health',
  'Epidemiology',
  'Other'
];

const DEFAULT_SECTIONS = [
  'Abstract',
  'Introduction',
  'Methods',
  'Results',
  'Discussion',
  'Conclusion',
  'References'
];

const PUBLICATION_TYPES = [
  'Article',
  'Book Chapter',
  'Chapter',
  'Proceeding',
  'Monograph',
  'Preprint',
  'Edited Book',
  'Seminar',
  'Research Chapter',
  'Review Article',
  'Book Review',
  'Conference Abstract',
  'Letter to Editor',
  'Editorial',
  'Other Book Content',
  'Correction Erratum'
];

const COLLABORATOR_ROLES = [
  { value: 'Admin', label: 'Admin', icon: AdminPanelSettingsIcon, color: '#f44336', description: 'Full access to manuscript and team management' },
  { value: 'Editor', label: 'Editor', icon: SupervisorAccountIcon, color: '#ff9800', description: 'Can edit content and manage sections' },
  { value: 'Reviewer', label: 'Reviewer', icon: VisibilityIcon, color: '#2196f3', description: 'Can view and comment on content' },
  { value: 'Contributor', label: 'Contributor', icon: PersonIcon, color: '#4caf50', description: 'Can contribute to specific sections' }
];

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft', color: '#9e9e9e', icon: PendingIcon },
  { value: 'In Progress', label: 'In Progress', color: '#ff9800', icon: AccessTimeIcon },
  { value: 'Under Review', label: 'Under Review', color: '#2196f3', icon: VisibilityIcon },
  { value: 'Completed', label: 'Completed', color: '#4caf50', icon: CheckCircleIcon },
  { value: 'Archived', label: 'Archived', color: '#607d8b', icon: ArchiveIcon }
];





// Add custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function CollaborativeWriting() {
  const { user } = useAuth();
  const router = useRouter();
  
  // State management
  const [manuscripts, setManuscripts] = useState([]);
  const [stats, setStats] = useState({
    totalManuscripts: 0,
    draftManuscripts: 0,
    inReviewManuscripts: 0,
    publishedManuscripts: 0,
    totalCollaborators: 0,
    activeInvitations: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [viewMode, setViewMode] = useState('grid');
  
  // Dialog states
  const [newManuscriptOpen, setNewManuscriptOpen] = useState(false);
  const [teamManagementOpen, setTeamManagementOpen] = useState(false);
  const [selectedManuscript, setSelectedManuscript] = useState(null);
  
  // Menu states
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuManuscript, setMenuManuscript] = useState(null);

  // New manuscript form state with comprehensive structure
  const [newManuscript, setNewManuscript] = useState({
    title: '',
    type: '',
    field: '', // For simple dialog single selection
    fields: [], // For advanced dialog multiple selection
    description: '',
    collaborators: [],
    sections: DEFAULT_SECTIONS.map((title, index) => ({
      id: `section-${index}-${title.toLowerCase().replace(/\s+/g, '-')}`,
      title,
      description: '',
      order: index
    }))
  });

  // Modal states for comprehensive functionality
  const [newPublicationOpen, setNewPublicationOpen] = useState(false);
  const [collaboratorModalOpen, setCollaboratorModalOpen] = useState(false);
  const [formError, setFormError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [creator, setCreator] = useState({ name: '', orcidId: '' });
  const [currentManuscriptId, setCurrentManuscriptId] = useState(null);
  
  // Collaborator form state
  const [collaboratorFormOpen, setCollaboratorFormOpen] = useState(false);
  const [searchMethod, setSearchMethod] = useState('orcid'); // 'orcid' or 'name'
  const [newCollaborator, setNewCollaborator] = useState({
    orcidId: '',
    name: '',
    givenName: '',
    familyName: '',
    institution: '',
    department: '',
    email: ''
  });
  
  const [orcidSearchResults, setOrcidSearchResults] = useState([]);
  const [isSearchingOrcid, setIsSearchingOrcid] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);

  // Steps for manuscript creation
  const steps = ['Manuscript Details', 'Invite Collaborators'];

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manuscriptToDelete, setManuscriptToDelete] = useState(null);

  // Snackbar notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success', 'error', 'warning', 'info'
  });

  // Inline title editing
  const [editingTitle, setEditingTitle] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  // Manuscript submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New proposal modal state
  const [newProposalOpen, setNewProposalOpen] = useState(false);
  const [proposalActiveStep, setProposalActiveStep] = useState(0);
  const [proposalFormError, setProposalFormError] = useState(null);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  // Proposal collaborator search state
  const [proposalOrcidInput, setProposalOrcidInput] = useState('');
  const [proposalSearchResults, setProposalSearchResults] = useState([]);
  const [proposalSelectedCollaborator, setProposalSelectedCollaborator] = useState(null);
  const [proposalIsSearching, setProposalIsSearching] = useState(false);
  
  // Name-based search state for proposals
  const [proposalSearchMethod, setProposalSearchMethod] = useState('name'); // 'name' or 'orcid'
  const [proposalNewCollaborator, setProposalNewCollaborator] = useState({
    givenName: '',
    familyName: '',
    affiliation: '',
    orcidId: '',
    name: '',
    email: ''
  });

  const proposalSteps = ['Proposal Details', 'Invite Collaborators'];

  // New proposal state
  const [newProposal, setNewProposal] = useState({
    title: '',
    type: 'Research Proposal',
    fields: [], // Changed from field to fields array
    otherFields: '', // For custom fields when "Other" is selected
    creator: '', // Changed from principalInvestigator
    creatorOrcid: '', // Changed from principalInvestigatorOrcid
    collaborators: [],
    sections: [
      { id: 'section-0-executive-summary', title: 'Executive Summary', description: 'Brief overview of the proposal', order: 0 },
      { id: 'section-1-background-significance', title: 'Background and Significance', description: 'Context and importance of the research', order: 1 },
      { id: 'section-2-research-objectives', title: 'Research Objectives', description: 'Primary and secondary objectives', order: 2 },
      { id: 'section-3-methodology', title: 'Methodology', description: 'Research methods and approach', order: 3 },
      { id: 'section-4-timeline-milestones', title: 'Timeline and Milestones', description: 'Project schedule and deliverables', order: 4 },
      { id: 'section-5-budget-resources', title: 'Budget and Resources', description: 'Financial requirements and resource allocation', order: 5 },
      { id: 'section-6-expected-outcomes', title: 'Expected Outcomes', description: 'Anticipated results and impact', order: 6 },
      { id: 'section-7-references', title: 'References', description: 'Supporting literature', order: 7 }
    ],
    status: 'Draft',
    researchAreas: [],
    keywords: [],
    abstract: '',
    funding: {
      fundingSource: '',
      grantNumber: '',
      budget: { total: 0, items: [] },
      fundingInstitution: ''
    }
  });

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Essential utility functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fetch manuscripts from API
  const fetchManuscripts = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/manuscripts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setManuscripts(result.data);
        
        // Calculate stats from fetched data
        const totalManuscripts = result.data.length;
        const draftManuscripts = result.data.filter(m => m.status === 'DRAFT').length;
        const inReviewManuscripts = result.data.filter(m => m.status === 'IN_REVIEW').length;
        const publishedManuscripts = result.data.filter(m => m.status === 'PUBLISHED').length;
        const totalCollaborators = result.data.reduce((sum, m) => sum + (m.totalCollaborators || 0), 0);
        const activeInvitations = result.data.reduce((sum, m) => sum + (m.pendingInvitations || 0), 0);
        
        setStats({
          totalManuscripts,
          draftManuscripts,
          inReviewManuscripts,
          publishedManuscripts,
          totalCollaborators,
          activeInvitations
        });
      } else {
        throw new Error(result.error || 'Failed to fetch manuscripts');
      }
      
    } catch (error) {
      console.error('Error fetching manuscripts:', error);
      showSnackbar('Failed to fetch manuscripts', 'error');
      // Set empty state on error
      setManuscripts([]);
      setStats({
        totalManuscripts: 0,
        draftManuscripts: 0,
        inReviewManuscripts: 0,
        publishedManuscripts: 0,
        totalCollaborators: 0,
        activeInvitations: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Handler for new proposal modal
  const handleNewProposal = () => {
    console.log('handleNewProposal function called - modal should open');
    // Ensure the creator fields are set to the logged-in user
    try {
      const userData = user || JSON.parse(localStorage.getItem('user') || '{}');
      if (userData) {
        setNewProposal(prev => ({ 
          ...prev, 
          creator: userData.name || 'Unknown User',
          creatorOrcid: userData.orcid || ''
        }));
      }
    } catch (error) {
      console.error('Error loading user info for proposal:', error);
    }
    
    console.log('Setting newProposalOpen to true');
    setNewProposalOpen(true);
    console.log('newProposalOpen should now be true');
  };

  // Auto-populate creator when modal opens
  useEffect(() => {
    if (newProposalOpen && typeof window !== 'undefined') {
      try {
        const userData = user || JSON.parse(localStorage.getItem('user') || '{}');
        if (userData) {
          setNewProposal(prev => ({
            ...prev,
            creator: userData.name || 'Unknown User',
            creatorOrcid: userData.orcid || ''
          }));
        }
      } catch (error) {
        console.error('Error loading user info for proposal:', error);
      }
    }
  }, [newProposalOpen, user]);

  // Load creator info when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userData = user || JSON.parse(localStorage.getItem('user') || '{}');
        if (userData) {
          const creatorInfo = {
            name: userData.name || 'Unknown User',
            orcidId: userData.orcid || ''
          };
          setCreator(creatorInfo);
          setNewManuscript(prev => ({ ...prev, creator: creatorInfo }));
        }
      } catch (error) {
        console.error('Error loading creator info:', error);
      }
    }
  }, [user]);

  // Fetch manuscripts on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchManuscripts();
    }
  }, [user, fetchManuscripts]);

  // Filter and search manuscripts
  const filteredManuscripts = manuscripts.filter(manuscript => {
    const matchesSearch = manuscript.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || manuscript.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || manuscript.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handlers
  const handleMenuClick = (event, manuscript) => {
    setAnchorEl(event.currentTarget);
    setMenuManuscript(manuscript);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuManuscript(null);
  };

  const handleCreateManuscriptStep1 = async () => {
    if (!newManuscript.title || !newManuscript.type || newManuscript.fields.length === 0) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setFormError(null);

      const manuscriptData = {
        title: newManuscript.title,
        type: newManuscript.type,
        field: newManuscript.fields.join(', '), // Convert array to comma-separated string
        description: newManuscript.description || null
      };

      const response = await fetch('/api/manuscripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manuscriptData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Store the manuscript ID for step 2
        setCurrentManuscriptId(result.data.manuscript.id);
        
        // Add the new manuscript to local state
        const newManuscriptData = {
          ...result.data.manuscript,
          collaborators: [{
            id: result.data.manuscript.creator.id,
            name: `${result.data.manuscript.creator.givenName} ${result.data.manuscript.creator.familyName}`,
            email: result.data.manuscript.creator.email,
            role: 'OWNER',
            canEdit: true,
            canInvite: true,
            canDelete: true
          }],
          totalCollaborators: 1,
          pendingInvitations: 0,
          lastUpdated: result.data.manuscript.updatedAt
        };

        setManuscripts(prev => [newManuscriptData, ...prev]);
        setStats(prev => ({ 
          ...prev, 
          totalManuscripts: prev.totalManuscripts + 1,
          draftManuscripts: prev.draftManuscripts + 1,
          totalCollaborators: prev.totalCollaborators + 1
        }));
        
        // Move to step 2 for collaborator invitations
        setActiveStep(1);
        showSnackbar('Manuscript created! Now you can invite collaborators.', 'success');
      } else {
        throw new Error(result.error || 'Failed to create manuscript');
      }

    } catch (error) {
      console.error('Error creating manuscript:', error);
      setFormError(error.message || 'Failed to create manuscript');
      showSnackbar('Failed to create manuscript', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishManuscript = () => {
    // Reset form and close modal since manuscript was already created in step 1
    setNewManuscript({ 
      title: '', 
      type: '', 
      field: '',
      fields: [], 
      description: '',
      collaborators: [],
      sections: DEFAULT_SECTIONS.map((title, index) => ({
        id: `section-${index}-${title.toLowerCase().replace(/\s+/g, '-')}`,
        title,
        description: '',
        order: index
      }))
    });
    setActiveStep(0);
    setCurrentManuscriptId(null);
    setNewManuscriptOpen(false);
    
    showSnackbar('Manuscript setup complete!', 'success');
  };

  const handleCreateManuscript = async () => {
    if (!newManuscript.title || !newManuscript.type || !newManuscript.field) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);

      const manuscriptData = {
        title: newManuscript.title,
        type: newManuscript.type,
        field: newManuscript.field,
        description: newManuscript.description || null
      };

      const response = await fetch('/api/manuscripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manuscriptData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Add the new manuscript to local state
        const newManuscriptData = {
          ...result.data.manuscript,
          collaborators: [{
            id: result.data.manuscript.creator.id,
            name: `${result.data.manuscript.creator.givenName} ${result.data.manuscript.creator.familyName}`,
            email: result.data.manuscript.creator.email,
            role: 'OWNER',
            canEdit: true,
            canInvite: true,
            canDelete: true
          }],
          totalCollaborators: 1,
          pendingInvitations: 0,
          lastUpdated: result.data.manuscript.updatedAt
        };

        setManuscripts(prev => [newManuscriptData, ...prev]);
        setStats(prev => ({ 
          ...prev, 
          totalManuscripts: prev.totalManuscripts + 1,
          draftManuscripts: prev.draftManuscripts + 1,
          totalCollaborators: prev.totalCollaborators + 1
        }));
        
        // Reset form and close modal
        setNewManuscript({ 
          title: '', 
          type: '', 
          field: '',
          fields: [], 
          description: '',
          collaborators: [],
          sections: DEFAULT_SECTIONS.map((title, index) => ({
            id: `section-${index}-${title.toLowerCase().replace(/\s+/g, '-')}`,
            title,
            description: '',
            order: index
          }))
        });
        setNewManuscriptOpen(false);
        
        showSnackbar('Manuscript created successfully!', 'success');
      } else {
        throw new Error(result.error || 'Failed to create manuscript');
      }

    } catch (error) {
      console.error('Error creating manuscript:', error);
      showSnackbar('Failed to create manuscript', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleManageTeam = (manuscript) => {
    setSelectedManuscript(manuscript);
    setTeamManagementOpen(true);
    handleMenuClose();
  };

  const handleEditManuscript = (manuscript) => {
    // Navigate to edit page using SPA navigation
    router.push(`/researcher/publications/collaborate/edit/${manuscript.id}`);
    handleMenuClose();
  };


  // Professional Manuscript Card Component
  const ManuscriptCardComponent = ({ manuscript }) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === manuscript.status);
    const StatusIcon = statusOption?.icon || PendingIcon;

    return (
      <Card sx={{
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)',
        position: 'relative',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease'
      }}>
        <CardContent sx={{ p: 2.5 }}>
          {/* Header with status and actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<StatusIcon sx={{ fontSize: 14 }} />}
                label={manuscript.status}
                size="small"
                sx={{
                  backgroundColor: statusOption?.color,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 22
                }}
              />
              <Chip
                label={manuscript.type}
                size="small"
                variant="outlined"
                sx={{ 
                  borderColor: '#8b6cbc', 
                  color: '#8b6cbc',
                  fontSize: '0.7rem',
                  height: 22
                }}
              />
            </Box>
            <IconButton
              size="small"
              onClick={(e) => handleMenuClick(e, manuscript)}
              title="More actions"
              sx={{ 
                color: '#666',
                '&:hover': { 
                  bgcolor: '#8b6cbc10' 
                } 
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              fontSize: '1rem', 
              lineHeight: 1.4,
              fontWeight: 600,
              color: '#2D3748',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden'
            }}
          >
            {manuscript.title}
          </Typography>

          {/* Field */}
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              color: '#8b6cbc',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            {manuscript.field}
          </Typography>

          {/* Progress */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {manuscript.completedSections}/{manuscript.sections} sections
              </Typography>
            </Box>
            <Box
              sx={{
                width: '100%',
                height: 4,
                backgroundColor: '#f0f0f0',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: `${manuscript.progress}%`,
                  height: '100%',
                  backgroundColor: '#8b6cbc',
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>

          {/* Team */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                Team:
              </Typography>
              <Stack direction="row" spacing={-0.5}>
                {manuscript.collaborators.slice(0, 3).map((collaborator, index) => (
                  <Tooltip key={collaborator.id} title={`${collaborator.name} (${collaborator.role})`}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: '0.7rem',
                        backgroundColor: collaborator.color,
                        border: '1px solid white',
                        fontWeight: 600
                      }}
                    >
                      {collaborator.avatar}
                    </Avatar>
                  </Tooltip>
                ))}
                {manuscript.collaborators.length > 3 && (
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: '0.6rem',
                      backgroundColor: '#e0e0e0',
                      color: '#666',
                      border: '1px solid white'
                    }}
                  >
                    +{manuscript.collaborators.length - 3}
                  </Avatar>
                )}
              </Stack>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {manuscript.lastUpdated}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<EditIcon fontSize="small" />}
            onClick={() => handleEditManuscript(manuscript)}
            sx={{
              bgcolor: '#8b6cbc',
              '&:hover': {
                bgcolor: '#7b5ca7',
              },
              textTransform: 'none',
              fontSize: '0.8rem'
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<GroupsIcon fontSize="small" />}
            onClick={() => handleManageTeam(manuscript)}
            sx={{
              borderColor: '#8b6cbc',
              color: '#8b6cbc',
              '&:hover': {
                borderColor: '#8b6cbc',
                backgroundColor: '#8b6cbc10'
              },
              textTransform: 'none',
              fontSize: '0.8rem'
            }}
          >
            Team
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <>
      {/* Full-width PageHeader */}
      <Box sx={{ width: '100%',mt:8, mb: 0 }}>
        <PageHeader
          title="Collaborative Writing"
          description="Create and manage your collaborative manuscripts with colleagues"
          icon={<CreateIcon />}
          breadcrumbs={[
            { label: 'Dashboard', href: '/researcher' },
            { label: 'Publications', href: '/researcher/publications' },
            { label: 'Collaborative Writing' }
          ]}
          actionButton={
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  sessionStorage.removeItem('manuscripts');
                  fetchManuscripts();
                  showSnackbar('Page refreshed successfully!', 'success');
                }}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  },
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  backdropFilter: 'blur(10px)',
                  minWidth: 'auto'
                }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<DescriptionIcon />}
                onClick={handleNewProposal}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)'
                }}
              >
                New Proposal
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setNewPublicationOpen(true)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                New Manuscript
              </Button>
            </Stack>
          }
        />
      </Box>

      {/* Contained content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>

      {/* Professional Statistics Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4, mt: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ 
            p: 2, 
            borderRadius: 2,
            bgcolor: '#8b6cbc',
            boxShadow: '0 2px 8px rgba(139, 108, 188, 0.2)',
            border: 'none',
            position: 'relative',
            overflow: 'hidden',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                Total Manuscripts
              </Typography>
              <DescriptionIcon sx={{ fontSize: 18, color: 'white', opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', fontSize: '1.75rem' }}>
              {stats.totalManuscripts}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
              <Box component="span" sx={{ mr: 0.5, fontSize: '0.8rem' }}>📝</Box>
              All collaborative works
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ 
            p: 2, 
            borderRadius: 2,
            bgcolor: '#8b6cbc',
            boxShadow: '0 2px 8px rgba(139, 108, 188, 0.2)',
            border: 'none',
            position: 'relative',
            overflow: 'hidden',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                In Progress
              </Typography>
              <AccessTimeIcon sx={{ fontSize: 18, color: 'white', opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', fontSize: '1.75rem' }}>
              {stats.inProgress}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
              <Box component="span" sx={{ mr: 0.5, fontSize: '0.8rem' }}>⏳</Box>
              Active manuscripts
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ 
            p: 2, 
            borderRadius: 2,
            bgcolor: '#8b6cbc',
            boxShadow: '0 2px 8px rgba(139, 108, 188, 0.2)',
            border: 'none',
            position: 'relative',
            overflow: 'hidden',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                Under Review
              </Typography>
              <VisibilityIcon sx={{ fontSize: 18, color: 'white', opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', fontSize: '1.75rem' }}>
              {stats.underReview}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
              <Box component="span" sx={{ mr: 0.5, fontSize: '0.8rem' }}>👀</Box>
              Pending approval
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ 
            p: 2, 
            borderRadius: 2,
            bgcolor: '#8b6cbc',
            boxShadow: '0 2px 8px rgba(139, 108, 188, 0.2)',
            border: 'none',
            position: 'relative',
            overflow: 'hidden',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                Collaborators
              </Typography>
              <GroupsIcon sx={{ fontSize: 18, color: 'white', opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', fontSize: '1.75rem' }}>
              {stats.totalCollaborators}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
              <Box component="span" sx={{ mr: 0.5, fontSize: '0.8rem' }}>👥</Box>
              Active team members
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Professional Search and Filters */}
      <Paper sx={{ 
        mb: 3, 
        p: 2.5, 
        borderRadius: 2, 
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', 
        border: '1px solid rgba(0,0,0,0.06)' 
      }}>
        <Grid container spacing={2.5} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search manuscripts, collaborators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#8b6cbc' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#8b6cbc',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b6cbc',
                  },
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'text.secondary' }}>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#8b6cbc',
                  },
                }}
              >
                <MenuItem value="All Status">All Status</MenuItem>
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'text.secondary' }}>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#8b6cbc',
                  },
                }}
              >
                <MenuItem value="All Types">All Types</MenuItem>
                {PUBLICATION_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                View:
              </Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    border: '1px solid #8b6cbc40',
                    color: '#8b6cbc',
                    '&:hover': {
                      backgroundColor: '#8b6cbc10',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#8b6cbc',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#7b5ca7',
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="grid">
                  <ViewModuleIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="table">
                  <ViewListIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Manuscripts Display */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
              <Card sx={{ p: 3 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2 }} />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filteredManuscripts.length === 0 ? (
        // Professional Empty State
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'rgba(139, 108, 188, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 3,
              }}
            >
              <MenuBookIcon sx={{ fontSize: 40, color: '#8b6cbc' }} />
            </Box>
            
            <Typography
              variant="h5"
              sx={{
                color: '#2D3748',
                mb: 2,
                fontWeight: 600,
              }}
            >
              No Manuscripts Yet
            </Typography>
            
            <Typography
              color="text.secondary"
              sx={{ 
                mb: 4, 
                maxWidth: 500, 
                mx: 'auto',
                fontSize: '1rem',
                lineHeight: 1.5
              }}
            >
              Start your collaborative writing journey by creating your first manuscript.
              Invite colleagues and work together seamlessly.
            </Typography>

            {/* Simplified feature highlights */}
            <Grid container spacing={3} sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <GroupsIcon sx={{ fontSize: 24, color: '#8b6cbc', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3748', fontSize: '0.875rem' }}>
                    Team Collaboration
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <TimelineIcon sx={{ fontSize: 24, color: '#8b6cbc', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3748', fontSize: '0.875rem' }}>
                    Progress Tracking
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <EditIcon sx={{ fontSize: 24, color: '#8b6cbc', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3748', fontSize: '0.875rem' }}>
                    Real-time Editing
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setNewManuscriptOpen(true)}
            sx={{
              bgcolor: '#8b6cbc',
              color: 'white',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                bgcolor: '#7b5ca7',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Create First Manuscript
          </Button>
        </Paper>
      ) : (
        // Manuscripts Grid/Table
        <>
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {filteredManuscripts.map((manuscript) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={manuscript.id}>
                  <ManuscriptCardComponent manuscript={manuscript} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ 
              borderRadius: 2, 
              overflow: 'visible', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', 
              border: '1px solid rgba(0,0,0,0.06)' 
            }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#8b6cbc' }}>
                      <TableCell sx={{ fontWeight: 600, color: 'white', borderBottom: 'none', py: 2 }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'white', borderBottom: 'none', py: 2 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'white', borderBottom: 'none', py: 2 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'white', borderBottom: 'none', py: 2 }}>Team</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'white', borderBottom: 'none', py: 2 }}>Progress</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'white', borderBottom: 'none', py: 2 }}>Updated</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'white', borderBottom: 'none', py: 2, textAlign: 'center' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredManuscripts.map((manuscript, index) => {
                      const statusOption = STATUS_OPTIONS.find(s => s.value === manuscript.status);
                      return (
                        <TableRow 
                          key={manuscript.id} 
                          sx={{ 
                            bgcolor: index % 2 === 0 ? '#fafafa' : 'white',
                            '&:hover': { backgroundColor: '#f0f0f0' } 
                          }}
                        >
                          <TableCell sx={{ py: 2, maxWidth: 300 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2D3748', mb: 0.5 }}>
                              {manuscript.title.length > 50 ? `${manuscript.title.slice(0, 50)}...` : manuscript.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {manuscript.field}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Chip
                              label={manuscript.status}
                              size="small"
                              sx={{
                                backgroundColor: statusOption?.color,
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2">{manuscript.type}</Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Stack direction="row" spacing={-0.5}>
                              {manuscript.collaborators.slice(0, 3).map((collaborator) => (
                                <Tooltip key={collaborator.id} title={collaborator.name}>
                                  <Avatar
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      fontSize: '0.7rem',
                                      backgroundColor: collaborator.color,
                                      border: '1px solid white'
                                    }}
                                  >
                                    {collaborator.avatar}
                                  </Avatar>
                                </Tooltip>
                              ))}
                              {manuscript.collaborators.length > 3 && (
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    fontSize: '0.6rem',
                                    backgroundColor: '#e0e0e0',
                                    color: '#666',
                                    border: '1px solid white'
                                  }}
                                >
                                  +{manuscript.collaborators.length - 3}
                                </Avatar>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 60,
                                  height: 4,
                                  backgroundColor: '#f0f0f0',
                                  borderRadius: 2,
                                  overflow: 'hidden'
                                }}
                              >
                                <Box
                                  sx={{
                                    width: `${manuscript.progress}%`,
                                    height: '100%',
                                    backgroundColor: '#8b6cbc',
                                    borderRadius: 2
                                  }}
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {manuscript.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                              {manuscript.lastUpdated}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2, textAlign: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuClick(e, manuscript)}
                              title="More actions"
                              sx={{ 
                                color: '#666',
                                '&:hover': { 
                                  bgcolor: '#8b6cbc10' 
                                } 
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}

      {/* Professional Context Menu */}
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disablePortal={false}
        sx={{
          zIndex: 1300,
          '& .MuiPaper-root': {
            minWidth: 180,
            mt: 0.5,
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
            overflow: 'visible'
          }
        }}
      >
        <MenuList sx={{ py: 1 }}>
          <MuiMenuItem 
            onClick={() => handleEditManuscript(menuManuscript)}
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: '#8b6cbc10',
          },
        }}
      >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Manuscript
        </MuiMenuItem>
          <MuiMenuItem 
            onClick={() => handleManageTeam(menuManuscript)}
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: '#8b6cbc10',
              },
            }}
          >
          <ListItemIcon>
            <GroupsIcon fontSize="small" />
          </ListItemIcon>
          Manage Team
        </MuiMenuItem>
        <Divider sx={{ mx: 0.5 }} />
          <MuiMenuItem 
            onClick={handleMenuClose}
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: '#8b6cbc10',
              },
            }}
          >
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          Share
        </MuiMenuItem>
          <MuiMenuItem 
            onClick={handleMenuClose}
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: '#8b6cbc10',
              },
            }}
          >
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          Archive
        </MuiMenuItem>
        </MenuList>
      </Popover>

      {/* New Manuscript Dialog */}
      <Dialog
        open={newManuscriptOpen}
        onClose={() => setNewManuscriptOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 40, 
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#8b6cbc',
              color: 'white'
            }}>
              <AddIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Create New Manuscript
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start a new collaborative writing project
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Manuscript Title"
                value={newManuscript.title}
                onChange={(e) => setNewManuscript(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your manuscript title..."
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Publication Type</InputLabel>
                <Select
                  value={newManuscript.type}
                  label="Publication Type"
                  onChange={(e) => setNewManuscript(prev => ({ ...prev, type: e.target.value }))}
                >
                  {PUBLICATION_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Medical Field</InputLabel>
                <Select
                  value={newManuscript.field}
                  label="Medical Field"
                  onChange={(e) => setNewManuscript(prev => ({ ...prev, field: e.target.value }))}
                >
                  {MEDICAL_FIELDS.map((field) => (
                    <MenuItem key={field} value={field}>
                      {field}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description (Optional)"
                value={newManuscript.description}
                onChange={(e) => setNewManuscript(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Briefly describe your manuscript..."
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setNewManuscriptOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateManuscript}
            variant="contained"
            disabled={!newManuscript.title || !newManuscript.type || !newManuscript.field || loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              background: 'linear-gradient(135deg, #8b6cbc, #7b5ca7)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7b5ca7, #6b4c97)',
              }
            }}
          >
            {loading ? 'Creating...' : 'Create Manuscript'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Team Management Dialog */}
      <Dialog
        open={teamManagementOpen}
        onClose={() => setTeamManagementOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 40, 
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#8b6cbc',
              color: 'white'
            }}>
              <GroupsIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Manage Team
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedManuscript?.title}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedManuscript?.collaborators && (
            <List>
              {selectedManuscript.collaborators.map((collaborator) => {
                const role = COLLABORATOR_ROLES.find(r => r.value === collaborator.role);
                const RoleIcon = role?.icon || PersonIcon;
                
                return (
                  <ListItem key={collaborator.id}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          backgroundColor: collaborator.color,
                          fontWeight: 600
                        }}
                      >
                        {collaborator.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={collaborator.name}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <RoleIcon sx={{ fontSize: 16, color: role?.color }} />
                          <Typography variant="caption" sx={{ color: role?.color, fontWeight: 600 }}>
                            {collaborator.role}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Button
            startIcon={<PersonAddIcon />}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#8b6cbc40',
              color: '#8b6cbc',
              '&:hover': {
                borderColor: '#8b6cbc',
                backgroundColor: '#8b6cbc10'
              }
            }}
          >
            Add Collaborator
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setTeamManagementOpen(false)}
            color="inherit"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced New Manuscript Modal */}
      <Dialog
        open={newPublicationOpen}
        onClose={() => {
          setNewPublicationOpen(false);
          setActiveStep(0);
          setFormError(null);
        }}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfd 100%)',
            border: '1px solid rgba(139, 108, 188, 0.08)',
            minHeight: '70vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {/* Professional Header */}
        <DialogTitle
          sx={{
            position: 'relative',
            background: 'linear-gradient(135deg, #8b6cbc 0%, #7b5ca7 100%)',
            color: 'white',
            p: 3,
            overflow: 'hidden',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Subtle background pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '50%',
              transform: 'translate(50px, -50px)',
              zIndex: 0
            }}
          />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
              >
                <AddIcon sx={{ fontSize: 24, color: 'white' }} />
              </Box>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: '1.5rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Create New Manuscript
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 400,
                    fontSize: '0.875rem'
                  }}
                >
                  Set up a new collaborative research project
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogTitle>

        {/* Professional Stepper */}
        <Box sx={{ 
          px: 4, 
          pt: 2.5, 
          pb: 2, 
          background: '#fafbfd',
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}>
          <Stepper 
            activeStep={activeStep}
            sx={{
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#8b6cbc',
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: '#8b6cbc',
              },
              '& .MuiStepConnector-alternativeLabel': {
                top: 10,
                left: 'calc(-50% + 16px)',
                right: 'calc(50% + 16px)',
              },
              '& .MuiStepConnector-alternativeLabel.Mui-active .MuiStepConnector-line': {
                borderColor: '#8b6cbc',
              },
              '& .MuiStepConnector-alternativeLabel.Mui-completed .MuiStepConnector-line': {
                borderColor: '#8b6cbc',
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {formError && (
          <Box sx={{ px: 4, pb: 2 }}>
            <Alert
              severity="error"
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(244, 67, 54, 0.2)',
                background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(244, 67, 54, 0.02) 100%)'
              }}
              icon={<ErrorIcon />}
            >
              {formError}
            </Alert>
          </Box>
        )}

        <DialogContent sx={{ p: 0, flex: 1 }}>
          {activeStep === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Manuscript Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Title Field */}
                <TextField
                  fullWidth
                  label="Manuscript Title *"
                  value={newManuscript.title}
                  onChange={(e) => setNewManuscript(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Enter a descriptive title for your manuscript"
                />
                
                {/* Publication Type Field */}
                <FormControl fullWidth required>
                  <InputLabel>Publication Type *</InputLabel>
                  <Select
                    value={newManuscript.type}
                    label="Publication Type *"
                    onChange={(e) => setNewManuscript(prev => ({ ...prev, type: e.target.value }))}
                  >
                    {PUBLICATION_TYPES.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Research Fields - Multiple Selection */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Research Fields * (Select multiple)
                  </Typography>
                  
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                    <FormGroup>
                      {MEDICAL_FIELDS.map((field) => (
                        <FormControlLabel
                          key={field}
                          control={
                            <Checkbox
                              checked={newManuscript.fields.includes(field)}
                              onChange={(e) => {
                                const fieldValue = e.target.value;
                                setNewManuscript(prev => ({
                                  ...prev,
                                  fields: e.target.checked
                                    ? [...prev.fields, fieldValue]
                                    : prev.fields.filter(f => f !== fieldValue)
                                }));
                              }}
                              value={field}
                              sx={{ color: '#8b6cbc', '&.Mui-checked': { color: '#8b6cbc' } }}
                            />
                          }
                          label={field}
                        />
                      ))}
                    </FormGroup>
                    
                    {/* Selected fields display */}
                    {newManuscript.fields.length > 0 && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                          Selected Fields:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {newManuscript.fields.map((field) => (
                            <Chip
                              key={field}
                              label={field}
                              size="small"
                              variant="outlined"
                              sx={{ borderColor: '#8b6cbc', color: '#8b6cbc' }}
                              onDelete={() => {
                                setNewManuscript(prev => ({
                                  ...prev,
                                  fields: prev.fields.filter(f => f !== field)
                                }));
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Box>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <OrcidCollaboratorInvite
              manuscriptId={currentManuscriptId}
              collaborators={newManuscript.collaborators}
              onCollaboratorsChange={(collaborators) => 
                setNewManuscript(prev => ({ ...prev, collaborators }))
              }
            />
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={() => {
            setNewPublicationOpen(false);
            setActiveStep(0);
            setCurrentManuscriptId(null);
            setFormError(null);
            setNewManuscript({
              title: '',
              type: '',
              field: '',
              fields: [],
              description: '',
              collaborators: [],
              sections: DEFAULT_SECTIONS.map((title, index) => ({
                id: `section-${index}-${title.toLowerCase().replace(/\s+/g, '-')}`,
                title,
                description: '',
                order: index
              }))
            });
          }}>
            Cancel
          </Button>
          
          <Box sx={{ flex: 1 }} />
          
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(prev => prev - 1)}>
              Back
            </Button>
          )}
          
          {activeStep === 0 ? (
            <Button
              variant="contained"
              disabled={!newManuscript.title || !newManuscript.type || newManuscript.fields.length === 0 || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              onClick={handleCreateManuscriptStep1}
              sx={{ background: 'linear-gradient(135deg, #8b6cbc 0%, #9575d1 100%)' }}
            >
              {loading ? 'Creating...' : 'Create & Continue'}
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={handleFinishManuscript}
              sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' }}
            >
              Finish
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* New Proposal Modal */}
      <Dialog
        open={newProposalOpen}
        onClose={() => setNewProposalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            minHeight: 600
          }
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #8b6cbc 0%, #9575d1 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            pb: 2
          }}
        >
          <DescriptionIcon />
          Create New Proposal
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {proposalFormError && (
            <Alert severity="error" sx={{ m: 3, mb: 0 }}>
              {proposalFormError}
            </Alert>
          )}

          <Box sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Proposal Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Proposal Title */}
              <TextField
                fullWidth
                label="Proposal Title *"
                value={newProposal.title}
                onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter proposal title..."
              />

              {/* Research Fields */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  Research Fields *
                </Typography>
                <FormControl fullWidth required>
                  <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, p: 2 }}>
                    <FormGroup>
                      {MEDICAL_FIELDS.map((field) => (
                        <FormControlLabel
                          key={field}
                          control={
                            <Checkbox
                              checked={newProposal.fields.includes(field)}
                              onChange={(e) => {
                                const fieldValue = e.target.value;
                                setNewProposal(prev => ({
                                  ...prev,
                                  fields: e.target.checked
                                    ? [...prev.fields, fieldValue]
                                    : prev.fields.filter(f => f !== fieldValue)
                                }));
                              }}
                              value={field}
                              sx={{ color: '#8b6cbc', '&.Mui-checked': { color: '#8b6cbc' } }}
                            />
                          }
                          label={field}
                        />
                      ))}
                    </FormGroup>
                    
                    {/* Selected fields display */}
                    {newProposal.fields.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {newProposal.fields.map((field) => (
                          <Chip
                            key={field}
                            label={field}
                            onDelete={() => {
                              setNewProposal(prev => ({
                                ...prev,
                                fields: prev.fields.filter(f => f !== field)
                              }));
                            }}
                            size="small"
                            sx={{
                              backgroundColor: '#8b6cbc',
                              color: 'white',
                              '& .MuiChip-deleteIcon': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': { color: 'white' }
                              }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Paper>
                </FormControl>
              </Box>

              {/* Creator (Read-only) */}
              <TextField
                fullWidth
                label="Creator"
                value={newProposal.creator}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <Box sx={{ mr: 1, px: 1.5, py: 0.5, backgroundColor: '#e1f5fe', borderRadius: 1, fontSize: '0.75rem', fontWeight: 600, color: '#0277bd' }}>
                      YOU
                    </Box>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc' } }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 3, gap: 2 }}>
          <Button onClick={() => setNewProposalOpen(false)}>
            Cancel
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="contained"
            disabled={!newProposal.title || newProposal.fields.length === 0 || isSubmittingProposal}
            startIcon={isSubmittingProposal ? <CircularProgress size={20} color="inherit" /> : <RocketLaunchIcon />}
            sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' }}
            onClick={() => {
              showSnackbar('Proposal created successfully!', 'success');
              setNewProposalOpen(false);
              setNewProposal({
                title: '',
                type: 'Research Proposal',
                fields: [],
                otherFields: '',
                creator: user?.name || '',
                creatorOrcid: user?.orcid || '',
                collaborators: [],
                sections: [],
                status: 'Draft',
                researchAreas: [],
                keywords: [],
                abstract: '',
                funding: {
                  fundingSource: '',
                  grantNumber: '',
                  budget: { total: 0, items: [] },
                  fundingInstitution: ''
                }
              });
            }}
          >
            {isSubmittingProposal ? 'Creating Proposal...' : 'Create Proposal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      </Container>
    </>
  );
}
