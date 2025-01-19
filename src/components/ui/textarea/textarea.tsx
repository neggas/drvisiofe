"use client";
import React, { useState, forwardRef } from "react";

export interface CustomTextareaProps {
  className: string;
  defaultValue?: string | number | readonly string[] | undefined;
  value?: string | number | readonly string[] | undefined;
  name?: string;
  row?: string;
  cols?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  validate?: boolean;
}

const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>((props, ref) => {
  const {
    className,
    defaultValue,
    value,
    name,
    placeholder,
    row,
    cols,
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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTouched(true);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <textarea
      className={`${className}`}
      defaultValue={defaultValue}
      value={value}
      name={name}
      placeholder={placeholder}
      //   row={row}
      //   cols={cols}
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

CustomTextarea.displayName = "CustomTextarea";

export default CustomTextarea;
