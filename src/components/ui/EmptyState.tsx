import { Card, CardContent, Typography } from '@mui/material'

type EmptyStateProps = {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ py: 5, textAlign: 'center' }}>
        <Typography color="text.secondary">{message}</Typography>
      </CardContent>
    </Card>
  )
}
