"use client";
import {
  CustomAsyncSelect,
  CustomButton,
  CustomDatePicker,
  CustomForm,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomLink,
  CustomModal,
  DynamicHtmlTag,
  HeadingTag,
  PhoneInputWithCountry,
} from "@/components";
import { RootState } from "@/store";
import { closeModal, openModal, resetModal } from "@/store/reducers/modalSlice";
import { selectPatientDetailsData, sethealthcardImage, setPatientDetailsData } from "@/store/reducers/patientDetailsSlice";
import {
  cityAutoCompleteApi,
  CityOption,
  countryListingApi,
  parseDateidentify,
  postalCodeAutoCompleteApi,
  PostalCodeOption,
  SelectedCountries,
  PatientPractitionerType,
  API_URL,
  formatDateidentify,
  UpdateDocument,
  getFormateDate,
  AddDocument,
} from "@/utility";
import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowForward, IoMdEye } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdClose, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
const updateDocument = {
  healthComplNumber: "",
  healthComplStartDate: "",
  healthComplEndDate: "",
  file: "",
};

const addDocument = {
  healthComplNumber: "",
  healthComplStartDate: "",
  healthComplEndDate: "",
  healthCompl: "",
};

const AccordionItem: React.FC<AccordionItemProps> = ({ title, isOpen, onToggle, children }) => (
  <>
    <DynamicHtmlTag
      type="div"
      className={`${title === "PERSONNE À CONTACTER" ? "hidden lg:block" : ""} p-1 lg:bg-sky-100 lg:my-2 2xl:my-4 lg:-mx-2 2xl:-mx-4 relative`}>
      <CustomButton
        type="button"
        onClick={onToggle}
        className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug lg:mx-auto block text-customBlue uppercase w-full text-left lg:text-center">
        {title}
      </CustomButton>
      <IoIosArrowForward
        className={`text-sky-800 absolute right-2 w-3 top-0 bottom-0 m-auto transition-all ease-linear duration-200 ${isOpen ? "rotate-90" : ""}`}
      />
    </DynamicHtmlTag>
    {isOpen && (
      <DynamicHtmlTag type="div" className="w-full">
        {children}
      </DynamicHtmlTag>
    )}
  </>
);
const SsnNumber = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openAddChildModal = () => setIsModalOpen(true);
  const closeAddChildModal = () => setIsModalOpen(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [openIndex, setOpenIndex] = useState(0);
  const [isCityDisable, setIsCityDisable] = useState<boolean>(false); // Initially disable City
  const [isPostalCodeDisable, setIsPostalCodeDisable] = useState<boolean>(false); // Initially disable Postal Code
  const [selectedCities, setSelectedCities] = useState<{ [key: number]: CityOption | null }>({});
  const [selectedCountries, setSelectedCountries] = useState<SelectedCountries>({});
  const [selectedPostalCodes, setSelectedPostalCodes] = useState<{ [key: number]: PostalCodeOption | null }>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageTypes = ["image/png", "image/jpg", "image/jpeg"];
  const [healthPreviewImage, setHealthPreviewImage] = useState<string | null>(null);
  const [healthPreviewImages, setHealthPreviewImages] = useState<string | null>(null);

  const [addhealthPreviewImage, setAddHealthPreviewImage] = useState<string | null>(null);

  const [deleteDocument, setDeleteDocument] = useState(false);
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const [DataUpdateDocument, setUpdateDocument] = useState<UpdateDocument>(updateDocument);
  const [AddpatientDocuments, setAddPatientDocuments] = useState<AddDocument>(addDocument);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const isModalOpens = useSelector((state: RootState) => state.modal.isOpen);
  const modalType = useSelector((state: RootState) => state.modal.modalType);

  const dispatch = useDispatch();
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setOpenIndex(0);
    }
  }, []);

  useEffect(() => {
    if (fetchPatientData) {
      const { id, country, patientData } = fetchPatientData;
      const { healthComplNumber, healthComplStartDate, healthComplEndDate } = patientData || {};
      setHealthPreviewImage(
        healthPreviewImage ? healthPreviewImage : patientData?.healthCompl?.url ? `${API_URL}${patientData.healthCompl.url}` : ""
      );
      // Set document update information
      setUpdateDocument({
        healthComplNumber: healthComplNumber || "",
        healthComplStartDate: healthComplStartDate || "",
        healthComplEndDate: healthComplEndDate || "",
        file: patientData?.healthCompl, // Default value for 'file'
      });

      if (healthComplStartDate) {
        const parts = healthComplStartDate.split("/");
        if (parts.length === 3) {
          const formattedDate = new Date(parts[2], parts[1] - 1, parts[0]); // Year, Month (0-based), Day
          setStartDate(formattedDate);
        }
      } else {
        setStartDate(undefined);
      }

      if (healthComplEndDate) {
        const parts = healthComplEndDate.split("/");
        if (parts.length === 3) {
          const formattedDate = new Date(parts[2], parts[1] - 1, parts[0]); // Year, Month (0-based), Day
          setEndDate(formattedDate);
        }
      } else {
        setEndDate(undefined);
      }
    }
  }, [fetchPatientData]);

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

  const handleInputChange = (field: string, value: string) => {
    const updatedPatient = { ...fetchPatientData };

    // Special logic for specific fields
    if (field === "patientData.socialSecurityNumber") {
      // Sanitize input: remove non-digits and limit to 15 characters
      value = value.replace(/\D/g, ""); // Remove non-digit characters
      if (value.length > 15) {
        value = value.slice(0, 15); // Limit to 15 characters
      }
    }

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
  const formatSocialSecurityNumber = (input: string) => {
    const parts = [];
    parts.push(input.slice(0, 1));
    parts.push(input.slice(1, 3));
    parts.push(input.slice(3, 5));
    parts.push(input.slice(5, 7));
    parts.push(input.slice(7, 10));
    parts.push(input.slice(10, 13));
    parts.push(input.slice(13, 15));
    return parts.filter(Boolean).join(" ");
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateDocument(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // setErrors({});
    setHealthPreviewImages("");
    const file = e.target.files?.[0];
    if (file) {
      try {
        // await createPatientFileSchema.validate({ file }, { abortEarly: false });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (imageTypes.includes(file.type)) {
            setHealthPreviewImages(reader.result as string);
          } else {
            setHealthPreviewImages("/images/paper-doc.svg");
          }

          setAddPatientDocuments(prevState => ({
            ...prevState,
            healthCompl: file, // Or you can store the file URL if needed
          }));

          const updatedPatient = {
            ...fetchPatientData,
            patientData: {
              ...fetchPatientData.patientData,
              healthCompl: file,
            },
          };
          dispatch(setPatientDetailsData(updatedPatient));
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        if (err.inner) {
          const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
          // setErrors(validationErrors);
        }
      } finally {
        // Nothing
      }
    }
    setUpdateDocument(prevState => ({ ...prevState, file: file }));
  };

  const handleAddDocumentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // setErrors({});
    setAddHealthPreviewImage("");
    const file = e.target.files?.[0];
    if (file) {
      try {
        // await createPatientFileSchema.validate({ file }, { abortEarly: false });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (imageTypes.includes(file.type)) {
            setAddHealthPreviewImage(reader.result as string);
          } else {
            setAddHealthPreviewImage("/images/paper-doc.svg");
          }

          setAddPatientDocuments(prevState => ({
            ...prevState,
            healthCompl: file, // Or you can store the file URL if needed
          }));

          const updatedPatient = {
            ...fetchPatientData,
            patientData: {
              ...fetchPatientData.patientData,
              healthCompl: file,
            },
          };
          dispatch(setPatientDetailsData(updatedPatient));
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        if (err.inner) {
          const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
          // setErrors(validationErrors);
        }
      } finally {
        // Nothing
      }
    }
  };
  const handleDeleteDocument = () => {
    closeEditModal();
    setDeleteDocument(true);
  };

  const handleAddFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddPatientDocuments(prevState => ({ ...prevState, [name]: value }));

    const updatedPatient = {
      ...fetchPatientData,
      patientData: {
        ...fetchPatientData.patientData,
        healthComplNumber: value,
      },
    };
    dispatch(setPatientDetailsData(updatedPatient));
  };
  const handleAddDocumentDateOptionChange = (name: string, date: any) => {
    date = date ? getFormateDate(date, "YYYY-MM-DD") : "";
    setAddPatientDocuments(prevState => ({ ...prevState, [name]: date }));
    if (name == "healthComplStartDate") {
      const updatedPatient = {
        ...fetchPatientData,
        patientData: {
          ...fetchPatientData.patientData,
          healthComplStartDate: date,
        },
      };
      dispatch(setPatientDetailsData(updatedPatient));
    }
    if (name == "healthComplEndDate") {
      const updatedPatient = {
        ...fetchPatientData,
        patientData: {
          ...fetchPatientData.patientData,
          healthComplEndDate: date,
        },
      };
      dispatch(setPatientDetailsData(updatedPatient));
    }
  };

  const openShowPreviewModal = () => {
    setPreviewImage(null);
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("showPreviewImage")));
  };
  const handleDeleteHealthCompl = () => {
    setAddHealthPreviewImage("");
    setAddPatientDocuments(prevState => ({ ...prevState, ["healthCompl"]: "" }));
  };
  const closeShowPreviewModal = () => {
    setPreviewImage(null);
    dispatch(closeModal());
  };

  const items = [
    {
      title: "PERSONNE À CONTACTER",
      content: (
        <DynamicHtmlTag type="div" className="w-full hidden lg:block">
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
          <DynamicHtmlTag type="div" className="flex flex-col mt-2 2xl:mt-4">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">Téléphone</CustomLabel>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="rounded-md border border-gray-200 flex items-center pe-2">
              <PhoneInputWithCountry
                value={fetchPatientData?.patientData?.phoneContactPerson ?? ""}
                onChange={handleChange}
                placeholder="Numéro de téléphone"
                containerClass="w-full overflow-hidden"
                inputClass="grow input outline-none focus:outline-none border-none border-[0px] h-auto pr-0 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug register-phone"
              />
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col mt-2 2xl:mt-4">
            <DynamicHtmlTag type="div" className="flex items-center w-full gap-2 justify-between">
              <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">Adresse email</CustomLabel>
            </DynamicHtmlTag>
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
      ),
    },
    {
      title: "NUMÉRO DE SÉCURITÉ SOCIALE",
      content: (
        <DynamicHtmlTag type="div" className="flex">
          <DynamicHtmlTag type="div" className="w-9/12 pe-3">
            <CustomLabel className="pb-1 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug ps-3">N° sécurité sociale</CustomLabel>
            <CustomInput
              value={formatSocialSecurityNumber(fetchPatientData?.patientData?.socialSecurityNumber || "")}
              onChange={e => handleInputChange("patientData.socialSecurityNumber", e.target.value)}
              type="text"
              name="socialSecurityNumber"
              placeholder="0 00 00 00 000 000 00"
              className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug 2xl:leading-tight py-1 px-2 outline-none w-full rounded-md border border-gray-200"
            />
            <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug block float-end opacity-75 pe-3">
              {15 - fetchPatientData?.patientData?.socialSecurityNumber?.length} caractères
            </CustomLabel>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="w-3/12 flex items-start justify-center">
            <CustomImage src="/images/ssn-demo.svg" alt="ssn sample img" width={73} height={55} className="m-auto" />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      ),
    },
    {
      title: "MUTUELLE",
      content: (
        <>
          {deleteDocument ? (
            <>
              <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row justify-end gap-2 xl:gap-x-5 mt-3 lg:mt-1 ssn-update-date-picker">
                <DynamicHtmlTag type="div" className="w-full lg:w-8/12 xl:w-9/12 flex flex-col justify-around">
                  <HeadingTag type="h4" className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug text-primary font-bold">
                    Mutuelle
                  </HeadingTag>
                  <DynamicHtmlTag type="div" className="form-group mt-0 2xl:mt-5">
                    <DynamicHtmlTag type="div" className="flex justify-between">
                      <DynamicHtmlTag type="span" className="px-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                        Numéro de la carte
                        <DynamicHtmlTag type="span" className="text-red-500 hidden">
                          *
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <CustomLabel className={`w-full input border py-1 px-2 xl:p-1 flex items-center gap-2 rounded-md mb-1`}>
                      <CustomInput
                        type="number"
                        name="healthComplNumber"
                        onChange={handleAddFieldChange}
                        value={AddpatientDocuments?.healthComplNumber}
                        className="grow input outline-none focus:outline-none border-none h-auto font-medium text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug"
                        placeholder="Numéro"
                      />
                    </CustomLabel>
                    <DynamicHtmlTag type="div" className="flex flex-row justify-between mt-0 2xl:mt-4">
                      <DynamicHtmlTag type="div" className="form-group w-[49%]">
                        <DynamicHtmlTag type="div" className="flex justify-between">
                          <DynamicHtmlTag type="span" className="px-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                            Date de début
                            <DynamicHtmlTag type="span" className="text-red-500 hidden">
                              *
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        <DynamicHtmlTag
                          type="div"
                          className={`date-picker relative flex items-center space-x-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug grow input border register-field border-gray-400 py-1 px-2 gap-2 rounded-md`}>
                          <CustomDatePicker
                            dateFormat={"dd/MM/yyyy"}
                            todayButton="Aujourd'hui"
                            selected={AddpatientDocuments?.healthComplStartDate}
                            onChange={(date: any) => handleAddDocumentDateOptionChange("healthComplStartDate", date)}
                            placeholderText="jj/mm/aaaa"
                            className="grow input outline-none focus:outline-none border-none h-auto text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug w-11/12"
                          />
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="form-group w-[49%]">
                        <DynamicHtmlTag type="div" className="flex justify-between">
                          <DynamicHtmlTag type="span" className="px-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                            Date de fin
                            <DynamicHtmlTag type="span" className="text-red-500 hidden">
                              *
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        <DynamicHtmlTag
                          type="div"
                          className={`date-picker relative flex items-center space-x-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug grow input border register-field border-gray-400 py-1 px-2 gap-2 rounded-md`}>
                          <CustomDatePicker
                            dateFormat={"dd/MM/yyyy"}
                            selected={AddpatientDocuments?.healthComplEndDate}
                            onChange={(date: any) => handleAddDocumentDateOptionChange("healthComplEndDate", date)}
                            todayButton="Aujourd'hui"
                            placeholderText="jj/mm/aaaa"
                            className="grow input outline-none focus:outline-none border-none h-auto text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug w-11/12"
                          />
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag
                  type="div"
                  className="w-full lg:w-4/12 xl:w-3/12 flex items-center justify-around xl:justify-end pb-7 lg:pb-0 pt-5 lg:pt-0 gap-3 flex-row lg:flex-col">
                  {addhealthPreviewImage ? (
                    <DynamicHtmlTag type="div" className="relative group">
                      <CustomImage src={addhealthPreviewImage} alt="preview" width={120} height={60} className="w-20 h-20" />
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
                    <CustomImage
                      src="/images/mutual-img.svg"
                      alt="mutual-doc"
                      width={120}
                      height={60}
                      className="w-20 h-20 lg:w-14 lg:h-14 xl:w-20 xl:h-20"
                    />
                  )}
                  {/* This image for document attach */}
                  {/* <CustomImage src="/images/paper-doc.svg" alt="paper-doc" width={120} height={60} className="w-1/2 xl:w-7/12" /> */}
                  <CustomButton
                    className={`text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug cstm-btn mx-auto flex px-8 py-1 lg:px-2 lg:py-2 justify-center lg:w-full view-more-btn rounded-full text-white`}
                    onClick={() => fileInputRef.current?.click()}>
                    Importer
                  </CustomButton>
                  <CustomInput type="file" ref={fileInputRef} id="fileInput" className="hidden" onChange={handleAddDocumentFileChange} />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </>
          ) : (
            <>
              <DynamicHtmlTag type="div" className="flex">
                <DynamicHtmlTag type="div" className="w-9/12 pe-3">
                  <HeadingTag type="h4" className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs leading-5 lg:leading-3 xl:leading-4">
                    Votre mutuelle est à jour
                  </HeadingTag>
                  <HeadingTag type="h4" className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs leading-5 lg:leading-3 xl:leading-4">
                    <DynamicHtmlTag type="span"> N° carte :</DynamicHtmlTag>{" "}
                    <DynamicHtmlTag type="span">{fetchPatientData?.patientData?.healthComplNumber}</DynamicHtmlTag>
                  </HeadingTag>
                  <HeadingTag type="h4" className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs leading-5 lg:leading-3 xl:leading-4">
                    <DynamicHtmlTag type="span">Validité : </DynamicHtmlTag>{" "}
                    {fetchPatientData?.patientData?.healthComplStartDate == undefined ||
                    fetchPatientData?.patientData?.healthComplEndDate == undefined ? (
                      ""
                    ) : (
                      <DynamicHtmlTag type="span">{`Du ${fetchPatientData?.patientData?.healthComplStartDate} au ${fetchPatientData?.patientData?.healthComplEndDate}`}</DynamicHtmlTag>
                    )}
                  </HeadingTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-3/12">
                  <CustomImage
                    src={healthPreviewImage ? healthPreviewImage : "/images/mutual-sample-img.svg"}
                    alt="mutual-sample-img"
                    width={90}
                    height={55}
                    className="m-auto"
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex gap-x-3 justify-center mt-2 xl:mt-6">
                <CustomButton
                  type="button"
                  className="card-btn text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs w-2/6 py-1 text-white rounded-xl"
                  onClick={openAddChildModal}>
                  Modifier
                </CustomButton>
                <CustomButton
                  type="button"
                  onClick={openEditModal}
                  className="card-btn text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs w-2/6 py-1 text-white rounded-xl">
                  Supprimer
                </CustomButton>
              </DynamicHtmlTag>
            </>
          )}
        </>
      ),
    },
  ];

  const handleToggle = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleEndDateChange = (date: any) => {
    setEndDate(date);
    date = date ? getFormateDate(date, "DD/MM/YYYY") : "";
    setUpdateDocument(prevState => ({ ...prevState, ["healthComplEndDate"]: date }));
  };
  // Datetime picker change event

  const handleDateOptionChange = (date: any) => {
    setStartDate(date);
    date = date ? getFormateDate(date, "DD/MM/YYYY") : "";
    setUpdateDocument(prevState => ({ ...prevState, ["healthComplStartDate"]: date }));
  };

  const handleUpdateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    // Directly access the native event's target and check the clicked button
    const action = (e.nativeEvent as any).submitter?.getAttribute("name");
    if (action === "cancel") {
      // Handle cancel action
      closeAddChildModal();
      setHealthPreviewImages("");
      return; // Exit early if cancel
    }
    const healthCompl = DataUpdateDocument?.file;
    dispatch(sethealthcardImage(healthCompl));
    if (healthCompl) {
      try {
        // await createPatientFileSchema.validate({ file }, { abortEarly: false });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (imageTypes.includes(healthCompl.type)) {
            setHealthPreviewImage(reader.result as string);
          } else {
            setHealthPreviewImage("/images/paper-doc.svg");
          }
          dispatch(sethealthcardImage(healthCompl));
        };
        reader.readAsDataURL(healthCompl);
      } catch (err: any) {
        if (err.inner) {
          const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
          // setErrors(validationErrors);
        }
      } finally {
        // Nothing
      }
    }
    const updatedPatient = {
      ...fetchPatientData,
      patientData: {
        ...fetchPatientData.patientData,
        healthComplNumber: DataUpdateDocument?.healthComplNumber,
        healthComplStartDate: DataUpdateDocument?.healthComplStartDate,
        healthComplEndDate: DataUpdateDocument?.healthComplEndDate,
        //healthCompl: DataUpdateDocument?.file,
      },
    };
    dispatch(setPatientDetailsData(updatedPatient));
    // Close the modal after submission
    closeAddChildModal();
  };

  return (
    <DynamicHtmlTag type="div" className="w-full">
      <DynamicHtmlTag type="div" className="lg:px-2 2xl:px-4 lg:py-2 pt-0">
        {items.map((item, index) => (
          <AccordionItem key={index} title={item.title} isOpen={openIndex === index} onToggle={() => handleToggle(index)}>
            {item.content}
          </AccordionItem>
        ))}
      </DynamicHtmlTag>
      {/* Add Members Custom Modal Starts */}
      <CustomModal id="add_user_modal" isOpen={isModalOpen} onClose={closeAddChildModal} modalClassName="w-full sm:max-w-1/2 md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 p-4">
            <HeadingTag type="h3" className="text-blue text-sm md:text-lg flex items-center gap-2">
              Mettre à jour votre carte mutuelle
              <MdClose
                onClick={closeAddChildModal}
                className="ms-auto cursor-pointer text-blue border border-blue rounded-full h-6 p-1 hover:bg-primary hover:border-primary hover:text-white w-6"
              />
            </HeadingTag>
            <CustomForm className="pt-5 space-y-3" onSubmit={e => handleUpdateDocument(e)}>
              <DynamicHtmlTag type="div" className="form-group w-full items-start">
                <DynamicHtmlTag type="p" className="text-xs md:text-base text-blue pb-1">
                  Entrez le numéro de votre carte mutuelle
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="">
                  <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-lg h-8 mb-1">
                    <CustomInput
                      type="number"
                      name="healthComplNumber"
                      onChange={handleFieldChange}
                      className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0"
                      placeholder="Numéro de la carte"
                      value={DataUpdateDocument.healthComplNumber}
                    />
                  </CustomLabel>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="form-group w-full items-start">
                <DynamicHtmlTag type="p" className="text-xs md:text-base text-blue">
                  Entrez la période de validité
                </DynamicHtmlTag>
                <DynamicHtmlTag type="p" className="text-xs md:text-base text-blue pb-1">
                  Date de début{" "}
                  <DynamicHtmlTag type="span" className="font-normal text-[12px]">
                    (champ obligatoire)
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="input border border-gray-400 p-2 flex items-center gap-2 rounded-lg h-8 mb-1">
                  <DynamicHtmlTag type="div" className="form-date-picker date-picker text-sm">
                    <CustomDatePicker
                      selected={startDate}
                      onChange={(date: any) => handleDateOptionChange(date)}
                      dateFormat={"dd/MM/yyyy"}
                      placeholderText="jj/mm/aaaa"
                      maxDate={new Date()}
                    />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="form-group w-full items-start">
                <DynamicHtmlTag type="p" className="text-xs md:text-base text-blue pb-1">
                  Date de fin{" "}
                  <DynamicHtmlTag type="span" className="font-normal text-[12px]">
                    (champ obligatoire)
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="">
                  <DynamicHtmlTag type="div" className="input border border-gray-400 p-2 flex items-center gap-2 rounded-lg h-8 mb-1">
                    <DynamicHtmlTag type="div" className="form-date-picker date-picker text-sm">
                      <CustomDatePicker
                        selected={endDate}
                        onChange={(date: any) => handleEndDateChange(date)}
                        dateFormat={"dd/MM/yyyy"}
                        placeholderText="jj/mm/aaaa"
                        maxDate={new Date()}
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="form-group w-full items-start">
                <DynamicHtmlTag type="p" className="text-xs md:text-base text-blue pb-1">
                  Ajoutez un fichier{" "}
                  <DynamicHtmlTag type="span" className="font-normal text-[12px]">
                    (pdf, jgp, png)
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                {healthPreviewImages || healthPreviewImage ? (
                  <CustomLabel htmlFor="file-change" className="">
                    <CustomInput type="file" className="hidden" id="file-change" ref={fileInputRef} onChange={handleFileChange} />
                    <DynamicHtmlTag type="div" className="w-full h-auto px-2 mt-5">
                      <DynamicHtmlTag type="div" className="flex items-center justify-center h-52 rounded-lg cursor-pointer">
                        <CustomImage
                          src={`${healthPreviewImages ? healthPreviewImages : healthPreviewImage}`}
                          alt="cloud"
                          width={100}
                          height={100}
                          className="w-full h-52 object-contain"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </CustomLabel>
                ) : (
                  <>
                    <CustomInput ref={fileInputRef} onChange={handleFileChange} type="file" className="hidden" id="file-change"></CustomInput>
                    <CustomLabel htmlFor="file-change" className="">
                      <DynamicHtmlTag type="div" className="w-full h-auto">
                        <DynamicHtmlTag type="div" className="flex items-center justify-center h-40 md:h-[230px] rounded-lg cstm-file-upload">
                          <DynamicHtmlTag type="div" className="flex flex-col items-center border-blue-300 rounded-lg p-8">
                            <DynamicHtmlTag type="div" className="text-center">
                              <DynamicHtmlTag type="div" className="w-full flex justify-center items-center">
                                <CustomImage src="/images/cloud-icon.svg" alt="cloud" width={100} height={100} className="w-14 md:w-28" />
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="text-base-100 font-bold mt-2">
                                <DynamicHtmlTag type="div" className="sm:text-[12px] md:text-[16px] lg:text-[16px]">
                                  Faites glisser votre fichier ici
                                </DynamicHtmlTag>
                                <DynamicHtmlTag type="div" className="mb-4 sm:text-[12px] md:text-[16px] lg:text-[16px]">
                                  ou
                                </DynamicHtmlTag>
                                <CustomButton
                                  onClick={() => fileInputRef.current?.click()}
                                  className="bg-[white] text-[#00AFC7] text-sm md:text-base px-5 md:px-10 py-2 rounded-full">
                                  importer
                                </CustomButton>
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </CustomLabel>
                  </>
                )}
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex justify-between pt-6">
                <CustomButton
                  name="cancel" // Unique identifier for cancel button
                  type="submit"
                  className="btn btn-danger text-xs md:text-sm rounded-full">
                  Annuler
                </CustomButton>
                <CustomButton
                  name="submit" // Unique identifier for submit button
                  type="submit"
                  className="btn btn-primary text-xs md:text-sm card-btn rounded-full">
                  Valider
                </CustomButton>
              </DynamicHtmlTag>
            </CustomForm>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>

      {/* delete Document Modal Box */}
      <CustomModal isOpen={editModalOpen} onClose={closeEditModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 py-3 lg:py-6 px-4 lg:px-8">
            <HeadingTag type="h4" className="text-blue font-bold text-sm lg:text-lg xl:text-xl flex items-center justify-between gap-2 pl-2">
              Suppression de votre mutuelle
              <CustomButton onClick={closeEditModal} type="button" className="w-fit inline-block custom-grey-btn p-0.5 rounded-full">
                <IoClose />
              </CustomButton>
            </HeadingTag>
            <DynamicHtmlTag
              type="div"
              className="text-blue py-8 px-2 w-11/12 lg:w-8/12 xl:w-10/12 text-center font-semibold text-sm lg:text-lg mx-auto">
              Êtes-vous sûr de vouloir supprimer votre mutuelle n° {fetchPatientData?.patientData?.healthComplNumber}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-2/3 flex items-center justify-center gap-3 mx-auto mt-4 lg:mt-6">
              <CustomButton
                onClick={handleDeleteDocument}
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

      {modalType === "showPreviewImage" && (
        <CustomModal
          id="show_Image"
          isOpen={isModalOpens && modalType === "showPreviewImage"}
          onClose={closeShowPreviewModal}
          modalClassName="w-full sm:max-w-1/2 md:max-w-6xl rounded-xl">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 p-4">
              <HeadingTag type="h3" className="text-blue text-sm md:text-lg flex items-center gap-2">
                Tous mes documents
                <MdClose
                  onClick={closeShowPreviewModal}
                  className="ms-auto cursor-pointer text-blue border border-blue rounded-full h-6 p-1 hover:bg-primary hover:border-primary hover:text-white w-6"
                />
              </HeadingTag>
              <DynamicHtmlTag type="div" className="w-full flex items-center justify-center mt-5">
                <CustomImage
                  src={addhealthPreviewImage || ""}
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
};

export default SsnNumber;
