import React, { HTMLAttributes } from 'react';

interface ButtonBlueProps extends HTMLAttributes<HTMLButtonElement> {
  text: string;
  disabled?: boolean;
}

const ButtonBlue = React.forwardRef<HTMLButtonElement, ButtonBlueProps>(
  ({ text, className, disabled, onClick, ...props }: ButtonBlueProps, ref) => (
    <button
      disabled={disabled}
      className={`mx-auto my-4 px-6 py-2 rounded-full uppercase flex flex-row justify-center bg-blue-700 ${className}`}
      {...{ onClick, ref }}
      {...props}
    >
      {props.children}
      {text}
    </button>
  ),
);
ButtonBlue.displayName = 'ButtonBlue';

export default ButtonBlue;
