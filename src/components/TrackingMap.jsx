import { Box, Paper, Typography } from '@mui/material'

function TrackingMap() {
  return (
    <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Live Tracking Map
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        This placeholder will render a real-time map with shipment locations, routes, and hub
        congestion overlays.
      </Typography>
      <Box
        sx={{
          mt: 2,
          borderRadius: 2,
          bgcolor: 'grey.100',
          border: '1px dashed',
          borderColor: 'grey.300',
          height: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          fontSize: 14,
        }}
      >
        Map visualization coming soon
      </Box>
    </Paper>
  )
}

export default TrackingMap

