"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  CustomAsyncSelect,
  CustomForm,
  CustomDatePicker,
  DynamicHtmlTag,
  CustomButton,
  CustomImage,
  CustomLink,
  HeadingTag,
  CustomInput,
  CustomLabel,
  PhoneInputWithCountry,
  CustomModal,
} from "@/components";
import { useRouter } from "next/navigation";
import {
  ListOption,
  CityPostListOption,
  PractitionerListOption,
  searchPractitionerByPatternApi,
  CreateMedicalDataRequest,
  PatientMedicalDataError,
  getFormateDate,
  countryListingApi,
  cityAutoCompleteApi,
  postalCodeAutoCompleteApi,
  createMedicalDataPatientSchema,
  createPatientFileSchema,
  recordablePatientStepTwo,
} from "@/utility";
import { selectCreatePatientData, setCreatePatientData } from "@/store/reducers/createPatientsSlice";
import { MdClose, MdDelete } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { RootState } from "@/store";
import { closeModal, openModal, resetModal } from "@/store/reducers/modalSlice";

interface PractitionerProps {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  genre?: string;
  city?: any;
}

const createMedicalDataParams = {
  personalPractitioner: "",
  personalPractitionerCity: "",
  personalPractitionerPostcode: "",
  firstNameContactPerson: "",
  lastNameContactPerson: "",
  emailContactPerson: "",
  phoneContactPerson: "",
  postalAddressContactPerson: "",
  countryContactPerson: "",
  cityContactPerson: "",
  healthComplNumber: "",
  healthComplStartDate: "",
  healthComplEndDate: "",
  healthCompl: "",
  hasSocialSecurityNumber: false,
  socialSecurityNumber: "",
};

export default function MedicalData() {
  const router = useRouter();
  const dispatch = useDispatch();
  const createPatientData = useSelector(selectCreatePatientData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageTypes = ["image/png", "image/jpg", "image/jpeg"];

  const [searchPractitionerList, setSearchPractitionerList] = useState<PractitionerListOption[]>([]);
  const [createMedicalData, setCreateMedicalData] = useState<CreateMedicalDataRequest>(createMedicalDataParams);
  const [errors, setErrors] = useState<PatientMedicalDataError>({});
  const [defaultCountryOptions, setDefaultCountryOptions] = useState<ListOption[]>([]);
  const [defaultCityOptions, setDefaultCityOptions] = useState<ListOption[]>([]);
  const [defaultPostalCodeOptions, setDefaultPostalCodeOptions] = useState<ListOption[]>([]);
  const [isCityDisable, setIsCityDisable] = useState<boolean>(true);
  const [isPostalCodeDisable, setIsPostalCodeDisable] = useState<boolean>(true);
  const [healthPreviewImage, setHealthPreviewImage] = useState<string | null>(null);
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [medicalError, setMedicalError] = useState<string>("");

  const modalType = useSelector((state: RootState) => state.modal.modalType);

  // If identity step form is not filled
  useEffect(() => {
    if (!createPatientData || (createPatientData && !createPatientData.createIdentity)) {
      router.push("/create-patient/identity");
    }
  }, []);

  useEffect(() => {
    if (createPatientData?.createMedicalData) {
      setSearchPractitionerList(
        createPatientData.createMedicalData?.personalPractitioner ? [createPatientData.createMedicalData.personalPractitioner] : []
      );
      setDefaultCountryOptions(
        createPatientData.createMedicalData?.countryContactPerson ? [createPatientData.createMedicalData.countryContactPerson] : []
      );
      setDefaultCityOptions(createPatientData.createMedicalData.cityContactPerson ? [createPatientData.createMedicalData.cityContactPerson] : []);
      setDefaultPostalCodeOptions(
        createPatientData.createMedicalData.postalCodeContactPerson ? [createPatientData.createMedicalData.postalCodeContactPerson] : []
      );
      setCreateMedicalData(createPatientData.createMedicalData);
      setIsCityDisable(!createPatientData.createMedicalData?.countryContactPerson);
      setIsPostalCodeDisable(!createPatientData.createMedicalData?.countryContactPerson);

      if (createPatientData?.createMedicalData?.healthCompl?.name) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (imageTypes.includes(createPatientData.createMedicalData.healthCompl.type)) {
            setHealthPreviewImage(reader.result as string);
          } else {
            setHealthPreviewImage("/images/paper-doc.svg");
          }
        };
        reader.readAsDataURL(createPatientData.createMedicalData.healthCompl);
      }
    }
  }, []);

  const handleSearchCountry = async (inputValue: string) => {
    if (inputValue.length < 3) {
      return [];
    }

    try {
      const response = await countryListingApi(inputValue);
      const countryOptionsList = response.data.results.map((country: any) => ({
        value: country.id.toString(),
        label: country.countryName,
      }));
      setDefaultCountryOptions(countryOptionsList);
      return countryOptionsList;
    } catch (error) {
      return [];
    }
  };

  const handleCountryChange = async (countryObject: ListOption | null) => {
    if (countryObject) {
      setIsCityDisable(false);
    } else {
      setIsCityDisable(true);
    }
    setIsPostalCodeDisable(true);
    setDefaultCityOptions([]);
    setDefaultPostalCodeOptions([]);

    setCreateMedicalData(prevState => ({ ...prevState, ["countryContactPerson"]: countryObject }));
    setCreateMedicalData(prevState => ({ ...prevState, ["cityContactPerson"]: null }));
    setCreateMedicalData(prevState => ({ ...prevState, ["postalCodeContactPerson"]: null }));
  };

  const handleSearchCity = async (inputValue: string, countryId: number) => {
    if (inputValue.length < 3 || countryId === null) {
      return [];
    }

    try {
      const response = await cityAutoCompleteApi(inputValue, countryId);
      const cityOptionsList = response.data.results.map((city: any) => ({
        value: city.cityName,
        label: `${city.cityName} - ${city.cityZipCode}`,
        postalCode: city.cityZipCode,
      }));
      setDefaultCityOptions(cityOptionsList);
      return cityOptionsList;
    } catch (error) {
      return [];
    }
  };

  const handleCityChange = (cityObject: CityPostListOption | null) => {
    if (cityObject && createMedicalData?.countryContactPerson) {
      setIsPostalCodeDisable(false);
      const postalCodeObject = {
        value: cityObject?.postalCode ?? "",
        label: `${cityObject?.postalCode} - ${cityObject?.value}`,
        cityName: cityObject?.value ?? "",
      };
      setDefaultPostalCodeOptions([postalCodeObject]);
      setCreateMedicalData(prevState => ({ ...prevState, ["postalCodeContactPerson"]: postalCodeObject }));
    } else {
      setIsPostalCodeDisable(true);
      setDefaultPostalCodeOptions([]);
      setCreateMedicalData(prevState => ({ ...prevState, ["postalCodeContactPerson"]: null }));
    }

    setCreateMedicalData(prevState => ({ ...prevState, ["cityContactPerson"]: cityObject }));
  };

  const handleSearchPostalCode = async (inputValue: string, countryId: number) => {
    if (inputValue.length < 3 || countryId === null) {
      return [];
    }

    try {
      const response = await postalCodeAutoCompleteApi(inputValue, countryId);
      const postalCodeOptionsList: ListOption[] = response?.data?.results?.map((code: any) => ({
        value: code.cityZipCode,
        label: `${code.cityZipCode} - ${code.cityName}`,
        cityName: code.cityName,
      }));
      setDefaultPostalCodeOptions(postalCodeOptionsList);
      return postalCodeOptionsList;
    } catch (error) {
      return [];
    }
  };

  const handlePostalCodeChange = (postalCode: CityPostListOption | null) => {
    setCreateMedicalData(prevState => ({ ...prevState, ["postalCodeContactPerson"]: postalCode }));
    if (postalCode) {
      const cityObject = {
        value: postalCode?.cityName ?? "",
        label: `${postalCode?.cityName} - ${postalCode?.value}`,
        postalCode: postalCode?.value,
      };
      setDefaultCityOptions([cityObject]);
      setCreateMedicalData(prevState => ({ ...prevState, ["cityContactPerson"]: cityObject }));
    }
  };

  // Function to Fetch Practitioner List by Pattern from API
  const searchPractitionersByPattern = async (search: string) => {
    if (search.length < 3) {
      return;
    }

    try {
      const data = await searchPractitionerByPatternApi(0, 25, search);
      const practitioners = data.data.results.map((practitioner: PractitionerProps) => {
        return {
          value: practitioner.id,
          label: `${practitioner.firstName} ${practitioner.lastName}`,
          city: `${practitioner?.city?.cityName}`,
          postCode: `${practitioner?.city?.cityZipCode}`,
        };
      });
      setSearchPractitionerList(practitioners);
      return practitioners;
    } catch (error) {
      // handle error
    } finally {
      // Nothing
    }
  };

  const handlePractitionerChange = (practitionerObject: any) => {
    setCreateMedicalData(prevState => ({ ...prevState, ["personalPractitioner"]: practitionerObject ?? null }));
    setCreateMedicalData(prevState => ({ ...prevState, ["personalPractitionerCity"]: practitionerObject?.city ?? "" }));
    setCreateMedicalData(prevState => ({ ...prevState, ["personalPractitionerPostcode"]: practitionerObject?.postCode ?? "" }));
  };

  // Handle field changes
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateMedicalData(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevState => ({ ...prevState, [name]: "" }));
  };

  // Datetime picker change event
  const handleDateOptionChange = (name: string, date: any) => {
    date = date ? getFormateDate(date, "YYYY-MM-DD") : "";
    setCreateMedicalData(prevState => ({ ...prevState, [name]: date }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setHealthPreviewImage("");
    const file = e.target.files?.[0];
    if (file) {
      try {
        await createPatientFileSchema.validate({ file }, { abortEarly: false });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (imageTypes.includes(file.type)) {
            setHealthPreviewImage(reader.result as string);
          } else {
            setHealthPreviewImage("/images/paper-doc.svg");
          }
        };
        reader.readAsDataURL(file);
        setCreateMedicalData(prevState => ({ ...prevState, ["healthCompl"]: file ?? "" }));
      } catch (err: any) {
        if (err.inner) {
          const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
          setErrors(validationErrors);
        }
      } finally {
        // Nothing
      }
    }
  };

  // Handle Create Patient Identity Form
  const handleCreatePatientMedicalData = async (e: any) => {
    e.preventDefault();
    setErrors({});
    try {
      const model = {
        socialSecurityNumber: createMedicalData.socialSecurityNumber,
      };
      await recordablePatientStepTwo(model);
      router.push("/create-patient/general-conditions");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message;
      setMedicalError(errorMessage);
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setErrors(validationErrors);
      }
    }
    try {
      await createMedicalDataPatientSchema.validate(createMedicalData, { abortEarly: false });
      dispatch(setCreatePatientData({ ...createPatientData, createMedicalData }));
      //router.push("/create-patient/general-conditions");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message;
      toast.error(errorMessage);

      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setErrors(validationErrors);
      }
    } finally {
      // Nothing
    }
  };

  const handleSkipMedicalData = () => {
    router.push("/create-patient/general-conditions");
  };

  const handleDeleteHealthCompl = () => {
    setHealthPreviewImage("");
    setCreateMedicalData(prevState => ({ ...prevState, ["healthCompl"]: "" }));
  };

  const handleViewHealthCompl = () => {
    if (createMedicalData?.healthCompl?.name) {
      const newTab: any = window.open();
      const reader = new FileReader();
      reader.onloadend = () => {
        if (imageTypes.includes(createMedicalData.healthCompl.type)) {
          newTab.document.body.innerHTML = `<img src=${reader.result as string}>`;
        } else {
          newTab.document.body.innerHTML = `<iframe width='100%' height='100%' src=${reader.result as string}></iframe>`;
        }
      };
      reader.readAsDataURL(createMedicalData.healthCompl);
    }
  };

  const openShowPreviewModal = () => {
    setPreviewImage(null);
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("showPreviewImage")));
  };

  const closeShowPreviewModal = () => {
    setPreviewImage(null);
    dispatch(closeModal());
  };

  return (
    <DynamicHtmlTag type="div" className="md:px-5 situation-screen-main h-full medical-data-screen 2xl:mt-4">
      <CustomForm onSubmit={handleCreatePatientMedicalData}>
        <DynamicHtmlTag type="div" className="flex flex-col md:flex-row gap-x-10">
          <DynamicHtmlTag type="div" className="w-full xl:w-1/2 flex flex-col gap-5">
            <DynamicHtmlTag type="div" className="flex flex-col">
              <HeadingTag type="h4" className="text-sm 2xl:text-base text-primary font-bold">
                Médecin traitant
              </HeadingTag>
              <DynamicHtmlTag type="div" className="mt-0 2xl:mt-1">
                <DynamicHtmlTag type="div" className="flex justify-between">
                  <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                    Nom &emsp; Prénom
                    <br />
                    <DynamicHtmlTag type="span" className="text-red-500 hidden">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.personalPractitioner && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                      {errors.personalPractitioner}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <CustomAsyncSelect
                  name="personalPractionerId"
                  value={createMedicalData?.personalPractitioner}
                  onChange={(practitionerObject: any) => handlePractitionerChange(practitionerObject)}
                  defaultOptions={searchPractitionerList}
                  loadOptions={searchPractitionersByPattern}
                  placeholder="Rechercher un médecin"
                  isClearable
                  cacheOptions
                  noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucun médecin n’a été trouvé")}
                  className={`w-full p-2 countries-select text-xs text-black placeholder-black rounded-lg mb-1 border ${errors.personalPractitioner ? "border-red-500" : "border-gray-400"}`}
                />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex flex-col xl:flex-row justify-between gap-x-5 mt-0 2xl:mt-1">
                <DynamicHtmlTag type="div" className="w-full">
                  <DynamicHtmlTag type="div" className="flex justify-between">
                    <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                      Ville
                      <DynamicHtmlTag type="span" className="text-red-500 hidden">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    {errors.personalPractitionerCity && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                        {errors.personalPractitionerCity}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <CustomLabel
                    className={`w-full input border ${errors.personalPractitionerCity ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                    <CustomInput
                      type="text"
                      name="personalPractitionerCity"
                      value={createMedicalData?.personalPractitionerCity}
                      onChange={handleFieldChange}
                      className={`grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs`}
                      placeholder="Ville"
                    />
                  </CustomLabel>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full">
                  <DynamicHtmlTag type="div" className="flex justify-between">
                    <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                      Code postal
                      <DynamicHtmlTag type="span" className="text-red-500 hidden">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    {errors.personalPractitionerPostcode && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                        {errors.personalPractitionerPostcode}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <CustomLabel
                    className={`w-full input border ${errors.personalPractitionerPostcode ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                    <CustomInput
                      type="text"
                      name="personalPractitionerPostcode"
                      value={createMedicalData?.personalPractitionerPostcode}
                      onChange={handleFieldChange}
                      className={`grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs`}
                      placeholder="Code Postal"
                    />
                  </CustomLabel>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>

            <DynamicHtmlTag type="div" className="flex justify-between items-end gap-x-5 mt-3 lg:mt-1">
              <DynamicHtmlTag type="div" className="w-10/12">
                <HeadingTag type="h4" className="text-sm 2xl:text-base text-primary font-bold">
                  Sécurité sociale
                </HeadingTag>
                <DynamicHtmlTag type="div" className="flex justify-between mt-0 2xl:mt-1">
                  <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                    Numéro de sécurité sociale
                    <DynamicHtmlTag type="span" className="text-red-500 hidden">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.personalPractitionerPostcode ? (
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                      {errors.personalPractitionerPostcode}
                    </DynamicHtmlTag>
                  ) : (
                    <DynamicHtmlTag type="div" className="text-2xs font-semibold">
                      {"15 caractères"}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <CustomLabel
                  className={`w-full input border ${errors.personalPractitionerCity ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                  <CustomInput
                    type="number"
                    name="socialSecurityNumber"
                    value={createMedicalData?.socialSecurityNumber}
                    onChange={handleFieldChange}
                    className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 font-medium text-xs placeholder-black"
                    placeholder="Numéro"
                  />
                </CustomLabel>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-2/12 flex align-bottom xl:ps-5">
                <CustomImage src="/images/validate-doc.svg" alt="validate-doc" width={60} height={25} />
              </DynamicHtmlTag>
            </DynamicHtmlTag>

            <DynamicHtmlTag type="div" className="flex justify-between items-center gap-x-5 mt-3 lg:mt-1">
              <DynamicHtmlTag type="div" className="w-7/12 xl:w-9/12">
                <HeadingTag type="h4" className="text-sm 2xl:text-base text-primary font-bold">
                  Mutuelle
                </HeadingTag>
                <DynamicHtmlTag type="div" className="form-group mt-0 2xl:mt-1">
                  <DynamicHtmlTag type="div" className="flex justify-between">
                    <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                      Numéro de la carte
                      <DynamicHtmlTag type="span" className="text-red-500 hidden">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    {errors.healthComplNumber && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                        {errors.healthComplNumber}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <CustomLabel
                    className={`w-full input border ${errors.personalPractitionerCity ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                    <CustomInput
                      type="text"
                      name="healthComplNumber"
                      value={createMedicalData?.healthComplNumber}
                      onChange={handleFieldChange}
                      className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 font-medium text-xs placeholder-black"
                      placeholder="Numéro"
                    />
                  </CustomLabel>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex flex-col xl:flex-row justify-between gap-x-5 mt-0 2xl:mt-2">
                  <DynamicHtmlTag type="div" className="form-group w-full">
                    <DynamicHtmlTag type="div" className="flex justify-between">
                      <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                        Date de début
                        <DynamicHtmlTag type="span" className="text-red-500 hidden">
                          *
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      {errors.healthComplStartDate && (
                        <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                          {errors.healthComplStartDate}
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                    <DynamicHtmlTag
                      type="div"
                      className={`date-picker relative flex items-center space-x-2 text-xs grow w-full input border register-field border-gray-400 p-2 gap-2 rounded-lg mb-1`}>
                      <CustomDatePicker
                        selected={createMedicalData?.healthComplStartDate}
                        dateFormat={"dd.MM.yyyy"}
                        onChange={(date: any) => handleDateOptionChange("healthComplStartDate", date)}
                        todayButton="Aujourd'hui"
                        placeholderText="jj/mm/aaaa"
                        className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs"
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="form-group w-full">
                    <DynamicHtmlTag type="div" className="flex justify-between">
                      <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                        Date de fin
                        <DynamicHtmlTag type="span" className="text-red-500 hidden">
                          *
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      {errors.healthComplStartDate && (
                        <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                          {errors.healthComplStartDate}
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                    <DynamicHtmlTag
                      type="div"
                      className={`date-picker relative flex items-center space-x-2 text-xs grow w-full input border register-field border-gray-400 p-2 gap-2 rounded-lg mb-1`}>
                      <CustomDatePicker
                        selected={createMedicalData?.healthComplEndDate}
                        dateFormat={"dd.MM.yyyy"}
                        onChange={(date: any) => handleDateOptionChange("healthComplEndDate", date)}
                        todayButton="Aujourd'hui"
                        placeholderText="jj/mm/aaaa"
                        className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs"
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag
                type="div"
                className="w-5/12 xl:w-3/12 flex items-center justify-around xl:justify-center pt-5 lg:pt-0 gap-3 flex-col-reverse lg:flex-col">
                {healthPreviewImage ? (
                  <DynamicHtmlTag type="div" className="relative group">
                    <CustomImage src={healthPreviewImage} alt="preview" width={120} height={60} className="w-20 h-20" />
                    <DynamicHtmlTag
                      type="div"
                      className="justify-center items-center gap-4 absolute top-0 bottom-0 left-0 right-0 transition-all duration-75 ease-linear bg-blend-darken bg-[#00000080] hidden group-hover:flex">
                      <CustomButton type="button" href="" onClick={openShowPreviewModal} className="text-white">
                        <IoMdEye />
                      </CustomButton>
                      <CustomLink href="" onClick={handleDeleteHealthCompl} className="text-white">
                        <MdDelete />
                      </CustomLink>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                ) : (
                  <CustomImage src="/images/mutual-img.svg" alt="mutual-doc" width={120} height={60} className="w-20 h-20" />
                )}
                {/* This image for document attach */}
                {/* <CustomImage src="/images/paper-doc.svg" alt="paper-doc" width={120} height={60} className="w-1/2 xl:w-7/12" /> */}
                <CustomButton
                  className={`text-xs cstm-btn mx-auto xl:mt-auto flex py-2 px-1 justify-center w-full view-more-btn rounded-xl text-white font-semibold`}
                  onClick={() => fileInputRef.current?.click()}>
                  Importer
                </CustomButton>
                <CustomInput type="file" ref={fileInputRef} id="fileInput" className="hidden" onChange={handleFileChange} />
                {errors.file && (
                  <DynamicHtmlTag type="div" className="text-red-500 font-bold text-xs text-center mt-2">
                    {errors.file}
                  </DynamicHtmlTag>
                )}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="w-full xl:w-1/2">
            <HeadingTag type="h4" className="text-sm 2xl:text-base text-primary font-bold">
              Personne à contacter en cas d’urgence
            </HeadingTag>
            <DynamicHtmlTag type="div" className="flex flex-col xl:flex-row justify-between gap-x-5 mt-0 2xl:mt-1">
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between">
                  <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                    Prénom
                    <DynamicHtmlTag type="span" className="text-red-500 hidden">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.personalPractitionerCity && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                      {errors.personalPractitionerCity}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                {/* <CustomLabel className="text-xs">Prénom</CustomLabel> */}
                <CustomLabel
                  className={`w-full input border ${errors.firstNameContactPerson ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                  <CustomInput
                    type="text"
                    name="firstNameContactPerson"
                    className={`grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs`}
                    placeholder="Prenom"
                    value={createMedicalData.firstNameContactPerson}
                    onChange={handleFieldChange}
                  />
                </CustomLabel>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between">
                  <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                    Nom
                    <DynamicHtmlTag type="span" className="text-red-500 hidden">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.personalPractitionerCity && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                      {errors.personalPractitionerCity}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                {/* <CustomLabel className="text-xs">Nom</CustomLabel> */}
                <CustomLabel
                  className={`w-full input border ${errors.lastNameContactPerson ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                  <CustomInput
                    type="text"
                    name="lastNameContactPerson"
                    className={`grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs`}
                    placeholder="Nom"
                    value={createMedicalData.lastNameContactPerson}
                    onChange={handleFieldChange}
                  />
                </CustomLabel>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="mt-0 2xl:mt-1">
              <DynamicHtmlTag type="div" className="flex justify-between">
                <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                  Pays
                  <DynamicHtmlTag type="span" className="text-red-500 hidden">
                    *
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                {errors.countryContactPerson && (
                  <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                    {errors.countryContactPerson}
                  </DynamicHtmlTag>
                )}
              </DynamicHtmlTag>
              <CustomAsyncSelect
                name="country"
                value={createMedicalData?.countryContactPerson}
                onChange={handleCountryChange}
                defaultOptions={defaultCountryOptions}
                loadOptions={handleSearchCountry}
                placeholder="Rechercher un pays"
                isClearable
                cacheOptions
                noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucune option trouvée")}
                className={`w-full p-2 countries-select text-xs text-black placeholder-black rounded-lg mb-1 border ${errors.countryContactPerson ? "border-red-500" : "border-gray-400"}`}
              />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex flex-col xl:flex-row justify-between gap-x-5 mt-0 2xl:mt-2">
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between">
                  <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                    Ville
                    <DynamicHtmlTag type="span" className="text-red-500 hidden">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.cityContactPerson && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                      {errors.cityContactPerson}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <CustomAsyncSelect
                  name="city"
                  value={createMedicalData?.cityContactPerson}
                  onChange={handleCityChange}
                  defaultOptions={defaultCityOptions}
                  loadOptions={(inputValue: any) => {
                    if (createMedicalData?.countryContactPerson) {
                      return handleSearchCity(inputValue, parseInt(createMedicalData.countryContactPerson.value));
                    }
                    return [];
                  }}
                  placeholder="Rechercher une ville"
                  isClearable
                  isDisabled={isCityDisable}
                  noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucune option trouvée")}
                  className={`w-full countries-select ville-select text-xs text-black placeholder-black rounded-lg mb-1 border ${errors.countryContactPerson ? "border-red-500" : "border-gray-400"}`}
                />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between">
                  <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                    Code postal
                    <DynamicHtmlTag type="span" className="text-red-500 hidden">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.cityContactPerson && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                      {errors.cityContactPerson}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <CustomAsyncSelect
                  name="postalCode"
                  value={createMedicalData.postalCodeContactPerson}
                  onChange={handlePostalCodeChange}
                  defaultOptions={defaultPostalCodeOptions}
                  loadOptions={(inputValue: any) => {
                    if (createMedicalData?.countryContactPerson) {
                      return handleSearchPostalCode(inputValue, parseInt(createMedicalData.countryContactPerson.value));
                    }
                    return [];
                  }}
                  placeholder="Rechercher un code postal"
                  isClearable
                  isDisabled={isPostalCodeDisable}
                  noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucune option trouvée")}
                  className={`w-full countries-select ville-select text-xs text-black placeholder-black rounded-lg mb-1 border ${errors.countryContactPerson ? "border-red-500" : "border-gray-400"}`}
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="mt-0 2xl:mt-1">
              <CustomLabel className="px-2 text-xs 2xl:text-sm">Address</CustomLabel>
              <CustomLabel
                className={`w-full input border ${errors.postalAddressContactPerson ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                <CustomInput
                  type="text"
                  name="postalAddressContactPerson"
                  className={`grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs`}
                  placeholder="Addrese"
                  value={createMedicalData.postalAddressContactPerson}
                  onChange={handleFieldChange}
                />
              </CustomLabel>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex gap-5 mt-0 2xl:mt-2">
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between">
                  <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm">
                    Téléphone
                    <DynamicHtmlTag type="span" className="text-red-500 hidden">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.phoneContactPerson && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                      {errors.phoneContactPerson}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <DynamicHtmlTag
                  type="div"
                  className={`w-full flex items-center border ${errors.phoneContactPerson ? "border-red-500" : "border-grey-400"} rounded-lg overflow-hidden mb-1`}>
                  <DynamicHtmlTag type="div" className="flex items-center p-2 w-full">
                    <PhoneInputWithCountry
                      value={createMedicalData.phoneContactPerson ?? ""}
                      onChange={(value: string) => {
                        setCreateMedicalData(prevState => ({ ...prevState, ["phoneContactPerson"]: value }));
                        setErrors(prevState => ({ ...prevState, ["phone"]: "" }));
                      }}
                      placeholder="uméro de téléphone"
                      containerClass="w-full  overflow-hidden"
                      inputClass="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0 text-xs register-phone"
                    />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                {/* </CustomLabel> */}
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between">
                  <DynamicHtmlTag type="span" className="px-2 text-xs 2xl:text-sm lg:px-2">
                    Address Email
                    <DynamicHtmlTag type="span" className="text-red-500 hidden">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.emailContactPerson && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                      {errors.emailContactPerson}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full">
                  <CustomLabel
                    className={`w-full input border ${errors.emailContactPerson ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                    <CustomInput
                      type="text"
                      name="emailContactPerson"
                      className={`grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs`}
                      placeholder="Adresse email"
                      value={createMedicalData.emailContactPerson}
                      onChange={handleFieldChange}
                    />
                    {errors.emailContactPerson && (
                      <DynamicHtmlTag type="div" className="absolute inset-y-0 right-3 flex items-center">
                        <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                      </DynamicHtmlTag>
                    )}
                  </CustomLabel>
                  {errors.emailContactPerson && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs">
                      {errors.emailContactPerson}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full mt-11 px-2 lg:px-1 flex justify-end gap-4 items-center">
              {/* <CustomButton
                className={`text-sm cstm-btn flex py-2 px-1 justify-center w-7/12 xl:w-4/12 view-more-btn rounded-xl text-white font-semibold`}
                onClick={handleSkipMedicalData}>
                Passer cette étape
              </CustomButton> */}
              <DynamicHtmlTag type="p" className="text-2xs font-semibold">
                Si vous le souhaitez, vous pouvez passercette étape en cliquant sur suivant
              </DynamicHtmlTag>
              <CustomButton type="submit" className=" text-xs cstm-btn py-2 px-2 w-full max-w-40 view-more-btn rounded-xl text-white font-semibold">
                Suivant
              </CustomButton>
            </DynamicHtmlTag>
            {medicalError && (
              <DynamicHtmlTag type="div" className="text-red-500 font-semibold text-2xs mt-1">
                {medicalError}
              </DynamicHtmlTag>
            )}
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomForm>
      {modalType === "showPreviewImage" && (
        <CustomModal
          id="show_Image"
          isOpen={isModalOpen && modalType === "showPreviewImage"}
          onClose={closeShowPreviewModal}
          modalClassName="w-full sm:max-w-1/2 md:max-w-6xl rounded-xl">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 p-4">
              <HeadingTag type="h3" className="text-blue font-semibold text-sm md:text-lg flex items-center gap-2">
                Tous mes documents
                <MdClose
                  onClick={closeShowPreviewModal}
                  className="ms-auto cursor-pointer text-blue border border-blue rounded-full h-6 p-1 hover:bg-primary hover:border-primary hover:text-white w-6"
                />
              </HeadingTag>
              <DynamicHtmlTag type="div" className="w-full flex items-center justify-center mt-5">
                <CustomImage
                  src={healthPreviewImage || ""}
                  alt="preview-image"
                  width={300}
                  height={300}
                  className="mx-auto w-full max-h-[80vh] object-cover"
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
      )}
    </DynamicHtmlTag>
  );
}
