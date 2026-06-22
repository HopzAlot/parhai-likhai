import {
  Box,
  Button,
  FormHelperText,
  Stack,
  Typography,
} from '@mui/material'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'

type FormFileFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  helperText?: string
  accept?: string
  required?: boolean
}

export function FormFileField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  accept,
  required,
}: FormFileFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const file = field.value as File | null | undefined

        return (
          <Stack spacing={0.75}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {label}
              {required ? ' *' : ''}
            </Typography>
            <Box>
              <Button variant="outlined" component="label">
                {file ? 'Change file' : 'Upload file'}
                <input
                  hidden
                  type="file"
                  accept={accept}
                  onChange={(event) => {
                    field.onChange(event.target.files?.[0] ?? null)
                  }}
                />
              </Button>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {file ? file.name : 'No file selected'}
              </Typography>
            </Box>
            {(fieldState.error?.message || helperText) && (
              <FormHelperText error={Boolean(fieldState.error?.message)}>
                {fieldState.error?.message || helperText}
              </FormHelperText>
            )}
          </Stack>
        )
      }}
    />
  )
}
