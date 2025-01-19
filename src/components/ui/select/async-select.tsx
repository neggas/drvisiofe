import { ListOption } from "@/utility";
import React from "react";
import { Props as SelectProps } from "react-select";
import AsyncSelect from "react-select/async";
export interface CustomSelectProps extends SelectProps {
  className?: string;
  id?: string;
  menuIsOpen?: boolean;
  classNamePrefix?: string;
  loadOptions?: any;
  onChange?: any;
  value?: any;
  defaultOptions?: ListOption[];
  defaultValue?: ListOption | undefined | null;
  isClearable?: boolean;
  cacheOptions?: boolean;
}

const CustomAsyncSelect: React.FC<CustomSelectProps> = props => {
  const {
    className,
    id,
    menuIsOpen,
    classNamePrefix,
    onChange,
    defaultValue,
    defaultOptions,
    loadOptions,
    value,
    isClearable,
    cacheOptions,
    ...rest
  } = props;

  return (
    <AsyncSelect
      className={
        className ||
        `select select-bordered rounded-full custom-select outline-none focus:outline-none border-none border-[0px] h-auto pl-0 pr-0 text-sm min-h-6 w-full mb-2`
      }
      id={id}
      menuIsOpen={menuIsOpen}
      classNamePrefix={classNamePrefix ?? "custom-select"}
      onChange={onChange}
      defaultValue={defaultValue} // Set default options if provided
      defaultOptions={defaultOptions} // Set default options if provided
      {...rest}
      loadOptions={loadOptions}
      value={value}
      isClearable={isClearable ?? true}
      cacheOptions={cacheOptions ?? true}
    />
  );
};

export default CustomAsyncSelect;
