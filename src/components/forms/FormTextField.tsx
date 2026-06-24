import { Controller } from 'react-hook-form'
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form'
import { TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'

type FormTextFieldProps<TFieldValues extends FieldValues = FieldValues> =
  TextFieldProps & {
    control: Control<TFieldValues>
    name: Path<TFieldValues>
    rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  }

export function FormTextField<TFieldValues extends FieldValues = FieldValues>(
  props: FormTextFieldProps<TFieldValues>
) {
  const {
    control,
    name,
    rules,
    helperText,
    required,
    label,
    ...textFieldProps
  } = props

  const validationRules = required
    ? {
        ...rules,
        required:
          typeof required === 'string'
            ? required
            : `${String(label ?? 'This field')} is required`,
      }
    : rules

  return (
    <Controller
      control={control}
      name={name}
      rules={validationRules}
      render={({ field, fieldState }) => (
        <TextField
          fullWidth
          required={required}
          {...textFieldProps}
          {...field}
          value={field.value ?? ''}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  )
}
