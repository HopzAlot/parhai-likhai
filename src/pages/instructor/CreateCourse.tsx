import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useAuth } from '../../hooks/useAuth'
import { createCourse } from '../../services/courseService'

const categories = ['Frontend', 'Backend', 'Design', 'Data', 'DevOps', 'Mobile']

export function CreateCourse() {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [duration, setDuration] = useState('')
  const [prerequisites, setPrerequisites] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategory('')
    setDuration('')
    setPrerequisites('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)

    try {
      await createCourse({
        title,
        description,
        category,
        duration,
        prerequisites,
        instructorId: user.uid,
        instructorName: user.displayName,
        instructorEmail: user.email,
      })

      enqueueSnackbar('Course created successfully', { variant: 'success' })
      resetForm()
    } catch (err) {
      enqueueSnackbar(
        err instanceof Error ? err.message : 'Failed to create course',
        { variant: 'error' }
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5">Create a Course</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Publish a structured course for student enrollment.
        </Typography>
      </Box>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2.5, sm: 3 },
          maxWidth: 720,
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Course Title"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              label="Category"
              select
              fullWidth
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Duration (e.g. 10h)"
              fullWidth
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <TextField
              label="Prerequisites"
              fullWidth
              multiline
              minRows={2}
              placeholder="e.g. Basic JavaScript knowledge"
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} /> : undefined}
              sx={{ alignSelf: 'flex-start', px: 3 }}
            >
              {submitting ? 'Creating...' : 'Create Course'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  )
}
