"use client";
import { CustomAsyncSelect, CustomImage, CustomInput, CustomLabel, DynamicHtmlTag, HeadingTag, PhoneInputWithCountry } from "@/components";
import { selectPatientDetailsData, setPatientDetailsData } from "@/store/reducers/patientDetailsSlice";
import {
  cityAutoCompleteApi,
  CityOption,
  countryListingApi,
  PatientPractitionerType,
  postalCodeAutoCompleteApi,
  PostalCodeOption,
  SelectedCountries,
} from "@/utility";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const PersonToContact = () => {
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const [isCityDisable, setIsCityDisable] = useState<boolean>(false); // Initially disable City
  const [isPostalCodeDisable, setIsPostalCodeDisable] = useState<boolean>(false); // Initially disable Postal Code
  const [selectedCities, setSelectedCities] = useState<{ [key: number]: CityOption | null }>({});
  const [selectedCountries, setSelectedCountries] = useState<SelectedCountries>({});
  const [selectedPostalCodes, setSelectedPostalCodes] = useState<{ [key: number]: PostalCodeOption | null }>({});

  const dispatch = useDispatch();
  useEffect(() => {
    if (!fetchPatientData) return;
    const { patientData } = fetchPatientData;
    // Set selected country

    setSelectedCountries({
      [fetchPatientData.id]: patientData?.countryContactPerson
        ? { value: patientData?.countryContactPerson, label: patientData?.countryContactPerson }
        : null,
    });
    setSelectedCities({
      [fetchPatientData.id]: patientData?.cityContactPerson ? { value: patientData?.cityContactPerson, label: patientData?.cityContactPerson } : null,
    });
    setSelectedPostalCodes({
      [fetchPatientData.id]: patientData.postalCodeContactPerson
        ? { value: patientData.postalCodeContactPerson, label: patientData.postalCodeContactPerson }
        : null,
    });
    // Other data setups as necessary...
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
  const handleChange = (value: string) => {
    const updatedPatient = {
      ...fetchPatientData,

      patientData: {
        ...fetchPatientData.patientData,
        phoneContactPerson: value ? value : "", // Ensure it clears correctly
      },
    };
    setPatientDetailsData(updatedPatient);
    dispatch(setPatientDetailsData(updatedPatient));
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
      patientData: {
        ...fetchPatientData.patientData,
        countryContactPerson: selectedOption?.label,
        cityContactPerson: null,
        postalCodeContactPerson: null,
      },
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
      patientData: {
        ...fetchPatientData.patientData,
        postalCodeContactPerson: selectedOption?.postalCode, // Ensure it clears correctly
        cityContactPerson: selectedOption?.value,
      },
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
      patientData: {
        ...fetchPatientData.patientData,
        postalCodeContactPerson: selectedOption?.value,
        cityContactPerson: selectedOption,
      },
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

  const handleInputChange = (field: string, value: string) => {
    const updatedPatient = { ...fetchPatientData };

    // Update logic for nested fields
    if (field.startsWith("patientData.")) {
      const nestedField = field.split(".")[1];
      updatedPatient.patientData = {
        ...updatedPatient.patientData,
        [nestedField]: value, // Directly assign the value
      };
    } else {
      updatedPatient[field] = value; // Directly assign the value
    }

    dispatch(setPatientDetailsData(updatedPatient)); // Dispatch the updated patient data
  };
  return (
    <DynamicHtmlTag type="div" className="w-full lg:pb-9">
      <HeadingTag type="h5" className="lg:hidden text-2xs text-customBlue uppercase mt-2">
        PERSONNE À CONTACTER
      </HeadingTag>
      <DynamicHtmlTag type="div" className="w-full">
        <DynamicHtmlTag type="div" className="flex mt-2 2xl:mt-4 gap-x-2">
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
            <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">Prénom</CustomLabel>
            <CustomInput
              name="firstNameContactPerson"
              onChange={e => handleInputChange("patientData.firstNameContactPerson", e.target.value)}
              value={fetchPatientData?.patientData?.firstNameContactPerson}
              type="text"
              placeholder="Prénom"
              className="outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug rounded-md border border-gray-200 py-1 px-2 w-full"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
            <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">Nom</CustomLabel>
            <CustomInput
              value={fetchPatientData?.patientData?.lastNameContactPerson}
              onChange={e => handleInputChange("patientData.lastNameContactPerson", e.target.value)}
              type="text"
              name="lastNameContactPerson"
              placeholder="Nom"
              className="outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug rounded-md border border-gray-200 py-1 px-2 w-full"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex mt-2 2xl:mt-4 gap-x-2">
          <DynamicHtmlTag type="div" className="flex flex-col w-1/3">
            <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">Pays</CustomLabel>
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
              className="timing-select outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug rounded-md border border-gray-200 font-semibold"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/3">
            <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">Ville</CustomLabel>
            <CustomAsyncSelect
              defaultOptions={[]}
              value={selectedCities[fetchPatientData?.id] || null}
              onChange={(selectedOption: any) => handleCityChange(fetchPatientData?.id, selectedOption)}
              loadOptions={(inputValue: any) => handleCityInputChange(fetchPatientData?.id, inputValue, fetchPatientData)}
              isClearable
              isDisabled={isCityDisable}
              name=""
              placeholder="Ville"
              className="timing-select outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug rounded-md border border-gray-200"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/3">
            <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">Code postal</CustomLabel>
            <CustomAsyncSelect
              name="postalCode"
              placeholder="Code Postal"
              defaultOptions={[]}
              isDisabled={isPostalCodeDisable}
              loadOptions={(inputValue: any) => handlePostalCodeInputChange(fetchPatientData?.id, inputValue, fetchPatientData)}
              onChange={(option: PostalCodeOption | null) => handlePostalCodeChange(option)} // Call the handler here
              value={selectedPostalCodes[fetchPatientData?.id] || null}
              isClearable
              className="timing-select outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug rounded-md border border-gray-200"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row mt-2 2xl:mt-4 gap-x-2">
          <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">Téléphone</CustomLabel>
          <DynamicHtmlTag type="div" className="rounded-md border border-gray-200 flex items-center pe-2">
            <PhoneInputWithCountry
              value={fetchPatientData?.patientData?.phoneContactPerson ?? ""}
              onChange={handleChange}
              placeholder="Numéro de téléphone"
              containerClass="w-full overflow-hidden"
              inputClass="grow input outline-none focus:outline-none border-none border-[0px] h-auto pr-0 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug register-phone"
            />
            {/* <CustomLabel className="ps-2 text-[.6rem] xl:text-3xs 2xl:text-xs leading-relaxed text-customBlue bg-sky-100 px-2 text-center rounded-lg w-fit lg:w-2/12">
                Vérifié
              </CustomLabel> */}
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row mt-2 2xl:mt-4 gap-x-2">
          <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">Adresse email</CustomLabel>
          <DynamicHtmlTag type="div" className="rounded-md border border-gray-200 flex items-center pe-2 px-1">
            <CustomInput
              value={fetchPatientData?.patientData?.emailContactPerson}
              onChange={e => handleInputChange("patientData.emailContactPerson", e.target.value)}
              type="text"
              name="emailContactPersons"
              placeholder="Adresse email"
              className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug py-1 px-2 outline-none w-10/12"
            />
            {/* <CustomLabel className="ps-2 text-[.6rem] xl:text-3xs 2xl:text-xs leading-relaxed text-customBlue bg-sky-100 px-2 text-center rounded-lg w-fit lg:w-2/12">
                Vérifié
              </CustomLabel> */}
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <CustomImage src="/images/support-girl.svg" alt="support-girl" width={150} height={150} className="m-auto mt-6 lg:hidden" />
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default PersonToContact;
