import { CustomInput, CustomLabel, DynamicHtmlTag } from "@/components";
import React from "react";

interface ToggleSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, ...props }) => {
  return (
    <CustomLabel className="inline-flex relative items-center mr-5 cursor-pointer">
      <CustomInput type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} {...props} />
      <DynamicHtmlTag
        type="div"
        className="w-11 h-6 bg-gray-400 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-[#45AAE0] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-l from-[#43ABE1] to-[#345AE8]"
      />
    </CustomLabel>
  );
};

export default ToggleSwitch;
