import React from "react";
import { CustomButton, CustomModal, HeadingTag, DynamicHtmlTag } from "@/components";
import { MdClose, MdWarning } from "react-icons/md";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const DeleteDocument: React.FC<ActionModalProps> = ({ isOpen, onClose, icon, title, description }) => {
  return (
    <CustomModal id="action_modal" isOpen={isOpen} onClose={onClose} modalClassName="w-full sm:max-w-1/2 md:max-w-xl rounded-xl">
      <DynamicHtmlTag type="div" className="modal-box rounded-lg bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
        <DynamicHtmlTag type="div" className="bg-base-100 p-4">
          <HeadingTag type="h3" className="font-bold text-lg flex gap-4 items-center">
            {icon}
            {title}
            <MdClose
              onClick={onClose}
              className="ms-auto cursor-pointer text-blue border border-blue rounded-full w-6 h-6 p-1 hover:bg-primary hover:border-primary hover:text-white"
            />
          </HeadingTag>
          <DynamicHtmlTag type="div" className="modal-head py-12">
            <DynamicHtmlTag type="h6" className="mb-3 text-blue text-sm lg:text-lg font-medium text-center whitespace-pre-wrap">
              {description}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className=" flex justify-between mt-0 mb-5">
            <CustomButton type="button" className="btn btn-danger w-36 h-8 lg:h-10 text-3xs xl:text-xs rounded-full" onClick={onClose}>
              ANNULER
            </CustomButton>
            <CustomButton
              type="button"
              className="text-3xs xl:text-xs w-36 h-8 lg:h-10 text-base-100 font-bold rounded-full card-btn cursor-pointer uppercase">
              Supprimer
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </CustomModal>
  );
};

export default DeleteDocument;
