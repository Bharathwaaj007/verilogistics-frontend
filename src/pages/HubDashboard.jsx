import { useEffect, useRef, useState } from 'react'
import { Box, Grid, Typography, Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { socket, connectSocket, disconnectSocket } from '../services/socket'

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

const STATS = [
  { label: 'Total Parcels', value: '12,847', sub: 'Last 30 days' },
  { label: 'Verified Today', value: '384', sub: 'Real-time' },
  { label: 'Alerts', value: '3', sub: 'Require attention' },
]

const HUB_METRICS = [
  { label: 'Active Trucks', value: '24' },
  { label: 'Fuel Rating', value: 'A+' },
  { label: 'Eco-Saving', value: '₹12 Lk' },
  { label: 'Staff', value: '88' },
]

const cyanGlow = '0 0 40px rgba(0, 212, 255, 0.18)'
const strongCyan = 'rgba(0,212,255,0.26)'
const orangeAccent = '#ff6200'
const glassCardBase = {
  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.7) 50%, rgba(15, 23, 42, 0.9) 100%)',
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.04)',
  padding: 24,
  transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
  fontFamily: '"Inter", sans-serif',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: `0 28px 80px rgba(0, 0, 0, 0.45), ${cyanGlow}`,
    borderColor: strongCyan,
  },
} 

const statusConfig = {
  passed: { label: 'PASS', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.28)' },
  warning: { label: 'WARNING', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.28)' },
  failed: { label: 'FAILED', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.28)' },
}

const entityInitial = (entity) => (entity || '?').charAt(0)

const NETWORK_ITEMS = [
  { time: '09:30', name: 'Rahim Uddin', status: 'on-route', note: 'ON-BOUTE' },
  { time: '11:15', name: 'Alexander Reid', status: 'standby', note: 'STANDBY' },
  { time: '14:00', name: 'Carolyn Weaver', status: 'delayed', note: 'DELAYED' },
]

const statusDot = {
  'on-route': '#22c55e',
  standby: '#f97316',
  delayed: '#ef4444',
}

function SimpleLeafletMap({ height = 360 }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    function init() {
      if (!mapRef.current || mapInstance.current) return
      const L = window.L
      mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([11.0168, 76.9558], 9)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance.current)

      const markers = [
        { coords: [11.0168, 76.9558], label: 'Coimbatore' },
        { coords: [11.1083, 77.346], label: 'Tiruppur' },
        { coords: [11.341, 77.7172], label: 'Erode' },
      ]

      markers.forEach((m) => {
        L.marker(m.coords).addTo(mapInstance.current).bindPopup(m.label)
      })

      const routeCoords = markers.map((m) => m.coords)
      L.polyline(routeCoords, { color: '#00d4ff', weight: 3, opacity: 0.85 }).addTo(mapInstance.current)
    }

    const alreadyLoaded = typeof window !== 'undefined' && window.L
    if (alreadyLoaded) init()
    else {
      if (!document.querySelector('link[data-leaflet]')) {
        const l = document.createElement('link')
        l.rel = 'stylesheet'
        l.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css'
        l.setAttribute('data-leaflet', '1')
        document.head.appendChild(l)
      }
      if (!document.querySelector('script[data-leaflet]')) {
        const s = document.createElement('script')
        s.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js'
        s.defer = true
        s.setAttribute('data-leaflet', '1')
        s.onload = init
        document.body.appendChild(s)
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return <Box ref={mapRef} sx={{ height, borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }} />
}

function SimpleCalendar({ monthDays = 28, events = [] }) {
  // Render a simple Sun-Sat grid with days 1..monthDays
  const headers = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const days = Array.from({ length: monthDays }, (_, i) => i + 1)

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
        {headers.map((h) => (
          <Typography key={h} variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', fontWeight: 700 }}>
            {h}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {days.map((d) => {
          const dayEvents = events.filter((e) => e.day === d)
          return (
            <Box
              key={d}
              sx={{
                minHeight: 72,
                borderRadius: 2,
                p: 1,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))',
                border: '1px solid rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>
                {d}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {dayEvents.map((ev) => (
                  <Box
                    key={ev.id}
                    sx={{
                      background: 'rgba(255,98,0,0.12)',
                      color: '#ff6200',
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 1.5,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: '1px solid rgba(255,98,0,0.22)',
                      boxShadow: '0 6px 18px rgba(255,98,0,0.06)',
                    }}
                  >
                    {ev.title}
                  </Box>
                ))}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

function HubDashboard() {
  const calendarEvents = [
    { id: 'evt-bc99-1', day: 13, title: 'Shipment BC-99 Deployment' },
    { id: 'evt-bc99-2', day: 21, title: 'Shipment BC-99 Deployment' },
  ]

  // Live QR Scan counters
  const [countA, setCountA] = useState(0)
  const [countB, setCountB] = useState(0)

  // Live Parcel Scan counter
  const [parcelCount, setParcelCount] = useState(0)

  useEffect(() => {
    // Connect socket on mount
    connectSocket()

    function handleNewScan(data) {
      console.log('new-scan', data)
      if (!data || !data.company) return
      if (data.company === 'A') setCountA((c) => c + 1)
      else if (data.company === 'B') setCountB((c) => c + 1)
    }

    function handleParcelScan(data) {
      const count = data?.objectsDetected ?? data?.count ?? 1
      setParcelCount((c) => c + count)
      console.log('new-parcel-scan', data)
    }

    socket.on('new-scan', handleNewScan)
    socket.on('new-parcel-scan', handleParcelScan)

    return () => {
      // cleanup listener and disconnect socket
      socket.off('new-scan', handleNewScan)
      socket.off('new-parcel-scan', handleParcelScan)
      disconnectSocket()
    }
  }, [])

  return (
    <Box sx={{ fontFamily: '"Inter", sans-serif' }}>
      {/* Page title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', mb: 0.5 }}>
          Hub Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Monitor inbound and outbound flows, dwell times, and verification flags at your consolidation hub.
        </Typography>
      </Box>

      {/* Live Parcel Scan Count (premium card) */}
      <Box sx={{ mb: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            ...glassCardBase,
            maxWidth: 480,
            width: '100%',
            borderRadius: '28px',
            p: { xs: 3, sm: 5 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 0 0 rgba(0,212,255,0.0)',
            border: '2px solid rgba(0,212,255,0.18)',
            animation: 'fadeInParcel 0.8s cubic-bezier(.4,1.4,.6,1) both',
            transition: 'box-shadow 0.25s, border-color 0.25s, transform 0.22s',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.025)',
              boxShadow: '0 0 64px 0 rgba(0,212,255,0.32), 0 18px 80px rgba(0,212,255,0.10)',
              borderColor: '#00d4ff',
            },
            '@keyframes fadeInParcel': {
              '0%': { opacity: 0, transform: 'translateY(24px) scale(0.98)' },
              '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
            <LocalShippingIcon sx={{ fontSize: 48, color: '#00d4ff', mb: 0.5, filter: 'drop-shadow(0 0 16px #00d4ff44)' }} />
            <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 800, letterSpacing: '0.04em', mb: 0.5, textShadow: '0 0 16px #00d4ff33' }}>
              Live Parcel Scans
            </Typography>
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              color: '#00d4ff',
              textShadow: '0 0 48px #00d4ff, 0 0 16px #00d4ff99',
              fontSize: { xs: '2.8rem', sm: '3.6rem', md: '4.2rem' },
              mb: 0.5,
              lineHeight: 1.1,
            }}
          >
            {parcelCount}
          </Typography>
        </Box>
      </Box>

      {/* Live QR Scan Counts */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 2 }}>
          Live QR Scan Counts
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ ...glassCardBase, p: 3, textAlign: 'center', border: '1px solid rgba(0,212,255,0.12)' }}>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.75)', letterSpacing: '0.12em', fontWeight: 700, display: 'block' }}>
                Company A
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, color: '#00d4ff', mt: 1 }}>{countA}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ ...glassCardBase, p: 3, textAlign: 'center', border: `1px solid ${orangeAccent}` }}>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.75)', letterSpacing: '0.12em', fontWeight: 700, display: 'block' }}>
                Company B
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, color: orangeAccent, mt: 1 }}>{countB}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Top stats row — 3 small glass cards with neon numbers */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        {STATS.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <Box sx={{ ...glassCardBase, p: 3, height: '100%' }}>
              <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.65)', letterSpacing: '0.12em', fontWeight: 600, display: 'block' }}>
                {stat.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#00d4ff', textShadow: '0 0 28px rgba(0,212,255,0.6)', letterSpacing: '-0.03em', mt: 0.75 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mt: 0.75 }}>{stat.sub}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Main content: Map + Logs and Calendar */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ ...glassCardBase, p: 3, minHeight: 440, border: `2px solid ${strongCyan}`, boxShadow: `0 6px 36px rgba(0,0,0,0.32), 0 0 84px rgba(0,212,255,0.12)` }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600, mb: 1 }}>
              Live Tracking Map
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2 }}>
              Placeholder for real-time map showing active trailers, hubs and routes. Cyan border glow indicates live telemetry.
            </Typography>
            <Box sx={{ borderRadius: '14px', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(10,14,23,0.75), rgba(20,28,48,0.5))', border: `2px solid rgba(0,212,255,0.22)`, boxShadow: 'inset 0 0 100px rgba(0,212,255,0.04)', color: 'rgba(255,255,255,0.48)', fontSize: 15, fontWeight: 500 }}>
              Map visualization coming soon
            </Box>
          </Box>

          {/* Calendar below map */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ ...glassCardBase, p: 3 }}>
              <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600, mb: 1 }}>Operational Calendar</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>Weekly overview (Sun–Sat) with upcoming deployments and events.</Typography>
              <SimpleCalendar monthDays={28} events={calendarEvents} />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ ...glassCardBase, p: 3, height: '100%', minHeight: 440, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600 }}>Verification Logs</Typography>
              <Button size="small" variant="text" sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none' }}>View all</Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, overflow: 'auto', flex: 1 }}>
              {SAMPLE_LOGS.map((log) => {
                const config = statusConfig[log.status] || statusConfig.passed
                return (
                  <Box key={log.id} sx={{ ...glassCardBase, p: 2.5, '&:hover': { transform: 'scale(1.02)', boxShadow: `0 18px 56px rgba(0,0,0,0.36), 0 0 64px rgba(0,212,255,0.16)` } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.25 }}>
                      <Avatar sx={{ width: 44, height: 44, bgcolor: 'rgba(0, 212, 255, 0.14)', border: '1px solid rgba(0, 212, 255, 0.28)', color: '#00d4ff', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>{entityInitial(log.entity)}</Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.25, mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ color: '#f1f5f9', fontWeight: 700 }}>{log.id}</Typography>
                          <Box component="span" sx={{ px: 1.5, py: 0.45, borderRadius: '10px', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', color: config.color, bgcolor: config.bg, border: `1px solid ${config.border}` }}>{config.label}</Box>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.55, mb: 1.25 }}>{log.message}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>{log.entity} · {log.timestamp}</Typography>
                      </Box>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Grid>

        {/* Bottom: Hub Analytics */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {HUB_METRICS.map((m) => (
              <Grid item xs={12} sm={6} md={3} key={m.label}>
                <Box sx={{ ...glassCardBase, p: 3, display: 'flex', flexDirection: 'column', gap: 1.25, alignItems: 'flex-start' }}>
                  <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '0.12em', fontWeight: 700 }}>{m.label}</Typography>
                  <Typography variant="h5" sx={{ color: '#00d4ff', fontWeight: 900, textShadow: '0 0 20px rgba(0,212,255,0.36)' }}>{m.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Network Intelligence Live */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Box sx={{ ...glassCardBase, p: 3 }}>
            <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 2 }}>Network Intelligence Live</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ ...glassCardBase, p: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 1 }}>Today's Logistics</Typography>
                  <List sx={{ maxHeight: 320, overflow: 'auto' }}>
                    {NETWORK_ITEMS.map((it, idx) => (
                      <Box key={it.time + it.name}>
                        <ListItem sx={{ alignItems: 'flex-start', py: 1.25 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 10, height: 10, bgcolor: statusDot[it.status], boxShadow: `0 0 8px ${statusDot[it.status]}33` }} />
                          </ListItemAvatar>

                          <ListItemText
                            primary={<Typography sx={{ color: '#f1f5f9', fontWeight: 700 }}>{`${it.time}  ${it.name}`}</Typography>}
                            secondary={<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', fontWeight: 700 }}>{it.note}</Typography>}
                          />
                        </ListItem>
                        {idx < NETWORK_ITEMS.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />}
                      </Box>
                    ))}
                  </List>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ ...glassCardBase, p: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 1 }}>Regional Map — Tamil Nadu (Coimbatore)</Typography>
                  <SimpleLeafletMap />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default HubDashboard
