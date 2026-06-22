import { forwardRef } from 'react'
import { MenuItem } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import { FormTextField } from './FormTextField'

type FormSelectFieldProps = TextFieldProps & {
  options: string[]
}

export const FormSelectField = forwardRef<HTMLInputElement, FormSelectFieldProps>(
  function FormSelectField({ options, ...props }, ref) {
    return (
      <FormTextField select {...props} ref={ref}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </FormTextField>
    )
  }
)

FormSelectField.displayName = 'FormSelectField'
