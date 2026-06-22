import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form'
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
import { PageHeader } from '../../components/ui/PageHeader'
import { FormTextField } from '../../components/ui/FormTextField'
import {
  registrationSchema,
  STEP_FIELDS,
  type RegistrationFormValues,
} from '../../schemas/registrationSchema'
import type { Course } from '../../types/course'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

const steps = ['Your Details', 'Course Review', 'Prerequisites & Payment']

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
      studentName: user?.displayName ?? '',
      studentEmail: user?.email ?? '',
      studentPhone: '',
      courseId: '',
      courseTitle: '',
      category: '',
      duration: '',
      instructorId: '',
      instructorName: '',
      instructorEmail: '',
      acceptedPrerequisites: false,
      paymentReference: '',
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
          studentName: user?.displayName ?? '',
          studentEmail: user?.email ?? '',
          studentPhone: '',
          courseId: data.id,
          courseTitle: data.title,
          category: data.category,
          duration: data.duration,
          instructorId: data.instructorId,
          instructorName: data.instructorName,
          instructorEmail: data.instructorEmail,
          acceptedPrerequisites: false,
          paymentReference: '',
        })
      } catch {
        enqueueSnackbar('Failed to load course', { variant: 'error' })
      } finally {
        setLoadingCourse(false)
      }
    }

    fetchCourse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user?.displayName, user?.email])

  const handleNext = async () => {
    const fields = STEP_FIELDS[activeStep]
    const valid = await methods.trigger(fields)
    if (valid) setActiveStep((s) => s + 1)
  }

  const handleBack = () => setActiveStep((s) => s - 1)

  const onSubmit = async (values: RegistrationFormValues) => {
    if (!user || !course) return

    setSubmitting(true)

    try {
      await createEnrollment({
        courseId: values.courseId,
        courseTitle: values.courseTitle,
        studentId: user.uid,
        studentName: values.studentName,
        studentEmail: values.studentEmail,
        studentPhone: values.studentPhone,
        instructorId: values.instructorId,
        acceptedPrerequisites: values.acceptedPrerequisites,
        paymentReference: values.paymentReference,
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
      <PageHeader
        title={`Register for ${course.title}`}
        subtitle="Fill your details, confirm the course, and share payment reference."
      />

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2.5, sm: 3 },
          maxWidth: 780,
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <FormProvider {...methods}>
          <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
            {activeStep === 0 && <YourDetailsStep />}
            {activeStep === 1 && <CourseInfoStep course={course} />}
            {activeStep === 2 && <PaymentStep prerequisites={course.prerequisites} />}

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

function YourDetailsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>()

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Enter details we’ll use for your enrollment record.
      </Typography>
      <FormTextField
        label="Your Name"
        required
        error={Boolean(errors.studentName)}
        helperText={errors.studentName?.message}
        {...register('studentName')}
      />
      <FormTextField
        label="Email Address"
        required
        error={Boolean(errors.studentEmail)}
        helperText={errors.studentEmail?.message}
        {...register('studentEmail')}
      />
      <FormTextField
        label="Phone Number"
        required
        error={Boolean(errors.studentPhone)}
        helperText={errors.studentPhone?.message}
        {...register('studentPhone')}
      />
    </Stack>
  )
}

function CourseInfoStep({ course }: { course: Course }) {
  const { watch } = useFormContext<RegistrationFormValues>()
  const values = watch()

  return (
    <Stack spacing={2}>
      <ReadOnlyField label="Course Title" value={course.title || values.courseTitle} />
      <ReadOnlyField label="Category" value={course.category || values.category} />
      <ReadOnlyField label="Duration" value={course.duration || values.duration} />
      <ReadOnlyField
        label="Instructor Name"
        value={course.instructorName || values.instructorName}
      />
      <ReadOnlyField
        label="Instructor Email"
        value={course.instructorEmail || values.instructorEmail}
      />
    </Stack>
  )
}

function PaymentStep({ prerequisites }: { prerequisites: string }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>()

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        {prerequisites || 'No prerequisites listed for this course.'}
      </Typography>
      <FormControlLabel
        control={
          <Controller
            control={control}
            name="acceptedPrerequisites"
            render={({ field }) => (
              <Checkbox
                checked={Boolean(field.value)}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            )}
          />
        }
        label="I confirm I meet the prerequisites for this course"
      />
      {errors.acceptedPrerequisites && (
        <FormHelperText error>
          {errors.acceptedPrerequisites.message}
        </FormHelperText>
      )}
      <FormTextField
        label="Payment Reference"
        placeholder="Optional transaction or receipt number"
        error={Boolean(errors.paymentReference)}
        helperText={errors.paymentReference?.message}
        {...register('paymentReference')}
      />
    </Stack>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 800 }}>{value}</Typography>
    </Box>
  )
}
