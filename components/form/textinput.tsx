import React, { forwardRef, HTMLProps } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TextInputProps {
  label?: string;
  className?: string;
  register: UseFormRegisterReturn;
  onChange?: (event:any)=>void;
}

const TextInput = forwardRef(
  (
    {
      label,
      register,
      className,
      onChange,
      ...props
    }: TextInputProps & HTMLProps<HTMLInputElement>,
    ref
  ) => {
    return (
      <label className={`my-4 ${className ?? ''}`}>
        <span className="text-slate-300 text-sm uppercase text-left">
          {label}
        </span>
        <input onKeyUp={onChange} ref={ref} {...props} {...register} />
      </label>
    )
  }
)

TextInput.displayName = 'TextInput'

export default TextInput
