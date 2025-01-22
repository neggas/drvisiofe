"use client";
import { CustomButton, CustomForm, CustomImage, CustomInput, CustomLabel, CustomTextarea, DynamicHtmlTag, HeadingTag } from "@/components";
import ProcessNoticeModal from "@/components/process-notice-modal/processNoticeModal";
import RdvAlreadyStartedModal from "@/components/rvdModal/RdvAlreadyStartedModal";
import { selectConsultationBooking, setCompletedStep, setOtherMotifText, setSelectedMotifs } from "@/store/reducers/consultationBookingSlice";
import {
  getActiveProcess,
  setConsultationMotifs,
  setConsultationOtherMotifText,
  setProcessCompletedSteps,
} from "@/store/reducers/consultationProcessReducerSlice";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { closeModal, openModal } from "@/store/reducers/modalSlice";
import { RootState } from "@/store/store";
import { addMotif, API_URL, fetchMotifs, handleCancelRdv, handleProcessError } from "@/utility";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Motifs = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const consultationBooking = useSelector(selectConsultationBooking);
  const [selected, setSelected] = useState<number[]>([]);
  const [motifs, setMotifs] = useState<any[]>([]);
  const [otherMotif, setOtherMotif] = useState<string>("");
  const [existingRdv, setExistingRdv] = useState<number | null>(null);
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const activeConsultationProcess = useSelector(getActiveProcess);
  const [remainingCharacters, setRemainingCharacters] = useState<number>(300 - (activeConsultationProcess?.otherMotifText?.length || 0));
  const [processNoticeMessage, setProcessNoticeMessage] = useState<string>("");
  const loadMotifs = async () => {
    try {
      dispatch(showLoader("motifs-loader"));
      const data = await fetchMotifs();
      setMotifs(data);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    loadMotifs();
  }, []);

  useEffect(() => {
    if (activeConsultationProcess) {
      const selectedMotifs = activeConsultationProcess.selectedMotifs;
      const selectedMotifsIds = motifs.filter(motif => selectedMotifs.includes(motif.name)).map(motif => motif.id);
      if (selectedMotifsIds.length > 0) {
        setSelected(selectedMotifsIds);
      }

      if (activeConsultationProcess.otherMotifText) {
        setOtherMotif(activeConsultationProcess.otherMotifText);
      }
    }
  }, [activeConsultationProcess, consultationBooking.selectedMotifs, motifs, consultationBooking.otherMotifText]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const id = parseInt(value, 10);

    // Find the name of the motif based on the ID
    const selectedMotifName = motifs.find(motif => motif.id === id)?.name || "";

    if (checked) {
      if (selected.length < 3) {
        // Update local state
        const updatedSelected = [...selected, id];
        setSelected(updatedSelected);

        // Dispatch updated motifs to Redux
        const updatedMotifNames = motifs.filter(motif => updatedSelected.includes(motif.id)).map(motif => motif.name);

        dispatch(setSelectedMotifs(updatedMotifNames));
        dispatch(setConsultationMotifs({ selectedMotifs: updatedMotifNames, patientId: activeConsultationProcess?.patientId || null }));
      }
    } else {
      // Update local state
      const updatedSelected = selected.filter(item => item !== id);
      setSelected(updatedSelected);

      // Dispatch updated motifs to Redux
      const updatedMotifNames = motifs.filter(motif => updatedSelected.includes(motif.id)).map(motif => motif.name);

      dispatch(setSelectedMotifs(updatedMotifNames));
      dispatch(setConsultationMotifs({ selectedMotifs: updatedMotifNames, patientId: activeConsultationProcess?.patientId || null }));
    }
  };

  const handleOtherMotifChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedOtherMotif = event.target.value;
    const difference = updatedOtherMotif.length - otherMotif.length;
    setRemainingCharacters(remainingCharacters - difference);
    setOtherMotif(updatedOtherMotif);
    dispatch(setOtherMotifText(updatedOtherMotif));
    dispatch(setConsultationOtherMotifText({ otherMotifText: updatedOtherMotif, patientId: activeConsultationProcess?.patientId || null }));
  };

  const handleNextStep = (stepNumber: number, nextPath: string) => {
    dispatch(setCompletedStep(stepNumber));
    dispatch(setProcessCompletedSteps({ completedSteps: stepNumber, patientId: activeConsultationProcess?.patientId || null }));
    router.push(nextPath);
  };

  const closeProcessNoticeModal = () => {
    setProcessNoticeMessage("");
    dispatch(closeModal());
    router.push("/search");
  };

  const handleAddMotifSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!activeConsultationProcess?.practitioner?.id || !activeConsultationProcess?.patientId) {
      return;
    }

    const payload = {
      practitionerId: activeConsultationProcess.practitioner.id,
      patientId: activeConsultationProcess.patientId,
      rdvId: activeConsultationProcess.rdvId ?? null,
      motifIdList: selected,
      otherMotif: otherMotif.trim(),
    };

    try {
      const response = await addMotif(payload);
      if (response?.data?.codeMessage === "RDV_NOT_AVAILABLE") {
        setProcessNoticeMessage("Le praticien n'est disponible pour le moment");
        dispatch(openModal("processNoticeModal"));
        return;
      }
      handleNextStep(2, "/consultationprocess/situation");
    } catch (error) {
      const errorHandlingResult = handleProcessError(error);
      if (errorHandlingResult.action === "openModal") {
        dispatch(openModal("rdvAlreadyStarted"));
        setExistingRdv(errorHandlingResult?.rdvId || null);
        return;
      }

      if (errorHandlingResult.action === "redirect") {
        setProcessNoticeMessage(errorHandlingResult.message || "");
        dispatch(openModal("processNoticeModal"));
      }
    }
  };

  return (
    <DynamicHtmlTag type="div" className="beneficiary-section motif-section lg:px-5 flex justify-between flex-col doctor-list-main mb-12 md:mb-20">
      <DynamicHtmlTag type="div">
        <HeadingTag type="h2" className="text-sm lg:text-base font-bold">
          Selectionnez 1 à 3 motifs de téléconsultation
        </HeadingTag>

        {/* Symptômes Card section start */}
        <DynamicHtmlTag type="div" className="flex flex-wrap items-start doctor-card-detail consult-radio gap-2 my-2">
          {motifs.map(motif => {
            const isSelected = activeConsultationProcess?.selectedMotifs.includes(motif.name) || selected.includes(motif.id);
            const isDisabled = (activeConsultationProcess?.selectedMotifs?.length || 0) >= 3 && !selected.includes(motif.id);

            return (
              <DynamicHtmlTag
                key={motif.id}
                type="div"
                title={isDisabled ? "Vous avez déjà sélectionné 3 motifs" : ""}
                className={`w-full sm:w-[48%] md:w-[32%] xl:w-[24%] 2xl:w-[32%] ${isDisabled ? "cursor-not-allowed" : ""}`}>
                <CustomInput
                  type="checkbox"
                  className="hidden text-sm custom-select"
                  id={motif.id.toString()}
                  name={motif.name}
                  value={motif.id.toString()}
                  onChange={handleCheckboxChange}
                  checked={isSelected}
                  disabled={isDisabled}
                />
                <CustomLabel htmlFor={motif.id.toString()} className="radio-label">
                  <DynamicHtmlTag
                    type="div"
                    className={`custom-select-btn flex flex-row sm:flex-col [&&]:pt-2 [&&]:pb-1 [&&]:w-full [&&]:rounded-lg justify-start sm:justify-center items-center ${
                      isDisabled ? " cursor-not-allowed opacity-50" : ""
                    }`}>
                    <CustomImage src={`${API_URL}${motif.file?.url}`} alt={motif.name} width={60} height={60} className="w-[5vh] h-[5vh]" />
                    <DynamicHtmlTag
                      type="span"
                      className="ps-3 sm:ps-0 sm:mt-1 text-xs font-semibold line-clamp-2 h-8 items-center text-left sm:text-center flex capitalize">
                      {motif.name}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </CustomLabel>
              </DynamicHtmlTag>
            );
          })}
        </DynamicHtmlTag>
        {/* Symptômes Card section End */}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div">
        <DynamicHtmlTag type="div" className="flex flex-col md:flex-row items-center justify-between w-full"></DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="md:absolute md:w-[93%] md:bottom-2">
          <CustomForm onSubmit={handleAddMotifSubmit} className="flex flex-col md:flex-row gap-y-4 md:gap-y-0 gap-x-6 mt-1 items-center">
            <DynamicHtmlTag type="div" className="w-full">
              <CustomLabel className={"flex justify-between items-center mb-1"}>
                <HeadingTag type="h4" className="text-xs xl:text-sm font-bold text-left w-full md:w-auto">
                  Si votre motif n’est pas dans la liste, merci de le saisir
                </HeadingTag>
                <DynamicHtmlTag type="span" className="text-2xs xl:text-xs opacity-1 w-full md:w-auto text-right hidden md:block">
                  {remainingCharacters} caractères maximum
                </DynamicHtmlTag>
              </CustomLabel>
              <CustomLabel className="input border border-gray-400 p-2 flex lg:items-center gap-2 rounded-lg h-20 md:h-auto mb-1">
                <CustomTextarea
                  name="otherMotif"
                  className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0 text-xs md:text-xs 2xl:text-sm resize-none"
                  value={otherMotif}
                  onChange={handleOtherMotifChange}
                  maxLength={300}
                  row="2"
                />
              </CustomLabel>
              <DynamicHtmlTag type="span" className="text-[9px] opacity-75 w-full md:w-auto text-right block md:hidden">
                {remainingCharacters} caractères maximum
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <CustomButton
              type="submit"
              className="card-btn text-xs 2xl:text-sm text-white py-2 px-10 lg:px-9 2xl:px-10 font-semibold rounded-full disabled:opacity-50 md:mt-4 absolute bottom-3 right-7 md:relative md:right-0 md:bottom-0"
              disabled={selected.length === 0 && !otherMotif.trim()}>
              Valider
            </CustomButton>
          </CustomForm>
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      {modalType === "rdvAlreadyStarted" && (
        <RdvAlreadyStartedModal
          isOpen={modalType === "rdvAlreadyStarted"}
          onClose={() => dispatch(closeModal())}
          consultationBooking={consultationBooking}
          existingRdv={existingRdv}
          handleCancelRdv={() => handleCancelRdv(existingRdv, router, () => dispatch(closeModal()))}
        />
      )}

      {modalType === "processNoticeModal" && (
        <ProcessNoticeModal isOpen={modalType === "processNoticeModal"} onClose={closeProcessNoticeModal} message={processNoticeMessage} />
      )}
    </DynamicHtmlTag>
  );
};

export default Motifs;
