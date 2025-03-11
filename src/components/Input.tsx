import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";

interface BaseInputProps {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "outlined" | "filled";
}

interface TextInputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    BaseInputProps {
  as?: "input";
}

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseInputProps {
  as: "textarea";
}

type InputProps = TextInputProps | TextareaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      className = "",
      as = "input",
      helperText,
      leftIcon,
      rightIcon,
      variant = "outlined",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "block w-full rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

    const variantClasses = {
      outlined:
        "border border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white",
      filled: "border-0 bg-gray-100 dark:bg-gray-700 dark:text-white",
    };

    const errorClasses = error
      ? "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500"
      : "";

    const paddingClasses = leftIcon ? "pl-10" : rightIcon ? "pr-10" : "";

    const widthClass = fullWidth ? "w-full" : "";

    const inputClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${paddingClasses} ${className}`;

    return (
      <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}

          {as === "textarea" ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={`${inputClasses} py-2 px-3 min-h-[100px]`}
              {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={`${inputClasses} h-10 py-2 px-3`}
              {...(props as InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
