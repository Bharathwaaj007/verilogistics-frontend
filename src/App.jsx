import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import HubDashboard from './pages/HubDashboard.jsx'
import Login from './pages/Login.jsx'
import CarrierDashboard from './pages/CarrierDashboard.jsx'

function PageWrap({ children }) {
  const location = useLocation()
  return (
    <Box
      key={location.pathname}
      sx={{
        animation: 'pageFadeIn 0.35s ease-out',
        width: '100%',
      }}
    >
      {children}
    </Box>
  )
}

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', fontFamily: '"Inter", sans-serif' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          mt: 8,
          maxWidth: '1440px',
          mx: 'auto',
          width: '100%',
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
          <Route path="/seller" element={<PageWrap><SellerDashboard /></PageWrap>} />
          <Route path="/hub" element={localStorage.getItem('isHubLoggedIn') === 'true' ? <PageWrap><HubDashboard /></PageWrap> : <Navigate to="/login" replace />} />
          <Route path="/carrier" element={<PageWrap><CarrierDashboard /></PageWrap>} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App
