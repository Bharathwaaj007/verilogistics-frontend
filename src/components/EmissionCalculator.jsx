import {
  Box,
  Divider,
  Grid,
  Paper,
  Slider,
  TextField,
  Typography,
} from '@mui/material'

function EmissionCalculator() {
  return (
    <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Emission Estimator
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Explore indicative CO₂e for a shipment by distance, weight, and mode. This is a static
        placeholder; wire to your model or API later.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Distance (km)"
              type="number"
              size="small"
              defaultValue={600}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              size="small"
              defaultValue={1200}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mode factor (g CO₂e / ton-km)"
              type="number"
              size="small"
              defaultValue={80}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Route reliability vs. sustainability
            </Typography>
            <Slider defaultValue={60} step={10} marks min={0} max={100} />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Estimated footprint
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            ~ 1.2 tCO₂e
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Replace this static value with a calculation driven by your emissions factors,
            carrier-specific data, and shipment attributes.
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default EmissionCalculator

