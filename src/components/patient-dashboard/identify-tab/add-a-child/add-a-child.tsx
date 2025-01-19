"use client";
import {
  CustomButton,
  CustomDatePicker,
  CustomForm,
  CustomFullScreenLoader,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomLoader,
  CustomModal,
  CustomSelect,
  DynamicHtmlTag,
  HeadingTag,
  VisioLogo,
} from "@/components";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import {
  selectalreadyHasPractionerUpdate,
  selectChildDetailsData,
  selectChildListSelect,
  selectdashboardProfileUpdate,
  selecthealthcardImage,
  selectPatientDetailsData,
  setChildDetailsData,
  setChildListSelect,
  setPatientDetailsData,
  setPatientSidebarDetails,
  setUpdateINTPatientError,
} from "@/store/reducers/patientDetailsSlice";
import {
  addChildSchema,
  addChildType,
  API_URL,
  genderListingApi,
  getCurrentDateOrFormateDate,
  getFormateDate,
  getFormateDatetwoDateformate,
  ListOption,
  Patient_Dashboard_Message,
  PatientIdentityError,
  UpdateIdentityPatientSchema,
} from "@/utility";
import {
  deleteNearbyPatientApi,
  getchildProfileApi,
  getNearbyChildlistApi,
  patientNearbyList,
  registerPatientNearby,
  updatePatientApi,
  updatePatientNearby,
} from "@/utility/apis/patient-dashboard";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlClose } from "react-icons/sl";
import { IoClose } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
const addChildParams = {
  id: "",
  firstName: "",
  lastName: "",
  birthdayDate: "",
  genre: "",
  weight: "",
  height: "",
  city: "",
};

const AddAChild = () => {
  const [addChild, setChild] = useState<addChildType>(addChildParams);

  const [birthdayDate, setBirthdayDate] = useState<Date>();
  const [gender, setGender] = useState<ListOption[]>([]);
  const [errors, setErrors] = useState<PatientIdentityError>({});
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const fetchChildDetailsData = useSelector(selectChildDetailsData);
  const dashboardProfileUpdate = useSelector(selectdashboardProfileUpdate);
  const fetchhealthcardImage = useSelector(selecthealthcardImage);

  const fetchChildListSelect = useSelector(selectChildListSelect);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [updatePatientError, setUpdatePatientError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState(0);

  const [editChild, setEditChild] = useState(false);
  const [childdataList, setChilddataList] = useState();
  const dispatch = useDispatch();
  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const alreadyHasPractionerUpdate = useSelector(selectalreadyHasPractionerUpdate);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleToggle = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const getPatientNearbyList = useCallback(async () => {
    try {
      const data = await patientNearbyList();
      dispatch(setChildDetailsData(data));
    } catch (error) {}
  }, [dispatch]);

  const getNearbyChildlist = useCallback(async () => {
    try {
      const data = await getNearbyChildlistApi(fetchPatientData?.id);
      dispatch(setChildListSelect(data));
    } catch (error) {}
  }, [dispatch, fetchPatientData]);

  const fetchGender = useCallback(async () => {
    try {
      const response = await genderListingApi();
      const genderOptions = response.data.map(gender => ({
        value: gender.code,
        label: gender.name,
      }));
      setGender(genderOptions);
    } catch (error) {
      setGender([]);
    }
  }, []);

  useEffect(() => {
    fetchGender();
    setErrors({});
    resetForm();
    getPatientNearbyList();
    if (fetchPatientData?.type === "Child") {
      setErrors({});
      resetForm();
      setEditChild(false);
      getNearbyChildlist();
    }
  }, [fetchGender, getPatientNearbyList, getNearbyChildlist, fetchPatientData]);

  const handleDateOptionChange = (date: any) => {
    setBirthdayDate(date);
    date = date ? getFormateDate(date, "YYYY-MM-DD") : "";
    setChild(prevState => ({ ...prevState, ["birthdayDate"]: date }));
  };
  const handleChildDetails = async (item: any) => {
    try {
      const response = await getchildProfileApi(item?.nearby?.id);
      setEditChild(true);
      setErrors({});
      const data = response?.data;
      if (data?.birthdayDate) {
        const [day, month, year] = data?.birthdayDate.split("/").map(Number);
        const parsedDate = new Date(year, month - 1, day);
        if (!isNaN(parsedDate.getTime())) setBirthdayDate(parsedDate);
        else {
        }
      }
      // Update the local state with the childList data
      setChild({
        id: item.id,
        city: data.city,
        firstName: data.firstName,
        lastName: data.lastName,
        birthdayDate: data.birthdayDate,
        genre: data.genre,
        weight: data.patientData.weight,
        height: data.patientData.height,
      });
    } catch (error) {}
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChild(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevState => ({ ...prevState, [name]: "" }));
  };

  const handleAddOrUpdateChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setRegisterError(null); // Reset previous errors
    try {
      // Show loading indicators
      // dispatch(showLoader("add-child"));
      setPageLoader(true);
      // Validate form data with schema
      await addChildSchema.validate(addChild, { abortEarly: false });
      const formattedBirthday = getFormateDatetwoDateformate(addChild.birthdayDate, "YYYY-MM-DD");
      // Prepare form data
      const formData = new FormData();
      formData.append("patientParentID", fetchPatientData?.id);
      formData.append("relationType", "ENFANT");
      formData.append("birthdayDate", formattedBirthday);
      formData.append("height", addChild?.height);
      formData.append("weight", addChild?.weight);
      formData.append("firstName", addChild?.firstName);
      formData.append("lastName", addChild?.lastName);
      formData.append("genre", addChild?.genre);
      // Update existing child if in edit mode; otherwise, add new child
      if (editChild) {
        formData.append("idNearby", addChild?.id);
        formData.append("city", addChild.city?.cityName);
        await updatePatientNearby(formData);
        setEditChild(false);
      } else {
        await registerPatientNearby(formData);
      }

      // Refresh list and reset form
      getPatientNearbyList();
      if (fetchPatientData?.type === "Child") {
        getNearbyChildlist();
      }
      resetForm();
    } catch (error: any) {
      // Handle validation errors
      const validationErrors = error.inner?.reduce(
        (acc: Record<string, string>, { path, message }: any) => ({
          ...acc,
          [path]: message,
        }),
        {}
      );
      setErrors(validationErrors || {});

      // Set API error message
      if (error?.response?.data?.message) {
        setRegisterError(error?.response?.data?.message);
      } else {
        setRegisterError("");
      }
    } finally {
      // Hide loading indicators
      //  dispatch(hideLoader());
      setPageLoader(false);
    }
  };
  const handleChildCancle = () => {
    resetForm();
    setEditChild(false);
  };
  // Reset form to default values
  const resetForm = () => {
    setChild(addChildParams);
    setBirthdayDate(undefined);
  };

  const handleUpdatePatient = async (e: any) => {
    e.preventDefault();
    setErrors({});
    resetForm();
    setEditChild(false);
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
      toast.success(Patient_Dashboard_Message.UpdateProfileMessage);

      if (fetchPatientData.type == "Child") {
        const updatedPatientData = await getchildProfileApi(fetchPatientData?.id);

        const updatedPatient = {
          ...fetchPatientData,
          updatedPatientData, // Set country to null if deleted
        };
        dispatch(setPatientSidebarDetails(updatedPatient));
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

  const deleteChildDetails = async (item: any) => {
    try {
      const formData = new FormData();
      formData.append("patientParentID", fetchPatientData?.id);
      formData.append("idNearby", item?.id);
      await deleteNearbyPatientApi(formData);
      getPatientNearbyList();
      getNearbyChildlist();
      closeEditModal();
      setErrors({});
      resetForm();
      setEditChild(false);
    } catch (error: any) {
      const validationErrors = error.inner?.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
      setErrors(validationErrors || {});

      if (error?.response?.data?.message) {
        setUpdatePatientError(error?.response?.data?.message);
      } else {
        setUpdatePatientError("");
      }
    } finally {
    }
  };
  return (
    <>
      {pageLoader && (
        <DynamicHtmlTag
          type="div"
          className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 backdrop-filter backdrop-blur-sm z-[99999999]">
          <CustomImage src={VisioLogo} alt="Logo" className="w-35 h-32 mb-4" width={250} height={200} />
          <DynamicHtmlTag type="p" className="text-white mb-4">
            Attendez, nous récupérons vos données ...
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="loader border-t-4 border-b-4 border-white h-12 w-12 rounded-full animate-spin"></DynamicHtmlTag>
        </DynamicHtmlTag>
      )}
      <DynamicHtmlTag
        type="div"
        className="w-full h-full lg:border lg:border-gray-200 lg:rounded-xl lg:overflow-auto lg:shadow-lg add-child-main-div pb-9 lg:pb-0">
        <CustomForm onSubmit={handleAddOrUpdateChild}>
          <DynamicHtmlTag type="div" className="lg:bg-sky-100 mb-5 lg:mb-2 p-1">
            <HeadingTag type="h4" className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug text-customBlue lg:text-center uppercase">
              {editChild ? "Éditer le ENFANT" : "AJOUTER UN ENFANT"}
            </HeadingTag>
          </DynamicHtmlTag>

          <DynamicHtmlTag type="div" className="lg:px-2 lg:py-2 pt-0">
            <DynamicHtmlTag type="div" className="lg:px-0 lg:py-0 pt-0">
              <DynamicHtmlTag type="div" className="flex mt-2 xl:mt-0 gap-x-2">
                <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
                  <DynamicHtmlTag type="div" className="flex items-center gap-x-2 justify-between">
                    <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none ">
                      Prénom{" "}
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </CustomLabel>
                    {errors.firstName && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                        {errors.firstName}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <CustomInput
                    value={addChild.firstName}
                    onChange={handleFieldChange}
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    className={`${errors.firstName ? "border-red-500" : ""} outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none rounded-md border border-gray-200 py-1 px-2 w-full`}
                  />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
                  <DynamicHtmlTag type="div" className="flex items-center gap-x-2 justify-between">
                    <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none">
                      Nom{" "}
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </CustomLabel>
                    {errors.lastName && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                        {errors.lastName}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <CustomInput
                    value={addChild.lastName}
                    onChange={handleFieldChange}
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    className={`${errors.lastName ? "border-red-500" : ""} outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none rounded-md border border-gray-200 py-1 px-2 w-full`}
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex mt-2 2xl:mt-4 gap-x-2">
                <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
                  <DynamicHtmlTag type="div" className="flex items-center gap-x-2 justify-between">
                    <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none w-full">
                      Date de naissance
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </CustomLabel>
                    {errors.birthdayDate && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1 w-16">
                        {errors.birthdayDate}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className={`form-date-picker date-picker flex items-center outline-none [&&]:text-2xs rounded-md border ${errors.birthdayDate ? "border-red-500" : "border-gray-200"} py-1 px-2`}>
                    <DynamicHtmlTag type="span" className="text-xs xl:text-3xs 2xl:text-xs 2xl:leading-tight xl:leading-none">
                      <CustomDatePicker
                        selected={birthdayDate}
                        maxDate={new Date()}
                        placeholderText="jj/mm/aaaa"
                        className={`${errors.birthdayDate ? "border-red-500" : ""} outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none rounded-md w-full`}
                        onChange={(date: any) => {
                          handleDateOptionChange(date);
                          // Clear the error message when the user selects a valid date
                          if (date) {
                            setErrors((prevErrors: any) => ({ ...prevErrors, birthdayDate: null }));
                          }
                        }}
                        dateFormat={"dd/MM/yyyy"}
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
                  <DynamicHtmlTag type="div" className="flex items-center gap-x-2 justify-between">
                    <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none">
                      Sexe
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </CustomLabel>
                    {errors.genre && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                        {errors.genre}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <CustomSelect
                    name="genre"
                    value={gender.find(option => option.value === addChild.genre) || null}
                    onChange={(selectedOption: ListOption) => {
                      setChild(prevState => ({ ...prevState, ["genre"]: selectedOption?.value ?? "" }));
                      if (selectedOption) {
                        setErrors((prevErrors: any) => ({ ...prevErrors, genre: null }));
                      }
                    }}
                    options={gender}
                    className={`${errors.genre ? "border-red-500" : ""} timing-select outline-none [&&]:text-2xs rounded-md border border-gray-200`}
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex mt-2 2xl:mt-4 gap-x-2">
                <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
                  <DynamicHtmlTag type="div" className="flex items-center gap-x-2 justify-between">
                    <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none">
                      Poids
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </CustomLabel>
                    {errors.weight && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                        {errors.weight}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className={`${errors.weight ? "border-red-500" : "border-gray-200"} rounded-md border py-1 px-2 flex items-center`}>
                    <CustomInput
                      name="weight"
                      type="number"
                      value={addChild.weight}
                      onChange={handleFieldChange}
                      placeholder="Poids"
                      className={`text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none w-11/12 outline-none pe-1`}
                    />
                    <DynamicHtmlTag type="span" className="text-[.5rem] opacity-50 xl:text-3xs 2xl:text-xs 2xl:leading-tight xl:leading-none ">
                      cm
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
                  <DynamicHtmlTag type="div" className="flex items-center gap-x-2 justify-between">
                    <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none">
                      Taille
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </CustomLabel>
                    {errors.height && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                        {errors.height}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className={`rounded-md border ${errors.height ? "border-red-500" : "border-gray-200"} py-1 px-2 flex items-center`}>
                    <CustomInput
                      name="height"
                      type="number"
                      value={addChild.height}
                      onChange={handleFieldChange}
                      placeholder="Taille"
                      className={`text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none w-11/12 outline-none pe-1`}
                    />
                    <DynamicHtmlTag type="span" className="text-[.5rem] opacity-50 xl:text-3xs 2xl:text-xs 2xl:leading-tight xl:leading-none ">
                      kg
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="border-b-2 flex mt-1 py-3 items-start justify-between">
                <CustomImage src="/images/add-child-bg-img.svg" alt="add-child-bg-img" width={200} height={150} className="w-3/5 lg:w-2/5" />
                {editChild ? (
                  <CustomButton
                    name="cancel" // Unique identifier for cancel button
                    type="button"
                    onClick={handleChildCancle}
                    className="btn-danger text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs font-semibold 2xl:leading-tight xl:leading-none w-2/6 lg:py-[.35rem] xl:py-2 text-white rounded-full me-1">
                    Annuler
                  </CustomButton>
                ) : (
                  ""
                )}
                <CustomButton
                  type="submit"
                  className="card-btn text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs font-semibold 2xl:leading-tight xl:leading-none w-2/6 lg:py-[.35rem] xl:py-2 text-white rounded-full">
                  {editChild ? "Modifier" : "Ajouter"}
                </CustomButton>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="text-2xs xl:text-3xs 2xl:text-xs 2xl:leading-tight xl:leading-none mt-2">
                Une fois votre enfant ajouté, pensez à compléter son dossier médical en cliquant sur{" "}
                <DynamicHtmlTag type="span" className="text-primary">
                  changer de patient
                </DynamicHtmlTag>{" "}
                pour vous mettre sur son profil.
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="p-1 lg:bg-sky-100 my-1 lg:-mx-2">
              {fetchPatientData?.type === "Child" ? (
                <HeadingTag
                  type="h5"
                  className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none lg:text-center text-customBlue uppercase">
                  VOS ENFANTS ({fetchChildListSelect?.data?.totalCount})
                </HeadingTag>
              ) : (
                <HeadingTag
                  type="h5"
                  className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none lg:text-center text-customBlue uppercase">
                  VOS ENFANTS ({fetchChildDetailsData?.data?.totalCount})
                </HeadingTag>
              )}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="lg:h-[13vh] 2xl:h-44 overflow-y-auto">
              {fetchPatientData?.type === "Child" ? (
                <DynamicHtmlTag type="div" className="grid grid-cols-3 gap-2 justify-start mt-3">
                  {fetchChildListSelect?.data?.results?.map((item: any, index: number) => (
                    <CustomButton
                      key={index}
                      type="button"
                      onClick={() => handleChildDetails(item)}
                      className="light-btn text-white rounded-full py-1 xl:py-2 px-2 text-2xs lg:text-3xs xl:text-xs xl:leading-none 2xl:leading-tight relative flex justify-between items-center">
                      {/* Display child's name */}
                      <DynamicHtmlTag
                        type="span"
                        className="line-clamp-1 w-[90%] text-3xs">{`${item?.nearby?.firstName || ""} ${item?.nearby?.lastName || ""}`}</DynamicHtmlTag>
                      {/* Cross (Delete) icon */}
                      <DynamicHtmlTag
                        type="span"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation(); // Prevent triggering `handleChildDetails`
                          setSelectedItem(item); // Store the selected item
                          openEditModal(); // Open the modal
                        }}
                        className="font-semibold text-white cursor-pointer"
                        aria-label="Delete">
                        <SlClose />
                      </DynamicHtmlTag>
                    </CustomButton>
                  ))}
                </DynamicHtmlTag>
              ) : (
                <DynamicHtmlTag type="div" className="grid grid-cols-3 gap-2 justify-start mt-3">
                  {fetchChildDetailsData?.data?.results?.map((item: any, index: number) => (
                    <CustomButton
                      key={index}
                      type="button"
                      onClick={() => handleChildDetails(item)}
                      className="light-btn text-white rounded-full py-1 xl:py-2 px-2 text-2xs xl:text-3xs 2xl:text-xs xl:leading-none 2xl:leading-tight relative flex justify-between items-center">
                      {/* Display child's name */}
                      <DynamicHtmlTag
                        type="span"
                        className="line-clamp-1 w-[90%] text-3xs">{`${item?.nearby?.firstName || ""} ${item?.nearby?.lastName || ""}`}</DynamicHtmlTag>
                      {/* Cross (Delete) icon */}
                      <DynamicHtmlTag
                        type="span"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation(); // Prevent triggering `handleChildDetails`
                          setSelectedItem(item); // Store the selected item
                          openEditModal(); // Open the modal
                        }}
                        className="font-semibold text-white cursor-pointer"
                        aria-label="Delete">
                        <SlClose />
                      </DynamicHtmlTag>
                    </CustomButton>
                  ))}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomForm>
        {registerError && (
          <DynamicHtmlTag type="div" className="text-red-500 font-semibold text-2xs mt-1">
            {registerError}
          </DynamicHtmlTag>
        )}
      </DynamicHtmlTag>

      <CustomForm onSubmit={handleUpdatePatient}>
        <CustomButton
          type="submit"
          className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none card-btn w-32 py-2 rounded-full font-semibold text-white ms-auto mt-4 hidden lg:block">
          Modifier
        </CustomButton>
        {updatePatientError && (
          <DynamicHtmlTag type="div" className="text-red-500 font-semibold text-2xs mt-1">
            {updatePatientError}
          </DynamicHtmlTag>
        )}
      </CustomForm>
      {/* Delete Modal Box */}
      <CustomModal isOpen={editModalOpen} onClose={closeEditModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 py-3 lg:py-6 px-4 lg:px-8">
            <HeadingTag type="h4" className="text-blue font-bold text-sm lg:text-lg xl:text-xl flex items-center justify-between gap-2 pl-2">
              Supression d{"'"}un enfant
              <CustomButton onClick={closeEditModal} type="button" className="w-fit inline-block custom-grey-btn p-0.5 rounded-full">
                <IoClose />
              </CustomButton>
            </HeadingTag>
            <DynamicHtmlTag
              type="div"
              className="text-blue py-8 px-2 w-11/12 lg:w-8/12 xl:w-10/12 text-center font-semibold text-sm lg:text-lg mx-auto">
              Êtes-vous sur de vouloir supprimer votre enfant:{" "}
              <DynamicHtmlTag type="span" className="capitalize">
                {selectedItem?.nearby?.firstName} {selectedItem?.nearby?.lastName} ?
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-2/3 flex items-center justify-center gap-3 mx-auto mt-4 lg:mt-6">
              <CustomButton
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation(); // Prevent triggering `handleChildDetails`
                  if (selectedItem) {
                    deleteChildDetails(selectedItem); // Use selectedItem for deletion
                  }
                }}
                type="button"
                className="card-btn text-sm py-1 px-4 rounded-full bg-gray-100 w-1/3 text-white capitalize">
                oui
              </CustomButton>
              <CustomButton
                onClick={closeEditModal}
                type="button"
                className="card-btn text-sm py-1 px-4 rounded-full bg-gray-100 w-1/3 text-white capitalize">
                non
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>
    </>
  );
};

export default AddAChild;
