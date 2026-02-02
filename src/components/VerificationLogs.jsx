import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
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

const statusColor = (status) => {
  switch (status) {
    case 'passed':
      return 'success'
    case 'warning':
      return 'warning'
    case 'failed':
      return 'error'
    default:
      return 'default'
  }
}

function VerificationLogs() {
  return (
    <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">Verification Logs</Typography>
        <Typography variant="body2" color="text.secondary">
          Synthetic events for design purposes
        </Typography>
      </Stack>
      <Divider sx={{ mb: 1 }} />
      <List dense disablePadding sx={{ maxHeight: 320, overflow: 'auto' }}>
        {SAMPLE_LOGS.map((log) => (
          <ListItem key={log.id} divider alignItems="flex-start">
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2">{log.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {log.message}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={log.status.toUpperCase()}
                    color={statusColor(log.status)}
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {log.entity} • {log.timestamp}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default VerificationLogs

