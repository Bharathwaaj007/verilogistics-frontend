import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Typography,
  TextField,
  CircularProgress,
  Button,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { socket, connectSocket, disconnectSocket } from '../services/socket/index.js'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const cyanGlow = '0 0 40px rgba(0, 212, 255, 0.18)'
const glassCardBase = {
  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.7) 50%, rgba(15, 23, 42, 0.9) 100%)',
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.04)',
  boxShadow: `0 6px 28px rgba(0, 0, 0, 0.28), ${cyanGlow}`,
  padding: 24,
  transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
  fontFamily: '"Inter", sans-serif',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: `0 22px 56px rgba(0, 0, 0, 0.38), 0 0 64px rgba(0, 212, 255, 0.18)`,
    borderColor: 'rgba(0, 212, 255, 0.24)',
  },
}

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    '& fieldset': { borderColor: 'rgba(0, 212, 255, 0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.35)' },
    '&.Mui-focused fieldset': {
      borderColor: '#00d4ff',
      borderWidth: '2px',
      boxShadow: '0 0 0 3px rgba(0, 212, 255, 0.15)',
    },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#00d4ff' },
  '& .MuiOutlinedInput-input': { color: '#f1f5f9' },
}

const emissionChartData = [
  { name: 'Before', value: 1.95, fill: 'rgba(148, 163, 184, 0.6)' },
  { name: 'After', value: 1.2, fill: '#00d4ff' },
]

function CarrierDashboard() {
  const [fleet, setFleet] = useState({ origin: '', destination: '', cargo: '', length: '', width: '', height: '' })
  const [saving] = useState({ percent: 45, amount: '₹ 3,420' })
  const [distance, setDistance] = useState(600)
  const [weight, setWeight] = useState(1200)
  const [modeFactor, setModeFactor] = useState(80)
  const [progress] = useState(38)
  const [snackOpen, setSnackOpen] = useState(false)

  console.log('CarrierDashboard mounted')

  // Live parcel detection counters (cleaned, safe implementation)
  const [countA, setCountA] = useState(0)
  const [countB, setCountB] = useState(0)

  useEffect(() => {
    // Safety: SSR and socket availability check
    if (typeof window === 'undefined' || !socket || !connectSocket) {
      console.warn('CarrierDashboard: socket unavailable - skipping live parcel setup')
      return
    }

    try {
      connectSocket()
    } catch (err) {
      console.error('Error connecting socket:', err)
    }

    const handleParcelScan = (data) => {
      try {
        console.log('Parcel scan received:', data)
        const inc = data?.objectsDetected ?? 1
        if (data?.company === 'A') setCountA((c) => c + inc)
        else if (data?.company === 'B') setCountB((c) => c + inc)
      } catch (err) {
        console.error('Error handling parcel scan:', err)
      }
    }

    try {
      socket.on('new-parcel-scan', handleParcelScan)
    } catch (err) {
      console.error('Error registering parcel listener:', err)
    }

    return () => {
      try {
        socket.off('new-parcel-scan', handleParcelScan)
      } catch (err) {
        console.error('Error removing parcel listener:', err)
      }

      try {
        disconnectSocket()
      } catch (err) {
        console.error('Error disconnecting socket:', err)
      }
    }
  }, [])

  const handleFleetChange = (key) => (e) => setFleet((s) => ({ ...s, [key]: e.target.value }))
  const handleConfirm = (e) => {
    e.preventDefault()
    console.log('Confirm Deployment', fleet)
    setSnackOpen(true)
  }

  // quick emission calc (demo): tCO2e = distance (km) * weight (kg) / 1e6 * modeFactor
  const estimated = ((distance * weight) / 1e6) * (modeFactor / 1000)

  return (
    <Box sx={{ fontFamily: '"Inter", sans-serif' }}>
      {/* Page title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', mb: 0.5 }}>
          Carrier Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Provide carriers with lane visibility, sustainability insights, and exception signals tied to their active loads.
        </Typography>
      </Box>

      {/* Live Parcel Detections (ESP32 Cam) — safe, stable UI */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9', mb: 2 }}>Live Parcel Detections (ESP32 Cam)</Typography>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} sm={6}>
            <Box sx={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.9), rgba(30,41,59,0.75))', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)', p: 3, textAlign: 'center', transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease', animation: 'fadeIn 0.7s ease both', '&:hover': { transform: 'translateY(-6px) scale(1.02)', boxShadow: '0 30px 80px rgba(0,212,255,0.18)', borderColor: '#00d4ff' } }}>
              <LocalShippingIcon sx={{ fontSize: 44, color: '#00d4ff', mb: 1, filter: 'drop-shadow(0 0 16px #00d4ff44)' }} />
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.75)', display: 'block', fontWeight: 800, letterSpacing: '0.12em' }}>Company A</Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, color: '#00d4ff', mt: 1, fontSize: '2.4rem', textShadow: '0 0 28px rgba(0,212,255,0.35)' }}>{countA}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.9), rgba(30,41,59,0.75))', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)', p: 3, textAlign: 'center', transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease', animation: 'fadeIn 0.85s ease both', '&:hover': { transform: 'translateY(-6px) scale(1.02)', boxShadow: '0 30px 80px rgba(255,107,203,0.14)', borderColor: '#ff6bcb' } }}>
              <LocalShippingIcon sx={{ fontSize: 44, color: '#ff6bcb', mb: 1, filter: 'drop-shadow(0 0 16px #ff6bcb44)' }} />
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.75)', display: 'block', fontWeight: 800, letterSpacing: '0.12em' }}>Company B</Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, color: '#ff6bcb', mt: 1, fontSize: '2.4rem', textShadow: '0 0 28px rgba(255,107,203,0.28)' }}>{countB}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Left: Fleet Deployment */}
        <Grid item xs={12} md={6}>
          <Box sx={{ ...glassCardBase, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 1 }}>
              Fleet Deployment
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.62)', mb: 2 }}>
              Prepare a carrier deployment with cargo details and dimensions.
            </Typography>
            <Box component="form" onSubmit={handleConfirm} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Shipment Origin" variant="outlined" size="small" sx={textFieldSx} value={fleet.origin} onChange={handleFleetChange('origin')} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Shipment Destination" variant="outlined" size="small" sx={textFieldSx} value={fleet.destination} onChange={handleFleetChange('destination')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Cargo Description" variant="outlined" size="small" sx={textFieldSx} value={fleet.cargo} onChange={handleFleetChange('cargo')} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Length (m)" variant="outlined" size="small" sx={textFieldSx} value={fleet.length} onChange={handleFleetChange('length')} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Width (m)" variant="outlined" size="small" sx={textFieldSx} value={fleet.width} onChange={handleFleetChange('width')} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Height (m)" variant="outlined" size="small" sx={textFieldSx} value={fleet.height} onChange={handleFleetChange('height')} />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                  <Button type="submit" sx={{ background: 'linear-gradient(90deg,#00d4ff,#0078d4)', color: '#00121a', fontWeight: 800, borderRadius: 2, px: 3, py: 1.25, boxShadow: '0 8px 32px rgba(0,212,255,0.12)', transition: 'transform 180ms ease, box-shadow 180ms ease', '&:hover': { transform: 'scale(1.03)', boxShadow: '0 18px 48px rgba(0,212,255,0.22), 0 0 40px rgba(0,212,255,0.18)' } }}>
                    Confirm Operational Deployment
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        {/* Right: Cost Savings Advisor */}
        <Grid item xs={12} md={6}>
          <Box sx={{ ...glassCardBase, p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 1 }}>Cost Savings Advisor</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.62)', mb: 2 }}>
              Empty-leg consolidation and backhaul optimization can reduce costs by approx <strong>45%</strong> on selected lanes.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ background: 'linear-gradient(90deg, rgba(255,98,0,0.12), rgba(255,98,0,0.06))', px: 2.5, py: 1.75, borderRadius: 2, border: '1px solid rgba(255,98,0,0.18)', boxShadow: '0 10px 30px rgba(255,98,0,0.06)' }}>
                <Typography variant="h4" sx={{ color: '#ff6200', fontWeight: 900, letterSpacing: '-0.02em' }}>{saving.amount}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>EST. SAVING</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ color: '#f1f5f9', fontWeight: 700 }}>~{saving.percent}% estimated</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Explore empty-leg opportunities and fleet fills to maximize utilization.</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
              <Button sx={{ borderRadius: 2, px: 3, py: 1, background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.04)', '&:hover': { background: 'rgba(255,255,255,0.04)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' } }}>Analyze Routes</Button>
              <Button sx={{ borderRadius: 2, px: 3, py: 1, background: 'linear-gradient(90deg,#ff6200,#ff5200)', color: '#08121a', fontWeight: 800, '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 36px rgba(255,98,0,0.26)' } }}>View Savings</Button>
            </Box>
          </Box>
        </Grid>

        {/* Bottom: Emission Estimator */}
        <Grid item xs={12}>
          <Box sx={{ ...glassCardBase, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 1 }}>Emission Estimator</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.62)', mb: 2 }}>Estimate carbon emissions by distance, weight and transport mode.</Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Distance (km)" type="number" variant="outlined" size="small" value={distance} onChange={(e) => setDistance(Number(e.target.value))} sx={textFieldSx} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Weight (kg)" type="number" variant="outlined" size="small" value={weight} onChange={(e) => setWeight(Number(e.target.value))} sx={textFieldSx} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField select fullWidth label="Mode" size="small" value={modeFactor} onChange={(e) => setModeFactor(Number(e.target.value))} sx={textFieldSx}>
                  <MenuItem value={80}>Road (80 g/ton-km)</MenuItem>
                  <MenuItem value={50}>Rail (50 g/ton-km)</MenuItem>
                  <MenuItem value={6}>Sea (6 g/ton-km)</MenuItem>
                  <MenuItem value={500}>Air (500 g/ton-km)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress variant="determinate" value={progress} size={80} thickness={4} sx={{ color: '#00d4ff', filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.36))' }} />
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: '#00d4ff' }}>{`${progress}%`}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>Estimated footprint</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#00d4ff', letterSpacing: '-0.03em', textShadow: '0 0 40px rgba(0,212,255,0.5)' }}>{`~${estimated.toFixed(1)} tCO₂e`}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Calculated from distance × weight × mode factor (demo).</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1 }}>Reduction vs baseline</Typography>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={emissionChartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                      <XAxis dataKey="name" tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }} axisLine={{ stroke: 'rgba(0, 212, 255, 0.2)' }} tickLine={{ stroke: 'rgba(0, 212, 255, 0.2)' }} />
                      <YAxis tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 11 }} axisLine={{ stroke: 'rgba(0, 212, 255, 0.2)' }} tickLine={{ stroke: 'rgba(0, 212, 255, 0.2)' }} unit=" tCO₂e" domain={[0, 2.5]} />
                      <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(0, 212, 255, 0.3)', borderRadius: 8, color: '#f1f5f9' }} formatter={(value) => [`${value} tCO₂e`, '']} labelStyle={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {emissionChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Snackbar open={snackOpen} autoHideDuration={2200} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ bgcolor: 'rgba(0,212,255,0.06)', color: '#00d4ff', boxShadow: '0 6px 24px rgba(0,212,255,0.12)' }}>
          Deployment confirmed
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CarrierDashboard
