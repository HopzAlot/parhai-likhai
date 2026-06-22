import { forwardRef } from 'react'
import { TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'

export const FormTextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function FormTextField(props, ref) {
    return <TextField fullWidth {...props} inputRef={ref} />
  }
)

FormTextField.displayName = 'FormTextField'
