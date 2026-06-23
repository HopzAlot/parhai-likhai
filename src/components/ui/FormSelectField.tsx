import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form'
import { MenuItem } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import { FormTextField } from './FormTextField'

type FormSelectFieldProps<TFieldValues extends FieldValues = FieldValues> =
  TextFieldProps & {
    options: string[]
    control: Control<TFieldValues>
    name: Path<TFieldValues>
    rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  }

export function FormSelectField<TFieldValues extends FieldValues = FieldValues>({
  options,
  ...props
}: FormSelectFieldProps<TFieldValues>) {
  return (
    <FormTextField select {...props}>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </FormTextField>
  )
}
