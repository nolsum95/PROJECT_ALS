import { useState, useEffect } from 'react';
import CaiSidebar from '../Components/CAI/Sidebar';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { showConfirm } from '@/Utils/sweetalert';
import { router } from '@inertiajs/react';
// Removed unused CSS import to align with LearnerLayout visual styling

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 64;

export default function CaiLayout({ children, title = 'CAI Dashboard', auth, selectedSection = 'dashboard' }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [expandedSections, setExpandedSections] = useState([selectedSection]);
  const [currentSelectedSection, setCurrentSelectedSection] = useState(selectedSection);

  const user = auth?.user;

  useEffect(() => {
    setCurrentSelectedSection(selectedSection);
    setExpandedSections([selectedSection]);
  }, [selectedSection]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = async () => {
    const result = await showConfirm('Are you sure you want to logout?', 'Logout Confirmation');
    if (result.isConfirmed) {
      router.post(route('logout'));
    }
  };

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="cai-layout">
      {/* Sidebar */}
      <div className="cai-sidebar">
        <CaiSidebar
          user={user}
          auth={auth}
          selectedSection={currentSelectedSection}
          onSelectSection={setCurrentSelectedSection}
          expandedSections={expandedSections}
          onToggleSection={(section) => {
            if (expandedSections.includes(section)) {
              setExpandedSections(expandedSections.filter(s => s !== section));
            } else {
              setExpandedSections([section]);
            }
          }}
          sidebarOpen={sidebarOpen}
          onClose={handleDrawerToggle}
          isMobile={isMobile}
          drawerWidth={DRAWER_WIDTH}
          collapsedWidth={COLLAPSED_WIDTH}
        />
      </div>

      {/* Main Content */}
      <div className="cai-main-content">
        {/* App Bar */}
        <AppBar
          position="fixed"
          className="cai-app-bar"
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
            backgroundColor: 'white',
            color: 'text.primary',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
            {/* Status Indicator (parity with LearnerLayout) */}
            <Chip
              icon={<CheckCircleIcon />}
              label="Active"
              color="success"
              size="small"
              variant="outlined"
              sx={{ mr: 1 }}
            />
            
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ 
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          className="cai-page-content"
          sx={{
            bgcolor: 'grey.50',
            minHeight: '100vh',
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
            p: 3,
          }}
        >
          {/* Spacer for fixed AppBar height */}
          <Toolbar />
          {children}
        </Box>
      </div>
    </div>
  );
}
