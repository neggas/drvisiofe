"use client";
import { Card, CustomButton, CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";
import RdvAlreadyStartedModal from "@/components/rvdModal/RdvAlreadyStartedModal";
import { selectConsultationBooking, setCompletedStep, setInformation, setTarifInformation } from "@/store/reducers/consultationBookingSlice";
import { closeModal, openModal } from "@/store/reducers/modalSlice";
import { RootState } from "@/store/store";
import { handleCancelRdv, handleProcessError, validateMedicalInformation } from "@/utility";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Information = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const consultationBooking = useSelector(selectConsultationBooking);
  const modalType = useSelector((state: RootState) => state.modal.modalType);

  const handleNextStep = (stepNumber: number, nextPath: string) => {
    dispatch(setCompletedStep(stepNumber));
    router.push(nextPath);
  };

  const handleValidateMedicalInfoSubmit = async () => {
    const payload = {
      practitionerId: consultationBooking.practitionerId,
      patientId: consultationBooking.patientId,
      rdvId: consultationBooking.rdvId ?? null,
      informationValidation: true,
    };
    try {
      const response = await validateMedicalInformation(payload);
      if (response?.data?.codeMessage === "RDV_NOT_AVAILABLE") {
        router.push("/search");
        return;
      }
      if (response.data) {
        dispatch(
          setTarifInformation({
            tarif: response.data.tarif,
            serviceFee: response.data.serviceFee,
            tarifTotal: response.data.tarifTotal,
            tarifPenality: response.data.tarifPenality,
          })
        );

        dispatch(setInformation(true));
      }
      handleNextStep(5, "/consultationprocess/payment");
    } catch (error) {
      const errorHandlingResult = handleProcessError(error);
      toast.error(errorHandlingResult.message);

      if (errorHandlingResult.action === "openModal") {
        dispatch(openModal("rdvAlreadyStarted"));
        return;
      }

      if (errorHandlingResult.action === "redirect") {
        router.push(errorHandlingResult.redirectPath || "/search");
        return;
      }
    }
  };

  const isAccepteInformation = () => {
    return consultationBooking.information;
  };

  return (
    <>
      <DynamicHtmlTag type="div" className="lg:px-5 h-full situation-screen-main situation-section pb-4">
        {/* --- Emergency section start ---- */}
        <DynamicHtmlTag type="div">
          <HeadingTag type="h2" className="text-xs leading-none lg:text-2xs 2xl:text-sm font-bold text-red-500">
            DrVisio n{"’"}est pas un service d{"’"}urgence !
          </HeadingTag>
          <DynamicHtmlTag type="div" className="emergency-section">
            <DynamicHtmlTag type="div" className="flex sm:flex-col md:flex-row items-center gap-2 sm:w-full xl:w-2/5 mb-2 lg:mb-0 2xl:py-4">
              <DynamicHtmlTag type="div" className="text-red-500 sm:w-full md:w-3/6 xl:w-4/5">
                <DynamicHtmlTag type="p" className="text-2xs 2xl:text-xs font-medium mb-2 xl:mb-0 2xl:mb-2">
                  DrVisio n{"’"}est pas adapté pour les situations nécessitant une intervention médicale urgente.
                </DynamicHtmlTag>
                <HeadingTag type="h3" className="text-sm xl:text-2xs 2xl:text-sm font-bold">
                  En CAS D{"’"}URGENCE CONTACTEZ
                </HeadingTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="sm:w-full md:w-3/6 xl:max-w-max ">
                <CustomImage src="/images/doctor-call-help.svg" className="m-auto xl:w-8" alt="doctor-call-help" width={42} height={42} />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full xl:w-[60%] flex sm:flex-col md:flex-row md:items-center gap-4">
              <DynamicHtmlTag type="div" className="flex sm:gap-2 2xl:gap-3 items-center w-full md:w-2/5">
                <HeadingTag type="h4" className="px-3 py-2 bg-red-500 rounded-lg text-white xl:text-sm 2xl:text-base font-bold">
                  15
                </HeadingTag>
                <DynamicHtmlTag type="div">
                  <HeadingTag type="h4" className="font-semibold sm:text-sm md:text-xs leading-none xl:text-2xs 2xl:text-xs">
                    SAMU
                  </HeadingTag>
                  <DynamicHtmlTag type="p" className="text-3xs 2xl:text-xs">
                    En cas de besoin d{"’"}une assistance médicale urgente.
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex sm:gap-2 2xl:gap-3 items-center w-full md:w-1/3">
                <DynamicHtmlTag type="div">
                  <HeadingTag type="h4" className="px-3 py-2 bg-red-500 rounded-lg text-white xl:text-2xs 2xl:text-base font-bold">
                    112
                  </HeadingTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <HeadingTag type="h4" className="font-semibold sm:text-sm md:text-xs leading-none xl:text-2xs 2xl:text-xs">
                    N° EUROPÉEN
                  </HeadingTag>
                  <DynamicHtmlTag type="p" className="text-2xs xl:text-3xs 2xl:text-xs">
                    Si vous vous trouvez en union européenne.
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex sm:gap-2 2xl:gap-3 items-center w-full md:w-1/3">
                <DynamicHtmlTag type="div">
                  <HeadingTag type="h4" className="px-3 py-2 bg-red-500 rounded-lg text-white xl:text-2xs 2xl:text-base font-bold">
                    18
                  </HeadingTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <HeadingTag type="h4" className="font-semibold sm:text-sm md:text-xs leading-none xl:text-2xs 2xl:text-xs">
                    POMPIERS
                  </HeadingTag>
                  <DynamicHtmlTag type="p" className="text-2xs xl:text-3xs 2xl:text-xs">
                    En cas d{"’"}accident.
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {/* --- Emergency section end ---- */}
        {/* --- Symptoms section start ---- */}
        <DynamicHtmlTag type="div" className="mt-5 xl:mt-2 2xl:mt-5">
          <HeadingTag type="h2" className="text-xs leading-none lg:text-sm xl:text-2xs 2xl:text-sm font-bold text-customBlue">
            Si vous ressentez un des symptômes suivants, contactez le 15 ou votre médecin traitant.
          </HeadingTag>
          <DynamicHtmlTag
            type="div"
            className="bg-customBlue/25 rounded-lg shadow-lg mt-3 sm:py-3 md:py-2 2xl:py-5 px-4 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            <DynamicHtmlTag type="div" className="w-full lg:w-9/12 flex items-center sm:gap-3 md:gap-2 2xl:gap-3">
              <CustomImage src="/images/pain-patient.svg" alt="Pain" width={90} height={90} className="w-10 lg:w-10" />
              <DynamicHtmlTag type="p" className="sm:text-xs leading-none lg:text-2xs xl:text-3xs 2xl:text-xs font-semibold">
                Douleur thoracique.
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full flex items-center sm:gap-3 md:gap-2 2xl:gap-3">
              <CustomImage src="/images/weakness-patient.svg" alt="weakness" width={90} height={90} className="w-10 lg:w-10" />
              <DynamicHtmlTag type="div">
                <DynamicHtmlTag type="p" className="sm:text-xs leading-none lg:text-2xs xl:text-3xs 2xl:text-xs font-semibold">
                  Une faiblesse ou un engourdissement soudain d{"'"}un seul côté du visage.
                </DynamicHtmlTag>
                <DynamicHtmlTag type="p" className="sm:text-xs leading-none lg:text-2xs xl:text-3xs 2xl:text-xs font-semibold mt-1">
                  Une déformation de la bouche.
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full flex items-center sm:gap-3 md:gap-2 2xl:gap-3">
              <CustomImage src="/images/arm-patient.svg" alt="arm" width={90} height={90} className="w-10 lg:w-10" />
              <DynamicHtmlTag type="p" className="sm:text-xs leading-none lg:text-2xs xl:text-3xs 2xl:text-xs font-semibold">
                Une perte de force ou un engourdissement du bras ou d{"'"}une jambe.
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full flex items-center sm:gap-3 md:gap-2 2xl:gap-3">
              <CustomImage src="/images/speech-patient.svg" alt="Pain" width={90} height={90} className="w-10 lg:w-10" />
              <DynamicHtmlTag type="p" className="sm:text-xs leading-none lg:text-2xs xl:text-3xs 2xl:text-xs font-semibold">
                Une difficulté d{"'"}élocution ou de compréhension.
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {/* --- Symptoms section end ---- */}
        {/* --- Teleconsultation info section start ---- */}
        <DynamicHtmlTag type="div" className="mt-5 xl:mt-2 2xl:mt-5">
          <HeadingTag type="h2" className="text-sm xl:text-2xs 2xl:text-sm font-bold text-indigo-950">
            Informations à lire avant votre téléconsultation
          </HeadingTag>
          <DynamicHtmlTag type="div" className="mt-3 xl:mt-1 2xl:mt-3 px-1 lg:px-0 flex sm:flex-col md:flex-row gap-4 items-stretch justify-between">
            <Card className="bg-white rounded-lg shadow-lg p-2 lg:p-4 xl:p-1 2xl:p-4 sm:w-full md:w-1/3 flex-grow">
              <HeadingTag type="h3" className="text-indigo-950 font-bold text-xs leading-none xl:text-2xs 2xl:text-xs text-center">
                Documents non délivrables en téléconsultation
              </HeadingTag>
              <DynamicHtmlTag type="div" className="flex items-center mt-4 xl:mt-2 2xl:mt-4 sm:flex-row md:flex-col xl:flex-row gap-3">
                <CustomImage src="/images/documents-img.svg" alt="documents" width={120} height={120} className="w-16 lg:w-32 xl:w-20 2xl:w-32" />
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="p" className="text-xs lg:text-2xs 2xl:text-xs leading-none">
                    Certificats pour la pratique sportive.
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="text-xs lg:text-2xs 2xl:text-xs leading-none mt-2">
                    Accidents de travail.
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </Card>
            <Card className="bg-white rounded-lg shadow-lg p-2 lg:p-4 xl:p-1 2xl:p-4 sm:w-full md:w-1/3 flex-grow">
              <HeadingTag type="h3" className="text-indigo-950 font-bold text-xs leading-none xl:text-2xs 2xl:text-xs text-center">
                Se mettre dans les bonnes conditions
              </HeadingTag>
              <DynamicHtmlTag type="div" className="flex items-center mt-4 xl:mt-2 2xl:mt-4 sm:flex-row md:flex-col xl:flex-row gap-3">
                <CustomImage src="/images/conditions-img.svg" alt="documents" width={120} height={120} className="w-16 lg:w-32 xl:w-20 2xl:w-32" />
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="p" className="text-xs leading-none lg:text-2xs 2xl:text-xs">
                    Merci d{"’"}être présent au moins{" "}
                    <DynamicHtmlTag type="span" className="font-bold lg:text-2xs 2xl:text-xs">
                      5 minutes avant le début de la téléconsultation.
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="text-xs leading-none mt-2 xl:mt-0 2xl:mt-2 lg:text-2xs 2xl:text-xs">
                    Installez-vous dans un{" "}
                    <DynamicHtmlTag type="span" className="font-bold lg:text-2xs 2xl:text-xs">
                      environnement calme, isolé{" "}
                    </DynamicHtmlTag>
                    et si possible{" "}
                    <DynamicHtmlTag type="span" className="font-bold xl:text-2xs 2xl:text-xs">
                      bien éclairé.
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </Card>
            <Card className="bg-white rounded-lg shadow-lg p-2 lg:p-4 xl:p-1 2xl:p-4 sm:w-full md:w-1/3 flex-grow">
              <HeadingTag type="h3" className="text-indigo-950 font-bold text-xs leading-none xl:text-2xs 2xl:text-xs text-center">
                Le respect est primordial
              </HeadingTag>
              <DynamicHtmlTag type="div" className="flex items-center mt-4 xl:mt-2 2xl:mt-4 sm:flex-row md:flex-col xl:flex-row gap-3">
                <CustomImage src="/images/respect-img.svg" alt="documents" width={120} height={120} className="w-16 lg:w-32 xl:w-20 2xl:w-32" />
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="p" className="text-xs leading-none font-bold lg:text-2xs 2xl:text-xs">
                    Ne pas faire preuve d{"’"}agressivité en vers{" "}
                    <DynamicHtmlTag type="span" className="font-medium xl:text-2xs 2xl:text-xs">
                      le médecin.
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="text-xs leading-none mt-2 xl:mt-0 2xl:mt-2 xl:text-2xs 2xl:text-xs">
                    Il se peut que le{" "}
                    <DynamicHtmlTag type="span" className="font-bold lg:text-2xs 2xl:text-xs">
                      médecin soit en retard.
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="text-xs xl:text-2xs 2xl:text-xs leading-none mt-2 xl:mt-0">
                    Merci de{" "}
                    <DynamicHtmlTag type="span" className="font-bold xl:text-2xs 2xl:text-xs">
                      respecter ce travail.
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </Card>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      {/* --- Teleconsultation info section end ---- */}
      {/* -- Accept button start -- */}
      <DynamicHtmlTag type="div" className="flex justify-end lg:px-5">
        {!isAccepteInformation() ? (
          <CustomButton
            type="submit"
            onClick={handleValidateMedicalInfoSubmit}
            className="card-btn text-xs 2xl:text-sm py-2 px-10 lg:px-9 2xl:px-10 text-base-100 rounded-full font-semibold inline-block mt-4 lg:mt-0">
            J{"’"}ai lu et j{"’"}accepte
          </CustomButton>
        ) : (
          <CustomButton
            type="submit"
            className="card-btn text-xs 2xl:text-sm py-2 px-10 lg:px-9 2xl:px-10 text-base-100 rounded-full font-semibold inline-block mt-4 lg:mt-0"
            onClick={() => handleNextStep(5, "/consultationprocess/payment")}>
            Suivant
          </CustomButton>
        )}
      </DynamicHtmlTag>
      {/* -- Accept button end -- */}

      {modalType === "rdvAlreadyStarted" && (
        <RdvAlreadyStartedModal
          isOpen={modalType === "rdvAlreadyStarted"}
          onClose={() => dispatch(closeModal())}
          consultationBooking={consultationBooking}
          existingRdv={consultationBooking?.rdvId ?? null}
          handleCancelRdv={() => handleCancelRdv(consultationBooking?.rdvId ?? null, router, () => dispatch(closeModal()))}
        />
      )}
    </>
  );
};

export default Information;
