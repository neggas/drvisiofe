"use client";
import { CustomButton, DynamicHtmlTag, PatientInfo } from "@/components";

import React, { useState } from "react";

const Agenda = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <DynamicHtmlTag type="div" className="">
      <DynamicHtmlTag type="div" className=" mt-5 w-full flex justify-center">
        <CustomButton
          type="button"
          className="text-xs w-32 py-1 text-base-100 xl:text-sm 2xl:text-lg font-bold rounded-full card-btn bg-gradient-to-b from-sky-500 to-indigo-500 cursor-pointer"
          onClick={openModal}>
          PatientInfo
        </CustomButton>
      </DynamicHtmlTag>
      <PatientInfo isOpen={isModalOpen} onClose={closeModal} />
    </DynamicHtmlTag>
  );
};

export default Agenda;
