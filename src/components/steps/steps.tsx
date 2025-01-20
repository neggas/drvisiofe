"use client";
import React, { useEffect, useState } from "react";
import { DynamicHtmlTag, CustomButton, CustomImage, CustomNav, CustomLink, HeadingTag } from "@/components";
import { usePathname, useRouter } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import CustomModal from "../modal/modal";
import { useDispatch, useSelector } from "react-redux";
import { selectConsultationBooking, setCompletedStep } from "@/store/reducers/consultationBookingSlice";
import { RootState } from "@/store";
import { closeModal, openModal } from "@/store/reducers/modalSlice";
import { cancelAppointment } from "@/utility";

const Steps = () => {
  const pathName = usePathname() || "";
  const router = useRouter();
  const dispatch = useDispatch();
  const consultationBooking = useSelector(selectConsultationBooking);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const openExitModal = () => setIsExitModalOpen(true);
  const closeExitModal = () => setIsExitModalOpen(false);
  const modalType = useSelector((state: RootState) => state.modal.modalType);

  const getActiveRoute = (currentPath: string, linkPath: string, activeClass: string) => {
    return currentPath === linkPath ? activeClass : "";
  };

  const stepPaths = ["beneficiary", "motifs", "situation", "dosier-medical", "informations", "payment"];

  const handleBackButton = () => {
    const currentStepIndex = stepPaths.findIndex(step => pathName.includes(step)) + 1;

    if (currentStepIndex > 1) {
      const previousStepPath = `/consultationprocess/${getStepPathByIndex(currentStepIndex - 1)}`;
      router.push(previousStepPath);
    } else {
      router.push("/search");
    }
  };

  const getStepPathByIndex = (index: number) => {
    return stepPaths[index - 1] || "";
  };

  useEffect(() => {
    const currentStepIndex = stepPaths.findIndex(step => pathName.includes(step)) + 1;

    if (currentStepIndex > 0 && consultationBooking.completedSteps < currentStepIndex) {
      dispatch(setCompletedStep(currentStepIndex));
    }
  }, [pathName, consultationBooking.completedSteps, dispatch]);

  const openAppointmentCloseModal = () => {
    dispatch(openModal("cancelPaymentModal"));
  };

  const closeAppointmentExitModal = () => {
    dispatch(closeModal());
  };

  const handleCloseButtonClick = () => {
    if (pathName === "/consultationprocess/beneficiary") {
      router.push("/search");
    } else {
      openAppointmentCloseModal();
    }
  };

  const handleAppointmentCancel = async () => {
    if (consultationBooking.rdvId !== undefined) {
      try {
        await cancelAppointment(consultationBooking.rdvId);
        closeAppointmentExitModal();
        router.push("/search");
      } catch (error) {}
    } else {
      router.push("/search");
    }
  };

  return (
    <DynamicHtmlTag
      type="div"
      className="grid lg:flex lg:gap-1 xl:gap-0 xl:grid grid-cols-12 sm:pb-0 lg:pb-4 sm:bg-light lg:bg-transparent lg:mx-auto mb-3 lg:mb-0 w-full">
      <DynamicHtmlTag type="div" className="sm:hidden lg:inline-block">
        <CustomButton className="w-fit inline-block previous-btn" as="link" onClick={handleBackButton}>
          <CustomImage src={"/images/back-btn.svg"} alt="back-arrow" width={30} height={30} className="img-fluid text-start rounded-full" />
        </CustomButton>
      </DynamicHtmlTag>

      {/* --- Tab section start --- */}
      <DynamicHtmlTag type="div" className="tab-section sm:col-span-12 lg:col-span-10 lg:w-full lg:px-0 rounded-full">
        <CustomNav defaultActiveKey="/consultationprocess/beneficiary" className="flex-column steps-menu light-gradient flex rounded-md">
          {["beneficiary", "motifs", "situation", "dosier-medical", "informations", "payment"].map((step, index) => {
            const stepNumber = index + 1;
            // const isStepEnabled = consultationBooking.completedSteps >= stepNumber && consultationBooking.completedSteps < 6;
            const isStepEnabled = consultationBooking.completedSteps >= stepNumber && consultationBooking.completedSteps <= 6;

            const disabledTitle = `Remplissez d'abord les informations de ${
              ["bénéficiaire", "motifs", "situation", "dossier médical", "informations", "paiement"][stepNumber - 2]
            }`;

            if (isStepEnabled) {
              // Render as a link when enabled
              return (
                <CustomLink
                  key={step}
                  href={`/consultationprocess/${step}`}
                  className={`steps-links sm:w-1/2 lg:w-1/6 ${getActiveRoute(pathName, `/consultationprocess/${step}`, "active")}`}>
                  <DynamicHtmlTag
                    type="span"
                    className="nav-span revert-light-gradient p-0.5 w-4 h-4 rounded-full inline-flex items-center justify-center text-center">
                    {stepNumber}
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span">
                    {["Bénéficiaire", "Motif(s)", "Situation", "Dossier médical", "Informations", "Paiement"][index]}
                  </DynamicHtmlTag>
                </CustomLink>
              );
            } else {
              // Render as a span when disabled
              return (
                <span
                  key={step}
                  className={`steps-links cursor-not-allowed opacity-50 sm:w-1/2 lg:w-1/6 steps-mob-links lg:flex`}
                  title={disabledTitle}>
                  <DynamicHtmlTag
                    type="span"
                    className="nav-span revert-light-gradient p-0.5 w-4 h-4 rounded-full inline-flex justify-center items-center text-center disabled-step">
                    {stepNumber}
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span">
                    {["Bénéficiaire", "Motif(s)", "Situation", "Dossier médical", "Informations", "Paiement"][index]}
                  </DynamicHtmlTag>
                </span>
              );
            }
          })}
          <CustomLink
            href="#!"
            className={`steps-links sm:w-1/2 lg:w-1/6 [&&]:shadow-none lg:hidden ${getActiveRoute(pathName, "/consultationprocess/payment", "active")}`}>
            Etape {consultationBooking.completedSteps}/6
          </CustomLink>
        </CustomNav>
      </DynamicHtmlTag>
      {/* --- Tab section end ---- */}

      {/* --- Close Button Start ---  */}
      <DynamicHtmlTag type="div" className="text-end sm:hidden lg:inline-block">
        <CustomButton className="w-fit inline-block p-1 revert-light-gradient rounded-full" as="button" onClick={handleCloseButtonClick}>
          <IoCloseSharp className="w-5 h-5" />
        </CustomButton>
      </DynamicHtmlTag>
      {/* --- Close Button End ---  */}

      {/*Exit from Process Custom Modal Starts */}
      <CustomModal
        isOpen={modalType === "cancelPaymentModal"}
        onClose={closeAppointmentExitModal}
        modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 p-4">
            <MdClose
              onClick={closeAppointmentExitModal}
              className="absolute top-6 right-2 cursor-pointer text-blue border border-blue rounded-full w-6 h-6 p-1 hover:bg-primary hover:border-primary hover:text-white"
            />
            <HeadingTag type="h3" className="text-blue font-semibold text-xl/8 w-8/12 m-auto text-center mt-5">
              Êtes-vous sûre de vouloir quitter la prise de rendez-vous ?
            </HeadingTag>

            <DynamicHtmlTag type="div" className="w-full flex md:gap-x-3 justify-center my-10">
              <CustomImage src="/images/danger-icon.svg" width={18} height={18} alt="danger" className="" />
              <HeadingTag type="h4" className="text-sm font-bold my-5">
                Attention, le créneau horaire ne sera pas reservé
              </HeadingTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex gap-x-10 justify-center mb-3">
              <CustomButton
                className={`text-sm btn-danger cstm-btn flex py-2 px-1 justify-center w-3/6  md:w-2/6 view-more-btn rounded-full text-white font-semibold`}
                onClick={closeAppointmentExitModal}>
                ANNULER
              </CustomButton>
              <CustomButton
                onClick={handleAppointmentCancel}
                className={`text-sm cstm-btn flex py-2 px-1 justify-center w-3/6  md:w-2/6 view-more-btn rounded-full text-white font-semibold`}>
                QUITTER
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>
      {/* Exit from Process Custom Modal Ends */}
    </DynamicHtmlTag>
  );
};
export default Steps;
