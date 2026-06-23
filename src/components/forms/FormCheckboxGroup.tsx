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
  Typography,
} from '@mui/material'

type FormCheckboxGroupProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  options: string[]
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  required?: boolean | string
  helperText?: string
}

export function FormCheckboxGroup<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  options,
  rules,
  required,
  helperText,
}: FormCheckboxGroupProps<TFieldValues>) {
  const validationRules = required
    ? {
        ...rules,
        validate: (value: unknown) => {
          const hasValue = Array.isArray(value) && value.length > 0
          if (hasValue) return true
          return typeof required === 'string'
            ? required
            : `${label} is required`
        },
      }
    : rules

  return (
    <Controller
      control={control}
      name={name}
      rules={validationRules}
      render={({ field, fieldState }) => {
        const selected = (Array.isArray(field.value) ? field.value : []) as string[]

        const toggleOption = (option: string, checked: boolean) => {
          const next = checked
            ? [...selected, option]
            : selected.filter((item) => item !== option)

          field.onChange(next as never)
        }

        return (
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {label}
              {required ? ' *' : ''}
            </Typography>
            <Stack>
              {options.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={selected.includes(option)}
                      onChange={(event) =>
                        toggleOption(option, event.target.checked)
                      }
                    />
                  }
                  label={option}
                />
              ))}
            </Stack>
            {(fieldState.error?.message || helperText) && (
              <FormHelperText error={Boolean(fieldState.error?.message)}>
                {fieldState.error?.message ?? helperText}
              </FormHelperText>
            )}
          </Stack>
        )
      }}
    />
  )
}
