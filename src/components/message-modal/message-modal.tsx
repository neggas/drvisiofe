"use client";
import React from "react";
import { CustomButton, CustomModal, DynamicHtmlTag, HeadingTag } from "@/components";
import { IoCloseSharp } from "react-icons/io5";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose }) => {
  return (
    <CustomModal id="message_modal" isOpen={isOpen} onClose={onClose} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
      <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
        <DynamicHtmlTag type="div" className="bg-base-100 py-4 px-6">
          <HeadingTag type="h3" className="text-blue font-bold text-lg flex items-center justify-between gap-2 pl-2 pb-4">
            Message du praticien
            <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={onClose}>
              <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
            </CustomButton>
          </HeadingTag>
          <DynamicHtmlTag type="div" className="border border-gray-200 rounded-md mt-3">
            <HeadingTag type="h5" className="my-2 text-xs font-bold p-2 pb-0">
              Message
            </HeadingTag>
            <DynamicHtmlTag type="div" className="max-h-36 h-full overflow-y-scroll ps-2 pb-2 font-semibold">
              <DynamicHtmlTag type="p" className="text-xs mb-2">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
                volutpat.
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="text-xs mb-2">
                Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis
                autem vel eum iriure dolor
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="text-xs mb-2">
                Ut wisi enim ad minim veniam, quis nostrud exip ex ea commodo consequat. Duis autem vel eum iriure dolor
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="text-xs mb-2">
                Ut wisi enim ad minim veniam,orper suscipit loboquat. Duis autem vel eum iriure dolor
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </CustomModal>
  );
};
export default MessageModal;
