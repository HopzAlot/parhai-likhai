import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Stack,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useAuth } from '../../hooks/useAuth'
import { createEnrollment } from '../../services/enrollmentService'
import {
  registrationSchema,
  STEP_FIELDS,
  type RegistrationFormValues,
} from '../../schemas/registrationSchema'
import type { Course } from '../../types/course'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

const steps = ['Course Info', 'Instructor Info', 'Prerequisites']

export function RegisterCourse() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const [course, setCourse] = useState<Course | null>(null)
  const [loadingCourse, setLoadingCourse] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const methods = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      courseId: '',
      courseTitle: '',
      category: '',
      duration: '',
      instructorId: '',
      instructorName: '',
      instructorEmail: '',
      acceptedPrerequisites: false as unknown as true,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (!courseId) return

    const fetchCourse = async () => {
      try {
        const snap = await getDoc(doc(db, 'courses', courseId))
        if (!snap.exists()) {
          enqueueSnackbar('Course not found', { variant: 'error' })
          navigate('/student/browse')
          return
        }

        const data = { id: snap.id, ...snap.data() } as Course
        setCourse(data)

        methods.reset({
          courseId: data.id,
          courseTitle: data.title,
          category: data.category,
          duration: data.duration,
          instructorId: data.instructorId,
          instructorName: data.instructorName,
          instructorEmail: data.instructorEmail,
          acceptedPrerequisites: false as unknown as true,
        })
      } catch {
        enqueueSnackbar('Failed to load course', { variant: 'error' })
      } finally {
        setLoadingCourse(false)
      }
    }

    fetchCourse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  const handleNext = async () => {
    const fields = STEP_FIELDS[activeStep]
    const valid = await methods.trigger(fields)
    if (valid) setActiveStep((s) => s + 1)
  }

  const handleBack = () => setActiveStep((s) => s - 1)

  const onSubmit = async (values: RegistrationFormValues) => {
    if (!user) return

    setSubmitting(true)
    try {
      await createEnrollment({
        courseId: values.courseId,
        courseTitle: values.courseTitle,
        studentId: user.uid,
        studentName: user.displayName,
        studentEmail: user.email,
        instructorId: values.instructorId,
        acceptedPrerequisites: values.acceptedPrerequisites,
        status: 'active',
      })

      enqueueSnackbar('Successfully enrolled!', { variant: 'success' })
      navigate('/student/my-courses')
    } catch (err) {
      enqueueSnackbar(
        err instanceof Error ? err.message : 'Enrollment failed',
        { variant: 'error' }
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingCourse) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!course) return null

  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Register for {course.title}
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, maxWidth: 600 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <FormProvider {...methods}>
          <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
            {activeStep === 0 && <CourseInfoStep />}
            {activeStep === 1 && <InstructorInfoStep />}
            {activeStep === 2 && <PrerequisitesStep prerequisites={course.prerequisites} />}

            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={18} /> : undefined}
                >
                  {submitting ? 'Enrolling...' : 'Confirm Enrollment'}
                </Button>
              )}
            </Stack>
          </Box>
        </FormProvider>
      </Paper>
    </Stack>
  )
}

function CourseInfoStep() {
  const { watch } = useFormContext<RegistrationFormValues>()
  const values = watch()

  return (
    <Stack spacing={2}>
      <ReadOnlyField label="Course Title" value={values.courseTitle} />
      <ReadOnlyField label="Category" value={values.category} />
      <ReadOnlyField label="Duration" value={values.duration} />
    </Stack>
  )
}

function InstructorInfoStep() {
  const { watch } = useFormContext<RegistrationFormValues>()
  const values = watch()

  return (
    <Stack spacing={2}>
      <ReadOnlyField label="Instructor Name" value={values.instructorName} />
      <ReadOnlyField label="Instructor Email" value={values.instructorEmail} />
    </Stack>
  )
}

function PrerequisitesStep({ prerequisites }: { prerequisites: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>()

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {prerequisites || 'No prerequisites listed for this course.'}
      </Typography>
      <FormControlLabel
        control={<Checkbox {...register('acceptedPrerequisites')} />}
        label="I confirm I meet the prerequisites for this course"
      />
      {errors.acceptedPrerequisites && (
        <FormHelperText error>
          {errors.acceptedPrerequisites.message}
        </FormHelperText>
      )}
    </Stack>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
    </Box>
  )
}