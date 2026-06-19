import { NavLink, Outlet } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'

const DRAWER_WIDTH = 260

const navItems = [
  { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, mark: 'D' },
  { label: 'My Courses', path: ROUTES.STUDENT_MY_COURSES, mark: 'M' },
  { label: 'Browse Courses', path: ROUTES.STUDENT_BROWSE, mark: 'B' },
]

export function StudentLayout() {
  const { user, logout } = useAuth()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Student Workspace
            </Typography>
            <Typography variant="h6">Learning Dashboard</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontSize: 14 }}>
              {user?.displayName?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {user?.displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Button variant="outlined" size="small" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            p: 2,
          },
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: 'white' }}>
            Parhai Likhai
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(209, 213, 219, 0.8)' }}>
            Learn, track, complete.
          </Typography>
        </Stack>
        <List sx={{ display: 'grid', gap: 0.75 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  gap: 1.5,
                  color: 'rgba(209, 213, 219, 0.86)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
                  '&.active': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.12)',
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {item.mark}
                </Box>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { sx: { fontWeight: 700, fontSize: 14 } } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 4 },
          py: 4,
          mt: 9,
          ml: { xs: 0, md: 0 },
        }}
      >
        <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: { xs: 'flex', md: 'none' },
              overflowX: 'auto',
              pb: 2,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                variant="outlined"
                size="small"
                sx={{
                  flexShrink: 0,
                  '&.active': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderColor: 'primary.main',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
