"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  PractitionerProfile,
  DynamicHtmlTag,
  CustomImage,
  CustomButton,
  Accordion,
  SideBar,
  CustomLink,
  CustomSelect,
  CustomLabel,
  CustomInput,
  CustomTextarea,
  CustomDatePicker,
} from "@/components";
import {
  getPractitionerProfileApi,
  getPractitionerTimeSlotsByDateRangeApi,
  generateDateRange,
  getCurrentDate,
  getCurrentDateTime,
  getFormateDate,
  getFormateTime,
  getLocalStorageData,
  PatientsType,
  createBeneficiary,
  handleProcessError,
  PractitionerType,
} from "@/utility";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import {
  setConsultationPractitionerId,
  setPractitionerAvatar,
  setPractitionerName,
  setPractitionerTarif,
  setRdvId,
  setTimeSlot,
} from "@/store/reducers/consultationBookingSlice";
import { ConsultationProcessState, resetConsultationProcess, setProcessRdvId, startConsultationProcess } from "@/store/reducers/consultationProcessReducerSlice";
import { toast } from "react-toastify";

interface PractitionerProps {
  practitioner: PractitionerType;
  localDate: string;
}

const beneficiaire = [
  { value: "Vous", label: "Dr Vous" },
  { value: "Patiem jdy", label: "Patiem" },
  { value: "Adien Pt", label: "Adien Pt" },
];

export default function PractitionerProfilePage({ slug }: { readonly slug: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  let selectedDate = searchParams.get("localDate");
  selectedDate = selectedDate ?? getCurrentDateTime();
  let selectedSpecialty = searchParams.get("specialty");
  selectedSpecialty = selectedSpecialty ?? "médecine générale";

  const [localDate, setLocalDate] = useState(selectedDate);
  const [specialty, setSpecialty] = useState(selectedSpecialty);
  const [firstName, setFirstName] = useState(searchParams.get("firstName") ?? "");
  const [lastName, setLastName] = useState(searchParams.get("lastName") ?? "");
  const [filter, setFilter] = useState<boolean>(false);
  const [practitioner, setPractitioner] = useState<any>({});
  const [practitionerError, setPractitionerError] = useState<string>("");
  const [practitionerTimeSlots, setPractitionerTimeSlots] = useState<any>([]);
  const [practitionerTimeSlotsCount, setPractitionerTimeSlotsCount] = useState<number>(0);
  const [practitionerTimeSlotsError, setPractitionerTimeSlotsError] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(getCurrentDate());
  const loggedInUser = useSelector(selectLoginResponse);
  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", false);
  const [IsshowBeneficiaries, setshowBeneficiaries] = useState(false);

  // Fetch Practitioner Profile
  useEffect(() => {
    fetchPractitionerProfile(slug);
  }, []);

  // Fetch Practitioner Time Slots by Date Range
  useEffect(() => {
    const dateRange = generateDateRange(startDate, 6);
    fetchPractitionerTimeSlotsByDateRange(slug, dateRange.startDate, dateRange.endDate);
  }, []);

  // Fetch Practitioners on specialty, name and data change
  useEffect(() => {
    const params = [
      { name: "specialty", value: specialty },
      { name: "localDate", value: localDate },
    ];

    if (firstName) {
      params.push({ name: "firstName", value: firstName });
    }

    if (lastName) {
      params.push({ name: "lastName", value: lastName });
    }

    if (filter) {
      router.push("/search?" + createQueryString(params));
    }
  }, [filter, specialty, localDate, firstName]);

  useEffect(() => {
    resetConsultationProcess()
  }, []);

  // Fetch Practitioner Profile
  const fetchPractitionerProfile = async (practitionerId: number) => {
    try {
      const data = await getPractitionerProfileApi(practitionerId);
      setPractitioner(data.data);
      setPractitionerError("");
    } catch (error: any) {
      // handle error
      setPractitionerError(error?.response?.data?.message);
    } finally {
      // Hide Loader
    }
  };

  const showBeneficiaries = () => {
    setshowBeneficiaries(true);
  };

  // Fetch Practitioner Time Slots by Date Range
  const fetchPractitionerTimeSlotsByDateRange = async (practitionerId: number, startDate: string, endDate: string) => {
    try {
      const data = await getPractitionerTimeSlotsByDateRangeApi(practitionerId, startDate, endDate);

      setPractitionerTimeSlotsCount(Object.keys(data.data).length);

      const timeSlots = Object.keys(data.data).map((key, dayIndex) => {
        return {
          title: getFormateDate(key, "dddd DD MMMM"),
          timeSlots: data.data[key].map((slot: any, slotIndex: number) => {
            return {
              id: slot.id || `${dayIndex}-${slotIndex}`,
              value: slot.start,
              label: getFormateTime(slot.start, "HH|mm"),
            };
          }),
        };
      });

      const dateRange = generateDateRange(endDate, 1);
      setStartDate(dateRange.endDate);
      setPractitionerTimeSlots([...practitionerTimeSlots, ...timeSlots]);
      setPractitionerTimeSlotsError("");
    } catch (error: any) {
      // handle error
      setPractitionerTimeSlotsError(error?.response?.data?.message);
    } finally {
      // Hide Loader
    }
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
    } catch (error: any) {
      const errorHandlingResult = handleProcessError(error);
      if (errorHandlingResult.action === "redirect") {
        toast.error(errorHandlingResult.message);
        router.push(errorHandlingResult.redirectPath || "/search");
        return;
      }
    }
  };

  const handleTimeSlotSelection = async (selectedTimeSlot: string, selectedDay: string) => {
    dispatch(
      setTimeSlot({
        daySlot: getFormateDate(selectedDay, "YYYY-MM-DD"),
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
      profile: loggedInUser?.data as unknown as PatientsType,
      practitioner: practitioner,
      completedSteps: 1,
      selectedMotifs: [],
      otherMotifText: "",
      confirmed: false,
      information: false,
      parentId: loggedInUser?.data?.id || null,
      patientId: loggedInUser?.data?.id || null,
      childrenId: null,
      tarif: tarif,
      timeSlot: selectedTimeSlot,
      daySlot: getFormateDate(localDate, "YYYY-MM-DD"),
      isActive: true,
    };

    dispatch(startConsultationProcess(startConsultationProcessPayload));

    await createAppointment({
      practitionerId: practitioner?.id,
      daySlot: getFormateDate(localDate, "YYYY-MM-DD"),
      timeSlot: selectedTimeSlot,
      patientId: loggedInUser?.data?.id,
    });

    // Navigate to the beneficiary URL
    router.push(`/consultationprocess/beneficiary`);
  };

  const loadMoreDates = () => {
    const dateRange = generateDateRange(getCurrentDate(startDate), 6);
    fetchPractitionerTimeSlotsByDateRange(slug, dateRange.startDate, dateRange.endDate);
  };

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (params: { name: string; value: string }[]) => {
      const urlsParams = new URLSearchParams(searchParams.toString());
      urlsParams.delete("firstName");
      urlsParams.delete("lastName");
      params.map((param: any) => {
        urlsParams.set(param.name, param.value);
      });
      return urlsParams.toString();
    },
    [searchParams]
  );

  // Datetime picker change event
  const handleDateOptionChange = (date: any) => {
    setStartDate(date);
    setLocalDate(getFormateDate(date, "YYYY-MM-DD HH:mm"));
    setFilter(true);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <DynamicHtmlTag
      type="div"
      className="doctor-box-main flex flex-col lg:flex-row gap-x-5 gap-y-0 lg:gap-y-0 sm:pb-0 md:py-5 sm:px-0 md:px-5 h-full">
      <DynamicHtmlTag type="div" className="w-[100%] lg:w-[30%] xl:w-[20%] sidebar-main">
        <SideBar
          selectedSpecialty={specialty}
          setSeleectedSpecialty={setSpecialty}
          setLocalDate={setLocalDate}
          localDate={localDate}
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setFilter={setFilter}
        />
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="w-[100%] lg:w-[70%] xl:w-[80%] md:bg-light rounded-2xl md:shadow-lg md:p-4">
        <DynamicHtmlTag
          type="div"
          className={`${loggedInUser && isTeleconsultationBooked ? "doctor-list-main doctor-profile" : "doctor-list-main"} grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-4 lg:gap-4 md:px-0 md:pe-2`}>
          {/* Doctor Profile Sidebar Start  */}
          <PractitionerProfile practitioner={practitioner} />
          {/* Doctor Profile Sidebar End  */}

          {/* Doctor Agenda Section Start  */}
          <DynamicHtmlTag type="div" className="bg-white rounded-2xl p-4 pt-1 lg:pt-4 pb-0 md:pb-4 col-span-3 lg:h-full lg:overflow-auto">
            <DynamicHtmlTag type="div" className="hidden lg:flex justify-between items-center">
              <DynamicHtmlTag type="div" className="flex items-center gap-2">
                <CustomButton onClick={handleClose} className="w-fit sm:hidden lg:inline-block previous-btn">
                  <CustomImage src={"/images/back-btn.svg"} alt="back-arrow" width={30} height={30} className="img-fluid text-start rounded-full" />
                </CustomButton>
                <DynamicHtmlTag type="p" className="text-xs text-darktext font-bold">
                  Retour à la liste des médecins
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <CustomButton type="button" className="text-xs text-customBlue font-bold">
                Agenda complet
              </CustomButton>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className={`${IsshowBeneficiaries ? "hidden" : "lg:h-[65%] 2xl:h-[75%] lg:overflow-auto"}`}>
              {/* Accordion Start  */}
              <Accordion
                items={practitionerTimeSlots.map((day: any, dayIndex: number) => ({
                  key: `day-${dayIndex}`,
                  title: day.title,
                  timeSlots: day.timeSlots.map((slot: any) => ({
                    id: slot.id,
                    label: slot.label,
                  })),
                }))}
                onTimeSlotSelect={handleTimeSlotSelection}
              />
              {/* Accordion End  */}
            </DynamicHtmlTag>
            {practitionerTimeSlotsCount > 0 && (
              <CustomButton
                className={`${IsshowBeneficiaries ? "hidden" : "mx-auto flex py-2 px-3 view-more-btn rounded-full text-2xs 2xl:text-xs text-white mt-3 font-semibold"}`}
                onClick={loadMoreDates}>
                Afficher plus
              </CustomButton>
            )}
            <DynamicHtmlTag
              type="div"
              className={`${IsshowBeneficiaries ? "hidden" : "bg-sky-100 flex flex-col lg:flex-row justify-between items-center mt-5 px-4 py-2 rounded-lg gap-y-3 lg:gap-0 sticky bottom-0"}`}>
              <DynamicHtmlTag type="p" className="text-xs xl:text-sm text-black font-semibold">
                Aucun créneau ne vous convient ?
              </DynamicHtmlTag>
              <CustomButton
                onClick={showBeneficiaries}
                className="flex py-2 px-3 view-more-btn rounded-full text-2xs 2xl:text-xs text-white font-semibold">
                Demander un rdv
              </CustomButton>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className={`${IsshowBeneficiaries ? "lg:h-[84%] 2xl:h-[86%] overflow-auto pt-3" : "hidden"}`}>
              <CustomLabel className="text-xs font-semibold mb-1">Beneficiaire</CustomLabel>
              <DynamicHtmlTag type="div" className="border border-gray-200 rounded-md px-2 z-50">
                <CustomSelect options={beneficiaire} className="text-xs 2xl:text-sm all-select-box w-full font-semibold z-50" />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex flex-col md:flex-row mt-3">
                <DynamicHtmlTag type="div" className="w-full md:w-1/2">
                  <CustomLabel className="text-xs font-semibold pb-2 block">Choisir une date</CustomLabel>
                  <DynamicHtmlTag type="div" className="form-date-picker date-picker flex items-center space-x-2 text-sm">
                    <DynamicHtmlTag type="span" className="text-xs outline-none mx-auto md:ms-0 w-full">
                      <CustomDatePicker
                        // timeCaption="Temps"
                        // timeFormat="HH:mm"
                        // locale="fr"
                        // todayButton="Aujourd'hui"
                        selected={startDate}
                        dateFormat={"dd/MM/yyyy"}
                        minDate={new Date()}
                        inline
                        onChange={(date: any) => handleDateOptionChange(date)}
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full md:w-1/2 mt-2 md:mt-0 md:ps-5">
                  <CustomLabel className="text-xs font-semibold pb-2 hidden md:block">La date s{"'"}affichera ici</CustomLabel>
                  <CustomLabel className="text-xs 2xl:text-sm bg-pink-600 px-3 py-1 rounded-full text-white font-semibold block text-center w-48 md:w-3/6">
                    Lundi 05 aout
                  </CustomLabel>
                  <CustomLabel className="text-xs font-semibold pt-5 pb-2 block">Choisir un creneau horaire</CustomLabel>
                  <CustomSelect
                    options={practitionerTimeSlots.flatMap((day: any, dayIndex: number) =>
                      day.timeSlots.map((slot: any, slotIndex: number) => ({
                        key: `${dayIndex}-${slotIndex}`,
                        value: slot.value,
                        label: `${day.title} - ${slot.label}`,
                      }))
                    )}
                    className="text-sm all-select-box w-full font-semibold md:w-3/6 border border-gray-600 rounded-3xl px-3 timing-select"
                    onChange={(selectedOption: any) => {
                      const [selectedDay, selectedSlot] = selectedOption.label.split(" - ");
                      handleTimeSlotSelection(selectedSlot, selectedDay);
                    }}
                  />

                  <DynamicHtmlTag type="div" className="flex gap-2 mt-2">
                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                      <CustomInput className="" type="checkbox" id="checkbox-1" />
                      <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="checkbox-1">
                        <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                      </CustomLabel>
                    </DynamicHtmlTag>
                    <CustomLabel className="text-xs font-semibold">Je suis flexible sur I{"'"}horaire</CustomLabel>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex flex-col mt-5">
                <CustomLabel className="text-xs font-semibold mb-1">Ecrire un message</CustomLabel>
                <CustomTextarea
                  className="text-xs 2xl:text-sm resize-none outline-none w-full font-semibold border border-gray-200 px-3 py-2 rounded-md h-20 mb-3"
                  placeholder="Message"
                  name=""
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="sticky bottom-0 bg-base-100">
              <CustomButton
                type="button"
                className={`${IsshowBeneficiaries ? "card-btn flex py-2 px-3 view-more-btn rounded-full text-2xs 2xl:text-xs text-white font-semibold w-fit ms-auto md:me-3" : "hidden"}`}>
                Envoyer ma demande
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
}
