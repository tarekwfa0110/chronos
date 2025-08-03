"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { getFieldError } from "@/lib/validation";

// Form field wrapper with error handling
interface FormFieldProps {
  name: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ name, children, className }: FormFieldProps) {
  const { formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);

  return (
    <div className={cn("space-y-2", className)}>
      {children}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 animate-in fade-in-0 slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}

// Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ 
  name, 
  label, 
  helperText, 
  leftIcon, 
  rightIcon, 
  className, 
  ...props 
}: InputProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);

  return (
    <FormField name={name}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          id={name}
          {...register(name)}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </FormField>
  );
}

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  helperText?: string;
}

export function Textarea({ name, label, helperText, className, ...props }: TextareaProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);

  return (
    <FormField name={name}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        id={name}
        {...register(name)}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </FormField>
  );
}

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({ name, label, helperText, options, className, ...props }: SelectProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);

  return (
    <FormField name={name}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        id={name}
        {...register(name)}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </FormField>
  );
}

// Checkbox component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
}

export function Checkbox({ name, label, helperText, className, ...props }: CheckboxProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);

  return (
    <FormField name={name}>
      <div className="flex items-center space-x-2">
        <input
          id={name}
          type="checkbox"
          {...register(name)}
          className={cn(
            "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
      </div>
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </FormField>
  );
}

// Radio group component
interface RadioGroupProps {
  name: string;
  label?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
}

export function RadioGroup({ name, label, helperText, options, className }: RadioGroupProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);

  return (
    <FormField name={name}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <div className={cn("space-y-2", className)}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              id={`${name}-${option.value}`}
              type="radio"
              value={option.value}
              {...register(name)}
              className={cn(
                "h-4 w-4 border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500 focus:ring-red-500"
              )}
            />
            <label htmlFor={`${name}-${option.value}`} className="text-sm font-medium leading-none">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </FormField>
  );
}

// Form component wrapper
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
}

export function Form({ onSubmit, children, className, ...props }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-6", className)} {...props}>
      {children}
    </form>
  );
}

// Form section component
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// Password strength indicator
interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 1) return { level: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (score <= 3) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium' };
    return { level: 'strong', color: 'bg-green-500', text: 'Strong' };
  };

  const strength = getStrength(password);
  const percentage = password.length > 0 ? Math.min((password.length / 8) * 100, 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Password strength</span>
        <span className={cn(
          strength.level === 'weak' && 'text-red-500',
          strength.level === 'medium' && 'text-yellow-500',
          strength.level === 'strong' && 'text-green-500'
        )}>
          {strength.text}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
        <div
          className={cn("h-1.5 rounded-full transition-all duration-300", strength.color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
} 