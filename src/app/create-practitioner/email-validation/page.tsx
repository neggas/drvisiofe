"use client";
import { CustomButton, DynamicHtmlTag, HeadingTag } from "@/components";
import React, { useState } from "react";

function EmailValidation() {
  const [code, setCode] = useState(["", "", "", "", "", "", "", ""]);

  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };
  return (
    <DynamicHtmlTag type="div" className="md:px-5 h-full">
      <DynamicHtmlTag type="p" className="font-semibold text-xs xl:text-sm 2xl:text-lg px-4 hidden lg:block">
        Merci de vous être inscrit sur notre DrVisio ! Pour finaliser la création de votre compte, veuillez érifier votre adresse e-mail. Un code de
        confirmation vous a été envoyé à ladresse suivante : [monadresse@gmail.com].
      </DynamicHtmlTag>
      <DynamicHtmlTag type="p" className="font-semibold text-xs xl:text-sm 2xl:text-lg px-4 lg:hidden">
        Merci de vous être inscrit sur notre DrVisio ! Pour finaliser la création de votre compte, veuillez érifier votre adresse e-mail.
      </DynamicHtmlTag>
      <DynamicHtmlTag type="p" className="font-semibold text-xs xl:text-sm 2xl:text-lg px-4 mt-5 lg:hidden">
        Un code de confirmation vous a été envoyé à ladresse suivante : [monadresse@gmail.com].
      </DynamicHtmlTag>

      <DynamicHtmlTag type="div" className="mt-8 text-center">
        <HeadingTag type="h2" className="font-bold text-xs xl:text-sm 2xl:text-lg">
          Veuillez entrer ce code ci-dessous (valable 10min)
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex justify-center mt-5">
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className="w-9 h-9 lg:w-12 lg:h-12 mx-1 flex text-center border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            value={digit}
            onChange={e => handleCodeChange(index, e.target.value)}
          />
        ))}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="w-full mt-10 lg:mt-32 px-2 lg:px-1 flex justify-end">
        <CustomButton
          type="submit"
          className="text-xs w-48 h-10 text-base-100 xl:text-sm font-bold rounded-full card-btn bg-gradient-to-b from-sky-500 to-indigo-500 cursor-pointer">
          Valider
        </CustomButton>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
}

export default EmailValidation;
