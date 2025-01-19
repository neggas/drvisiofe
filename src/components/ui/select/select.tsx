"use client";

import React from "react";
import Select, { Props as SelectProps } from "react-select";

export interface CustomSelectProps extends SelectProps {
  className?: string;
  id?: string;
  menuIsOpen?: boolean;
  classNamePrefix?: string;
  bsPrefix?: string;
  placeholder?: string;
  options?: any;
  name?: string;
  value?: any;
  defaultValue?: any;
  onChange?: any;
}

const CustomSelect: React.FC<CustomSelectProps> = props => {
  const { className, id, menuIsOpen, classNamePrefix, placeholder, options, name, value, defaultValue, onChange, ...rest } = props;

  return (
    <Select
      className={className}
      id={id}
      menuIsOpen={menuIsOpen}
      classNamePrefix={classNamePrefix ?? "custom-select"}
      placeholder={placeholder}
      options={options}
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      {...rest}
    />
  );
};

export default CustomSelect;
