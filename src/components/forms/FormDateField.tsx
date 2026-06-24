import type { Control, FieldValues, Path } from 'react-hook-form'
import type { TextFieldProps } from '@mui/material'
import { FormTextField } from './FormTextField'

type FormDateFieldProps<TFieldValues extends FieldValues = FieldValues> =
  TextFieldProps & {
    control: Control<TFieldValues>
    name: Path<TFieldValues>
    required?: boolean | string
  }

export function FormDateField<TFieldValues extends FieldValues = FieldValues>({
  ...props
}: FormDateFieldProps<TFieldValues>) {
  return (
    <FormTextField
      type="date"
      slotProps={{ inputLabel: { shrink: true } }}
      {...props}
    />
  )
}
