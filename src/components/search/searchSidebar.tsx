"use client";

import React, { useEffect, useState } from "react";
import {
  DynamicHtmlTag,
  CustomImage,
  HeadingTag,
  CustomSelect,
  CustomAsyncSelect,
  CustomLink,
  CustomButton,
  CustomDatePicker,
  PinkCheck,
  CustomModal,
  CustomTextarea,
} from "@/components";
import { API_URL, SpecialityType, getFormateDate, getSpecialitiesApi, searchPractitionerByPatternApi } from "@/utility";
import { selectSpecialityData, setSpecialityData } from "@/store/reducers/specialitySlice";
import { useDispatch, useSelector } from "react-redux";
import { IoCloseSharp } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { MdClose } from "react-icons/md";
import { selectConsultationBooking, setSelectedDate } from "@/store/reducers/consultationBookingSlice";
import { getActiveProcess } from "@/store/reducers/consultationProcessReducerSlice";

interface SpecialitiesProps {
  selectedSpecialty: string;
  setSeleectedSpecialty: (value: string) => void;
  localDate: string;
  setLocalDate: (value: string) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  firstName: string;
  lastName: string;
  setFilter: (value: boolean) => void;
}

interface PractitionerProps {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  genre?: string;
}

const SideBar: React.FC<SpecialitiesProps> = ({
  selectedSpecialty,
  setSeleectedSpecialty,
  localDate,
  setLocalDate,
  setFirstName,
  setLastName,
  firstName,
  lastName,
  setFilter,
}) => {
  const dispatch = useDispatch();
  const specialities = useSelector(selectSpecialityData);
  const consultationBooking = useSelector(selectConsultationBooking);
  const activeProcess = useSelector(getActiveProcess);

  const selectedMotifs = activeProcess?.selectedMotifs || [];
  const otherMotifText = activeProcess?.otherMotifText || "";

  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(localDate ? new Date(localDate) : new Date());
  const [speciality, setSpeciality] = useState<{ value: string; label: string } | null>(null);
  const [specialityOptions, setSpecialityOptions] = useState<{ value: string; label: string }[]>([]);
  const pathname = usePathname();
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const openExitModal = () => setIsExitModalOpen(true);
  const closeExitModal = () => setIsExitModalOpen(false);
  const allowedMotifSidebarPaths = [
    "/consultationprocess/motifs",
    "/consultationprocess/situation",
    "/consultationprocess/dosier-medical",
    "/consultationprocess/informations",
    "/consultationprocess/payment",
    "/consultationprocess/beneficiary",
  ];

  const defaultSelectedPractitioner = [];
  if (firstName) {
    defaultSelectedPractitioner.push({
      value: firstName,
      label: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
    });
  }

  const [searchPractitionerList, setSearchPractitionerList] = useState<any>(defaultSelectedPractitioner);

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Hook to trigger get Speciality List function
  useEffect(() => {
    fetchSpecialities();
  }, []);

  // Hook to trigger set options for Speciality dropdown and set default selected Speciality
  useEffect(() => {
    setSpecialityOptions(
      specialities.map((speciality: SpecialityType) => {
        if (selectedSpecialty && speciality.name == selectedSpecialty) {
          setSpeciality({ value: speciality.name, label: speciality.name });
        } else if (!selectedSpecialty && speciality.name == "médecine générale") {
          setSpeciality({ value: speciality.name, label: speciality.name });
        } else {
          // No action
        }
        return { value: speciality.name, label: speciality.name };
      })
    );
  }, [specialities]);

  // Function to Fetch Speciality List from API
  const fetchSpecialities = async () => {
    // dispatch(showLoader("patient-table"));
    try {
      const data = await getSpecialitiesApi();
      dispatch(setSpecialityData(data.data.results));
    } catch (error) {
      // handle error
      dispatch(setSpecialityData([]));
    } finally {
      // dispatch(hideLoader());
    }
  };

  // Function to Fetch Practitioner List by Pattern from API
  const searchPractitionersByPattern = async (search: string) => {
    if (search.length < 3) {
      return;
    }
    // dispatch(showLoader("patient-table"));
    try {
      const data = await searchPractitionerByPatternApi(0, 25, search);
      // dispatch(setSpecialityData(data.data.results));
      const practitioners = data.data.results.map((practitioner: PractitionerProps) => {
        return {
          value: practitioner.id,
          label: `${practitioner.firstName} ${practitioner.lastName}`,
          firstName: practitioner.firstName,
          lastName: practitioner.lastName,
        };
      });
      setSearchPractitionerList(practitioners);
      return practitioners;
    } catch (error) {
      // handle error
      // dispatch(setSpecialityData([]));
    } finally {
      // dispatch(hideLoader());
    }
  };

  // Speciality change event
  const handleSpecialityChange = (newValue: any) => {
    const selectedOption = newValue as { value: string; label: string };
    setSpeciality(selectedOption);
    setSeleectedSpecialty(selectedOption.value);
    setFilter(true);
  };

  const handleDateOptionChange = (date: any) => {
    setStartDate(date);
    dispatch(setSelectedDate(date));
    setLocalDate(getFormateDate(date, "YYYY-MM-DD HH:mm"));
    setFilter(true);
  };

  useEffect(() => {
    if (!activeProcess?.daySlot) {
      const currentDate = new Date();
      dispatch(setSelectedDate(currentDate));
    }
  }, [dispatch, activeProcess?.daySlot]);

  return (
    <DynamicHtmlTag type="div" className="bg-base-100 flex-col lg:flex-row rounded-2xl min-h-full lg:border overflow-y-hidden lg:h-full">
      <DynamicHtmlTag type="div" className="bg-base-100 w-full px-4 sm:pb-0 sm:pt-2 lg:py-4 rounded-full">
        <DynamicHtmlTag type="div" className="lg:space-y-6">
          <DynamicHtmlTag type="div" className="flex items-center justify-between mb-4 lg:mb-0">
            <CustomLink className="w-fit lg:hidden previous-btn" href="/">
              <CustomImage
                src={"/images/back-btn.svg"}
                alt="back-arrow"
                width={30}
                height={30}
                className="img-fluid text-start rounded-full w-6 h-6"
              />
            </CustomLink>
            <DynamicHtmlTag type="div" className="font-semibold flex items-center gap-1 lg:gap-3">
              <CustomImage src="/images/side-icon.svg" alt="side-icon" width={15} height={15} />
              <HeadingTag type="h3" className="text-[9px] lg:text-xs 2xl:text-sm leading-normal">
                PRENDRE UN RENDEZ-VOUS
              </HeadingTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-end lg:hidden">
              <CustomButton className="w-fit inline-block p-1 revert-light-gradient rounded-full" onClick={openExitModal}>
                <IoCloseSharp className="w-4 h-4" />
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>

          {pathname && !pathname.startsWith("/consultationprocess") && (
            <DynamicHtmlTag
              type="div"
              className={`relative ${pathname && !pathname.startsWith("/consultationprocess/") && !pathname.startsWith("/waiting-room") ? "block" : "hidden lg:block"}`}>
              <CustomAsyncSelect
                className="custom-search w-full text-[12px] border-none rounded-full px-8 lg:px-2 lg:pl-12 py-0 bg-base-200"
                isClearable
                cacheOptions
                classNamePrefix={"custom-select"}
                defaultOptions={searchPractitionerList}
                loadOptions={searchPractitionersByPattern}
                onChange={(data: any) => {
                  setFirstName(data?.firstName ?? "");
                  setLastName(data?.lastName ?? "");
                  setFilter(true);
                }}
                placeholder="Rechercher un médecin"
                noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucune option trouvée")}
              />
              <DynamicHtmlTag type="div" className="absolute left-0 inset-y-0 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 2xl:h-6 w-5 2xl:w-6 ml-3 text-gray-400 hover:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          )}

          <DynamicHtmlTag
            type="div"
            className={`${pathname && !pathname.startsWith("/consultationprocess/") && !pathname.startsWith("/waiting-room") ? "block" : "hidden lg:block"} bg-white rounded-lg p-2 lg:px-2 lg:py-4 xl:p-4 shadow-md lg:shadow-lg lg:space-y-2 gap-x-5 my-2`}>
            <DynamicHtmlTag type="div" className="flex xs:flex lg:block gap-5 items-center">
              <DynamicHtmlTag
                type="div"
                className="flex justify-between items-center sm:text-center cursor-pointer lg:pointer-events-none"
                onClick={() => setOpen(!open)}>
                <HeadingTag type="h3" className="text-2xs 2xl:text-xs font-semibold text-center mb-2 w-full hidden lg:block ">
                  SPÉCIALITÉ
                </HeadingTag>
                <CustomImage src="/images/speciality-icon.png" alt="speciality" className="lg:hidden" width={30} height={30} />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex justify-between gap-4 w-full lg:w-auto">
                <CustomSelect
                  name="speciality"
                  className="select w-full font-bold text-[10px] lg:text-xs 2xl:text-sm text-center specility-list"
                  placeholder="Médecin généraliste"
                  classNamePrefix={"custom-select"}
                  options={specialityOptions}
                  value={
                    pathname && pathname.startsWith("/consultationprocess/beneficiary")
                      ? specialityOptions.find(option => option.value === consultationBooking.speciality)
                      : speciality
                  }
                  isDisabled={pathname.startsWith("/consultationprocess/beneficiary")}
                  onChange={!pathname.startsWith("/consultationprocess/beneficiary") ? handleSpecialityChange : undefined}
                />
                <CustomImage
                  src="/images/select-icon.svg"
                  alt="select"
                  className="lg:hidden"
                  width={10}
                  height={10}
                  onClick={() => setOpen(!open)}></CustomImage>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            {/* REQUEST AN APPOINTMENT  CARD WITH CALENDER FOR SM:SCREEN */}
            {open && (
              <DynamicHtmlTag type="div" className="block relative lg:hidden">
                <DynamicHtmlTag type="div" className="rounded-lg p-3 lg:p-4 shadow-md space-y-4 w-full absolute top-2 bg-base-100 z-10">
                  <HeadingTag type="h3" className="text-[10px] font-semibold">
                    {" "}
                    DEMANDE DE RENDEZ-VOUS LE
                  </HeadingTag>
                  <DynamicHtmlTag type="div">
                    <DynamicHtmlTag type="div" className="flex items-center mb-4 gap-2">
                      <CustomImage
                        src="/images/dr-franck-image.webp"
                        alt="Dr Franck DUPONT"
                        className="w-10 h-10 rounded-full"
                        width={15}
                        height={15}
                      />
                      <DynamicHtmlTag type="div">
                        <DynamicHtmlTag type="p" className="font-bold text-xs text-gray-900">
                          Dr Franck DUPONT
                        </DynamicHtmlTag>
                        <DynamicHtmlTag type="p" className="text-xs text-gray-400">
                          Médecin Généraliste
                        </DynamicHtmlTag>
                        <DynamicHtmlTag type="p" className="text-2xs font-bold text-gray-600">
                          Tarif 25€ à 35€ - Secteur 1
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="flex items-start my-2 gap-1">
                      <CustomImage src="/images/pink-check.svg" alt="check" className="mt-1" width={13} height={13} />
                      <DynamicHtmlTag type="div" className="flex gap-2 items-center">
                        <DynamicHtmlTag type="p" className="text-pink-500 text-xs font-bold">
                          Vendredi 02 août
                        </DynamicHtmlTag>
                        <DynamicHtmlTag type="p" className="text-customBlue text-xs font-semibold">
                          à 15h20
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="date-picker flex items-center space-x-2 text-sm">
                    <CustomDatePicker
                      selected={startDate} // Pass the state variable
                      onChange={(date: any) => handleDateOptionChange(date)} // Pass the updated handler
                      todayButton="Aujourd'hui"
                      showTimeSelect
                      dateFormat="dd/MM/yyyy HH:mm"
                    />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            )}
          </DynamicHtmlTag>
          {/* REQUEST AN APPOINTMENT  CARD WITH CALENDER FOR LG:SCREEN */}
          <DynamicHtmlTag type="div" className="hidden lg:block bg-white rounded-lg p-3 lg:p-4 shadow-lg open-date-picker">
            <HeadingTag type="h3" className="text-2xs 2xl:text-xs font-semibold">
              DEMANDE DE RENDEZ-VOUS LE
            </HeadingTag>
            {pathname && pathname.startsWith("/consultationprocess") && activeProcess ? (
              <DynamicHtmlTag type="div" className={`${viewportHeight < 850 ? "h-[100px]" : "h-auto"} overflow-y-scroll`}>
                <DynamicHtmlTag type="div" className="flex items-start my-2 gap-1">
                  <CustomImage src={PinkCheck} alt="check" className="mt-0.5 2xl:mt-1" width={13} height={13} />
                  <DynamicHtmlTag type="div">
                    <DynamicHtmlTag type="p" className="text-pink-500 text-2xs 2xl:text-xs font-bold">
                      {activeProcess?.daySlot ? getFormateDate(new Date(activeProcess.daySlot).toISOString(), "dddd DD MMMM", true) : ""}
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="p" className="text-customBlue text-2xs 2xl:text-xs font-semibold">
                      à {activeProcess?.timeSlot || "Tarif not available"}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="mt-0 2xl:mt-3">
                  <HeadingTag type="h4" className="text-2xs 2xl:text-xs text-gray-700 font-bold mb-2 text-left uppercase">
                    Pour le patient
                  </HeadingTag>
                  <DynamicHtmlTag type="div" className="flex items-center mb-4 gap-2">
                    <CustomImage
                      key={activeProcess?.profile?.avatar?.id}
                      src={activeProcess?.profile?.avatar ? `${API_URL}${activeProcess.profile.avatar.url}` : "/images/dr-franck-image.webp"}
                      alt={activeProcess?.profile?.firstName + " " + activeProcess?.profile?.lastName}
                      className="w-8 2xl:w-10 h-8 2xl:h-10 rounded-full"
                      width={15}
                      height={15}
                    />
                    <DynamicHtmlTag type="div">
                      <DynamicHtmlTag type="div" className="font-bold text-2xs 2xl:text-xs text-gray-900">
                        {activeProcess?.profile?.lastName + " " + activeProcess?.profile?.firstName || "Unknown Doctor"}
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="mt-3 2xl:mt-3">
                  <HeadingTag type="h4" className="text-2xs 2xl:text-xs text-gray-700 font-bold mb-2 text-left">
                    VOTRE RDV AURA LIEU AVEC
                  </HeadingTag>
                  <DynamicHtmlTag type="div" className="flex items-center mb-4 gap-2">
                    <CustomImage
                      key={activeProcess?.practitioner?.avatar?.id}
                      src={
                        activeProcess?.practitioner?.avatar ? `${API_URL}${activeProcess.practitioner.avatar.url}` : "/images/dr-franck-image.webp"
                      }
                      alt="Dr.Franck"
                      className="w-8 2xl:w-10 h-8 2xl:h-10 rounded-full"
                      width={15}
                      height={15}
                    />
                    <DynamicHtmlTag type="div" className="mb-4">
                      <DynamicHtmlTag type="div" className="font-bold text-2xs 2xl:text-xs text-gray-900">
                        {activeProcess?.practitioner?.firstName + " " + activeProcess?.practitioner?.lastName || "Unknown Doctor"}
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="text-2xs 2xl:text-xs text-gray-400">
                        Médecin Généraliste
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="text-2xs 2xl:text-xs font-bold">
                    Tarif {activeProcess?.tarif || "Tarif not available"}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            ) : (
              <DynamicHtmlTag type="div" className="date-picker w-full mt-4">
                <DynamicHtmlTag type="div" className="w-full">
                  <CustomDatePicker
                    selected={startDate}
                    onChange={(date: any) => handleDateOptionChange(date)}
                    todayButton="Aujourd'hui"
                    showTimeSelect
                    minDate={new Date()}
                  />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex items-center justify-center capitalize w-full gap-x-4 mt-2">
                  <DynamicHtmlTag type="div" className="flex items-center justify-center gap-x-1">
                    <DynamicHtmlTag type="span" className="bg-gradient-to-l from-sky-500 to-indigo-500 p-1 rounded-full"></DynamicHtmlTag>
                    <DynamicHtmlTag type="span" className="text-2xs xl:text-3xs 2xl:text-2xs">
                      date du jour
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex items-center justify-center gap-x-1">
                    <DynamicHtmlTag type="span" className="bg-gradient-to-r from-red-600 to-red-400 p-1 rounded-full"></DynamicHtmlTag>
                    <DynamicHtmlTag type="span" className="text-2xs xl:text-3xs 2xl:text-2xs">
                      date Sélectionnée
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            )}
          </DynamicHtmlTag>

          {allowedMotifSidebarPaths.includes(pathname) && (selectedMotifs?.length > 0 || otherMotifText) && (
            <DynamicHtmlTag
              type="div"
              className={`${viewportHeight < 850 ? "h-[100px]" : "h-[150px"} hidden lg:block bg-white rounded-lg p-3 lg:p-4 shadow-lg max-h-[200px] overflow-y-scroll`}>
              <HeadingTag type="h3" className="text-xs font-semibold text-center mb-2">
                MOTIFS
              </HeadingTag>
              <DynamicHtmlTag type="div" className="space-y-1">
                {selectedMotifs.map((motif, index) => (
                  <CustomButton key={index} className="w-full py-2 text-xs text-white bg-gradient-to-r from-pink-500 to-pink-400 rounded-full">
                    {typeof motif === "string" ? motif : motif.name}
                  </CustomButton>
                ))}
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="mt-4">
                {otherMotifText && (
                  <CustomTextarea
                    name="motif"
                    className="w-full h- px-2 py-2 border text-xs resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-black"
                    value={otherMotifText}
                    disabled={true}
                    readOnly
                  />
                )}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          )}
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      {/*Exit from Process Custom Modal Starts */}
      <CustomModal isOpen={isExitModalOpen} onClose={closeExitModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 p-4">
            <MdClose
              onClick={closeExitModal}
              className="absolute top-6 right-2 cursor-pointer text-blue border border-blue rounded-full w-6 h-6 p-1 hover:bg-primary hover:border-primary hover:text-white"
            />
            <HeadingTag type="h3" className="text-blue font-semibold text-base 2xl:text-xl/8 w-8/12 m-auto text-center mt-5">
              Êtes-vous sûre de vouloir quitter la prise de rendez-vous?
            </HeadingTag>
            <DynamicHtmlTag type="div" className="w-full flex flex-col md:flex-row md:gap-x-3 justify-center items-center md:items-start my-10">
              <CustomImage src="/images/danger-icon.svg" width={18} height={18} alt="danger" className="" />
              <HeadingTag type="h4" className="text-xs md:text-sm font-bold my-2 md:my-5 text-center">
                Attention, le créneau horaire ne sera pas reservé
              </HeadingTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex gap-x-10 justify-center mb-3">
              <CustomButton
                className={`cstm-btn view-more-btn btn btn-danger text-xs 2xl:text-sm font-semibold text-white py-2 px-3 rounded-full flex justify-center w-3/6 md:w-2/6`}
                onClick={closeExitModal}>
                ANNULER
              </CustomButton>
              <CustomButton
                onClick={closeExitModal}
                className={`cstm-btn view-more-btn btn btn-primary text-xs 2xl:text-sm font-semibold text-white py-2 px-3 rounded-full flex justify-center w-3/6 md:w-2/6`}>
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

export default SideBar;
