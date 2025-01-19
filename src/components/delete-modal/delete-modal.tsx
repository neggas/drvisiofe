"use client";
import React from "react";
import { CustomButton, CustomForm, CustomInput, CustomLabel, CustomModal, DynamicHtmlTag, HeadingTag } from "@/components";
import { IoCloseSharp } from "react-icons/io5";

interface DeleteModalProps {
  isOpen: boolean;
  modalInputTitle?: String;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  paragraph?: string;
  icon?: any;
  description?: string;
  modalSubTitle?: String;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, title, paragraph, modalInputTitle, modalSubTitle }) => {
  return (
    <CustomModal id="delete_modal" isOpen={isOpen} onClose={onClose} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
      <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
        <DynamicHtmlTag type="div" className="bg-base-100 py-4 px-3 lg:px-6">
          <HeadingTag type="h3" className="text-blue font-bold text-sm lg:text-lg flex items-center justify-between gap-2 pl-2">
            {title}
            <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={onClose}>
              <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
            </CustomButton>
          </HeadingTag>

          <CustomForm className="pt-5" onSubmit={e => e.preventDefault()}>
            {/* <DynamicHtmlTag type="div" className="form-group gap-3 w-full items-start">
              <DynamicHtmlTag type="p" className="px-2 text-xs">
                {modalSubTitle}
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full lg:w-3/4 mt-1">
                <CustomLabel className="input border border-slate-200 p-2 flex items-center gap-2 rounded-lg font-semibold h-8 mb-1">
                  <CustomInput
                    type="text"
                    name="Appendicectomie"
                    className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0"
                    placeholder="Appendicectomie"
                    value={`${modalInputTitle}`}
                    disabled
                  />
                </CustomLabel>
              </DynamicHtmlTag>
            </DynamicHtmlTag> */}
            <DynamicHtmlTag type="div" className="p-3 md:p-10 w-full lg:w-10/12 mx-auto my-3">
              <DynamicHtmlTag type="p" className="text-center text-blue font-semibold text-sm lg:text-lg">
                {paragraph}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex justify-end gap-2">
              <CustomButton type="button" className="btn btn-danger w-36 h-8 lg:h-10 text-3xs xl:text-xs" onClick={onClose}>
                Annuler
              </CustomButton>
              <CustomButton
                type="button"
                onClick={onConfirm}
                className="uppercase card-btn w-36 h-8 lg:h-10 bg-gradient-to-b from-[#47A7DE] to-[#3460A7] rounded-full shadow-md font-semibold text-base-100 text-3xs xl:text-xs">
                Supprimer
              </CustomButton>
            </DynamicHtmlTag>
          </CustomForm>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </CustomModal>
  );
};

export default DeleteModal;
