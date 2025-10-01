import { Link } from '@inertiajs/react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Divider,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  MenuBook as MenuBookIcon,
  Quiz as QuizIcon,
  EventAvailable as EventAvailableIcon,
  Summarize as SummarizeIcon,
  EditNote as EditNoteIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Archive as ArchiveIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

export default function CaiSidebar({
  user,
  selectedSection,
  onSelectSection,
  expandedSections,
  onToggleSection,
  sidebarOpen,
  onClose,
  isMobile,
  drawerWidth,
  collapsedWidth
}) {
  const theme = useTheme();
  const displayName = user?.name || (user?.email_address ? user.email_address.split('@')[0] : 'CAI');

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: <DashboardIcon />, route: 'cai.dashboard' },
    { id: 'enrollments', label: 'Enrollment', icon: <EditNoteIcon />, route: 'cai.enrollments' },
    { id: 'learners', label: 'Learners', icon: <GroupIcon />, route: 'cai.learners' },
    { id: 'attendance', label: 'Attendance', icon: <EventAvailableIcon />, route: 'cai.attendance' },
    { id: 'modules', label: 'Modules', icon: <MenuBookIcon />, route: 'cai.modules' },
     { id: 'reviewers', label: 'Reviewer', icon: <QuizIcon />, route: 'cai.reviewers' },
    { id: 'exams', label: 'Exams', icon: <ArchiveIcon />, route: 'cai.exams' },
    { id: 'reports', label: 'Reports', icon: <SummarizeIcon />, route: 'cai.reports' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: sidebarOpen ? 3 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          minHeight: 64,
          transition: theme.transitions.create(['padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Avatar
          sx={{
            width: sidebarOpen ? 48 : 40,
            height: sidebarOpen ? 48 : 40,
            bgcolor: 'primary.dark',
            fontSize: sidebarOpen ? '1.2rem' : '1rem',
            transition: theme.transitions.create(['width', 'height'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          {displayName.substring(0, 2).toUpperCase()}
        </Avatar>
        {sidebarOpen && (
          <Box sx={{ ml: 1, overflow: 'hidden' }}>
            <Typography variant="h6" noWrap sx={{ fontWeight: 600, color: 'white' }}>
              {displayName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }} noWrap>
              Community ALS Implementor
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isSelected = selectedSection === item.id;
          const ItemComponent = (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={route(item.route)}
                sx={{
                  minHeight: 48,
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: 2,
                  backgroundColor: isSelected ? 'primary.main' : 'transparent',
                  color: isSelected ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                  },
                  transition: theme.transitions.create(['background-color', 'color'], {
                    duration: theme.transitions.duration.short,
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: sidebarOpen ? 3 : 'auto',
                    justifyContent: 'center',
                    color: 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText 
                    primary={item.label} 
                    sx={{ 
                      opacity: sidebarOpen ? 1 : 0,
                      '& .MuiListItemText-primary': {
                        fontWeight: isSelected ? 600 : 400,
                      }
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          );

          return sidebarOpen ? ItemComponent : (
            <Tooltip key={item.id} title={item.label} placement="right">
              {ItemComponent}
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { sm: sidebarOpen ? drawerWidth : collapsedWidth }, 
        flexShrink: { sm: 0 } 
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarOpen ? drawerWidth : collapsedWidth,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
