import React from "react";
interface CustomTabProps {
  name: string;
  label: string;
  onClick: () => void;
  defaultChecked?: boolean;
}

const CustomTab: React.FC<CustomTabProps> = ({ name, label, onClick, defaultChecked }) => {
  return (
    <>
      <input type="radio" id={name} name="tabs" className="hidden" defaultChecked={defaultChecked} onClick={onClick} />
      <label
        htmlFor={name}
        className="tab text-[16px] xl:text-[15px] 2xl:text-[20px] 3xl:text-[36px] leading-[1.15] font-normal block text-blue w-full text-start pb-5 px-0 mr-10 relative cursor-pointer">
        {label}
      </label>
    </>
  );
};

export default CustomTab;
