import { useState } from 'react'
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material'

const SAMPLE_LOGS = [
  {
    id: 'VL-10293',
    entity: 'Seller',
    message: 'Invoice and packing list verified',
    status: 'passed',
    timestamp: '2026-01-18 09:21 UTC',
  },
  {
    id: 'VL-10294',
    entity: 'Carrier',
    message: 'Temperature excursion alert acknowledged',
    status: 'warning',
    timestamp: '2026-01-18 09:32 UTC',
  },
  {
    id: 'VL-10295',
    entity: 'Hub',
    message: 'Geo-fence breach flagged for review',
    status: 'failed',
    timestamp: '2026-01-18 09:44 UTC',
  },
]

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

const statusConfig = {
  passed: { label: 'PASS', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.18)', border: 'rgba(34, 197, 94, 0.45)' },
  warning: { label: 'WARNING', color: '#f97316', bg: 'rgba(249, 115, 22, 0.18)', border: 'rgba(249, 115, 22, 0.45)' },
  failed: { label: 'FAILED', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.18)', border: 'rgba(239, 68, 68, 0.45)' },
}

const entityInitial = (entity) => (entity || '?').charAt(0)

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    '& fieldset': { borderColor: 'rgba(0, 212, 255, 0.18)' },
    '&:hover fieldset': { borderColor: 'rgba(0, 212, 255, 0.36)' },
    '&.Mui-focused fieldset': {
      borderColor: '#00d4ff',
      borderWidth: '2px',
      boxShadow: '0 0 0 6px rgba(0, 212, 255, 0.12)',
    },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.75)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#00d4ff' },
  '& .MuiOutlinedInput-input': { color: '#f1f5f9' },
}

const gradientButtonSx = {
  background: 'linear-gradient(135deg, #00d4ff 0%, #0078d4 100%)',
  color: '#0a0e17',
  fontWeight: 700,
  borderRadius: '12px',
  px: 3,
  py: 1.5,
  boxShadow: '0 8px 28px rgba(0, 212, 255, 0.24)',
  transition: 'transform 0.18s ease, box-shadow 0.18s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 14px 44px rgba(0, 212, 255, 0.42), 0 0 64px rgba(0, 212, 255, 0.22)',
  },
} 

const noiseSvg =
  "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

function SellerDashboard() {
  const [form, setForm] = useState({
    ref: '',
    origin: '',
    destination: '',
    seller: '',
    carrier: '',
    mode: 'road',
    notes: '',
  })
  const [snackOpen, setSnackOpen] = useState(false)

  const handleChange = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }))
  const handleSaveDraft = (e) => {
    e.preventDefault()
    // demo: show snackbar
    setSnackOpen(true)
    console.log('Save Draft', form)
  }

  return (
    <Box
      sx={{
        fontFamily: '"Inter", sans-serif',
        position: 'relative',
        minHeight: '100%',
        background: 'linear-gradient(160deg, #0a0e17 0%, #0f172a 35%, #0a0e17 100%)',
      }}
    >
      {/* Subtle noise overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${noiseSvg}")`,
          opacity: 0.04,
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Page title */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', mb: 0.5 }}
          >
            Seller Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Onboard shipments, attach verification documents, and monitor seller-side controls before
            handoff to carriers.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Left: Create Shipment glass card — stacks on mobile */}
          <Grid item xs={12} md={6}>
            <Box sx={{ ...glassCardBase, p: { xs: 2.5, sm: 3 }, height: '100%' }}>
              <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600, mb: 0.5 }}>
                Create Shipment
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2 }}>
                Capture seller, origin, destination, and verification metadata for a new shipment.
              </Typography>
              <Box component="form" noValidate autoComplete="off" onSubmit={handleSaveDraft}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Shipment Reference" variant="outlined" size="small" sx={textFieldSx} value={form.ref} onChange={handleChange('ref')} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Origin Hub" variant="outlined" size="small" sx={textFieldSx} value={form.origin} onChange={handleChange('origin')} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Destination Hub" variant="outlined" size="small" sx={textFieldSx} value={form.destination} onChange={handleChange('destination')} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Seller" variant="outlined" size="small" sx={textFieldSx} value={form.seller} onChange={handleChange('seller')} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Carrier" variant="outlined" size="small" sx={textFieldSx} value={form.carrier} onChange={handleChange('carrier')} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField select fullWidth label="Mode" variant="outlined" size="small" sx={textFieldSx} value={form.mode} onChange={handleChange('mode')}>
                      <MenuItem value="road">Road</MenuItem>
                      <MenuItem value="air">Air</MenuItem>
                      <MenuItem value="sea">Sea</MenuItem>
                      <MenuItem value="rail">Rail</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Verification Notes" variant="outlined" size="small" multiline minRows={3} sx={textFieldSx} value={form.notes} onChange={handleChange('notes')} />
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="flex-end">
                    <Button type="submit" sx={gradientButtonSx}>
                      Save Draft
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>

          {/* Right: Verification Logs — same style as Hub */}
          <Grid item xs={12} md={6}>
            <Box sx={{ ...glassCardBase, p: { xs: 2.5, sm: 3 }, height: '100%', minHeight: 420, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600 }}>Verification Logs</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Synthetic events</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, overflow: 'auto', flex: 1 }}>
                {SAMPLE_LOGS.map((log) => {
                  const config = statusConfig[log.status] || statusConfig.passed
                  return (
                    <Box key={log.id} sx={{ ...glassCardBase, p: 2.5, '&:hover': { transform: 'scale(1.02)', boxShadow: `0 18px 56px rgba(0,0,0,0.36), 0 0 64px rgba(0,212,255,0.16)` } }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.25 }}>
                        <Avatar sx={{ width: 44, height: 44, bgcolor: 'rgba(0, 212, 255, 0.18)', border: '1px solid rgba(0, 212, 255, 0.35)', color: '#00d4ff', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>{entityInitial(log.entity)}</Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.25, mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ color: '#f1f5f9', fontWeight: 600 }}>{log.id}</Typography>
                            <Box component="span" sx={{ px: 1.5, py: 0.4, borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', color: config.color, bgcolor: config.bg, border: `1px solid ${config.border}` }}>{config.label}</Box>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.55, mb: 1.25 }}>{log.message}</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>{log.entity} · {log.timestamp}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={snackOpen} autoHideDuration={2200} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ bgcolor: 'rgba(0,212,255,0.06)', color: '#00d4ff', boxShadow: '0 6px 24px rgba(0,212,255,0.12)' }}>
          Draft saved
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SellerDashboard
