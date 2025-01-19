"use client";
import React, { useState, forwardRef } from "react";

export interface CustomInputProps {
  type: string;
  className?: string;
  defaultValue?: string | number | readonly string[] | undefined;
  value?: string | number | readonly string[] | undefined;
  name?: string;
  placeholder?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
  validate?: boolean;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
  const {
    type,
    className,
    defaultValue,
    value,
    name,
    placeholder,
    checked,
    defaultChecked,
    onChange,
    disabled,
    readOnly,
    id,
    onKeyDown,
    maxLength,
    onPaste,
    validate = true,
  } = props;

  const [touched, setTouched] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTouched(true);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <input
      type={type ?? "text"}
      className={`${className}`}
      defaultValue={defaultValue}
      value={value}
      name={name}
      placeholder={placeholder}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={handleChange}
      disabled={disabled}
      readOnly={readOnly}
      id={id}
      ref={ref}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      maxLength={maxLength}
      onFocus={() => setTouched(true)}
    />
  );
});

CustomInput.displayName = "CustomInput";

export default CustomInput;
