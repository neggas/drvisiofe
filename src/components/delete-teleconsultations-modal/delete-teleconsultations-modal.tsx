"use client";
import React from "react";
import { CustomButton, CustomForm, CustomInput, CustomLabel, CustomModal, DynamicHtmlTag, HeadingTag } from "@/components";
import { IoCloseSharp } from "react-icons/io5";

interface DeleteTeleconsultationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const DeleteTeleconsultationsModal: React.FC<DeleteTeleconsultationsModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <CustomModal id="delete_modal" isOpen={isOpen} onClose={onClose} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
      <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
        <DynamicHtmlTag type="div" className="bg-base-100 py-4 px-3 lg:px-6">
          <HeadingTag type="h3" className="text-blue font-bold text-lg flex items-center justify-between gap-2 pl-2">
            Annuler le rendez-vous
            <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={onClose}>
              <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
            </CustomButton>
          </HeadingTag>
          <DynamicHtmlTag type="div" className="p-3 md:p-10 w-full lg:w-8/12 mx-auto my-3">
            <DynamicHtmlTag type="p" className="text-center text-blue font-semibold text-sm lg:text-base">
              Êtes-vous sûr de vouloir annuler votre rendez-vous ?
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex justify-between items-center w-10/12 md:w-7/12 mx-auto gap-x-2">
            <CustomButton
              type="button"
              onClick={onConfirm}
              className="card-btn w-36 h-8 lg:h-10 bg-gradient-to-b from-[#47A7DE] to-[#3460A7] rounded-2xl shadow-md font-semibold text-base-100 text-xs">
              Oui
            </CustomButton>
            <CustomButton
              type="button"
              onClick={onClose}
              className="card-btn w-36 h-8 lg:h-10 bg-gradient-to-b from-[#47A7DE] to-[#3460A7] rounded-2xl shadow-md font-semibold text-base-100 text-xs">
              Non
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </CustomModal>
  );
};
export default DeleteTeleconsultationsModal;
