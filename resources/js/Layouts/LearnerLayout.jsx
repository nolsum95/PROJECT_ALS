import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { showConfirm } from '@/Utils/sweetalert';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Chip,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Assessment as AssessmentIcon,
  TrendingUp as ProgressIcon,
  Description as ReportsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  BookmarkBorder as BookmarkIcon,
  CheckCircle as CheckCircleIcon,
  ManageAccounts as ManageAccountIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

export default function LearnerLayout({ 
  children, 
  auth, 
  selectedSection = 'dashboard',
  title = 'ALS Learning Portal'
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = auth?.user?.name || 'Learner';
  const learnerInfo = auth?.learner || {};

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    const result = await showConfirm('Are you sure you want to logout?', 'Logout Confirmation');
    if (result.isConfirmed) {
      router.post('/logout');
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      route: '/learner/dashboard'
    },
    {
      id: 'enrollment',
      label: 'Enrollment Status',
      icon: <SchoolIcon />,
      route: '/learner/enrollment'
    },
    {
      id: 'reviewers',
      label: 'Study Materials',
      icon: <BookmarkIcon />,
      route: '/learner/reviewers'
    },
    {
      id: 'exams',
      label: 'Exams & Tests',
      icon: <AssessmentIcon />,
      route: '/learner/exams'
    },
    {
      id: 'progress',
      label: 'My Progress',
      icon: <ProgressIcon />,
      route: '/learner/progress'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <ReportsIcon />,
      route: '/learner/reports'
    }
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.dark', mr: 2 }}>
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              ALS Learner
            </Typography>
          </Box>
        </Box>
        
        {/* Learner Info */}
        {learnerInfo.assigned_clc && (
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={`CLC: ${learnerInfo.clc?.clc_name || 'Not Assigned'}`}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: '0.7rem'
              }}
            />
          </Box>
        )}
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5, px: 1 }}>
            <ListItemButton
              component={Link}
              href={item.route}
              selected={selectedSection === item.id}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ 
            borderColor: 'divider',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover'
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {/* Status Indicator */}
          <Chip
            icon={<CheckCircleIcon />}
            label="Active"
            color="success"
            size="small"
            variant="outlined"
            sx={{ mr: 1 }}
          />
          
          {/* Profile Icon */}
          <Tooltip title="My Profile">
            <IconButton
              color="inherit"
              onClick={() => router.visit('/learner/profile')}
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ManageAccountIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              bgcolor: 'background.paper'
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'grey.50'
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
