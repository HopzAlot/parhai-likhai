import { NavLink, Outlet } from 'react-router-dom'
import {
  AppBar, Box, Drawer, List, ListItem, ListItemButton,
  ListItemText, Toolbar, Typography, Button, Divider, Avatar,
} from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'

const DRAWER_WIDTH = 220

const navItems = [
  { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD },
  { label: 'My Courses', path: ROUTES.STUDENT_MY_COURSES },
  { label: 'Browse Courses', path: ROUTES.STUDENT_BROWSE },
]

export function StudentLayout() {
  const { user, logout } = useAuth()

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>LMS – Student</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
              {user?.displayName?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="body2">{user?.displayName}</Typography>
            <Button color="inherit" size="small" onClick={logout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{ '&.active': { bgcolor: 'primary.light', color: 'primary.contrastText' } }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  )
}