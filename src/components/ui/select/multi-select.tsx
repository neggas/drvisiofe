import React from "react";
import Select, { components, OptionProps, GroupBase, MultiValue, Props as SelectProps, MultiValueProps, ActionMeta } from "react-select";
import { DynamicHtmlTag } from "@/components";

interface OptionType {
  label: string;
  value: string;
}

export interface CustomMultiSelectProps extends SelectProps<OptionType, true> {
  className?: string;
  id?: string;
  menuIsOpen?: boolean;
  classNamePrefix?: string;
  options: OptionType[];
  multipleSelectText?: string;
  placeholderText?: string;
  onChange?: (newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
  value?: OptionType[];
}

// Include checkboxes
const Option = (props: OptionProps<OptionType, true, GroupBase<OptionType>>) => {
  return (
    <components.Option {...props}>
      <input type="checkbox" checked={props.isSelected} onChange={() => null} style={{ marginRight: "10px" }} />
      {props.label}
    </components.Option>
  );
};

const customStyles = {
  menuList: (provided: any) => ({
    ...provided,
    maxHeight: "200px",
    overflowY: "auto",
  }),
};

// Display count instead of label
const CustomMultiValue = (props: MultiValueProps<OptionType, true>) => {
  const selectedValues = props.selectProps.value as OptionType[] | null;

  if (selectedValues && selectedValues.length > 1 && props.index === 0) {
    const multipleText = (props.selectProps as any).multipleSelectText || "items selected";
    return <DynamicHtmlTag type="div">{`${selectedValues.length} ${multipleText}`}</DynamicHtmlTag>;
  }

  // Single item is selected; default label behavior will show
  if (selectedValues && selectedValues.length === 1) {
    return <components.MultiValue {...props} />;
  }

  return null; // Will not render the label for other selected values when multiple are selected
};

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = props => {
  const { classNamePrefix, options, onChange, value, ...rest } = props;

  const handleChange = (newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
    if (onChange) {
      onChange(newValue, actionMeta); // Call the onChange prop if provided
    }
  };

  const getPlaceholder = () => {
    const selectedOptions = value || [];
    if (selectedOptions.length > 1) {
      return `${selectedOptions.length} ${props.multipleSelectText || "items selected"}`;
    } else if (selectedOptions.length === 1) {
      return selectedOptions[0].label;
    } else {
      return props.placeholderText || "Select...";
    }
  };

  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={handleChange}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{ Option, MultiValue: CustomMultiValue }}
      placeholder={getPlaceholder()}
      noOptionsMessage={() => "Aucun résultat de recherche trouvé"}
      classNamePrefix={classNamePrefix ?? "custom-select"}
      menuPortalTarget={document.body}
      styles={customStyles}
      isClearable
      {...rest}
    />
  );
};

export default CustomMultiSelect;
