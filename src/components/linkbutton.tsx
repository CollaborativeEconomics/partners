import React, { HTMLAttributes } from 'react'
import Link from 'next/Link'

interface LinkButtonProps extends HTMLAttributes<HTMLButtonElement> {
  text: string;
  disabled?: boolean;
}

const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
  (
    {
      text,
      href,
      className,
      disabled,
      ...props
    }: LinkButtonProps,
    ref
  ) => (
    <Link
      href={href}
      disabled={disabled}
      className={`mx-auto px-12 py-2 rounded-full uppercase flex flex-row justify-center bg-blue-700 ${className}`}
      {...{ ref }}
      {...props}
    >
      {text}
      {props.children}
    </Link>
  )
);
//LinkButton.displayName = 'LinkButton'

export default LinkButton
