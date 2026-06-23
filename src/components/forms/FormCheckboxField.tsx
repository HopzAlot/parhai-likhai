import { Controller } from 'react-hook-form'
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form'
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Stack,
} from '@mui/material'

type FormCheckboxFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  required?: boolean | string
  helperText?: string
}

export function FormCheckboxField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  rules,
  required,
  helperText,
}: FormCheckboxFieldProps<TFieldValues>) {
  const validationRules = required
    ? {
        ...rules,
        required:
          typeof required === 'string'
            ? required
            : `${label} is required`,
      }
    : rules

  return (
    <Controller
      control={control}
      name={name}
      rules={validationRules}
      render={({ field, fieldState }) => (
        <Stack spacing={0.5}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(field.value)}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            }
            label={required ? `${label} *` : label}
          />
          {(fieldState.error?.message || helperText) && (
            <FormHelperText error={Boolean(fieldState.error?.message)}>
              {fieldState.error?.message ?? helperText}
            </FormHelperText>
          )}
        </Stack>
      )}
    />
  )
}
