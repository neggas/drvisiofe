"use client";
import React, { useState } from "react";
import { CustomButton, DynamicHtmlTag, TermConditionNotice } from "@/components";
export default function TermNotice() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // DeleteModalBox
  const openDeleteModal = () => setIsModalOpen(true);
  const closeDeleteModal = () => setIsModalOpen(false);
  return (
    <DynamicHtmlTag type="div" className="p-5">
      <CustomButton onClick={openDeleteModal} type="button" className="card-btn px-3 py-2 rounded-xl text-white shadow-xl m-auto block">
        Term And Conditions
      </CustomButton>
      <TermConditionNotice isOpen={isModalOpen} onClose={closeDeleteModal} />
    </DynamicHtmlTag>
  );
}
