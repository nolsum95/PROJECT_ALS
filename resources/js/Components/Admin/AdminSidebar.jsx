import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { showConfirm } from '@/Utils/sweetalert';
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
  Tooltip,
  Collapse,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  useMediaQuery,
  Menu,
  MenuItem,
  Paper,
  ClickAwayListener,
  Popper,
  Fade
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Summarize as SummarizeIcon,
  EditNote as EditNoteIcon,
  Apartment as ApartmentIcon,
  MenuBook as MenuBookIcon,
  Assessment as AssessmentIcon,
  Article as ArticleIcon,
  People as PeopleIcon,
  ManageAccounts as ManageAccountsIcon,
  EventAvailable as EventAvailableIcon,
  CloudUpload as MaterialsIcon,
  Quiz as ReviewersIcon,
  School as ExamsIcon,
  Schedule as ScheduleIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  ArrowDropDown as ArrowDropDownIcon,
  MoreHoriz as MoreHorizIcon
} from '@mui/icons-material';
import '../../../css/admin.css';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 64;

export default function AdminSidebar({
  user,
  selectedSection,
  onSelectSection,
  expandedSections = {},
  onToggleSection,
  children,
  title = 'Admin Dashboard'
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [internalExpandedSections, setInternalExpandedSections] = useState({});
  const [assessmentMenuAnchor, setAssessmentMenuAnchor] = useState(null);
  const assessmentMenuOpen = Boolean(assessmentMenuAnchor);

  const displayName = user?.name || 'Admin';
  const displayEmail = user?.email_address || 'admin@example.com';

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = async () => {
    const result = await showConfirm('Are you sure you want to logout?', 'Logout Confirmation');
    if (result.isConfirmed) {
      router.post(route('logout'));
    }
  };

  const handleToggleSection = (sectionId) => {
    console.log('Toggling section:', sectionId);
    if (onToggleSection) {
      onToggleSection(sectionId);
    } else {
      setInternalExpandedSections(prev => ({
        ...prev,
        [sectionId]: !prev[sectionId]
      }));
    }
  };

  const isExpanded = (sectionId) => {
    return expandedSections[sectionId] !== undefined 
      ? expandedSections[sectionId] 
      : internalExpandedSections[sectionId] || false;
  };

  const handleAssessmentMenuClick = (event) => {
    setAssessmentMenuAnchor(event.currentTarget);
  };

  const handleAssessmentMenuClose = () => {
    setAssessmentMenuAnchor(null);
  };

  const handleAssessmentSubmenuClick = (subItem) => {
    if (onSelectSection) {
      onSelectSection(subItem.id);
    }
    handleAssessmentMenuClose();
  };

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuSections = [
    {
      title: 'MAIN',
      items: [
        {
          id: 'dashboard',
          label: 'Overview',
          icon: <DashboardIcon />,
          route: 'admin.dashboard'
        },
        {
          id: 'users',
          label: 'Users',
          icon: <PeopleIcon />,
          route: 'admin.dashboard',
          params: { section: 'users' }
        },
        {
          id: 'enrollments',
          label: 'Enrollment',
          icon: <EditNoteIcon />,
          route: 'admin.dashboard',
          params: { section: 'enrollments' }
        }
      ]
    },
    {
      title: 'CLC MANAGEMENT',
      items: [
        {
          id: 'clc-list',
          label: 'CLC List',
          icon: <ApartmentIcon />,
          route: 'admin.dashboard',
          params: { section: 'clc-list' }
        },
        {
          id: 'clc-cai-list',
          label: 'CAI List',
          icon: <ManageAccountsIcon />,
          route: 'admin.dashboard',
          params: { section: 'clc-cai-list' }
        },
        {
          id: 'learner-list',
          label: 'Learner List',
          icon: <PeopleIcon />,
          route: 'admin.dashboard',
          params: { section: 'learner-list' }
        },
      ]
    },
    {
      title: 'LEARNING CONTENT',
      items: [
        {
          id: 'attendance-list',
          label: 'Attendance',
          icon: <EventAvailableIcon />,
          route: 'admin.dashboard',
          params: { section: 'attendance-list' }
        },
        {
          id: 'assessments',
          label: 'Assessments',
          icon: <AssessmentIcon />,
          hasSubmenu: true,
          submenu: [
            {
              id: 'materials',
              label: 'Materials',
              icon: <MaterialsIcon />,
              route: 'admin.modules',
              description: 'Upload and manage learning resources (PDFs, PPTs, docs, etc.)'
            },
            {
              id: 'reviewers',
              label: 'Reviewers',
              icon: <ReviewersIcon />,
              route: 'admin.reviewers',
              description: 'Manage/upload reviewer sets learners can use for practice'
            },
            {
              id: 'exams',
              label: 'Exams',
              icon: <ExamsIcon />,
              route: 'admin.assessments',
              description: 'Upload exam materials for CAIs to receive and download. Only Admin can upload, assigned CAIs can receive and download.'
            },
            {
              id: 'schedules',
              label: 'Schedules',
              icon: <ScheduleIcon />,
              route: 'admin.dashboard',
              description: 'Manage upcoming exams, deadlines, announcements, meetings'
            }
          ]
        }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        {
          id: 'reports',
          label: 'Reports',
          icon: <SummarizeIcon />,
          route: 'admin.dashboard',
          params: { section: 'reports' }
        }
      ]
    }
  ];

  const drawerContent = (
    <Box>
      {/* User Profile Section */}
      <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: '#3b82f6', mr: 2 }}>
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
        {sidebarOpen && (
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
              {displayName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
              {displayEmail}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ px: 1.7, py: 1 }}>
        {menuSections.map((section, sectionIndex) => (
          <Box key={section.title}>
            {/* Section Header */}
            {sidebarOpen && (
              <Typography
                variant="overline"
                sx={{
                  display: 'block',
                  px: 1,
                  py: 0,
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  mt: sectionIndex > 0 ? 2 : 0
                }}
              >
                {section.title}
              </Typography>
            )}
            
            {/* Section Items */}
            {section.items.map((item) => {
              // Handle Assessment item with floating dropdown
              if (item.id === 'assessments' && item.hasSubmenu && item.submenu) {
                const ItemComponent = (
                  <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={handleAssessmentMenuClick}
                      sx={{
                        minHeight: 40,
                        justifyContent: sidebarOpen ? 'initial' : 'center',
                        px: 2.5,
                        borderRadius: 1.5,
                        color: assessmentMenuOpen ? '#fff' : '#cbd5e1',
                        backgroundColor: assessmentMenuOpen ? '#3b82f6' : 'transparent',
                        '&:hover': {
                          backgroundColor: assessmentMenuOpen ? '#2563eb' : 'rgba(255,255,255,0.1)',
                        }
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
                        <>
                          <ListItemText 
                            primary={item.label}
                            primaryTypographyProps={{ fontSize: '0.875rem' }}
                          />
                          <ArrowDropDownIcon />
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>
                );

                return sidebarOpen ? ItemComponent : (
                  <Tooltip key={item.id} title={item.label} placement="right">
                    {ItemComponent}
                  </Tooltip>
                );
              }

              // Handle other items with submenus (if any)
              if (item.hasSubmenu && item.submenu) {
                const itemIsExpanded = isExpanded(item.id);
                
                return (
                  <Box key={item.id}>
                    {/* Main menu item with dropdown */}
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => handleToggleSection(item.id)}
                        sx={{
                          minHeight: 40,
                          justifyContent: sidebarOpen ? 'initial' : 'center',
                          px: 2.5,
                          borderRadius: 1.5,
                          color: selectedSection === item.id ? '#fff' : '#cbd5e1',
                          backgroundColor: selectedSection === item.id ? '#3b82f6' : 'transparent',
                          '&:hover': {
                            backgroundColor: selectedSection === item.id ? '#2563eb' : 'rgba(255,255,255,0.1)',
                          }
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
                          <>
                            <ListItemText 
                              primary={item.label}
                              primaryTypographyProps={{ fontSize: '0.875rem' }}
                            />
                            {itemIsExpanded ? <ExpandLess /> : <ExpandMore />}
                          </>
                        )}
                      </ListItemButton>
                    </ListItem>

                    {/* Submenu items */}
                    {sidebarOpen && (
                      <Collapse in={itemIsExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.submenu.map((subItem) => (
                            <ListItem key={subItem.id} disablePadding sx={{ mb: 0.3 }}>
                              <ListItemButton
                                component={Link}
                                href={route(subItem.route)}
                                onClick={() => onSelectSection && onSelectSection(subItem.id)}
                                sx={{
                                  minHeight: 36,
                                  pl: 6,
                                  pr: 2.5,
                                  borderRadius: 1,
                                  color: selectedSection === subItem.id ? '#fff' : '#94a3b8',
                                  backgroundColor: selectedSection === subItem.id ? '#2563eb' : 'transparent',
                                  '&:hover': {
                                    backgroundColor: selectedSection === subItem.id ? '#1d4ed8' : 'rgba(255,255,255,0.05)',
                                  }
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 0,
                                    mr: 2,
                                    justifyContent: 'center',
                                    color: 'inherit',
                                  }}
                                >
                                  {subItem.icon}
                                </ListItemIcon>
                                <ListItemText 
                                  primary={subItem.label}
                                  primaryTypographyProps={{ fontSize: '0.8rem' }}
                                />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </Box>
                );
              }

              // Handle regular menu items
              const ItemComponent = (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href={item.params ? route(item.route, item.params) : route(item.route)}
                    onClick={() => onSelectSection(item.id)}
                    sx={{
                      minHeight: 40,
                      justifyContent: sidebarOpen ? 'initial' : 'center',
                      px: 2.5,
                      borderRadius: 1.5,
                      color: selectedSection === item.id ? '#fff' : '#cbd5e1',
                      backgroundColor: selectedSection === item.id ? '#3b82f6' : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedSection === item.id ? '#2563eb' : 'rgba(255,255,255,0.1)',
                      }
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
                        primaryTypographyProps={{ fontSize: '0.875rem' }}
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
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { sm: sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH }, 
          flexShrink: { sm: 0 } 
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              backgroundColor: '#182f54',
              borderRight: '1px solid #334155',
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
              width: sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
              backgroundColor: '#182f54',
              borderRight: '1px solid #334155',
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

      {/* Main Content */}
      <div className="admin-main">
        {/* App Bar */}
        <AppBar
          position="fixed"
          className="admin-app-bar"
          sx={{
            width: { 
              sm: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)`,
              xs: '100%'
            },
            ml: { 
              sm: `${sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH}px`,
              xs: 0
            },
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ 
                color: '#cbd5e1',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <div className="admin-page-content">
          {children}
        </div>
      </div>

      {/* Floating Assessment Menu */}
      <Menu
        anchorEl={assessmentMenuAnchor}
        open={assessmentMenuOpen}
        onClose={handleAssessmentMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#1e293b',
            color: '#cbd5e1',
            border: '1px solid #334155',
            minWidth: 200,
            '& .MuiMenuItem-root': {
              fontSize: '0.875rem',
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              }
            }
          }
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        {menuSections.find(section => section.title === 'LEARNING CONTENT')?.items
          .find(item => item.id === 'assessments')?.submenu?.map((subItem) => (
          <MenuItem 
            key={subItem.id}
            onClick={() => handleAssessmentSubmenuClick(subItem)}
            component={Link}
            href={route(subItem.route)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Box sx={{ color: 'inherit', display: 'flex' }}>
              {subItem.icon}
            </Box>
            {subItem.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
