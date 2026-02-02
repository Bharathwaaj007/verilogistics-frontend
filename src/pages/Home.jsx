import { Box, Grid, Paper, Typography } from '@mui/material'
import TrackingMap from '../components/TrackingMap.jsx'
import VerificationLogs from '../components/VerificationLogs.jsx'

function Home() {
  return (
    <Box sx={{ fontFamily: '"Inter", sans-serif' }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', mb: 0.5 }}
        >
          Network Overview
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          High-level view of active shipments, hub performance, and verification signals across the
          VeriLogistics network.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12} md={8}>
          <TrackingMap />
        </Grid>
        <Grid item xs={12} md={4}>
          <VerificationLogs />
        </Grid>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              bgcolor: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 3,
              border: '1px solid rgba(0, 212, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3), 0 0 32px rgba(0, 212, 255, 0.15)',
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ color: '#f1f5f9', fontWeight: 600, mb: 1 }}>
              Integration checklist
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Plug in your APIs, Socket.io streams, and carrier feeds here to power real-time
              network KPIs.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home
