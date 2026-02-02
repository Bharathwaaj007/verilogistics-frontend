import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

function ShipmentForm() {
  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Shipment
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Capture seller, origin, destination, and verification metadata for a new shipment.
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Shipment Reference" size="small" />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Origin Hub" size="small" />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Destination Hub" size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Seller" size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Carrier" size="small" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Mode" size="small" defaultValue="road">
              <MenuItem value="road">Road</MenuItem>
              <MenuItem value="air">Air</MenuItem>
              <MenuItem value="sea">Sea</MenuItem>
              <MenuItem value="rail">Rail</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Verification Notes"
              size="small"
              multiline
              minRows={3}
            />
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary">
              Save Draft
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default ShipmentForm

