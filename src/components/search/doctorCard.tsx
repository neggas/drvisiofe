"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { DynamicHtmlTag, CustomButton, CustomImage, HeadingTag, CustomInput, Card, CustomLabel } from "@/components";
import {
  PatientData,
  PatientsType,
  PractitionerType,
  createBeneficiary,
  getFormateDate,
  getFormateTime,
  handleCancelRdv,
  handleProcessError,
} from "@/utility";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import {
  setConsultationPractitionerId,
  setPractitionerAvatar,
  setPractitionerName,
  setPractitionerTarif,
  setRdvId,
  setTimeSlot,
} from "@/store/reducers/consultationBookingSlice";
import { toast } from "react-toastify";
import {
  ConsultationProcessState,
  getActiveProcess,
  setProcessRdvId,
  startConsultationProcess,
} from "@/store/reducers/consultationProcessReducerSlice";
import ProcessNoticeModal from "../process-notice-modal/processNoticeModal";
import { RootState } from "@/store/store";
import { closeModal, openModal } from "@/store/reducers/modalSlice";
import { selectPatientDetailsData } from "@/store/reducers/patientDetailsSlice";
import RdvAlreadyStartedModal from "../rvdModal/RdvAlreadyStartedModal";
import { get } from "http";
interface PractitionerProps {
  practitioner: PractitionerType;
  localDate: string;
}

interface AppointmentPayload {
  practitionerId: number;
  patientId?: number;
  daySlot: string;
  timeSlot: string;
}

const DoctorCard: React.FC<PractitionerProps> = ({ practitioner, localDate }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoginResponse);
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const [processNoticeMessage, setProcessNoticeMessage] = useState("");
  const patientData = useSelector(selectPatientDetailsData);
  const activeProcess = useSelector(getActiveProcess);
  const [existingRdv, setExistingRdv] = useState<number | null>(null);
  const handleLink = () => {
    dispatch(setConsultationPractitionerId(practitioner?.id));
    router.push(`/practitioner-profile/${practitioner?.id}`);
  };

  const openProcessNoticeModal = () => {
    dispatch(openModal("processNoticeModal"));
  };

  const closeProcessNoticeModal = () => {
    dispatch(closeModal());
    setProcessNoticeMessage("");
  };

  const openRdvAlreadyStartedModal = () => {
    dispatch(openModal("rdvAlreadyStarted"));
  };

  const createAppointment = async (payload: AppointmentPayload) => {
    try {
      const response = await createBeneficiary(payload);

      if (response.data) {
        dispatch(setRdvId(response.data.id));
        dispatch(setProcessRdvId({ rdvId: response.data.id, parentId: loggedInUser?.data?.id! }));
      }

      if (response?.data?.codeMessage === "RDV_NOT_AVAILABLE") {
        router.push("/search");
        return;
      }

      return response.data;
    } catch (error: any) {
      const errorHandlingResult = handleProcessError(error);
      if (errorHandlingResult.action === "openModal") {
        openRdvAlreadyStartedModal();
        setExistingRdv(errorHandlingResult?.rdvId || null);
        return;
      }

      if (errorHandlingResult.action === "redirect") {
        setProcessNoticeMessage(errorHandlingResult.message || "");
        openProcessNoticeModal();
        return;
      }
    }
  };

  const handleBookSlot = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTimeSlot = event.target.value;
    if (!loggedInUser?.data?.id) {
      router.push(`/login`);
    } else {
      dispatch(
        setTimeSlot({
          daySlot: getFormateDate(localDate, "YYYY-MM-DD"),
          timeSlot: selectedTimeSlot,
        })
      );
      dispatch(setConsultationPractitionerId(practitioner?.id));
      dispatch(setPractitionerAvatar(practitioner?.avatar?.url || ""));
      dispatch(setPractitionerName(`Dr. ${practitioner?.firstName} ${practitioner?.lastName}`));
      dispatch(
        setPractitionerTarif(
          `${practitioner?.practitionerData?.tarifMin ? practitioner.practitionerData.tarifMin + "€" : ""} ${
            practitioner?.practitionerData?.tarifMax ? "à " + practitioner.practitionerData.tarifMax + "€" : ""
          }${practitioner?.practitionerData?.sector?.name ? " - " + practitioner?.practitionerData?.sector.name : ""}`
        )
      );

      const tarif = `${practitioner?.practitionerData?.tarifMin ? practitioner.practitionerData.tarifMin + "€" : ""} ${
        practitioner?.practitionerData?.tarifMax ? "à " + practitioner.practitionerData.tarifMax + "€" : ""
      }${practitioner?.practitionerData?.sector?.name ? " - " + practitioner?.practitionerData?.sector.name : ""}`;

      const startConsultationProcessPayload: ConsultationProcessState = {
        profile: patientData,
        practitioner: practitioner,
        completedSteps: 1,
        selectedMotifs: [],
        otherMotifText: "",
        confirmed: false,
        information: false,
        parentId: loggedInUser?.data?.id,
        patientId: loggedInUser?.data?.id,
        childrenId: null,
        tarif: tarif,
        timeSlot: selectedTimeSlot,
        daySlot: getFormateDate(localDate, "YYYY-MM-DD"),
        isActive: true,
      };

      dispatch(startConsultationProcess(startConsultationProcessPayload));

      const appointment = await createAppointment({
        practitionerId: practitioner?.id,
        daySlot: getFormateDate(localDate, "YYYY-MM-DD"),
        timeSlot: selectedTimeSlot,
        patientId: loggedInUser?.data?.id,
      });

      if (appointment) {
        router.push(`/consultationprocess/beneficiary`);
      }
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-lg p-2 lg:p-3 doctor-card-detail relative">
      <DynamicHtmlTag type="div" className="flex items-center mb-2 lg:mb-2 gap-4 lg:gap-2">
        <CustomImage
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${practitioner?.avatar?.url}`}
          placeholderSrc={"/images/dr-eric.webp"}
          alt={practitioner?.firstName}
          width={65}
          height={65}
          className="w-16 h-16 sm:w-12 sm:h-12 rounded-full border-2"
        />
        <DynamicHtmlTag type="div">
          <HeadingTag type="h2" className="text-sm sm:text-xs text-black font-semibold">
            {`Dr. ${practitioner?.firstName} ${practitioner?.lastName}`}
          </HeadingTag>
          <DynamicHtmlTag type="p" className="text-gray-400 text-xs sm:text-[0.625rem] font-semibold">
            {practitioner?.practitionerData?.speciality?.name}
          </DynamicHtmlTag>
          <DynamicHtmlTag type="p" className="text-black text-[0.625rem] sm:text-[0.5rem] font-semibold">
            N° RPPS : {practitioner?.practitionerData?.rpps}
          </DynamicHtmlTag>
          <DynamicHtmlTag type="p" className="text-black font-bold text-xs sm:text-[0.5rem]">
            {practitioner?.practitionerData?.city?.cityName} ({practitioner?.practitionerData?.postalCode})
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="p" className="text-black font-semibold text-xs">
        Tarif {practitioner?.practitionerData?.tarifMin ? practitioner.practitionerData.tarifMin + "€" : ""}
        {practitioner?.practitionerData?.tarifMax ? "à " + practitioner.practitionerData.tarifMax + "€" : ""}
        {practitioner?.practitionerData?.sector?.name ? " - " + practitioner.practitionerData?.sector.name : ""}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="p" className="text-red-500 font-semibold my-1 text-xs capitalize">
        {getFormateDate(localDate, "dddd DD MMMM")}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex flex-wrap gap-1 lg:gap-1.5 justify-start mb-12">
        {practitioner?.practitionerData?.availableCurrentPractitionerTimeSlots &&
          practitioner.practitionerData.availableCurrentPractitionerTimeSlots.map((slot, index) => {
            return slot.type === "AVAILABLE" ? (
              <DynamicHtmlTag key={index} type="div" className="radio-card w-[19%] sm:w-[18%]">
                <CustomInput
                  onChange={handleBookSlot}
                  className="custom-select hidden"
                  type="radio"
                  name={`selectTime-${practitioner?.id}`}
                  id={practitioner?.id + "_" + slot.start}
                  value={slot.start}
                />
                <CustomLabel
                  htmlFor={practitioner?.id + "_" + slot.start}
                  className="radio-label d-block flex items-center justify-center cursor-pointer">
                  <DynamicHtmlTag type="span" className="custom-select-btn [&&]:text-3xs [&&]:lg:text-[0.625rem] [&&]:p-1">
                    {getFormateTime(slot.start, "HH|mm")}
                  </DynamicHtmlTag>
                </CustomLabel>
              </DynamicHtmlTag>
            ) : (
              ""
            );
          })}
      </DynamicHtmlTag>
      <CustomButton
        as="button"
        className="card-btn text-white py-2 sm:w-8/12 2xl:w-8/12 rounded-full block text-2xs lg:text-xs absolute left-0 right-0 mx-auto bottom-2"
        onClick={handleLink}>
        Voir {"l'"}agenda complet
      </CustomButton>

      {modalType === "processNoticeModal" && (
        <ProcessNoticeModal isOpen={modalType === "processNoticeModal"} onClose={closeProcessNoticeModal} message={processNoticeMessage} />
      )}

      {modalType === "rdvAlreadyStarted" && (
        <RdvAlreadyStartedModal
          isOpen={modalType === "rdvAlreadyStarted"}
          onClose={() => dispatch(closeModal())}
          consultationBooking={activeProcess}
          existingRdv={existingRdv}
          handleCancelRdv={() => handleCancelRdv(existingRdv, router, () => dispatch(closeModal()))}
        />
      )}
    </Card>
  );
};

export default DoctorCard;
