import { useState } from 'react'
import { Box, Button, MenuItem, Paper, Stack, TextField, Typography, Alert } from '@mui/material'

const categories = ['Frontend', 'Backend', 'Design', 'Data', 'DevOps', 'Mobile']

export function CreateCourse() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>Create a Course</Typography>
      <Paper variant="outlined" sx={{ p: 3, maxWidth: 600 }}>
        {submitted ? (
          <Alert severity="success" onClose={() => setSubmitted(false)}>
            Course created! (Static demo — not saved to DB yet)
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField label="Course Title" fullWidth required />
              <TextField label="Description" fullWidth multiline minRows={3} required />
              <TextField label="Category" select fullWidth required defaultValue="">
                {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField label="Duration (e.g. 10h)" fullWidth required />
              <Button type="submit" variant="contained">Create Course</Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Stack>
  )
}