import { CustomButton } from "../ui/button/button";

import { DynamicHtmlTag } from "../ui";

import { CustomModal } from "..";

interface RdvAlreadyStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationBooking: any;
  existingRdv?: number | null;
  handleCancelRdv: () => void;
}

const RdvAlreadyStartedModal = ({ isOpen, onClose, consultationBooking, existingRdv, handleCancelRdv }: RdvAlreadyStartedModalProps) => {
  return (
    <CustomModal id="rdvAlreadyStarted" isOpen={isOpen} onClose={onClose} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
      <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
        <DynamicHtmlTag type="div" className="bg-base-100 py-3 lg:py-6 px-4 lg:px-8">
          <DynamicHtmlTag
            type="div"
            className="text-blue py-8 px-2 w-11/12 lg:w-8/12 xl:w-10/12 text-center font-semibold text-sm lg:text-lg mx-auto">
            <DynamicHtmlTag type="p" className="text-center">
              Vous avez déjà un rendez-vous de prévu
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-center">
              pour le {consultationBooking.daySlot} à {consultationBooking.timeSlot}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="mt-4">
              Souhaiter-vous annuler votre rendez-vous ?
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="w-2/3 flex items-center justify-center gap-3 mx-auto mt-4 lg:mt-6">
            <CustomButton
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                if (existingRdv) {
                  handleCancelRdv();
                }
              }}
              type="button"
              className="card-btn text-sm py-1 px-4 rounded-full bg-gray-100 w-1/3 text-white capitalize">
              Oui
            </CustomButton>
            <CustomButton
              onClick={onClose}
              type="button"
              className="card-btn  text-sm py-1 px-4 rounded-full bg-gray-100 w-1/3 text-white capitalize">
              Non
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </CustomModal>
  );
};

export default RdvAlreadyStartedModal;
