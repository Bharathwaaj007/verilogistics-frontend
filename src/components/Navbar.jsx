import { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItemButton,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material' 
import { NavLink, useNavigate, useLocation } from 'react-router-dom' 

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
)
const LogoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
  </svg>
)

const ROUTES = [
  { to: '/', label: 'OVERVIEW' },
  { to: '/seller', label: 'SELLER' },
  { to: '/hub', label: 'HUB' },
  { to: '/carrier', label: 'CARRIER' },
]

const cyanGlow = '0 0 20px rgba(0, 212, 255, 0.38)'
const cyanGlowStrong = '0 0 28px rgba(0, 212, 255, 0.6)'

function NavButton({ to, label }) {
  return (
    <NavLink to={to} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Button
          disableRipple
          sx={{
            color: isActive ? '#00d4ff' : 'rgba(255,255,255,0.88)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontWeight: 700,
            fontSize: '0.84rem',
            px: 1.5,
            py: 0.75,
            minWidth: 'auto',
            position: 'relative',
            transition: 'transform 160ms ease, color 160ms ease, box-shadow 160ms ease',
            '&:hover': {
              transform: 'scale(1.05)',
              color: '#00d4ff',
              textShadow: cyanGlow,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 6,
              right: 6,
              bottom: 4,
              height: 3,
              borderRadius: 2,
              background: isActive ? '#00d4ff' : 'transparent',
              boxShadow: isActive ? cyanGlowStrong : 'none',
              transition: 'background 220ms ease, box-shadow 220ms ease',
            },
          }}
        >
          {label}
        </Button>
      )}
    </NavLink>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const [isHubLoggedIn, setIsHubLoggedIn] = useState(localStorage.getItem('isHubLoggedIn') === 'true')

  useEffect(() => {
    setIsHubLoggedIn(localStorage.getItem('isHubLoggedIn') === 'true')
  }, [location.pathname])

  const handleDrawerToggle = () => setMobileOpen((v) => !v)

  const drawer = (
    <Box
      sx={{
        width: 260,
        height: '100%',
        px: 2,
        pt: 3,
        bgcolor: 'rgba(10,14,23,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      role="presentation"
      onClick={handleDrawerToggle}
    >
      <Typography sx={{ mb: 1, fontWeight: 800, color: '#00d4ff', letterSpacing: '-0.02em' }}>VeriLogistics</Typography>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)', mb: 1 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {ROUTES.map((r) => (
          <NavLink key={r.to} to={r.to} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <ListItemButton sx={{ borderRadius: 1, px: 2, color: isActive ? '#00d4ff' : 'rgba(255,255,255,0.9)', boxShadow: isActive ? cyanGlow : 'none' }}>
                {r.label}
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 0,
          bgcolor: 'rgba(10,14,23,0.64)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ maxWidth: 1400, mx: 'auto', width: '100%', py: 0.5 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#00d4ff',
              textDecoration: 'none',
              textShadow: '0 2px 14px rgba(0,212,255,0.14)',
              transition: 'transform 160ms ease, filter 160ms ease',
              '&:hover': { transform: 'scale(1.02)', filter: 'drop-shadow(0 6px 18px rgba(0,212,255,0.12))' },
            }}
          >
            VeriLogistics
          </Typography>

          {/* Desktop nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {ROUTES.map((r) => (
                <NavButton key={r.to} to={r.to} label={r.label} />
              ))}
            </Box>
          )}

          {/* Right: logout + avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            {isHubLoggedIn && (
              <>
                {!isMobile ? (
                  <Button
                    startIcon={<LogoutIcon />}
                    onClick={() => { localStorage.removeItem('isHubLoggedIn'); setIsHubLoggedIn(false); navigate('/login') }}
                    sx={{ ml: 0.5, color: 'rgba(255,255,255,0.92)', borderRadius: 1.25, textTransform: 'none', px: 1.5, py: 0.5, border: '1px solid rgba(255,255,255,0.03)', '&:hover': { color: '#ff4d4f', boxShadow: '0 8px 26px rgba(255,77,79,0.12)', transform: 'scale(1.03)' } }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Tooltip title="Logout">
                    <IconButton
                      size="small"
                      aria-label="logout"
                      onClick={() => { localStorage.removeItem('isHubLoggedIn'); setIsHubLoggedIn(false); navigate('/login') }}
                      sx={{ ml: 0.5, color: 'rgba(255,255,255,0.9)', '&:hover': { color: '#ff4d4f', boxShadow: '0 8px 26px rgba(255,77,79,0.12)', transform: 'scale(1.05)' } }}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
            <Tooltip title="Account">
              <IconButton sx={{ ml: 1 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(0,212,255,0.12)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.16)' }}>U</Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Mobile hamburger */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              onClick={handleDrawerToggle}
              sx={{ ml: 1, color: 'rgba(255,255,255,0.9)', '&:hover': { color: '#00d4ff', transform: 'scale(1.05)' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: 260, bgcolor: 'rgba(10,14,23,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } }}
      >
        {drawer}
      </Drawer>
    </>
  )
}
