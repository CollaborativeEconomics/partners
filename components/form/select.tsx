import React, { HTMLProps } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Option {
  id: string;
  name: string;
}

interface SelectProps {
  id?: string;
  label?: string;
  options?: Option[];
  register: UseFormRegisterReturn;
}

const Select = ({
  id,
  label,
  options,
  register,
  ...rest
}: SelectProps & HTMLProps<HTMLSelectElement>) => (
  <label className="my-4">
    <span className="text-slate-300 text-sm text-left uppercase">{label}</span>
    <select id={id} {...rest} {...register} >
      { options
        ? options.map(item => (
            <option value={item.id} key={item.id}>{item.name}</option>
          ))
        : <option value='0' key={0}>No items</option>
      }
    </select>
  </label>
);

export default Select;
