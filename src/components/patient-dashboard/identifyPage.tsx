"use client";

import {
  CustomButton,
  CustomImage,
  DynamicHtmlTag,
  HeadingTag,
  IdentifyTab,
  MedecinTraitantTab,
  PersonToContact,
  SsnNumber,
  AddAChild,
  CustomFullScreenLoader,
  CustomForm,
} from "@/components";
import { RootState } from "@/store";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import {
  selectalreadyHasPractionerUpdate,
  selectdashboardProfileUpdate,
  selecthealthcardImage,
  selectPatientDetailsData,
  setPatientDetailsData,
  setUpdateINTPatientError,
} from "@/store/reducers/patientDetailsSlice";
import { API_URL, getCurrentDateOrFormateDate, getFormateDatetwoDateformate, getLocalStorageData, UpdateIdentityPatientSchema } from "@/utility";
import { getchildProfileApi, updatePatientApi } from "@/utility/apis/patient-dashboard";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Custom hook to detect if the screen size is mobile
function useMobileView() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px for lg breakpoint
    };

    // Initial check
    checkScreenSize();

    // Add resize event listener
    window.addEventListener("resize", checkScreenSize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile;
}

const tabs = [
  { label: "Identité", component: "IdentifyTab" },
  { label: "Médecin traitant", component: "MedecinTraitantTab" },
  { label: "Personne à contacter", component: "PersonToContact" },
  { label: "Sécurité Sociale et Mutuelle", component: "SsnNumber" },
  { label: "Ajouter un enfant", component: "AddAChild" },
];

const getComponent = (type: string) => {
  switch (type) {
    case "IdentifyTab":
      return <IdentifyTab />;
    case "MedecinTraitantTab":
      return <MedecinTraitantTab />;
    case "PersonToContact":
      return <PersonToContact />;
    case "SsnNumber":
      return <SsnNumber />;
    default:
      return <AddAChild />;
  }
};

const IdentifyPage = () => {
  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", false);
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useMobileView(); // Detect if the screen is mobile
  const loggedInUser = useSelector(selectLoginResponse);
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const dashboardProfileUpdate = useSelector(selectdashboardProfileUpdate);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const alreadyHasPractionerUpdate = useSelector(selectalreadyHasPractionerUpdate);
  const dispatch = useDispatch();
  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const [updatePatientError, setUpdatePatientError] = useState<string | null>(null);
  const fetchhealthcardImage = useSelector(selecthealthcardImage);

  const handleUpdatePatient = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

    // Helper function to append data to FormData if value is defined
    const appendField = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    };

    // Helper function to append file if URL exists
    const appendFileIfExists = async (field: string, url: string | undefined) => {
      if (url) {
        try {
          const response = await fetch(`${API_URL}${url}`);
          const blob = await response.blob();
          formData.append(field, blob, url.split("/").pop());
        } catch (error) {}
      }
    };

    // Function to append patient data
    const appendPatientData = () => {
      // Basic patient information
      if (fetchPatientData?.type === "Child" && fetchPatientData?.id) {
        formData.append("patientId", fetchPatientData.id);
      }
      appendField("email", fetchPatientData?.email);
      appendField("firstName", fetchPatientData?.firstName);
      appendField("lastName", fetchPatientData?.lastName);
      appendField("phone", fetchPatientData?.phone);
      appendField("genre", fetchPatientData?.genre);
      appendField("birthdayDate", getFormateDatetwoDateformate(fetchPatientData?.birthdayDate, "YYYY-MM-DD"));

      // Health data (height, weight)
      appendField("height", fetchPatientData?.patientData?.height);
      appendField("weight", fetchPatientData?.patientData?.weight);

      // Contact details and other fields
      appendField("country", fetchPatientData?.country);
      appendField("city", fetchPatientData?.city?.cityName);
      appendField("postalCode", fetchPatientData?.postalCode);
      appendField("postalAddress", fetchPatientData?.postalAddress);
      appendField("nationality", fetchPatientData?.nationality);

      // Contact Person Details
      appendField("countryContactPerson", fetchPatientData?.patientData?.countryContactPerson);
      appendField("postalCodeContactPerson", fetchPatientData?.patientData?.postalCodeContactPerson);
      appendField("cityContactPerson", fetchPatientData?.patientData?.cityContactPerson);
      appendField("phoneContactPerson", fetchPatientData?.patientData?.phoneContactPerson);
      appendField("firstNameContactPerson", fetchPatientData?.patientData?.firstNameContactPerson);
      appendField("lastNameContactPerson", fetchPatientData?.patientData?.lastNameContactPerson);
      appendField("emailContactPerson", fetchPatientData?.patientData?.emailContactPerson);

      // Health Complaint Dates
      appendField("healthComplNumber", fetchPatientData?.patientData?.healthComplNumber);
      appendField("healthComplStartDate", getCurrentDateOrFormateDate(fetchPatientData?.patientData?.healthComplStartDate));
      appendField("healthComplEndDate", getCurrentDateOrFormateDate(fetchPatientData?.patientData?.healthComplEndDate));

      // Social Security Number
      appendField("hasSocialSecurityNumber", fetchPatientData?.patientData?.hasSocialSecurityNumber);
      appendField("socialSecurityNumber", fetchPatientData?.patientData?.socialSecurityNumber);

      // Newsletter acceptance
      if (fetchPatientData?.patientData?.acceptNewsLetter !== undefined) {
        formData.append("acceptNewsLetter", fetchPatientData?.patientData?.acceptNewsLetter);
      }

      // Practitioner details
      if (alreadyHasPractionerUpdate?.personalPractitioner) {
        formData.append("personalPractionerId", alreadyHasPractionerUpdate?.personalPractitioner);
        formData.append("alreadyHasPractioner", "true");
      } else if (alreadyHasPractionerUpdate?.alreadyHasPractioner === false) {
        formData.append("alreadyHasPractioner", "false");
      } else if (fetchPatientData?.patientData?.personalPractitioner?.id) {
        formData.append("personalPractionerId", fetchPatientData?.patientData?.personalPractitioner?.id);
        formData.append("alreadyHasPractioner", "true");
      } else {
        formData.append("alreadyHasPractioner", "false");
      }

      // Spoken languages
      if (fetchPatientData?.spokenLanguages) {
        formData.append(
          "spokenLanguages",
          fetchPatientData.spokenLanguages.map((item: any) => item.id)
        );
      }
    };

    // Function to handle file uploads
    const appendFiles = async () => {
      // File Handling for Avatar and Health Complaints
      if (dashboardProfileUpdate instanceof File) {
        formData.append("avatar", dashboardProfileUpdate);
      } else {
        await appendFileIfExists("avatar", fetchPatientData?.avatar?.url);
      }

      if (fetchhealthcardImage instanceof File) {
        formData.append("healthCompl", fetchhealthcardImage);
      } else {
        await appendFileIfExists("healthCompl", fetchPatientData?.patientData?.healthCompl?.url);
      }
    };
    // Function to handle validation and errors
    const handleError = (err: any) => {
      // Handle Yup validation errors
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        dispatch(setUpdateINTPatientError(validationErrors));
      }
      // Handle API validation errors
      if (err.response?.data?.errorMessages) {
        const apiErrors = err.response.data.errorMessages.reduce((acc: any, { field, message }: any) => ({ ...acc, [field]: message }), {});
        // Handle API errors (you can store/display them as necessary)
      }
      // Handle generic errors
      const errorMessage = err.response?.data?.message;
      setUpdatePatientError(errorMessage);
    };
    try {
      await UpdateIdentityPatientSchema.validate(fetchPatientData, { abortEarly: false });
      // Step 1: Append data and files
      appendPatientData();
      await appendFiles();
      // Step 2: Show loader
      // Step 3: Validate the data using Yup schema
      dispatch(showLoader("update-patient"));
      // Step 4: Call the API to update the patient
      await updatePatientApi(formData);
      if (fetchPatientData.type == "Child") {
        const updatedPatientData = await getchildProfileApi(fetchPatientData?.id);
        const updatedPatient = {
          ...fetchPatientData,
          updatedPatientData, // Set country to null if deleted
        };
        // Dispatch the updated data to Redux store
        dispatch(setPatientDetailsData(updatedPatient));
      }
    } catch (err: any) {
      // Handle errors that occur during the process
      handleError(err);
    } finally {
      // Hide loader and reset page loading state
      dispatch(hideLoader());
    }
  };
  if (isLoading) {
    return <CustomFullScreenLoader />; // Render loader if loading
  }
  return (
    <>
      <DynamicHtmlTag type="div" className="items-center gap-x-2 ps-3 pb-2 hidden lg:flex">
        <CustomImage src="/images/top-identity-icon.svg" alt="top-identity-icon-icon" width={18} height={15} />
        <HeadingTag type="h2" className="text-black font-semibold [&&]:text-sm uppercase">
          IDENTITÉ
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="h-full patient-dashboard-select">
        <DynamicHtmlTag
          type="div"
          className={`gradient-main identity-main pt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 ${loggedInUser && isTeleconsultationBooked ? "small-height" : "identity-height"}`}>
          <DynamicHtmlTag
            type="div"
            className="flex flex-col lg:flex-row gap-1 lg:gap-5 bg-white h-full overflow-hidden pt-0 lg:pt-5 p-2 lg:p-5 rounded-b-xl relative">
            {/* Render tabs and content only for mobile */}
            {isMobile && (
              <>
                <DynamicHtmlTag type="div" className="identifyTabs flex border-b-2 border-sky-200 -mx-2 lg:hidden sticky top-0 z-50 bg-white">
                  {tabs.map((tab, index) => (
                    <React.Fragment key={index}>
                      <CustomButton
                        className={`tabs w-1/5 text-[6px] lg:text-2xs font-semibold ${index === activeTab ? "active-tab" : "non-active-tab"}`}
                        onClick={() => setActiveTab(index)}>
                        {tab.label}
                      </CustomButton>
                    </React.Fragment>
                  ))}
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="lg:hidden overflow-auto pb-5">
                  {tabs.map((tab, index) => (
                    <DynamicHtmlTag
                      type="div"
                      role="tabpanel"
                      className="tab-content lg:h-full"
                      key={index}
                      style={{ display: activeTab === index ? "block" : "none" }}>
                      <tab.component />
                      {getComponent(tab.component)}
                    </DynamicHtmlTag>
                  ))}
                </DynamicHtmlTag>
                {updatePatientError && (
                  <DynamicHtmlTag type="div" className="text-red-500 font-semibold text-2xs mt-1">
                    {updatePatientError}
                  </DynamicHtmlTag>
                )}
                <CustomForm onSubmit={handleUpdatePatient}>
                  <DynamicHtmlTag type="div" className="w-full lg:w-[95%] flex mt-auto absolute bottom-0 left-0 bg-white pb-2">
                    <CustomButton
                      type="submit"
                      className="[&&]:text-2xs card-btn w-32 py-1 rounded-full font-semibold text-white ms-auto mt-2 lg:mt-0">
                      Modifier
                    </CustomButton>
                  </DynamicHtmlTag>
                </CustomForm>
              </>
            )}

            {/* Render only for desktop */}
            <DynamicHtmlTag type="div" className="hidden lg:block h-full overflow-auto w-full lg:w-1/3 border border-gray-200 rounded-xl shadow-lg">
              <IdentifyTab />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="hidden lg:block h-full overflow-auto w-full lg:w-1/3 border border-gray-200 rounded-xl shadow-lg">
              <MedecinTraitantTab />
              {/* <PersonToContact /> */}
              <SsnNumber />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="hidden lg:flex flex-col w-full lg:w-1/3">
              <AddAChild />
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </>
    // <DynamicHtmlTag type="div" className="relative dashboard-identify-screen">
    // </DynamicHtmlTag>
  );
};

export default IdentifyPage;
