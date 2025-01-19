"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import {
  CustomImage,
  CustomButton,
  CustomForm,
  CustomInput,
  CustomLabel,
  CustomSelect,
  CustomAsyncSelect,
  DynamicHtmlTag,
  PhoneInputWithCountry,
  CustomDatePicker,
} from "@/components";
import {
  genderListingApi,
  nationalityListingApi,
  countryListingApi,
  cityAutoCompleteApi,
  postalCodeAutoCompleteApi,
  fetchLanguagesApi,
  GenderApiResponse,
  ListOption,
  CityPostListOption,
  PatientIdentityError,
  createIdentityPatientSchema,
  CreateIdentityRequest,
  getFormateDate,
  getLocalStorageData,
  clearLocalStorageData,
  recordablePatientStepOne,
} from "@/utility";
import { selectCreatePatientData, setCreatePatientData } from "@/store/reducers/createPatientsSlice";
import { IoEyeOff } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";

const createIdentityParams = {
  firstName: "",
  lastName: "",
  birthdayDate: "",
  genre: "",
  weight: "",
  height: "",
  nationality: "",
  phone: "",
  email: "",
  postalAddress: "",
  country: null,
  city: null,
  postalCode: null,
  spokenLanguages: [],
  password: "",
  confirmPassword: "",
};

const Identity = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const createPatientData = useSelector(selectCreatePatientData);
  const emailExist = getLocalStorageData("emailExistError", null);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [gender, setGender] = useState<ListOption[]>([]);
  const [nationalityOptions, setNationalityOptions] = useState<ListOption[]>([]);
  const [languages, setLanguages] = useState<ListOption[]>([]);
  const [defaultCountryOptions, setDefaultCountryOptions] = useState<ListOption[]>([]);
  const [defaultCityOptions, setDefaultCityOptions] = useState<ListOption[]>([]);
  const [isCityDisable, setIsCityDisable] = useState<boolean>(true);
  const [defaultPostalCodeOptions, setDefaultPostalCodeOptions] = useState<ListOption[]>([]);
  const [isPostalCodeDisable, setIsPostalCodeDisable] = useState<boolean>(true);
  const [birthdayDate, setBirthdayDate] = useState<Date>();
  const [createIdentity, setCreateIdentity] = useState<CreateIdentityRequest>(createIdentityParams);
  const [errors, setErrors] = useState<PatientIdentityError>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailExistError, setEmailExistError] = useState<string | null>(null);
  const [identityError, setIdentityError] = useState<string>("");

  useEffect(() => {
    fetchGender();
    fetchCountries();
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (emailExist) {
      setEmailExistError(emailExist);
      clearLocalStorageData("emailExistError");
    }
  }, [emailExist]);

  useEffect(() => {
    if (createPatientData?.createIdentity) {
      setDefaultCountryOptions(createPatientData.createIdentity.country ? [createPatientData.createIdentity.country] : []);
      setDefaultCityOptions(createPatientData.createIdentity.city ? [createPatientData.createIdentity.city] : []);
      setDefaultPostalCodeOptions(createPatientData.createIdentity.postalCode ? [createPatientData.createIdentity.postalCode] : []);

      if (createPatientData?.createIdentity?.birthdayDate) {
        setBirthdayDate(createPatientData.createIdentity.birthdayDate);
      }
      setCreateIdentity(createPatientData.createIdentity);
      setIsCityDisable(!createPatientData.createIdentity.country);
      setIsPostalCodeDisable(!createPatientData.createIdentity.country);
    }
  }, []);

  const fetchGender = async () => {
    try {
      const response: GenderApiResponse = await genderListingApi();
      const genderOptions: ListOption[] = response.data.map(gender => ({ value: gender.code, label: gender.name }));
      setGender(genderOptions);
    } catch (error) {
      setGender([]);
    }
  };

  const fetchCountries = async () => {
    try {
      const data = await nationalityListingApi();
      const options = data?.data?.map((nationality: any) => ({
        value: nationality.nationalityName,
        label: nationality.nationalityName,
      }));
      setNationalityOptions(options);
    } catch (error) {
      setNationalityOptions([]);
    }
  };

  const fetchLanguages = async () => {
    try {
      const data = await fetchLanguagesApi();
      const options = data?.map((language: any) => ({
        value: language.id,
        label: language.name,
      }));
      setLanguages(options);
    } catch (error) {
      setLanguages([]);
    }
  };

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

    setCreateIdentity(prevState => ({ ...prevState, ["country"]: countryObject }));
    setCreateIdentity(prevState => ({ ...prevState, ["city"]: null }));
    setCreateIdentity(prevState => ({ ...prevState, ["postalCode"]: null }));

    setErrors(prevState => ({ ...prevState, ["country"]: "" }));
    setErrors(prevState => ({ ...prevState, ["city"]: "" }));
    setErrors(prevState => ({ ...prevState, ["postalCode"]: "" }));
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
    if (cityObject && createIdentity?.country) {
      setIsPostalCodeDisable(false);
      const postalCodeObject = {
        value: cityObject?.postalCode ?? "",
        label: `${cityObject?.postalCode} - ${cityObject?.value}`,
        cityName: cityObject?.value ?? "",
      };
      setDefaultPostalCodeOptions([postalCodeObject]);
      setCreateIdentity(prevState => ({ ...prevState, ["postalCode"]: postalCodeObject }));
    } else {
      setIsPostalCodeDisable(true);
      setDefaultPostalCodeOptions([]);
      setCreateIdentity(prevState => ({ ...prevState, ["postalCode"]: null }));
    }
    setCreateIdentity(prevState => ({ ...prevState, ["city"]: cityObject }));
    setErrors(prevState => ({ ...prevState, ["city"]: "" }));
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
    setCreateIdentity(prevState => ({ ...prevState, ["postalCode"]: postalCode }));
    if (postalCode) {
      const cityObject = {
        value: postalCode?.cityName ?? "",
        label: `${postalCode?.cityName} - ${postalCode?.value}`,
        postalCode: postalCode?.value,
      };
      setDefaultCityOptions([cityObject]);
      setCreateIdentity(prevState => ({ ...prevState, ["city"]: cityObject }));
    }

    setErrors(prevState => ({ ...prevState, ["postalCode"]: "" }));
  };

  // Datetime picker change event
  const handleDateOptionChange = (date: any) => {
    setBirthdayDate(date);
    date = date ? getFormateDate(date, "YYYY-MM-DD") : "";
    setCreateIdentity(prevState => ({ ...prevState, ["birthdayDate"]: date }));
    setErrors(prevState => ({ ...prevState, ["birthdayDate"]: "" }));
  };

  // Handle field changes
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateIdentity(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevState => ({ ...prevState, [name]: "" }));

    if (name == "email") {
      setEmailExistError("");
      clearLocalStorageData("emailExistError");
    }
  };

  // Handle Create Patient Identity Form
  const handleCreatePatientIdentity = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    try {
      const model = {
        email: createIdentity.email,
        password: createIdentity.password,
        confirmedPassword: createIdentity.confirmPassword,
        phone: createIdentity.phone,
        birthdayDate: createIdentity.birthdayDate,
        firstName: createIdentity.firstName,
        lastName: createIdentity.lastName,
        postalCode: createIdentity.postalCode?.value,
        postalAddress: createIdentity.postalAddress,
        city: createIdentity.city?.value,
        country: createIdentity.country?.label,
        genre: createIdentity.genre,
      };
      await recordablePatientStepOne(model);
      router.push("/create-patient/medical-data");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message;
      setIdentityError(errorMessage);
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setErrors(validationErrors);
      }
    }
    try {
      let createIdentityValidate: any = { ...createIdentity };
      if (createIdentityValidate.country) {
        createIdentityValidate.country = createIdentityValidate.country?.value ?? "";
      }
      if (createIdentityValidate.city) {
        createIdentityValidate.city = createIdentityValidate.city?.value ?? "";
      }
      if (createIdentityValidate.postalCode) {
        createIdentityValidate.postalCode = createIdentityValidate.postalCode?.value ?? "";
      }
      if (createIdentityValidate.spokenLanguages) {
        createIdentityValidate.spokenLanguages = createIdentityValidate.spokenLanguages.length > 0 ? "true" : "";
      }
      await createIdentityPatientSchema.validate(createIdentityValidate, { abortEarly: false });
      dispatch(setCreatePatientData({ ...createPatientData, createIdentity }));
      // router.push("/create-patient/medical-data");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message;

      toast.error(errorMessage);

      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setErrors(validationErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DynamicHtmlTag type="div" className="md:px-5 situation-screen-main h-full">
      <CustomForm onSubmit={handleCreatePatientIdentity}>
        <DynamicHtmlTag type="div" className="grid grid-col-1 lg:grid-cols-2 gap-5">
          <DynamicHtmlTag type="div" className="w-[348px] lg:w-full">
            <DynamicHtmlTag type="div" className="md:w-full flex gap-4">
              <DynamicHtmlTag type="div" className="form-group w-full">
                <DynamicHtmlTag type="div" className="flex justify-between items-center">
                  <DynamicHtmlTag type="span" className="px-2 text-xs lg:text-sm">
                    Prénom
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.firstName && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                      {errors.firstName}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <CustomLabel
                  className={`w-full input border ${errors.firstName ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                  <CustomInput
                    type="text"
                    name="firstName"
                    className={`grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs`}
                    placeholder="Prénom"
                    value={createIdentity.firstName}
                    onChange={handleFieldChange}
                  />
                  {errors.firstName && (
                    <DynamicHtmlTag type="div" className="absolute inset-y-0 right-3 flex items-center">
                      <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                    </DynamicHtmlTag>
                  )}
                </CustomLabel>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="form-group w-full">
                <DynamicHtmlTag type="div" className="flex justify-between items-center">
                  <DynamicHtmlTag type="span" className="px-2 text-xs lg:text-sm">
                    Nom
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.lastName && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                      {errors.lastName}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <CustomLabel
                  className={`w-full input border ${errors.lastName ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                  <CustomInput
                    type="text"
                    name="lastName"
                    className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs"
                    placeholder="Nom"
                    value={createIdentity.lastName}
                    onChange={handleFieldChange}
                  />
                  {errors.lastName && (
                    <DynamicHtmlTag type="div" className="absolute inset-y-0 right-3 flex items-center">
                      <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                    </DynamicHtmlTag>
                  )}
                </CustomLabel>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            {/* Date of Birth and Gender */}
            <DynamicHtmlTag type="div" className="md:w-full flex gap-4">
              <DynamicHtmlTag type="div" className=" md:w-full">
                <DynamicHtmlTag type="div" className="flex justify-between items-center">
                  <DynamicHtmlTag type="span" className="px-2 text-xs lg:text-sm">
                    Date de naissance
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.birthdayDate && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                      {errors.birthdayDate}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <DynamicHtmlTag
                  type="div"
                  className={`date-picker relative flex items-center space-x-2 text-xs grow w-full input border register-field ${errors.birthdayDate ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                  <CustomDatePicker
                    selected={birthdayDate}
                    placeholderText="jj/mm/aaaa"
                    onChange={(date: any) => handleDateOptionChange(date)}
                    dateFormat="dd/MM/yyyy"
                    todayButton="Aujourd'hui"
                    className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs"
                    maxDate={new Date()}
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between items-center">
                  <DynamicHtmlTag type="span" className="px-2 text-xs lg:text-sm">
                    Sexe
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.genre && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                      {errors.genre}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <CustomSelect
                  name="genre"
                  value={gender.find(option => option.value === createIdentity.genre) || null}
                  onChange={(selectedOption: ListOption) => {
                    setCreateIdentity(prevState => ({ ...prevState, ["genre"]: selectedOption?.value ?? "" }));
                    setErrors(prevState => ({ ...prevState, ["genre"]: "" }));
                  }}
                  options={gender}
                  placeholder="Sexe"
                  isClearable
                  className={`w-full p-2 countries-select text-xs text-black placeholder-black border rounded-lg mb-1 ${errors.genre ? "border-red-500" : "border-grey-400"} `}
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>

            {/* Weight and Height */}
            <DynamicHtmlTag type="div" className="flex gap-5">
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between items-center">
                  <DynamicHtmlTag type="div" className="max-w-max px-2 text-[10px] lg:text-sm">
                    Poids
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.weight && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                      {errors.weight}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <DynamicHtmlTag
                  type="div"
                  className={`w-full input border ${errors.weight ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg relative mb-1`}>
                  <CustomInput
                    name="weight"
                    type="number"
                    value={createIdentity.weight}
                    onChange={handleFieldChange}
                    className={`grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs`}
                    placeholder="Poids"
                  />
                  <DynamicHtmlTag type="span" className={`flex items-center bg-grey-lighter px-2 text-xs border-l`}>
                    Kg
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between items-center">
                  <DynamicHtmlTag type="div" className="max-w-max px-2 text-[10px] lg:text-sm">
                    Taille
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.height && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                      {errors.height}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <DynamicHtmlTag
                  type="div"
                  className={`w-full input border ${errors.height ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg relative mb-1`}>
                  <CustomInput
                    name="height"
                    type="number"
                    value={createIdentity.height}
                    onChange={handleFieldChange}
                    className={`grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs`}
                    placeholder="Taille"
                  />
                  <DynamicHtmlTag type="span" className={`flex items-center bg-grey-lighter px-2 text-xs border-l`}>
                    Cm
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            {/* Nationality */}
            <DynamicHtmlTag type="div" className="w-full">
              <DynamicHtmlTag type="div" className="flex justify-between items-center">
                <DynamicHtmlTag type="span" className="px-2 text-xs lg:text-sm">
                  Nationalité
                  <DynamicHtmlTag type="span" className="text-red-500">
                    *
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                {errors.nationality && (
                  <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                    {errors.nationality}
                  </DynamicHtmlTag>
                )}
              </DynamicHtmlTag>
              <CustomSelect
                name="nationality"
                value={nationalityOptions.find(option => option.value === createIdentity.nationality) || null}
                onChange={(selectedOption: ListOption) => {
                  setCreateIdentity(prevState => ({ ...prevState, ["nationality"]: selectedOption?.value ?? "" }));
                  setErrors(prevState => ({ ...prevState, ["nationality"]: "" }));
                }}
                options={nationalityOptions}
                placeholder="Nationalité"
                isClearable={true}
                className={`w-full p-2 countries-select text-xs text-black placeholder-black border rounded-lg mb-1 ${errors.nationality ? "border-red-500" : "border-grey-400"} `}
              />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full">
              <DynamicHtmlTag type="div" className="flex justify-between items-center">
                <DynamicHtmlTag type="span" className="px-2 text-xs lg:text-sm">
                  Langues parlées
                  <DynamicHtmlTag type="span" className="text-red-500">
                    *
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                {errors.spokenLanguages && (
                  <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                    {errors.spokenLanguages}
                  </DynamicHtmlTag>
                )}
              </DynamicHtmlTag>
              <CustomSelect
                name="spokenLanguages"
                onChange={(language: ListOption[]) => {
                  // language = language.map((language: any) => language.value);
                  setCreateIdentity(prevState => ({ ...prevState, ["spokenLanguages"]: language }));
                  setErrors(prevState => ({ ...prevState, ["spokenLanguages"]: "" }));
                }}
                value={createIdentity?.spokenLanguages}
                options={languages}
                placeholder="Langues parlées"
                isMulti={true}
                className={`w-full p-2 countries-select text-xs text-black placeholder-black border rounded-lg mb-1 ${errors.spokenLanguages ? "border-red-500" : "border-gray-400"}`}
              />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex gap-5">
              {/* Phone Number */}
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between items-center">
                  <DynamicHtmlTag type="span" className="px-2 text-xs lg:text-sm lg:px-2">
                    Téléphone
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.phone && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                      {errors.phone}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <DynamicHtmlTag
                  type="div"
                  className={`w-full flex items-center border ${errors.phone ? "border-red-500" : "border-grey-400"} rounded-lg overflow-hidden mb-1`}>
                  <DynamicHtmlTag type="div" className="flex items-center p-2 w-full">
                    <PhoneInputWithCountry
                      value={createIdentity.phone}
                      onChange={(value: string) => {
                        setCreateIdentity(prevState => ({ ...prevState, ["phone"]: value }));
                        setErrors(prevState => ({ ...prevState, ["phone"]: "" }));
                      }}
                      placeholder="Numéro de téléphone"
                      containerClass="w-full overflow-hidden"
                      inputClass="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0 text-xs register-phone"
                    />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              {/* Email Address */}
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between items-center">
                  <DynamicHtmlTag type="span" className="px-2 text-xs lg:text-sm lg:px-2">
                    Adresse email
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {(errors.email || emailExistError) && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                      {errors.email ?? emailExistError}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full">
                  <CustomLabel
                    className={`w-full input border ${errors.email ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                    <CustomInput
                      type="text"
                      name="email"
                      className={`grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs`}
                      placeholder="Adresse email"
                      value={createIdentity.email}
                      onChange={handleFieldChange}
                    />
                    {(errors.email || emailExistError) && (
                      <DynamicHtmlTag type="div" className="absolute inset-y-0 right-3 flex items-center">
                        <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                      </DynamicHtmlTag>
                    )}
                  </CustomLabel>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full mt-3">
              <DynamicHtmlTag type="span" className="px-2 font-bold text-xs lg:text-sm lg:px-2">
                Les champs munis d’un (*) sont obligatoires
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="... w-[348px] lg:w-full">
            <DynamicHtmlTag type="div" className="">
              <DynamicHtmlTag type="div" className="w-full">
                <DynamicHtmlTag type="div" className="flex justify-between items-center">
                  <DynamicHtmlTag type="span" className="px-2 text-xs lg:text-sm">
                    Pays
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.country && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                      {errors.country}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <CustomAsyncSelect
                  name="country"
                  value={createIdentity?.country}
                  onChange={handleCountryChange}
                  defaultOptions={defaultCountryOptions}
                  loadOptions={handleSearchCountry}
                  placeholder="Rechercher un pays"
                  isClearable
                  cacheOptions
                  noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucune option trouvée")}
                  className={`w-full p-2 countries-select text-xs text-black placeholder-black rounded-lg mb-1 border ${errors.country ? "border-red-500" : "border-gray-400"}`}
                />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="mt-3 lg:mt-0">
                <DynamicHtmlTag type="div" className="flex gap-5">
                  <DynamicHtmlTag type="div" className="w-full px-2 lg:px-0 flex justify-between gap-5">
                    <DynamicHtmlTag type="div" className="w-full">
                      <DynamicHtmlTag type="div" className="flex justify-between items-center">
                        <DynamicHtmlTag type="span" className="px-2 text-xs lg:text-sm">
                          Ville
                          <DynamicHtmlTag type="span" className="text-red-500">
                            *
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        {errors.city && (
                          <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                            {errors.city}
                          </DynamicHtmlTag>
                        )}
                      </DynamicHtmlTag>
                      <CustomAsyncSelect
                        name="city"
                        value={createIdentity?.city}
                        onChange={handleCityChange}
                        defaultOptions={defaultCityOptions}
                        loadOptions={(inputValue: any) => {
                          if (createIdentity?.country) {
                            return handleSearchCity(inputValue, parseInt(createIdentity.country.value));
                          }
                          return [];
                        }}
                        placeholder="Rechercher une ville"
                        isClearable
                        isDisabled={isCityDisable}
                        noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucune option trouvée")}
                        className={`w-full countries-select ville-select text-xs text-black placeholder-black rounded-lg mb-1 border ${errors.city ? "border-red-500" : "border-gray-400"}`}
                      />
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="w-full">
                      <DynamicHtmlTag type="div" className="flex justify-between items-center">
                        <DynamicHtmlTag type="span" className="px-2 text-xs lg:text-sm">
                          Code postal
                          <DynamicHtmlTag type="span" className="text-red-500">
                            *
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        {errors.postalCode && (
                          <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                            {errors.postalCode}
                          </DynamicHtmlTag>
                        )}
                      </DynamicHtmlTag>
                      <CustomAsyncSelect
                        name="postalCode"
                        value={createIdentity.postalCode}
                        onChange={handlePostalCodeChange}
                        defaultOptions={defaultPostalCodeOptions}
                        loadOptions={(inputValue: any) => {
                          if (createIdentity?.country) {
                            return handleSearchPostalCode(inputValue, parseInt(createIdentity.country.value));
                          }
                          return [];
                        }}
                        placeholder="Rechercher un code postal"
                        isClearable
                        isDisabled={isPostalCodeDisable}
                        noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucune option trouvée")}
                        className={`w-full countries-select ville-select text-xs text-black placeholder-black rounded-lg mb-1 border ${errors.postalCode ? "border-red-500" : "border-gray-400"}`}
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="form-group">
                  <DynamicHtmlTag type="div" className="flex justify-between items-center">
                    <DynamicHtmlTag type="span" className="text-xs lg:text-sm lg:px-2">
                      Adresse
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    {errors.postalAddress && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                        {errors.postalAddress}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <CustomLabel
                    className={`w-full input border ${errors.postalAddress ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                    <CustomInput
                      type="text"
                      name="postalAddress"
                      className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs"
                      placeholder="Addrese"
                      value={createIdentity.postalAddress}
                      onChange={handleFieldChange}
                    />
                    {errors.postalAddress && (
                      <DynamicHtmlTag type="div" className="absolute inset-y-0 right-3 flex items-center">
                        <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                      </DynamicHtmlTag>
                    )}
                  </CustomLabel>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="bg-[#43ABE16E] rounded-xl">
                  <DynamicHtmlTag type="div" className="mt-4 px-4 py-6">
                    <DynamicHtmlTag type="div" className="flex flex-col space-y-2">
                      <DynamicHtmlTag type="div" className="form-group">
                        <DynamicHtmlTag type="div" className="flex justify-between items-center">
                          <CustomLabel htmlFor="password" className="text-xs lg:text-sm lg:px-2">
                            Créer un mot de passe
                            <DynamicHtmlTag type="span" className="text-red-500">
                              *
                            </DynamicHtmlTag>
                          </CustomLabel>
                          {errors.password && (
                            <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                              {errors.password}
                            </DynamicHtmlTag>
                          )}
                        </DynamicHtmlTag>
                        <CustomLabel
                          className={`w-full input border ${errors.password ? "border-red-500" : "border-base-100"} p-2 flex items-center gap-2 rounded-lg mb-1 relative bg-white`}>
                          <CustomInput
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs"
                            placeholder="Mot de passe"
                            value={createIdentity.password}
                            onChange={handleFieldChange}
                          />
                          <CustomButton
                            onClick={() => {
                              setPasswordVisible(!passwordVisible);
                            }}
                            className={"absolute inset-y-0 right-3 flex items-center cursor-pointer"}>
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                          </CustomButton>
                        </CustomLabel>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="form-group">
                        <DynamicHtmlTag type="div" className="flex justify-between items-center">
                          <CustomLabel htmlFor="password" className="text-xs lg:text-sm lg:px-2">
                            Confirmer le mot de passe
                            <DynamicHtmlTag type="span" className="text-red-500">
                              *
                            </DynamicHtmlTag>
                          </CustomLabel>
                          {errors.confirmPassword && (
                            <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                              {errors.confirmPassword}
                            </DynamicHtmlTag>
                          )}
                        </DynamicHtmlTag>
                        <CustomLabel
                          className={`w-full input border ${errors.confirmPassword ? "border-red-500" : "border-base-100"} p-2 flex items-center gap-2 rounded-lg mb-1 relative bg-white`}>
                          <CustomInput
                            type={confirmPasswordVisible ? "text" : "password"}
                            name="confirmPassword"
                            className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 placeholder-black text-xs"
                            placeholder="Mot de passe"
                            value={createIdentity.confirmPassword}
                            onChange={handleFieldChange}
                          />
                          <CustomButton
                            onClick={() => {
                              setConfirmPasswordVisible(!confirmPasswordVisible);
                            }}
                            className={"absolute inset-y-0 right-3 flex items-center cursor-pointer"}>
                            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                          </CustomButton>
                          {/* <DynamicHtmlTag
                            type="div"
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={() => {
                              setConfirmPasswordVisible(!confirmPasswordVisible);
                            }}>
                            {confirmPasswordVisible ? <IoEyeOff className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                          </DynamicHtmlTag> */}
                        </CustomLabel>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>

              <DynamicHtmlTag type="div" className="w-full mt-3 px-2 lg:px-1 flex justify-end">
                <CustomButton
                  type="submit"
                  disabled={isLoading}
                  className="login-button cstm-btn block card-btn text-white py-2 rounded-full text-xs">
                  Suivant
                </CustomButton>
              </DynamicHtmlTag>
              {identityError && (
                <DynamicHtmlTag type="div" className="text-red-500 font-semibold text-2xs mt-1">
                  {identityError}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomForm>
    </DynamicHtmlTag>
  );
};

export default Identity;
