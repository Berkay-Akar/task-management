import React, { forwardRef } from "react";
import { cva } from "class-variance-authority";

interface BaseInputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outline";
}

interface TextInputProps extends BaseInputProps {
  type?: string;
  multiline?: boolean;
}

interface TextareaProps extends BaseInputProps {
  type: "textarea";
  rows?: number;
}

type InputProps = TextInputProps | TextareaProps;

const inputVariants = cva(
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        filled: "bg-gray-100 dark:bg-gray-800 border-transparent",
        outline: "bg-transparent",
      },
      error: {
        true: "border-danger focus:ring-danger focus:border-danger",
      },
      withLeftIcon: {
        true: "pl-10",
      },
      withRightIcon: {
        true: "pr-10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      variant = "default",
      type = "text",
      ...props
    },
    ref
  ) => {
    const isTextarea = type === "textarea";
    const inputClasses = inputVariants({
      variant,
      error: !!error,
      withLeftIcon: !!leftIcon,
      withRightIcon: !!rightIcon,
      className,
    });

    const inputProps = { ...props };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {isTextarea ? (
            <textarea
              className={inputClasses}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={(props as TextareaProps).rows || 4}
              {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              type={type}
              className={inputClasses}
              ref={ref as React.Ref<HTMLInputElement>}
              {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
