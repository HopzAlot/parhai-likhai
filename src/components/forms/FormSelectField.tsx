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
    multiple?: boolean
    control: Control<TFieldValues>
    name: Path<TFieldValues>
    rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  }

export function FormSelectField<TFieldValues extends FieldValues = FieldValues>({
  options,
  multiple,
  slotProps,
  ...props
}: FormSelectFieldProps<TFieldValues>) {
  return (
    <FormTextField
      select
      slotProps={{
        ...slotProps,
        ...(multiple ? { select: { multiple: true } } : {}),
      }}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </FormTextField>
  )
}
