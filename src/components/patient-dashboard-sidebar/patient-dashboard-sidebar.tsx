"use client";
import React, { useCallback, useEffect, useState } from "react";
import { DynamicHtmlTag, CustomImage, CustomNav, CustomLink, HeadingTag, CustomSelect } from "@/components";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { getchildProfileApi, getPatientDeatils, patientNearbyList } from "@/utility/apis/patient-dashboard";
import { ChildListOption, getLocalStorageData, ListOption, setLocalStorageData } from "@/utility";
import {
  selectChildDetailsData,
  selectPatientDetailsData,
  selectPatientSidebarDetails,
  setChildDetailsData,
  setPatientSidebarDetails,
  setPatientDetailsData,
} from "@/store/reducers/patientDetailsSlice";

const PatientDashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname() || "";
  const loggedInUser = useSelector(selectLoginResponse);
  const [NearbyList, setNearbyList] = useState<ListOption[]>([]);
  const childDetailsData = useSelector(selectChildDetailsData);
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const fetchPatientSidebarDetails = useSelector(selectPatientSidebarDetails);
  const [currentPatientId, setCurrentPatientId] = useState(() => getLocalStorageData("PatientId", null)); // Initialize from local storage

  const dispatch = useDispatch();

  const getActiveRoute = (currentPath: string, linkPath: string, activeClass: string) => {
    return currentPath.startsWith(linkPath) ? activeClass : "";
  };
  const handleSidebarToggle = () => setIsOpen(prev => !prev);

  const fetchNearbyPatients = useCallback(async () => {
    try {
      const data = await patientNearbyList();
      dispatch(setChildDetailsData(data));
    } catch (error) {}
  }, [dispatch]);

  const fetchPatientDetails = useCallback(async () => {
    try {
      const data = await getPatientDeatils();
      setLocalStorageData("PatientId", data?.data.id);
      dispatch(setPatientDetailsData(data.data));
      dispatch(setPatientSidebarDetails(data.data));
    } catch (error) {}
  }, [dispatch]);

  const handlePatientChange = async (selectedOption: { value: string; label: string }) => {
    if (selectedOption.label === "Vous") {
      fetchPatientDetails();
    } else {
      try {
        const response = await getchildProfileApi(selectedOption.value);
        setLocalStorageData("PatientId", response?.data.id);
        dispatch(
          setPatientDetailsData({
            ...response.data,
            type: "Child",
          })
        );
        dispatch(
          setPatientSidebarDetails({
            ...response.data,
            type: "Child",
          })
        );
      } catch (error) {}
    }
  };

  const initializePatientData = useCallback(() => {
    if (currentPatientId) {
      handlePatientChange({
        value: currentPatientId,
        label:
          fetchPatientSidebarDetails?.type == "Child" ? `${fetchPatientSidebarDetails?.firstName} ${fetchPatientSidebarDetails?.lastName}` : "Vous",
      });
    }
  }, [currentPatientId]);
  useEffect(() => {
    const patientId = getLocalStorageData("PatientId", null);
    if (!patientId) {
      fetchPatientDetails(); // This will trigger the fetchPatientData if no PatientId in localStorage
    }
  }, [fetchPatientDetails]);

  useEffect(() => {
    fetchNearbyPatients();
    setIsOpen(false);
  }, [pathName, fetchNearbyPatients]);

  useEffect(() => {
    initializePatientData();
  }, [initializePatientData]);

  useEffect(() => {
    if (childDetailsData) {
      const options: ChildListOption[] = childDetailsData.data.results.map((item: any) => ({
        value: `${item.nearby.id}`,
        label: `${item.nearby.firstName} ${item.nearby.lastName}`,
      }));
      setNearbyList([{ value: "Vous", label: "Vous" }, ...options]);
    }
  }, [childDetailsData]);
  const Selectlabel = {
    label: fetchPatientSidebarDetails?.type == "Child" ? `${fetchPatientSidebarDetails?.firstName} ${fetchPatientSidebarDetails?.lastName}` : "Vous",
  };
  return (
    <DynamicHtmlTag type="div" className="relative mb-2 lg:mb-0 h-full">
      <HeadingTag type="h1" className="text-black font-semibold text-sm text-center pb-2 sm:hidden lg:block">
        TABLEAU DE BORD
      </HeadingTag>
      <DynamicHtmlTag type="div" className="patient-gradient gradient-main pt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 lg:h-full">
        <DynamicHtmlTag
          type="div"
          className="bg-white flex flex-col lg:min-h-full text-center pb-0 lg:pb-2 rounded-b-lg sidebar-main lg:h-full relative justify-between">
          <DynamicHtmlTag type="div">
            <DynamicHtmlTag
              type="div"
              className="flex items-center justify-between gap-1 lg:block px-2 md:px-5 border-b border-indigo-500 lg:border-b-0">
              <DynamicHtmlTag type="div" className="flex items-center lg:block text-center pt-1 2xl:pt-4 pb-1 2xl:pb-4 gap-2 md:gap-3">
                <DynamicHtmlTag type="span" className="rounded-full border border-black p-1 2xl:p-2 inline-block">
                  <CustomImage
                    src={
                      fetchPatientSidebarDetails?.avatar
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${fetchPatientSidebarDetails?.avatar?.url}`
                        : "/images/quiz-profile.svg"
                    }
                    alt="quiz-profile"
                    width={80}
                    height={80}
                    className="img-fluid rounded-full w-6 xl:w-16 2xl:w-20 h-6 xl:h-16 2xl:h-20"
                  />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="p" className="text-center text-2xs md:text-sm xl:text-xs 2xl:text-sm text-black font-semibold">
                  {fetchPatientSidebarDetails
                    ? `${fetchPatientSidebarDetails?.firstName} ${fetchPatientSidebarDetails?.lastName}`
                    : `${loggedInUser?.data?.firstName} ${loggedInUser?.data?.lastName}`}
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="inline-block patient-dashboard-dropdown w-6/12 lg:w-9/12">
                <CustomSelect
                  options={NearbyList}
                  // defaultValue={ChangePatient[0]} // Set default value here
                  onChange={handlePatientChange}
                  value={Selectlabel}
                  isSearchable={false}
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="main-patient-side-menu mt-0 lg:mt-2 2xl:mt-5 rounded-b-lg lg:rounded-b-none">
              <CustomNav
                defaultActiveKey="/patient-dashboard/welcome"
                className="flex-row lg:flex-col justify-between lg:justify-normal gap-0 xl:gap-1 2xl:gap-2 px-0 md:px-3 lg:px-0 overflow-x-scroll lg:overflow-hidden pb-1 2xl:pb-3 bg-white rounded-b-lg lg:rounded-b-none">
                <CustomLink
                  href="/patient-dashboard/welcome"
                  className={`min-w-10 lg:min-w-full py-0.5 xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-lg 2xl:rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-col lg:flex-row gap-0 lg:gap-3 justify-center lg:justify-normal text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/patient-dashboard/welcome", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-5 2xl:w-8 h-5 2xl:h-8 flex items-center justify-center">
                    <CustomImage src="/images/home-icon.svg" alt="welcome" width={18} height={18} className="w-3 h-3 max-w-max" />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Accueil
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/patient-dashboard/identify"
                  className={`min-w-12 lg:min-w-full py-0.5 xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-lg 2xl:rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-col lg:flex-row gap-0 lg:gap-3 justify-center lg:justify-normal text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/patient-dashboard/identify", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-5 2xl:w-8 h-5 2xl:h-8 flex items-center justify-center">
                    <CustomImage src="/images/top-identity-icon.svg" alt="identity" width={18} height={18} className="w-3 h-3 max-w-max" />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Identité
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/patient-dashboard/medical-profile"
                  className={`min-w-[70px] lg:min-w-full py-0.5 xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-lg 2xl:rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-col lg:flex-row gap-0 lg:gap-3 justify-center lg:justify-normal text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/patient-dashboard/medical-profile", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-5 2xl:w-8 h-5 2xl:h-8 flex items-center justify-center">
                    <CustomImage src="/images/profile-medical.svg" alt="medical-profile" width={18} height={18} className="w-3 h-3 max-w-max" />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Profil médical
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/patient-dashboard/documents"
                  className={`min-w-12 lg:min-w-full py-0.5 xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-lg 2xl:rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-col lg:flex-row gap-0 lg:gap-3 justify-center lg:justify-normal text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/patient-dashboard/documents", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-5 2xl:w-8 h-5 2xl:h-8 flex items-center justify-center">
                    <CustomImage src="/images/document-menu-icon.svg" alt="documents-icon" width={18} height={18} className="w-3 h-3 max-w-max" />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Documents
                  </DynamicHtmlTag>
                </CustomLink>
                <CustomLink
                  href="/patient-dashboard/teleconsultations"
                  className={`lg:min-w-full py-0.5 xl:py-1 px-1 xl:px-3 2xl:px-4 rounded-lg 2xl:rounded-xl font-semibold border-[0.15rem] border-transparent flex flex-col lg:flex-row gap-0 lg:gap-3 justify-center lg:justify-normal text-3xs xl:text-2xs 2xl:text-xs items-center ${getActiveRoute(pathName, "/patient-dashboard/teleconsultations", "menu-active")}`}>
                  <DynamicHtmlTag
                    type="div"
                    className="patient-custom-grey-btn rounded-full w-5 2xl:w-8 h-5 2xl:h-8 flex items-center justify-center">
                    <CustomImage src="/images/tele-menu-icon.svg" alt="teleconsultation-icon" width={18} height={18} className="w-3 h-3 max-w-max" />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="quiz-side-text text-blue">
                    Téléconsultations
                  </DynamicHtmlTag>
                </CustomLink>
              </CustomNav>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="text-center pt-0 2xl:pt-3 hidden lg:block">
            <CustomImage
              src="/images/logos/chatboot.png"
              alt="octopus-icon"
              width={80}
              height={80}
              className="w-20 2xl:w-36 h-20 2xl:h-36 m-auto max-w-max"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default PatientDashboardSidebar;
