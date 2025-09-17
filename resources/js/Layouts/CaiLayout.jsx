import { useState, useEffect } from 'react';
import CaiSidebar from '../Components/CAI/Sidebar';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { showConfirm } from '@/Utils/sweetalert';
import { router } from '@inertiajs/react';
import '../../css/cai-layout.css';

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
            backgroundColor: '#182f54',
            color: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
                color: '#fff',
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
        <div className="cai-page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
