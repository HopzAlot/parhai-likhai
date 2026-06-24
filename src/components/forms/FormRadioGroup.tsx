import { Controller } from 'react-hook-form'
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form'
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'

type FormRadioGroupProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  options: string[]
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  required?: boolean | string
  helperText?: string
}

export function FormRadioGroup<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  options,
  rules,
  required,
  helperText,
}: FormRadioGroupProps<TFieldValues>) {
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
        <FormControl error={Boolean(fieldState.error?.message)} component="fieldset">
          <FormLabel component="legend">
            {label}
            {required ? ' *' : ''}
          </FormLabel>
          <RadioGroup
            {...field}
            value={field.value ?? ''}
            onChange={(event) => field.onChange(event.target.value)}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
          {(fieldState.error?.message || helperText) && (
            <FormHelperText>
              {fieldState.error?.message ?? helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}
