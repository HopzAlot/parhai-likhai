import { Box, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type AuthShellProps = {
  title: string
  panelTitle?: string
  subtitle: string
  panelSubtitle: string
  features: string[]
  accent?: 'primary' | 'secondary'
  children: ReactNode
}

const gradients = {
  primary: {
    page: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), transparent 36%), #f7f8fb',
    panel:
      'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 64, 175, 0.88))',
  },
  secondary: {
    page: 'linear-gradient(135deg, rgba(15, 118, 110, 0.12), transparent 36%), #f7f8fb',
    panel:
      'linear-gradient(145deg, rgba(11, 18, 32, 0.98), rgba(15, 118, 110, 0.88))',
  },
}

export function AuthShell({
  title,
  panelTitle,
  subtitle,
  panelSubtitle,
  features,
  accent = 'primary',
  children,
}: AuthShellProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 5,
        background: gradients[accent].page,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 980,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 560,
            p: 5,
            color: 'white',
            background: gradients[accent].panel,
          }}
        >
          <Box>
            <Typography variant="h4">{panelTitle ?? title}</Typography>
            <Typography sx={{ mt: 2, maxWidth: 360, color: 'rgba(255,255,255,0.74)' }}>
              {panelSubtitle}
            </Typography>
          </Box>
          <Stack spacing={2}>
            {features.map((feature) => (
              <Box
                key={feature}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>{feature}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 3, sm: 5 }, display: 'grid', alignContent: 'center' }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4">{title}</Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            </Box>
            {children}
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
