"use client";

import { DynamicHtmlTag } from "@/components";
import React, { useState, useEffect } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FaExclamationTriangle } from "react-icons/fa";

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (value: string) => void;
  inputClass?: string;
  containerClass?: string;
  placeholder?: string;
}

const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({ value, onChange, inputClass, containerClass, placeholder }) => {
  const [isLocalError, setIsLocalError] = useState<boolean>(false);

  useEffect(() => {
    setIsLocalError(value !== "" && !isValidPhoneNumber(value));
  }, [value]);

  const handleChange = (value: string | undefined) => {
    onChange(value || "");
  };

  return (
    <DynamicHtmlTag type="div" className={containerClass}>
      <div className="flex items-center">
        <PhoneInput defaultCountry={"FR"} value={value} onChange={handleChange} className={inputClass} placeholder={placeholder} />
        {isLocalError && (
          <FaExclamationTriangle
            title="Numéro de téléphone invalide"
            className="text-red-500 ml-2
        "
          />
        )}
      </div>
    </DynamicHtmlTag>
  );
};

export default PhoneInputWithCountry;
