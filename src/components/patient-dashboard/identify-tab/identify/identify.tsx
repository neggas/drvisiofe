"use client";
import {
  CustomAsyncSelect,
  CustomDatePicker,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomSelect,
  DynamicHtmlTag,
  HeadingTag,
  PhoneInputWithCountry,
} from "@/components";
import {
  selectPatientDetailsData,
  selectUpdatePatientError,
  setDashboardProfileUpdate,
  setPatientSidebarDetails,
  setPatientDetailsData,
} from "@/store/reducers/patientDetailsSlice";
import {
  cityAutoCompleteApi,
  CityOption,
  countryListingApi,
  fetchLanguagesApi,
  GenderApiResponse,
  genderListingApi,
  GenderOption,
  LanguageOption,
  nationalityListingApi,
  OptionType,
  PatientsType,
  PatientPractitionerType,
  postalCodeAutoCompleteApi,
  PostalCodeOption,
  PractitionerType,
  SelectedCountries,
  createPatientAvatarSchema,
  getFormateDate,
  getPatientDeatils,
} from "@/utility";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MultiValue, ActionMeta } from "react-select";

//
const IdentifyTab = () => {
  const [birthdayDate, setBirthdayDate] = useState<Date>();
  const [gender, setGender] = useState<GenderOption[]>([]);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const patientErrors = useSelector(selectUpdatePatientError);

  const [selectedCountries, setSelectedCountries] = useState<SelectedCountries>({});
  const [selectedCities, setSelectedCities] = useState<{ [key: number]: CityOption | null }>({});
  const [selectedPostalCodes, setSelectedPostalCodes] = useState<{ [key: number]: PostalCodeOption | null }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isCityDisable, setIsCityDisable] = useState<boolean>(false);
  const [isPostalCodeDisable, setIsPostalCodeDisable] = useState<boolean>(false);

  const dispatch = useDispatch();
  const fetchGender = useCallback(async () => {
    try {
      const response: GenderApiResponse = await genderListingApi();
      const genderOptions: GenderOption[] = response.data.map(gender => ({ value: gender.code, label: gender.name }));
      setGender(genderOptions);
    } catch (error) {
      setGender([]);
    }
  }, []);

  const fetchNationalityList = useCallback(async () => {
    try {
      const data = await nationalityListingApi();
      const options =
        data?.data?.map((nationality: any) => ({
          value: nationality.nationalityName,
          label: nationality.nationalityName,
        })) || [];
      setNationalityOptions(options); // No TypeScript error now
    } catch (error) {
      setNationalityOptions([]);
    }
  }, []);

  const fetchLanguages = useCallback(async () => {
    try {
      const languageData = await fetchLanguagesApi();
      const languageOptions = languageData.map((lang: any) => ({
        value: lang.id.toString(),
        label: lang.name,
      }));
      setLanguages(languageOptions);
    } catch (error) {}
  }, []);

  const patientDetails = useCallback(async () => {
    try {
      const data = await getPatientDeatils();
      dispatch(setPatientDetailsData(data.data));
      dispatch(setPatientSidebarDetails(data.data));
    } catch (error) {}
  }, [dispatch]);

  useEffect(() => {
    patientDetails();
    fetchGender();
    fetchNationalityList();
    fetchLanguages();
  }, [fetchGender, fetchNationalityList, fetchLanguages, patientDetails]);

  useEffect(() => {
    if (!fetchPatientData) return;
    const { birthdayDate = "", country, city, postalCode, avatar } = fetchPatientData;

    // Parse and set the birthday date
    if (birthdayDate) {
      const [day, month, year] = birthdayDate.split("/").map(Number);
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate.getTime())) setBirthdayDate(parsedDate);
      else {
      }
    }

    // Update selected fields based on country, city, and postal code presence
    setSelectedCountries({
      [fetchPatientData.id]: country ? { value: country, label: country } : null,
    });
    setSelectedCities({
      [fetchPatientData.id]: city ? { value: city.cityName, label: city.cityName } : null,
    });
    setSelectedPostalCodes({
      [fetchPatientData.id]: postalCode ? { value: postalCode, label: postalCode } : null,
    });

    // Set the preview image if avatar is available
    setPreviewImage(avatar?.url ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${avatar.url}` : "");
  }, [fetchPatientData]);

  const fetchCountries = async (inputValue: string): Promise<Array<{ value: number; label: string }>> => {
    try {
      const data = await countryListingApi(inputValue);
      const options = data?.data?.results?.map((country: any) => ({
        value: country.id,
        label: country.countryName,
      }));
      return options || [];
    } catch (error) {
      return [];
    }
  };

  const fetchCities = async (inputValue: string, countryId: number): Promise<Array<CityOption>> => {
    try {
      const data = await cityAutoCompleteApi(inputValue, countryId);
      const options: CityOption[] = data?.data?.results?.map((city: any) => ({
        id: city.id,
        value: city.cityName,
        label: `${city.cityName} - ${city.cityZipCode}`,
        postalCode: city.cityZipCode,
      }));
      return options || [];
    } catch (error) {
      return [];
    }
  };

  const fetchPostalCodes = async (cityName: string, countryId: number): Promise<Array<PostalCodeOption>> => {
    try {
      const data = await postalCodeAutoCompleteApi(cityName, countryId); // Adjust this based on your API
      const options: PostalCodeOption[] = data?.data?.results?.map((code: any) => ({
        value: code.cityZipCode,
        label: `${code.cityZipCode} - ${code.cityName}`,
        cityName: code.cityName,
      }));
      return options || [];
    } catch (error) {
      return [];
    }
  };

  const handleCountryChange = (selectedOption: any) => {
    setSelectedCountries({
      [fetchPatientData.id]: selectedOption,
    });
    if (selectedOption) {
      setIsPostalCodeDisable(false);
      setIsCityDisable(false);
    } else {
      setIsCityDisable(true);
      setIsPostalCodeDisable(true);
    }

    setSelectedCities(prev => ({
      ...prev,
      [fetchPatientData.id]: null,
    }));
    setSelectedPostalCodes(prev => ({
      ...prev,
      [fetchPatientData.id]: null,
    }));

    // Update patient data
    const updatedPatient = {
      ...fetchPatientData,
      country: selectedOption?.label || null,
      city: null,
      postalCode: null,
    };
    dispatch(setPatientDetailsData(updatedPatient));
  };

  const handleCityChange = async (practitionerId: number, selectedOption: CityOption | null) => {
    // Update the selected city in the state
    setSelectedCities(prev => ({
      ...prev,
      [practitionerId]: selectedOption,
    }));
    const updatedPatient = {
      ...fetchPatientData,
      postalCode: selectedOption?.postalCode, // Ensure it clears correctly
      city: { cityName: selectedOption?.value },
    };
    dispatch(setPatientDetailsData(updatedPatient));
    if (selectedOption) {
      const countryId = selectedCountries[practitionerId]?.value;
      const postalCode = selectedOption.postalCode;

      if (countryId && postalCode) {
        try {
          // Fetch postal codes based on the selected city and country
          const postalCodes = await fetchPostalCodes(postalCode, countryId);

          if (postalCodes && postalCodes.length > 0) {
            // Automatically select the first postal code if postal codes are available
            const firstPostalCode = postalCodes[0];

            // Update the selected postal code in the state
            setSelectedPostalCodes(prev => ({
              ...prev,
              [practitionerId]: firstPostalCode,
            }));

            // Optionally disable the postal code field after selection
          } else {
            // If no postal codes are found, reset the postal code
            setSelectedPostalCodes(prev => ({
              ...prev,
              [practitionerId]: null,
            }));
          }
        } catch (error) {
          // Reset postal code selection in case of an error
          setSelectedPostalCodes(prev => ({
            ...prev,
            [practitionerId]: null,
          }));
        }
      }
    } else {
      // If no city is selected, reset postal code and enable postal code field again
      setSelectedPostalCodes(prev => ({
        ...prev,
        [practitionerId]: null,
      }));
    }
  };
  const handlePostalCodeChange = (selectedOption: PostalCodeOption | null) => {
    setSelectedPostalCodes({ [fetchPatientData?.id]: selectedOption });
    const updatedPatient = {
      ...fetchPatientData,
      postalCode: selectedOption?.value,
      city: selectedOption,
    };
    dispatch(setPatientDetailsData(updatedPatient));
    // If a postal code is selected, find the corresponding city
    if (selectedOption) {
      const cityName = selectedOption.cityName; // Assuming `cityName` is part of the PostalCodeOption
      setSelectedCities({
        [fetchPatientData?.id]: {
          value: cityName || "", // Make sure value is not undefined
          label: cityName || "", // Make sure label is not undefined
        } as CityOption, // Explicitly cast it to CityOption to match the type
      });
    } else {
      // If postal code is cleared, reset the city
      setSelectedCities({
        [fetchPatientData?.id]: null,
      });
    }
  };
  const handleCityInputChange = async (
    practitionerId: number,
    inputValue: string,
    practitioner: PatientPractitionerType
  ): Promise<Array<CityOption>> => {
    let selectedCountry = selectedCountries[practitionerId];
    let countryId = selectedCountry ? selectedCountry.value : null;

    if (selectedCountry && typeof countryId === "string") {
      const countryName = selectedCountry.label;
      const countryOptions = await fetchCountries(countryName);
      const matchingCountry = countryOptions.find((option: any) => option.label.toLowerCase() === countryName.toLowerCase());
      if (matchingCountry) {
        countryId = matchingCountry.value;
        setSelectedCountries(prev => ({
          ...prev,
          [practitionerId]: matchingCountry,
        }));
      } else {
        countryId = null;
      }
    }

    if (!countryId && fetchPatientData.country) {
      let countryName = "";
      if (typeof practitioner.country === "object" && practitioner.country.countryName) {
        countryName = practitioner.country.countryName;
        countryId = practitioner.country.id;
      } else if (typeof practitioner.country === "string") {
        countryName = practitioner.country;
      }
      if (countryName) {
        const countryOptions = await fetchCountries(countryName);
        const matchingCountry = countryOptions.find((option: any) => option.label.toLowerCase() === countryName.toLowerCase());
        if (matchingCountry) {
          countryId = matchingCountry.value;
          setSelectedCountries(prev => ({
            ...prev,
            [practitionerId]: matchingCountry,
          }));
        }
      }
    }

    if (inputValue.length >= 3 && countryId) {
      return await fetchCities(inputValue, countryId);
    } else {
      return [];
    }
  };

  const handlePostalCodeInputChange = async (
    practitionerId: number,
    inputValue: string,
    practitioner: PatientPractitionerType
  ): Promise<Array<PostalCodeOption>> => {
    let selectedCountry = selectedCountries[practitionerId];
    let countryId = selectedCountry ? selectedCountry.value : null;
    if (selectedCountry && typeof countryId === "string") {
      // The value is a string (country name), fetch the countryId
      const countryName = selectedCountry.label;
      const countryOptions = await fetchCountries(countryName);
      const matchingCountry = countryOptions.find(option => option.label.toLowerCase() === countryName.toLowerCase());
      if (matchingCountry) {
        countryId = matchingCountry.value;
        // Update selectedCountries with the correct countryId
        setSelectedCountries(prev => ({
          ...prev,
          [practitionerId]: matchingCountry,
        }));
      } else {
        countryId = null;
      }
    }

    if (!countryId && practitioner.country) {
      let countryName = "";
      if (typeof practitioner.country === "object" && practitioner.country.countryName) {
        countryName = practitioner.country.countryName;
        countryId = practitioner.country.id;
      } else if (typeof practitioner.country === "string") {
        countryName = practitioner.country;
      }
      if (countryName) {
        // Fetch country ID based on country name
        const countryOptions = await fetchCountries(countryName);
        const matchingCountry = countryOptions.find(option => option.label.toLowerCase() === countryName.toLowerCase());
        if (matchingCountry) {
          countryId = matchingCountry.value;
          // Update selectedCountries with the correct countryId
          setSelectedCountries(prev => ({
            ...prev,
            [practitionerId]: matchingCountry,
          }));
        }
      }
    }

    if (inputValue.length >= 3 && countryId) {
      return await fetchPostalCodes(inputValue, countryId);
    } else {
      return [];
    }
  };

  const handleChange = (value: string) => {
    const updatedPatient = {
      ...fetchPatientData,
      phone: value,
    };
    setPatientDetailsData(updatedPatient);
    dispatch(setPatientDetailsData(updatedPatient));
  };

  const handleGenderChange = (selectedOption: GenderOption | null, patient: PatientsType) => {
    const updatedPatient = { ...patient, genre: selectedOption ? selectedOption.value : "" };

    // Update the patient data in the state
    dispatch(setPatientDetailsData(updatedPatient));
  };

  const handleNationalityChange = (selectedOption: { value: string; label: string } | null, patient: PatientsType) => {
    const updatedPatients = { ...patient, nationality: selectedOption ? selectedOption.value : "" };
    dispatch(setPatientDetailsData(updatedPatients));
  };

  const handleLanguageChange = (selectedOptions: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>, practitioner: PractitionerType) => {
    const updatedPractitioner = {
      ...fetchPatientData,
      spokenLanguages: selectedOptions.map(option => ({
        id: option.value.toString(),
        name: option.label,
      })),
    };

    setPatientDetailsData(updatedPractitioner as PractitionerType);
    dispatch(setPatientDetailsData(updatedPractitioner as PractitionerType));
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setPreviewImage("");
    const file = e.target.files?.[0];
    if (file) {
      try {
        await createPatientAvatarSchema.validate({ file }, { abortEarly: false });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        dispatch(setDashboardProfileUpdate(file));
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

  const handleDateOptionChange = (date: any) => {
    setBirthdayDate(date);
    date = date ? getFormateDate(date, "YYYY-MM-DD") : "";
    const updatedPatient = {
      ...fetchPatientData,
      birthdayDate: date,
    };
    setPatientDetailsData(updatedPatient);
    dispatch(setPatientDetailsData(updatedPatient));
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedPatient = { ...fetchPatientData };

    // Check if the field is nested (e.g., "patientData.height")
    if (field.startsWith("patientData.")) {
      const nestedField = field.split(".")[1];
      updatedPatient.patientData = {
        ...updatedPatient.patientData,
        [nestedField]: value === "" ? "" : isNaN(Number(value)) ? value : Number(value),
      };
    } else {
      updatedPatient[field] = value === "" ? "" : value;
    }

    // Dispatch the update to the state
    dispatch(setPatientDetailsData(updatedPatient));
  };

  return (
    <DynamicHtmlTag type="div" className="w-full identity-component pb-9 lg:pb-0">
      <DynamicHtmlTag type="div" className="lg:bg-sky-100 mb-2 xl:mb-2 p-1 lg:sticky lg:top-0 lg:z-10">
        <HeadingTag type="h5" className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug lg:text-center text-customBlue uppercase">
          IDENTITÉ
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex items-center justify-between lg:px-2 xl:px-5 relative -mt-5 lg:mt-0">
        <DynamicHtmlTag type="div" className="w-full flex justify-center items-center lg:block">
          <CustomImage
            src={
              previewImage
                ? previewImage
                : fetchPatientData?.avatar?.url
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${fetchPatientData.avatar.url}`
                  : "/images/quiz-profile.svg"
            }
            alt="user-img"
            width={50}
            height={50}
            className="rounded-full w-9 2xl:w-16 h-9 2xl:h-16 xl:mx-auto border-2 border-gray-200"
          />
        </DynamicHtmlTag>
        <CustomInput ref={fileInputRef} onChange={handleFileChange} type="file" className="hidden" name="" id="identifyUpload" />
        <CustomLabel
          htmlFor="identifyUpload"
          className="text-3xs 2xl:text-2xs leading-none card-btn flex w-fit items-center justify-center gap-x-2 px-4 py-1 rounded-xl cursor-pointer [&&]:absolute right-3 xl:right-5">
          <CustomImage src="/images/camera.svg" alt="camera" width={15} height={15} />
          <DynamicHtmlTag
            type="span"
            onClick={() => fileInputRef.current?.click()}
            className="text-3xs 2xl:text-xs xl:text-3xs leading-none text-white">
            importer
          </DynamicHtmlTag>
        </CustomLabel>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="lg:p-2 xl:pb-0 2xl:p-4 pb-0 pt-0 2xl:mt-2">
        <DynamicHtmlTag type="div" className="flex gap-2 flex-col lg:flex-row">
          <DynamicHtmlTag type="div" className="flex flex-col w-full lg:w-1/2">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                Prénom
                <DynamicHtmlTag type="span" className="text-red-500">
                  *
                </DynamicHtmlTag>
              </CustomLabel>
              {patientErrors?.firstName && (
                <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1">
                  {fetchPatientData?.firstName ? "" : patientErrors?.firstName}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <CustomInput
              type="text"
              name="firstName"
              value={fetchPatientData?.firstName}
              onChange={e => handleInputChange("firstName", e.target.value)}
              placeholder="Prénom"
              className={`${fetchPatientData?.firstName ? "" : patientErrors?.firstName ? "border-red-500" : ""} text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug rounded-md border border-gray-200 py-1 px-2 outline-none disabled:bg-gray-300`}
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-full lg:w-1/2">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                Nom
                <DynamicHtmlTag type="span" className="text-red-500">
                  *
                </DynamicHtmlTag>
              </CustomLabel>
              {patientErrors?.lastName && (
                <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1">
                  {fetchPatientData?.lastName ? "" : patientErrors?.lastName}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <CustomInput
              type="text"
              name="lastName"
              value={fetchPatientData?.lastName}
              onChange={e => handleInputChange("lastName", e.target.value)}
              placeholder="Nom"
              className={`${fetchPatientData?.lastName ? "" : patientErrors?.lastName ? "border-red-500" : ""} text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug rounded-md border border-gray-200 py-1 px-2 outline-none disabled:bg-gray-300`}
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex mt-2 2xl:mt-4 gap-x-2">
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                Date de naissance
                <DynamicHtmlTag type="span" className="text-red-500">
                  *
                </DynamicHtmlTag>
              </CustomLabel>
              {patientErrors?.birthdayDate && (
                <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1">
                  {fetchPatientData?.birthdayDate ? "" : patientErrors?.birthdayDate}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className="form-date-picker date-picker flex items-center outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug rounded-md border border-gray-200  py-1 px-2">
              <DynamicHtmlTag type="span" className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                <CustomDatePicker
                  maxDate={new Date()}
                  onChange={(date: any) => handleDateOptionChange(date)}
                  dateFormat={"dd/MM/yyyy"}
                  placeholderText="jj/mm/aaaa"
                  selected={birthdayDate}
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                Sexe
                <DynamicHtmlTag type="span" className="text-red-500">
                  *
                </DynamicHtmlTag>
              </CustomLabel>
              {patientErrors?.genre && (
                <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1">
                  {fetchPatientData?.genre ? "" : patientErrors?.genre}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <CustomSelect
              name="genre"
              value={gender.find(option => option.value === fetchPatientData?.genre) || null}
              onChange={(selectedOption: any) => handleGenderChange(selectedOption, fetchPatientData)}
              isClearable
              options={gender}
              className={`${patientErrors?.genre ? "border-red-500" : ""} timing-select outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug [&&]:rounded-md border border-gray-200`}
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex mt-2 2xl:mt-4 gap-x-2">
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                Poids
                <DynamicHtmlTag type="span" className="text-red-500">
                  *
                </DynamicHtmlTag>
              </CustomLabel>
              {patientErrors?.["patientData.weight"] && (
                <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1">
                  {fetchPatientData?.patientData?.weight ? "" : patientErrors["patientData.weight"]}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className={`${fetchPatientData?.patientData?.weight ? "" : patientErrors?.["patientData.weight"] ? "border-red-500" : "border-gray-200"} rounded-md border py-1 px-2 flex items-center `}>
              <CustomInput
                type="text"
                name="weight"
                value={fetchPatientData?.patientData?.weight || ""}
                placeholder="Poids"
                onChange={e => {
                  const value = e.target.value;
                  // Validate if it's a number or empty
                  if (value === "" || !isNaN(Number(value))) {
                    handleInputChange("patientData.weight", value); // Keep as string for display
                  }
                }}
                className={`text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug w-11/12 outline-none pe-1`}
              />
              <DynamicHtmlTag type="span" className="text-[.5rem] opacity-50 xl:text-3xs 2xl:text-xs 2xl:leading-tight">
                cm
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                Taille
                <DynamicHtmlTag type="span" className="text-red-500">
                  *
                </DynamicHtmlTag>
              </CustomLabel>
              {patientErrors?.["patientData.height"] && (
                <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1">
                  {fetchPatientData?.patientData?.height ? "" : patientErrors["patientData.height"]}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className={`${patientErrors?.patientData?.height ? "" : patientErrors?.["patientData.height"] ? "border-red-500" : "border-gray-200"} rounded-md border py-1 px-2 flex items-center`}>
              <CustomInput
                type="text"
                name="height"
                value={fetchPatientData?.patientData?.height || ""}
                placeholder="Taille"
                onChange={e => {
                  const value = e.target.value;
                  // Validate if it's a number or empty
                  if (value === "" || !isNaN(Number(value))) {
                    handleInputChange("patientData.height", value); // Keep as string for display
                  }
                }}
                className={`text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug w-11/12 outline-none pe-1`}
              />
              <DynamicHtmlTag type="span" className="text-[.5rem] opacity-50 xl:text-3xs 2xl:text-xs 2xl:leading-tight">
                kg
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex mt-2 2xl:mt-4 gap-x-2">
          <DynamicHtmlTag type="div" className="flex flex-col mt-2 lg:mt-0 w-1/2 pe-1">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                Nationalité
                <DynamicHtmlTag type="span" className="text-red-500">
                  *
                </DynamicHtmlTag>
              </CustomLabel>
              {patientErrors?.nationality && (
                <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1">
                  {fetchPatientData?.nationality ? "" : patientErrors?.nationality}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <CustomSelect
              value={nationalityOptions.find((option: any) => option.value === fetchPatientData?.nationality) || null}
              options={nationalityOptions}
              name="nationality"
              isClearable
              onChange={(selectedOption: any) => handleNationalityChange(selectedOption, fetchPatientData)}
              className={`${fetchPatientData?.nationality ? "" : patientErrors?.nationality ? "border-red-500" : ""} timing-select outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug rounded-md border border-gray-200`}
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col mt-2 lg:mt-0 w-1/2 ps-1 language-select-box">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug w-full max-w-fit">
                Langues parlées
                <DynamicHtmlTag type="span" className="text-red-500">
                  *
                </DynamicHtmlTag>
              </CustomLabel>
              {patientErrors?.spokenLanguages && (
                <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1 w-1/3">
                  {fetchPatientData?.spokenLanguages.length > 0 ? "" : patientErrors?.spokenLanguages}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <CustomSelect
              options={languages}
              value={
                fetchPatientData?.spokenLanguages
                  ? fetchPatientData.spokenLanguages.map((item: any) => ({
                      value: item.id.toString(),
                      label: item.name,
                    }))
                  : []
              }
              onChange={(selectedOptions: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) =>
                handleLanguageChange(selectedOptions, actionMeta, fetchPatientData)
              }
              className="timing-select language-multiselect languages-select outline-none text-2xs xl:text-4xs 2xl:text-xs xl:leading-snug rounded-md border border-gray-200"
              isMulti
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex mt-3 xl:mt-2 2xl:mt-4">
          <DynamicHtmlTag type="div" className="flex flex-col w-1/3">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                Pays
                <DynamicHtmlTag type="span" className="text-red-500">
                  *
                </DynamicHtmlTag>
              </CustomLabel>
              {patientErrors?.country && (
                <DynamicHtmlTag type="div" className="text-red-500 text-3xs w-1/2 line-clamp-1">
                  {fetchPatientData?.country ? "" : patientErrors?.country}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <CustomAsyncSelect
              defaultOptions={[]} // Add default options here
              name="country"
              placeholder="Pays"
              value={selectedCountries[fetchPatientData?.id] || null}
              onChange={handleCountryChange}
              loadOptions={fetchCountries}
              isClearable
              cacheOptions
              noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucune option trouvée")}
              className="timing-select outline-none text-2xs xl:text-3xs 2xl:text-xs xl:leading-none rounded-md border border-gray-200 font-semibold"
              // className="timing-select outline-none line-clamp-1 placeholder:h-1 placeholder:line-clamp-1 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs/6 xl:leading-none rounded-md border border-gray-200 font-semibold"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/3 px-2">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                Ville
                <DynamicHtmlTag type="span" className="text-red-500">
                  *
                </DynamicHtmlTag>
              </CustomLabel>
              {patientErrors?.city && (
                <DynamicHtmlTag type="div" className="text-red-500 text-3xs w-1/2 line-clamp-1">
                  {fetchPatientData?.city ? "" : patientErrors?.city}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <CustomAsyncSelect
              defaultOptions={[]}
              value={selectedCities[fetchPatientData?.id] || null}
              onChange={(selectedOption: any) => handleCityChange(fetchPatientData?.id, selectedOption)}
              loadOptions={(inputValue: any) => handleCityInputChange(fetchPatientData?.id, inputValue, fetchPatientData)}
              isClearable
              isDisabled={isCityDisable}
              name=""
              placeholder="Ville"
              className="timing-select outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs/6 xl:leading-none rounded-md border border-gray-200"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/3">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug w-full max-w-fit">
                Code postal
                <DynamicHtmlTag type="span" className="text-red-500">
                  *
                </DynamicHtmlTag>
              </CustomLabel>
              {patientErrors?.postalCode && (
                <DynamicHtmlTag type="div" className="text-red-500 text-3xs w-1/3 line-clamp-1">
                  {fetchPatientData?.postalCode ? "" : patientErrors?.postalCode}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <CustomAsyncSelect
              name="postalCode"
              placeholder="Code Postal"
              defaultOptions={[]}
              isDisabled={isPostalCodeDisable}
              loadOptions={(inputValue: any) => handlePostalCodeInputChange(fetchPatientData?.id, inputValue, fetchPatientData)}
              onChange={(option: PostalCodeOption | null) => handlePostalCodeChange(option)} // Call the handler here
              value={selectedPostalCodes[fetchPatientData?.id] || null}
              isClearable
              className="timing-select outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs/6 xl:leading-none rounded-md border border-gray-200"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex flex-col mt-2 2xl:mt-4">
          <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
            <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
              Adresse
              <DynamicHtmlTag type="span" className="text-red-500">
                *
              </DynamicHtmlTag>
            </CustomLabel>
            {patientErrors?.postalAddress && (
              <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1">
                {fetchPatientData?.postalAddress ? "" : patientErrors?.postalAddress}
              </DynamicHtmlTag>
            )}
          </DynamicHtmlTag>
          <CustomInput
            type="text"
            value={fetchPatientData?.postalAddress}
            onChange={e => handleInputChange("postalAddress", e.target.value)}
            name="postalAddress"
            placeholder="Adresse"
            className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug rounded-md border border-gray-200 py-1 px-2 outline-none"
          />
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex flex-col mt-2 2xl:mt-4">
          <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
            <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
              Téléphone
              <DynamicHtmlTag type="span" className="text-red-500">
                *
              </DynamicHtmlTag>
            </CustomLabel>
            {patientErrors?.phone && (
              <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1">
                {fetchPatientData?.phone ? "" : patientErrors?.phone}
              </DynamicHtmlTag>
            )}
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="rounded-md border border-gray-200 flex items-center pe-2">
            <PhoneInputWithCountry
              value={fetchPatientData?.phone ?? ""}
              onChange={handleChange}
              placeholder="Numéro de téléphone"
              containerClass="w-full overflow-hidden"
              inputClass="grow input outline-none focus:outline-none border-none border-[0px] h-auto pr-0 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug register-phone"
            />
            {/* <CustomLabel className="ps-2 text-[.5rem] leading-tight text-customBlue bg-sky-100 px-2 text-center rounded-lg w-fit lg:w-2/12">
              Vérifié
            </CustomLabel> */}
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex flex-col mt-2 2xl:mt-4">
          <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
            <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
              Adresse email
              <DynamicHtmlTag type="span" className="text-red-500">
                *
              </DynamicHtmlTag>
            </CustomLabel>
            {patientErrors?.email && (
              <DynamicHtmlTag type="div" className="text-red-500 text-3xs line-clamp-1">
                {fetchPatientData?.email ? "" : patientErrors?.email}
              </DynamicHtmlTag>
            )}
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="rounded-md border border-gray-200 flex items-center pe-2 px-1">
            <CustomInput
              type="email"
              value={fetchPatientData?.email}
              onChange={e => handleInputChange("email", e.target.value)}
              name="email"
              placeholder="Adresse email"
              className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug py-1 px-2 outline-none w-10/12"
            />
            {/* <CustomLabel className="ps-2 text-[.5rem] leading-tight text-customBlue bg-sky-100 px-2 text-center rounded-lg w-fit lg:w-2/12">
              Vérifié
            </CustomLabel> */}
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default IdentifyTab;
