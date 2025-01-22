"use client";
import { CustomButton, CustomFullScreenLoader, CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";
import React, { useState } from "react";
import { resetConsultationBooking, selectConsultationBooking, setCompletedStep, setConfirmed } from "@/store/reducers/consultationBookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { appointmentPaymentApi, extractMinMaxValues, getFormateDate, validateAppointment } from "@/utility";
import { RootState } from "@/store";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { getActiveProcess, setProcessConfirmed } from "@/store/reducers/consultationProcessReducerSlice";

const Payment = () => {
  const dispatch = useDispatch();
  const consultationBooking = useSelector(selectConsultationBooking);
  const activePatient = useSelector(getActiveProcess);
  const [isConfirmed] = useState(activePatient?.confirmed);
  const [IsSubmitDetail, setIsSubmitDetail] = useState(false);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const tarif = activePatient?.tarif ?? "";
  const { min, max } = extractMinMaxValues(tarif as string);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);

  const handleConfirmClick = async () => {
    const payload = {
      practitionerId: activePatient?.practitioner?.id,
      patientId: activePatient?.patientId,
      rdvId: activePatient?.rdvId ?? null,
      appointementValidation: true,
    };

    try {
      await validateAppointment(payload);
      dispatch(setConfirmed(true));
      dispatch(setProcessConfirmed({ confirmed: true, patientId: activePatient?.patientId || null }));
    } catch (error) {}
  };

  const handlePaymentInitiated = (stepNumber: number) => {
    dispatch(setCompletedStep(stepNumber));
    // dispatch(resetConsultationBooking());
  };

  const handleSubmitDetail = async () => {
    setIsSubmitDetail(true);
    dispatch(showLoader("payment_started"));
    try {
      const payload = {
        practitionerId: activePatient?.practitioner?.id,
        patientId: activePatient?.patientId,
        rdvId: activePatient?.rdvId ?? null,
      };
      const paymentResponse = await appointmentPaymentApi(payload);

      if (paymentResponse?.data) {
        const paymentLink = paymentResponse.data;
        handlePaymentInitiated(6);
        setIsPaymentInitiated(true);
        window.open(paymentLink, "_blank");
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  if (isLoading) {
    return <CustomFullScreenLoader />;
  }

  return (
    <DynamicHtmlTag type="div" className={`lg:px-5 h-full situation-screen-main situation-section}`}>
      <HeadingTag type="h2" className="font-bold text-base lg:text-lg mb-3 sticky top-0 z-10 bg-white">
        Confirmation et paiement
      </HeadingTag>

      {!isPaymentInitiated ? (
        <>
          <DynamicHtmlTag type="div" className={`gap-7 flex-col md:flex-row pb-0 md:px-1 md:pb-8 lg:pb-0 ${IsSubmitDetail ? "hidden" : "flex"}`}>
            {/* left div  */}
            <DynamicHtmlTag type="div" className="w-full md:w-1/2">
              {/* Appointment confirmation Div */}
              <DynamicHtmlTag type="div" className="md:shadow-lg rounded-lg p-0 md:p-3 confirmation-div relative">
                <DynamicHtmlTag type="div" className="rounded-lg md:rounded-none border-2 md:border-0 p-3 md-pb-0 md:p-0">
                  <HeadingTag type="h4" className="text-center text-xs lg:text-sm 2xl:text-base font-semibold mb-2">
                    Confirmation de rendez-vous
                  </HeadingTag>
                  <DynamicHtmlTag type="div" className="bg-sky-100 text-center px-3 md:px-9 py-2 rounded-lg">
                    <DynamicHtmlTag type="p" className="font-bold text-xs xl:text-sm 2xl:text-base">
                      Vous vous engagez à honorer votre présence en téléconsultation,<DynamicHtmlTag type="br"></DynamicHtmlTag>
                      le
                      <DynamicHtmlTag type="span" className="text-customBlue px-1">
                        {activePatient?.selectedDate ? getFormateDate(new Date(activePatient?.selectedDate).toISOString(), "dddd DD MMMM", true) : ""}
                        à {activePatient?.timeSlot}
                      </DynamicHtmlTag>
                      avec le
                      <DynamicHtmlTag type="span" className="text-customBlue ps-1">
                        {activePatient?.practitioner?.firstName} {activePatient?.practitioner?.lastName}.
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="font-bold text-xs xl:text-sm 2xl:text-base px-2 md:px-10 py-2 text-center">
                    En prennant rendez-vous, vous acceptez la prise en charge par téléconsultation.
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex gap-2 items-start">
                    <CustomImage src="/images/danger-icon.svg" width={18} height={18} alt="danger" className="pt-1" />
                    <DynamicHtmlTag type="p" className="text-2xs 2xl:text-sm">
                      Vous pouvez annuler le RDV gratuitement sans pénalité jusqu’à 1h avant. Au-delà des frais s’appliqueront ! Si vous n’honorez pas
                      le RDV, vous serez redevable d’une pénalité forfaitaire de {activePatient?.tarifInformation?.tarifPenality} €
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>

                <CustomButton
                  onClick={handleConfirmClick}
                  className={`confirm-btn cstm-btn view-more-btn text-xs 2xl:text-sm py-2 px-3 text-white font-semibold rounded-full ms-auto mt-3 xl:mt-0 w-1/3 xl:w-1/4 flex justify-center`}>
                  Confirmer
                </CustomButton>
                {/* after complete confirmation start */}
                <DynamicHtmlTag
                  type="div"
                  className={`absolute w-full h-full bg-primary/45 top-0 left-0 shadow-lg rounded-lg p-3 justify-center items-center flex ${activePatient?.confirmed ? "" : "hidden"}`}>
                  <CustomImage src="/images/right-tick.svg" alt="right-tick" width={150} height={150} className="w-24 lg:w-36" />
                </DynamicHtmlTag>
                {/* after complete confirmation end*/}
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="justify-end hidden md:flex">
                <CustomImage
                  src="/images/payment-bg.svg"
                  alt="payment-bg"
                  width={350}
                  height={200}
                  className="md:w-56 xl:w-48 2xl:w-96 mt-3 mb-5 lg:mb-0 mx-auto"
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            {/* Right div  */}
            <DynamicHtmlTag type="div" className="w-full md:w-1/2">
              {/* Pricing applied by DrVisio Div */}
              <DynamicHtmlTag type="div" className="md:shadow-lg rounded-lg md:px-5 md:py-3 h-full lg:relative md:pb-14">
                <DynamicHtmlTag type="div" className="rounded-lg md:rounded-none border-2 md:border-0 p-3 pb-8 md-pb-0 md:p-0 mb-0 md:mb-0">
                  <HeadingTag type="h4" className="text-center text-xs xl:text-sm 2xl:text-base font-semibold mb-2 border-b pb-2">
                    Tarification appliquée par DrVisio
                  </HeadingTag>
                  <DynamicHtmlTag type="div" className="flex justify-between mb-1">
                    <HeadingTag type="h5" className="text-xs xl:text-sm 2xl:text-base font-semibold">
                      Téléconsultation : Entre {min} et {max}€ max.
                    </HeadingTag>
                    <DynamicHtmlTag type="span" className="text-[#48A7DE] text-sm 2xl:text-base font-semibold">
                      {activePatient?.tarifInformation?.tarif} €
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="text-[#48A7DE] text-2xs 2xl:text-sm font-[600]">
                    Le montant final sera indiqué par le praticien lors de la téléconsultation. Le montant peut varier suivant l’acte réalisé par le
                    praticien. En cas d’évolution de tarif, le praticien doit vous informer pendant le rendez-vous. Vous serez débité à la fin de la
                    téléconsultation.
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex justify-between border-b py-2">
                    <HeadingTag type="h5" className="text-xs xl:text-sm 2xl:text-base font-semibold">
                      Frais de service DrVisio
                    </HeadingTag>
                    <DynamicHtmlTag type="span" className="text-[#48A7DE] text-sm xl:text-base font-semibold">
                      {activePatient?.tarifInformation?.serviceFee} €
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex justify-between py-2">
                    <HeadingTag type="h5" className="text-xs xl:text-sm 2xl:text-base font-bold">
                      Montant total
                    </HeadingTag>
                    <DynamicHtmlTag type="span" className="text-[#48A7DE] text-xs xl:text-sm 2xl:text-base font-bold">
                      {activePatient?.tarifInformation?.tarifTotal} €
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="bg-sky-100 text-center p-2 rounded-lg mt-1">
                    <DynamicHtmlTag type="p" className="font-semibold text-2xs xl:text-xs 2xl:text-sm">
                      Le tarif maximum sera retenu temporairement sur votre compte bancaire mais le montant final sera débité en fonction du montant
                      determiné par le praticien lors de la téléconsultation.
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag
                  type="div"
                  className="flex lg:flex-col xl:flex-row justify-between items-center absolute w-full md:left-0 md:p-5 right-6 bottom-12 md:bottom-0 -mb-10 md:mb-0 bg-white lg:bg-transparent">
                  <DynamicHtmlTag type="span" className="text-xs hidden md:block lg:mb-3 xl:mb-0">
                    Confirmer le rendez-vous pour pouvoir payer.
                  </DynamicHtmlTag>
                  <CustomButton
                    onClick={handleSubmitDetail}
                    className={`cstm-btn view-more-btn text-xs 2xl:text-sm py-2 px-3 text-base-100 rounded-full font-semibold ms-auto lg:mb-0 w-1/3 md:w-1/5 lg:w-1/3 xl:w-1/4 lg:bg-transparent flex justify-center max-w-x ${
                      activePatient?.confirmed ? "" : "opacity-65 cursor-not-allowed"
                    }`}
                    title={!activePatient?.confirmed ? "Confirmer le rendez-vous pour pouvoir payer." : ""}
                    disabled={!activePatient?.confirmed}>
                    Payer
                  </CustomButton>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </>
      ) : (
        <DynamicHtmlTag type="div" className="flex flex-col justify-center items-center h-[90%]">
          <DynamicHtmlTag type="div">
            <CustomImage
              src="/images/success-msg-bg.svg"
              alt="succes-paymnent-notification"
              width={400}
              height={190}
              className="m-auto mt-6 lg:mt-10 max-w-[75%] middle:max-w-full"
            />
            <DynamicHtmlTag type="div">
              <HeadingTag type="h2" className="text-xs md:text-xl font-bold text-center">
                Le paiement est lancé dans un nouvel onglet
              </HeadingTag>
              <HeadingTag type="h3" className="text-xs md:text-xl font-bold text-center">
                Complétez le paiement à l&apos;écran suivant
              </HeadingTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}
    </DynamicHtmlTag>
  );
};

export default Payment;
