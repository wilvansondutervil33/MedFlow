import { AppBar, Toolbar, Typography, Box, Button, Link, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import {Analytics as AnalyticsIcon} from '@mui/icons-material';
import CallIcon from '@mui/icons-material/Call';
import ReportIcon from '@mui/icons-material/Report';
import PersonIcon from '@mui/icons-material/Person';

//added username, role, onLogout to function params
function AppHeader({username, role, onLogout, children}) {

  const drawerWidth = 0;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
          position="fixed"
          sx={{
            backgroundColor: 'light blue',
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            zIndex: (theme) => theme.zIndex.drawer + 1, // sit above the drawer
          }}
        >
        <Toolbar sx={{display: 'flex', justifyContent: 'space-around'}}>
          <Typography variant="h6" component="h1">
            Medflow Fleet Command Center
          </Typography>
          {username && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 20}}>
              <Typography variant="body2">{username} ({role})</Typography>
            </Box>
          )}
          <Button color="inherit" onClick={onLogout}>Log Out</Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* spacer so content starts below the AppBar */}
        {children}
      </Box>
    </Box>
  );
}

export default AppHeader;