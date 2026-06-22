import { Box, Card, CardContent, Typography } from '@mui/material'

type StatCardProps = {
  label: string
  value: number | string
  color?: string
}

export function StatCard({ label, value, color = 'primary.main' }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box
          sx={{
            width: 38,
            height: 4,
            borderRadius: 999,
            bgcolor: color,
            mb: 2,
          }}
        />
        <Typography variant="h4">{value}</Typography>
        <Typography color="text.secondary">{label}</Typography>
      </CardContent>
    </Card>
  )
}
