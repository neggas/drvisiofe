import { CustomButton } from "../ui/button/button";

import { DynamicHtmlTag } from "../ui";

import { CustomModal } from "..";

import { FaExclamationTriangle } from "react-icons/fa";

interface ProcessNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  buttonText?: string;
  path?: string;
}

const ProcessNoticeModal = ({ isOpen, onClose, message, buttonText = "D'accord" }: ProcessNoticeModalProps) => {
  return (
    <CustomModal id="processNoticeModal" isOpen={isOpen} onClose={onClose} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
      <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-yellow-400 to-red-500 p-0 pt-4">
        <DynamicHtmlTag type="div" className="bg-base-100 py-3 lg:py-6 px-4 lg:px-8">
          <DynamicHtmlTag
            type="div"
            className="text-yellow-800 py-8 px-2 w-11/12 lg:w-8/12 xl:w-10/12 text-center font-semibold text-sm lg:text-lg mx-auto flex flex-col items-center">
            <FaExclamationTriangle className="text-4xl mb-4" />
            <DynamicHtmlTag type="p" className="text-center">
              {message}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="w-full flex items-center justify-end gap-3 mx-auto mt-4 lg:mt-6">
            <CustomButton onClick={onClose} type="button" className="card-btn text-sm py-1 px-4 rounded-full bg-gray-100 w-1/3 text-white capitalize">
              {buttonText}
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </CustomModal>
  );
};

export default ProcessNoticeModal;
