"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  CustomButton,
  CustomDatePicker,
  CustomFullScreenLoader,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomSelect,
  CustomTextarea,
  DeleteModal,
  DynamicHtmlTag,
  EmptyHistory,
  HeadingTag,
  Pagination,
  VisioLogo,
} from "@/components";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IoCloseSharp } from "react-icons/io5";
import {
  addAllergyApi,
  addallergyUpdateApi,
  AddMedicalAllergySchema,
  allergyMotifOption,
  AllergyMotifType,
  deleteAllergyApi,
  fetchMedicalAllergyApi,
  getFormateDate,
  getFormateDatetwoDateformate,
  getListAllergyApi,
  MedicalProfileAllergy,
  profileMedicalDeleteMessage,
  UpdateMedicalAllergySchema,
} from "@/utility";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { RootState } from "@/store";
import { toast } from "react-toastify";
import { selectPatientDetailsData } from "@/store/reducers/patientDetailsSlice";

const itemsPerPage = 10;

const createallergyParams = {
  allergyMotif: "",
  isMedicalProduct: "", // Only store boolean values here
  isUnkownHowManifestAllergy: false,
  startDate: "",
  howAllergyManifest: "",
};
const UpdateAllergyParams = {
  allergyMotif: "",
  isMedicalProduct: "", // Only store boolean values here
  isUnkownHowManifestAllergy: false,
  startDate: "",
  howAllergyManifest: "",
};
const Allergies = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddAllergiesModalOpen, setIsAddAllergiesModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [startDate, setStartDate] = useState<Date>();
  const [UpdatestartDate, setUpdateStartDate] = useState<Date>();

  const [errors, setErrors] = useState<MedicalProfileAllergy>();
  const [Updateerrors, setUpdateErrors] = useState<MedicalProfileAllergy>();

  const [Allergylist, setAllergy] = useState<AllergyMotifType[]>([]);
  const [UpdatemedicalProfileAllergy, setUpdatemedicalProfileAllergy] = useState<MedicalProfileAllergy>(UpdateAllergyParams);
  const [AllergyId, setAllergyId] = useState(String);
  const fetchPatientData = useSelector(selectPatientDetailsData);

  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [defaultAllergyMotifOptions, setDefaultAllergyMotifOptions] = useState<allergyMotifOption[]>([]);
  const [isUnknownSelected, setIsUnknownSelected] = useState(false); // Tracks the "Je ne sais pas" checkbox state
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoginResponse);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [medicalProfileAllergy, setmedicalProfileAllergy] = useState<MedicalProfileAllergy>(createallergyParams);
  const [AllergyDeleteName, setAllergyDeleteName] = useState();
  const [listDelete, setListDelete] = useState<number | undefined>();

  const fetchMedicalAllergy = useCallback(async () => {
    try {
      const response: any[] = await fetchMedicalAllergyApi();
      const allergyMotifOptions: allergyMotifOption[] = response.map(treatment => ({
        value: treatment.id,
        label: treatment.name,
      }));
      setDefaultAllergyMotifOptions(allergyMotifOptions);
    } catch (error) {
      setDefaultAllergyMotifOptions([]);
    }
  }, []);
  const fetchAllergyList = useCallback(async () => {
    try {
      const data = await getListAllergyApi(fetchPatientData?.id, currentPage, itemsPerPage);
      setTotalPages(data?.data?.totalPage || 0);
      setTotalItems(data?.data?.totalCount || 0);
      setAllergy(data?.data?.results || []);
    } catch (error) {}
  }, [currentPage, fetchPatientData?.id]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("medical-profile"));
      try {
        await fetchMedicalAllergy();
        await fetchAllergyList();
      } catch (err) {
      } finally {
        dispatch(hideLoader());
      }
    };
    fetchData();
  }, [fetchMedicalAllergy, fetchAllergyList]);

  const handleCheckboxChange = (option: string) => {
    setSelectedOption(option);
    // Update the `isMedicalProduct` field in the state based on the selected option
    setmedicalProfileAllergy(prevState => ({
      ...prevState,
      isMedicalProduct: option === "Oui", // Set to true for "Oui", false for "Non"
    }));
    setErrors((prevErrors: any) => ({ ...prevErrors, isMedicalProduct: undefined }));
  };
  const deleteAllergy = async (allergyId: number) => {
    const pateientId = fetchPatientData?.id;
    try {
      const response = await deleteAllergyApi(pateientId, allergyId);
      toast.success(profileMedicalDeleteMessage.AllergieDeleteMessage);
      closeDeleteModal();
      fetchAllergyList();
    } catch (error: any) {
      // const errorMessage = error.response?.data?.message;
    } finally {
    }
  };

  const handleToggleRow = (rowId: any) => {
    // Set expanded row state
    setExpandedRow(prevExpandedRow => (prevExpandedRow === rowId.id ? null : rowId.id));
    setUpdateErrors(UpdateAllergyParams);
    // Update allergy data in state
    setUpdatemedicalProfileAllergy(prevState => ({
      ...prevState,
      allergyMotif: {
        value: rowId.allergyMotif.id,
        label: rowId.allergyMotif.name,
      },
      howAllergyManifest: rowId.howAllergyManifest,
      isMedicalProduct: rowId.medicalProduct,
      isUnkownHowManifestAllergy: rowId.unkownHowManifestAllergy, // Ensure the value is set from the row data
      startDate: rowId.startDate,
    }));

    // Update allergy ID
    setAllergyId(rowId.id);

    // Parse start date if available
    if (rowId.startDate) {
      const [day, month, year] = rowId.startDate.split("/").map(Number);
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate.getTime())) setUpdateStartDate(parsedDate);
    }
  };

  const handleDateOptionChange = (date: any) => {
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";

    setStartDate(date);
    setmedicalProfileAllergy((prevState: MedicalProfileAllergy) => ({
      ...prevState,
      startDate: formattedDate,
    }));
    setErrors((prevErrors: any) => ({ ...prevErrors, startDate: undefined }));
  };
  const handleDateUpdateOptionChange = (date: any) => {
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";

    setUpdateStartDate(date);
    setUpdatemedicalProfileAllergy((prevState: MedicalProfileAllergy) => ({
      ...prevState,
      startDate: formattedDate,
    }));
    setUpdateErrors((prevErrors: any) => ({ ...prevErrors, startDate: undefined }));
  };
  const handlePageChange = (selected: { selected: number }) => {
    setCurrentPage(selected.selected);
  };

  const handleUnknownCheckboxChange = () => {
    setIsUnknownSelected(prevState => !prevState); // Toggle the state
    setmedicalProfileAllergy(prevState => ({
      ...prevState,
      isUnkownHowManifestAllergy: !prevState.isUnkownHowManifestAllergy, // Sync state with checkbox
      howAllergyManifest: !prevState.isUnkownHowManifestAllergy ? "" : prevState.howAllergyManifest, // Clear textarea value if checked
    }));
  };

  const openAddModal = () => {
    setModalMode("add");
  };
  const handleFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Prevent input type "time" and enforce 500-character limit
    const isValidInput = /^[^\d:]*$/.test(value); // Rejects "time" formats (e.g., 12:34)
    if (value.length > 250 || !isValidInput) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        howAllergyManifest: "Maximum 250 characters allowed, and time input is not valid.",
      }));
      return; // Do not proceed with invalid input
    }

    // Update the field value in state
    setmedicalProfileAllergy(prevState => ({ ...prevState, [name]: value }));

    // Validate the field and update errors
    AddMedicalAllergySchema.validateAt("howAllergyManifest", { ...medicalProfileAllergy, [name]: value })
      .then(() => {
        // Clear error if validation passes
        setErrors((prevErrors: any) => ({ ...prevErrors, howAllergyManifest: undefined }));
      })
      .catch((err: any) => {
        // Set error message if validation fails
        setErrors((prevErrors: any) => ({ ...prevErrors, howAllergyManifest: err.message }));
      });
  };

  const handleFieldUpdateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update the field value in state
    setUpdatemedicalProfileAllergy(prevState => ({ ...prevState, [name]: value }));

    // Validate the field and update errors
    UpdateMedicalAllergySchema.validateAt("howAllergyManifest", { ...UpdatemedicalProfileAllergy, [name]: value })
      .then(() => {
        // Clear error if validation passes
        setUpdateErrors((prevErrors: any) => ({ ...prevErrors, howAllergyManifest: undefined }));
      })
      .catch((err: any) => {
        // Set error message if validation fails
        setUpdateErrors((prevErrors: any) => ({ ...prevErrors, howAllergyManifest: err.message }));
      });
  };
  // DeleteModalBox
  const openDeleteModal = () => setIsModalOpen(true);
  const closeDeleteModal = () => setIsModalOpen(false);

  const openAddAllergyModal = () => setIsAddAllergiesModalOpen(true);

  const closeAddAllergyModal = () => {
    setIsAddAllergiesModalOpen(false);
    setmedicalProfileAllergy(createallergyParams);
    setStartDate(undefined);
    setErrors(createallergyParams);
  };
  // EditModalBox
  const openEditModal = () => {
    setIsModalOpen(true);
  };
  const closeEditModal = () => setIsModalOpen(false);
  const handleUpdateSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Conditionally add endDate if isFinished is true
    const model: any = {
      patientId: fetchPatientData?.id.toString(),
      allergyId: AllergyId.toString(),
      allergyMotif: UpdatemedicalProfileAllergy.allergyMotif?.value,
      isMedicalProduct: UpdatemedicalProfileAllergy.isMedicalProduct, // Only store boolean values here
      startDate: getFormateDatetwoDateformate(UpdatemedicalProfileAllergy.startDate || ""),
      isUnkownHowManifestAllergy: UpdatemedicalProfileAllergy.isUnkownHowManifestAllergy,
    };
    if (UpdatemedicalProfileAllergy.isUnkownHowManifestAllergy === false) {
      model.howAllergyManifest = UpdatemedicalProfileAllergy.howAllergyManifest;
    }
    try {
      await UpdateMedicalAllergySchema.validate(UpdatemedicalProfileAllergy, { abortEarly: false });
      dispatch(showLoader("medical-profile"));
      setExpandedRow(null);
      // Call API to add medical history
      await addallergyUpdateApi(model);

      // Reset form fields and errors after successful submission
      fetchAllergyList();
    } catch (err: any) {
      // Yup validation errors
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setUpdateErrors(validationErrors);
      }
      // API other errors
      let errorMessage = err.response?.data?.message;
      // setRegisterError(errorMessage);
    } finally {
      // setIsLoading(false);
      dispatch(hideLoader());
    }
  };
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const model: any = {
      patientId: fetchPatientData?.id,
      allergyMotif: medicalProfileAllergy.allergyMotif,
      isMedicalProduct: medicalProfileAllergy.isMedicalProduct, // Only store boolean values here
      startDate: medicalProfileAllergy.startDate,
      isUnkownHowManifestAllergy: medicalProfileAllergy.isUnkownHowManifestAllergy,
    };

    if (medicalProfileAllergy.isUnkownHowManifestAllergy === false) {
      model.howAllergyManifest = medicalProfileAllergy.howAllergyManifest;
    }
    try {
      // Validate data
      await AddMedicalAllergySchema.validate(medicalProfileAllergy, { abortEarly: false });
      dispatch(showLoader("medical-profile")); // Ensure the loader is shown immediately
      // Call API
      await addAllergyApi(model);
      fetchAllergyList();
      // Reset state
      // fetchTreatmentList();
      setmedicalProfileAllergy(createallergyParams);
      setStartDate(undefined);
      setErrors(createallergyParams);
      closeAddAllergyModal();
    } catch (err: any) {
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setErrors(validationErrors);
      }
    } finally {
      // Add a slight delay to ensure loader visibility
      setTimeout(() => dispatch(hideLoader()), 500); // Optional delay for better UX
    }
  };
  const handleDeleteModal = (item: any) => {
    setListDelete(item.id); // Ensure item is a number here
    setAllergyDeleteName(item?.allergyMotif?.name);
    openDeleteModal();
  };

  return (
    <DynamicHtmlTag type="div" className="bg-white rounded-xl h-[92%]">
      <DynamicHtmlTag type="div" className="bg-gradient-to-t from-[#49BBBC] to-[#9DCB8C] rounded-t-xl pt-0">
        <HeadingTag type="h3" className="font-semibold text-sm text-white text-center py-1 px-3">
          Allergies
        </HeadingTag>
      </DynamicHtmlTag>

      <DynamicHtmlTag type="div" className="w-full px-3 py-2 relative h-full main-tab-inner">
        <DynamicHtmlTag
          type="div"
          className={`max-h-table overflow-auto min-w-full bg-white ${Allergylist.length === 0 ? "h-full" : "h-[88%]"} pt-10 lg:pt-0`}>
          <DynamicHtmlTag type="div" className="w-full h-12 bg-white absolute top-0 z-10 left-0 right-0 block lg:hidden ps-2">
            <CustomButton
              onClick={openAddAllergyModal}
              as="button"
              className="card-btn text-2xs lg:text-xs text-white py-1.5 lg:py-2 px-3 font-semibold rounded-2xl absolute top-2 lg:hidden">
              Ajouter une allergie
            </CustomButton>
          </DynamicHtmlTag>
          {isLoading ? (
            <CustomFullScreenLoader />
          ) : (
            <table className={`min-w-full bg-white border-collapse ${Allergylist.length === 0 ? "h-full" : "h-auto"}`}>
              {Allergylist.length === 0 ? (
                ""
              ) : (
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-slate-100 bg-white text-[2vw] md:text-2xs">
                    <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100">
                      <DynamicHtmlTag type="div" className="line-clamp-1">
                        Allergie
                      </DynamicHtmlTag>
                    </th>
                    <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100 hidden md:table-cell">
                      <DynamicHtmlTag type="div" className="line-clamp-1">
                        Effet
                      </DynamicHtmlTag>
                    </th>
                    <th className="p-1 lg:py-2 lg:px-2 text-center font-medium text-slate-100">
                      <DynamicHtmlTag type="div" className="line-clamp-1">
                        Date de découverte
                      </DynamicHtmlTag>
                    </th>
                    <th className="p-1 lg:py-2 lg:px-2 text-center font-medium text-slate-100">
                      <DynamicHtmlTag type="div" className="line-clamp-1">
                        Ajouté le
                      </DynamicHtmlTag>
                    </th>

                    <th className="p-1 lg:py-2 lg:px-2 text-center font-medium text-slate-100">
                      <DynamicHtmlTag type="div" className="line-clamp-1">
                        Action
                      </DynamicHtmlTag>
                    </th>
                  </tr>
                </thead>
              )}
              <tbody>
                {Allergylist.length === 0 ? (
                  <EmptyHistory
                    onConfirm={openAddAllergyModal}
                    title="Aucune mesure d’allergies n’a été enregistrée pour le moment."
                    paragraph={`Aucune mesure de allergies n{"'"}a été enregistrée pour le moment.`}
                    button="Ajouter un allergies"
                    uniqueId="3"
                  />
                ) : (
                  // <DynamicHtmlTag
                  //   type="span"
                  //   className="max-w-max text-center text-xs lg:text-base py-1 md:absolute top-1/2 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 empty-image-main">
                  //   <CustomImage src={VisioLogo} alt="logo" className="loader-logo mx-auto mb-2" width={500} height={200} />
                  //   Aucune mesure de allergies n{"'"}a été enregistrée pour le moment.
                  // </DynamicHtmlTag>
                  Allergylist.map(allergy => (
                    <React.Fragment key={allergy?.id}>
                      {/* Main Row */}
                      <tr
                        className="cursor-pointer text-[2vw] md:text-[1.2vw] lg:text-2xs font-bold border-t border-slate-100"
                        onClick={() => handleToggleRow(allergy)}>
                        <td className="p-1 lg:py-3 lg:px-2">
                          <DynamicHtmlTag type="span" className="line-clamp-1">
                            {allergy?.allergyMotif.name}
                          </DynamicHtmlTag>
                        </td>
                        <td className="p-1 lg:py-3 lg:px-2 max-w-56 hidden md:table-cell">
                          <DynamicHtmlTag type="span" className="font-bold break-all">
                            {allergy?.howAllergyManifest}
                          </DynamicHtmlTag>
                        </td>
                        <td className="p-1 lg:py-3 lg:px-2 text-center">
                          <DynamicHtmlTag type="span" className="line-clamp-1">
                            {allergy?.startDate}
                          </DynamicHtmlTag>
                        </td>
                        <td className="p-1 lg:py-3 lg:px-2 text-center">
                          <DynamicHtmlTag type="span" className="line-clamp-1">
                            {allergy?.createdAt}
                          </DynamicHtmlTag>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <DynamicHtmlTag type="div" className="flex items-center space-x-4 justify-center">
                            <CustomButton type="button">
                              <CustomImage className="w-4 h-4 max-w-max" src="/images/pencil-edit.svg" alt="Edit" width={16} height={16} />
                            </CustomButton>
                            <CustomButton
                              type="button"
                              onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                event.stopPropagation();
                                handleDeleteModal(allergy);
                              }}>
                              <CustomImage className="w-4 h-4 max-w-max" src="/images/trash.svg" alt="Delete" width={16} height={16} />
                            </CustomButton>
                          </DynamicHtmlTag>
                        </td>
                      </tr>
                      <tr className="md:hidden">
                        <td colSpan={5}>
                          <DynamicHtmlTag type="div" className="bg-gray-400 bg-opacity-40 rounded-lg font-bold w-full flex px-2 gap-2 mb-2">
                            <DynamicHtmlTag type="div" className="py-2 w-full text-[2vw] md:text-3xs">
                              <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                                Effet
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="span" className="font-semibold break-all">
                                {allergy?.howAllergyManifest}
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </td>
                      </tr>
                      {/* Collapsible Row */}
                      {expandedRow === allergy.id && (
                        <tr className="bg-base-100 z-20">
                          <td colSpan={5} className="">
                            <DynamicHtmlTag type="div" className="max-h-auto">
                              <DynamicHtmlTag type="div" className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-2 px-2">
                                <DynamicHtmlTag type="div" className="col-span-1">
                                  <DynamicHtmlTag type="div">
                                    <DynamicHtmlTag type="div" className="flex items-center justify-between">
                                      <CustomLabel className="text-2xs 2xl:text-xs px-2 font-semibold">
                                        Allergie
                                        <DynamicHtmlTag type="span" className="text-red-500">
                                          *
                                        </DynamicHtmlTag>
                                      </CustomLabel>
                                      {Updateerrors?.allergyMotif && (
                                        <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                                          {Updateerrors?.allergyMotif}
                                        </DynamicHtmlTag>
                                      )}
                                    </DynamicHtmlTag>
                                    <CustomSelect
                                      name="allergy"
                                      value={
                                        defaultAllergyMotifOptions.find(option => option.value === UpdatemedicalProfileAllergy.allergyMotif?.value) ||
                                        null
                                      }
                                      onChange={(selectedOption: { value: number; label: string } | null) => {
                                        setUpdatemedicalProfileAllergy(prevState => ({
                                          ...prevState,
                                          allergyMotif: selectedOption || "", // Store the full selected option or empty string
                                        }));

                                        setUpdateErrors((prevState: any) => ({
                                          ...prevState,
                                          allergyMotif: "", // Clear any existing error
                                        }));
                                      }}
                                      isClearable
                                      options={defaultAllergyMotifOptions}
                                      placeholder="Sélectionnez une allergies"
                                      className={`${Updateerrors?.allergyMotif ? "border-red-500" : "border-gray-200"} w-full p-2 countries-select text-2xs 2xl:text-xs text-black placeholder-black border rounded-lg mb-1 `}
                                    />
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div" className="w-full xl:my-2">
                                    <DynamicHtmlTag type="div" className="flex justify-between items-center">
                                      <CustomLabel className="text-2xs 2xl:text-xs w-8/12 md:w-11/12">
                                        S’agit t-il d’un médicament ou d’un produit médical ?{" "}
                                        <DynamicHtmlTag type="span" className="text-red-500">
                                          *
                                        </DynamicHtmlTag>
                                      </CustomLabel>
                                      {Updateerrors?.isMedicalProduct && (
                                        <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                                          {Updateerrors?.isMedicalProduct}
                                        </DynamicHtmlTag>
                                      )}
                                    </DynamicHtmlTag>
                                    <DynamicHtmlTag type="div" className="flex gap-10 mt-3">
                                      <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                                        <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                          <CustomInput
                                            className=""
                                            type="checkbox"
                                            id="affection-Oui"
                                            checked={UpdatemedicalProfileAllergy.isMedicalProduct == true}
                                            onChange={() => {
                                              setUpdatemedicalProfileAllergy(prevState => ({
                                                ...prevState,
                                                isMedicalProduct: true, // Set `isFinished` to true
                                              }));
                                              setUpdateErrors((prevErrors: any) => ({
                                                ...prevErrors,
                                                isMedicalProduct: undefined, // Clear the error for isMedicalProduct
                                              }));
                                            }}
                                          />
                                          <CustomLabel
                                            className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]"
                                            htmlFor="affection-Oui">
                                            <CustomImage
                                              src="/images/checkbox-img.svg"
                                              alt="checkbox"
                                              width={100}
                                              height={100}
                                              className="checkmark w-full"
                                            />
                                          </CustomLabel>
                                        </DynamicHtmlTag>
                                        <CustomLabel htmlFor="affection" className="ps-2 text-2xs 2xl:text-xs font-normal cstm-lable">
                                          Oui
                                        </CustomLabel>
                                      </DynamicHtmlTag>
                                      <DynamicHtmlTag type="div" className="cstm-form-group flex items-center  justify-center">
                                        <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                          <CustomInput
                                            className=""
                                            type="checkbox"
                                            id="affection-non"
                                            checked={UpdatemedicalProfileAllergy.isMedicalProduct == false}
                                            onChange={() => {
                                              setUpdatemedicalProfileAllergy(prevState => ({
                                                ...prevState,
                                                isMedicalProduct: !prevState.isMedicalProduct, // Toggle between true and false
                                              }));
                                              setUpdateErrors((prevErrors: any) => ({
                                                ...prevErrors,
                                                isMedicalProduct: undefined, // Clear the error for isMedicalProduct
                                              }));
                                            }}
                                          />
                                          <CustomLabel
                                            className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]"
                                            htmlFor="affection-non">
                                            <CustomImage
                                              src="/images/checkbox-img.svg"
                                              alt="checkbox"
                                              width={100}
                                              height={100}
                                              className="checkmark w-full"
                                            />
                                          </CustomLabel>
                                        </DynamicHtmlTag>
                                        <CustomLabel htmlFor="affection" className="ps-2 text-2xs 2xl:text-xs font-normal cstm-lable">
                                          Non
                                        </CustomLabel>
                                      </DynamicHtmlTag>
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                                <DynamicHtmlTag type="div" className="...">
                                  <DynamicHtmlTag type="div">
                                    <DynamicHtmlTag type="div" className="flex items-center justify-between">
                                      <CustomLabel className="text-2xs 2xl:text-xs px-2 font-semibold">
                                        Date de début de l’allergie
                                        <DynamicHtmlTag type="span" className="text-red-500">
                                          *
                                        </DynamicHtmlTag>
                                      </CustomLabel>
                                      {Updateerrors?.startDate && (
                                        <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                                          {Updateerrors?.startDate}
                                        </DynamicHtmlTag>
                                      )}
                                    </DynamicHtmlTag>
                                    <DynamicHtmlTag
                                      type="div"
                                      className={`${Updateerrors?.startDate ? "border-red-500" : "border-gray-200"} form-date-picker date-picker w-full h-8 flex items-center outline-none [&&]:text-2xs rounded-md border border-gray-400 px-2`}>
                                      <DynamicHtmlTag type="span" className="text-2xs 2xl:text-xs w-full">
                                        <CustomDatePicker
                                          selected={UpdatestartDate}
                                          onChange={(date: any) => handleDateUpdateOptionChange(date)}
                                          dateFormat={"dd/MM/yyyy"}
                                          placeholderText="jj/mm/aaaa"
                                          className="w-full placeholder:font-normal ps-2"
                                        />
                                      </DynamicHtmlTag>
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div" className="w-full xl:my-3">
                                    <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-start mb-1">
                                      <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                        <CustomInput
                                          className=""
                                          checked={UpdatemedicalProfileAllergy.isUnkownHowManifestAllergy}
                                          onChange={() =>
                                            setUpdatemedicalProfileAllergy(prevState => ({
                                              ...prevState,
                                              isUnkownHowManifestAllergy: !prevState.isUnkownHowManifestAllergy,
                                              howAllergyManifest: prevState.isUnkownHowManifestAllergy ? prevState.howAllergyManifest : "", // Clear if unchecked
                                            }))
                                          }
                                          type="checkbox"
                                          id="ne-sais"
                                        />
                                        <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="ne-sais">
                                          <CustomImage
                                            src="/images/checkbox-img.svg"
                                            alt="checkbox"
                                            width={100}
                                            height={100}
                                            className="checkmark w-full"
                                          />
                                        </CustomLabel>
                                      </DynamicHtmlTag>
                                      <CustomLabel htmlFor="affection" className="ps-2 text-2xs 2xl:text-xs font-normal cstm-lable">
                                        Je ne sais pas
                                      </CustomLabel>
                                    </DynamicHtmlTag>
                                    <DynamicHtmlTag type="div" className="flex items-center gap-4 justify-between">
                                      <CustomLabel className="text-2xs 2xl:text-xs px-1 font-semibold flex gap-2 custom-tooltip">
                                        Comment se manifeste cette allergie ?
                                        <CustomButton
                                          type="button"
                                          data-tooltip-id="cette-allergie"
                                          data-tooltip-place="bottom-start"
                                          data-tooltip-html="Comment se manifeste cette allergie">
                                          <CustomImage
                                            src={"/images/tooltip-icon.svg"}
                                            alt="banner"
                                            width={15}
                                            height={15}
                                            className="img-fluid lg:w-4 lg:h-4"
                                          />
                                        </CustomButton>
                                        <ReactTooltip id="cette-allergie" place="bottom" />
                                      </CustomLabel>
                                      {Updateerrors?.howAllergyManifest && (
                                        <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                                          {Updateerrors?.howAllergyManifest}
                                        </DynamicHtmlTag>
                                      )}
                                    </DynamicHtmlTag>
                                    <CustomTextarea
                                      className={`${Updateerrors?.howAllergyManifest ? "border-red-500" : "border-gray-200"} resize-none w-full border border-gray-400 outline-none h-16 py-1 px-2 rounded-md text-2xs 2xl:text-xs`}
                                      placeholder="Saisir votre texte ici"
                                      disabled={UpdatemedicalProfileAllergy.isUnkownHowManifestAllergy == true}
                                      onChange={handleFieldUpdateChange}
                                      name="howAllergyManifest"
                                      value={UpdatemedicalProfileAllergy.howAllergyManifest?.toString()} // Convert to primitive string
                                    />
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div" className="w-full flex justify-end mt-1">
                                    <CustomButton
                                      as="button"
                                      onClick={handleUpdateSubmit}
                                      className="card-btn text-2xs 2xl:text-xs text-white py-2 px-3 font-semibold rounded-full inline-block">
                                      Enregistrer
                                    </CustomButton>
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          )}
        </DynamicHtmlTag>
        {Allergylist.length === 0 ? (
          ""
        ) : (
          <DynamicHtmlTag
            type="div"
            className="flex flex-row-reverse lg:flex-row justify-center lg:justify-end absolute lg:mt-0 bottom-0 left-0 right-0 items-center mx-2 md:mx-3 border-t-slate-100 border-t-[1px] pt-3">
            <DynamicHtmlTag type="div" className="flex items-center justify-between lg:w-7/12">
              <Pagination
                currentPage={currentPage}
                pageCount={totalPages}
                onPageChange={handlePageChange}
                pageClassName="inline-block px-3 py-1 border border-blue rounded-full mx-1 text-blue"
                activeClassName="bg-primary text-white border-primary"
                previousClassName="text-[#CCCACA] py-2 px-3 xl:px-4"
                nextClassName="text-[#CCCACA] py-2 px-3 xl:px-4"
                disabledClassName="opacity-50 cursor-not-allowed pointer-events-none"
                breakLabel={"..."}
                breakClassName="inline-block px-3 py-1 border rounded-full mx-1"
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
              />
              <CustomButton
                onClick={openAddAllergyModal}
                as="button"
                className="card-btn text-2xs 2xl:text-xs text-white py-2 px-3 font-semibold rounded-full hidden lg:inline-block">
                Ajouter une allergie
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        )}
        {/* Edit Modal Box Start */}
        <CustomModal isOpen={isAddAllergiesModalOpen} onClose={closeAddAllergyModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 py-4 px-3 lg:px-6">
              <DynamicHtmlTag type="div" className="flex flex-col">
                <DynamicHtmlTag type="div" className="flex items-center justify-between gap-2">
                  <HeadingTag type="h2" className="text-blue font-bold text-lg mb-3">
                    {modalMode === "edit" ? "Modifier une allergie" : "Ajouter une allergie"}
                  </HeadingTag>
                  <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={closeAddAllergyModal}>
                    <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
                  </CustomButton>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="div" className="mt-5 w-full lg:w-8/12">
                    <DynamicHtmlTag type="div" className="flex items-center justify-between w-full">
                      <CustomLabel className="text-xs font-semibold ps-2 pb-1">
                        Allergie{" "}
                        <DynamicHtmlTag type="span" className="text-red-500">
                          *
                        </DynamicHtmlTag>{" "}
                      </CustomLabel>
                      {errors?.allergyMotif && (
                        <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                          {errors?.allergyMotif}
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                    <DynamicHtmlTag
                      type="div"
                      className={`${errors?.allergyMotif ? "border-red-400" : "border-gray-400"}  h-[2.063rem] input border p-2 flex items-center gap-2 rounded-md font-semibold mb-1 relative`}>
                      <CustomSelect
                        value={defaultAllergyMotifOptions.find(option => option.value === medicalProfileAllergy.allergyMotif) || null}
                        onChange={(selectedOption: allergyMotifOption | null) => {
                          setmedicalProfileAllergy((prevState: any) => ({
                            ...prevState,
                            allergyMotif: selectedOption?.value ?? "",
                          }));
                          setErrors((prevState: any) => ({
                            ...prevState,
                            allergyMotif: "",
                          }));
                        }}
                        isClearable
                        options={defaultAllergyMotifOptions}
                        placeholder="Séléctionnez une allergies"
                        className={`w-full timing-select outline-none [&&]:text-xs font-semibold`}
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex items-center gap-3 w-full my-5">
                    <CustomLabel className="text-2xs md:text-xs font-semibold w-7/12 md:w-9/12 pe-1 relative ps-2">
                      S’agit t-il d’un médicament ou d’un produit médical ?
                      {errors?.isMedicalProduct && (
                        <DynamicHtmlTag type="span" className="text-red-500 text-[9px] font-normal absolute -bottom-3 left-0 ps-2">
                          {errors?.isMedicalProduct}
                        </DynamicHtmlTag>
                      )}
                    </CustomLabel>
                    <DynamicHtmlTag type="div" className="flex items-center gap-4 w-4/12 lg:w-3/12">
                      <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                        <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                          <CustomInput
                            className=""
                            type="checkbox"
                            id="affection-Oui"
                            checked={selectedOption === "Oui"}
                            onChange={() => handleCheckboxChange("Oui")}
                          />
                          <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="affection-Oui">
                            <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                          </CustomLabel>
                        </DynamicHtmlTag>
                        <CustomLabel htmlFor="affection" className="ps-2 text-2xs sm:text-xs font-normal cstm-lable">
                          Oui
                        </CustomLabel>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="cstm-form-group flex items-center  justify-center">
                        <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                          <CustomInput
                            className=""
                            type="checkbox"
                            id="affection-non"
                            checked={selectedOption === "Non"}
                            onChange={() => handleCheckboxChange("Non")}
                          />
                          <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="affection-non">
                            <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                          </CustomLabel>
                        </DynamicHtmlTag>
                        <CustomLabel htmlFor="affection" className="ps-2 text-2xs sm:text-xs font-normal cstm-lable">
                          Non{" "}
                          <DynamicHtmlTag type="span" className="text-red-500">
                            *
                          </DynamicHtmlTag>
                        </CustomLabel>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex justify-between items-center mt-2">
                    <CustomLabel className="text-xs font-semibold ps-2 pb-1">
                      Date de début de l’allergie{" "}
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </CustomLabel>
                    {errors?.startDate && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                        {errors?.startDate}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className={`${errors?.startDate ? "border-red-400" : "border-gray-400"} h-[2.063rem] form-date-picker date-picker w-full flex items-center outline-none [&&]:text-2xs rounded-md border border-gray-200  py-2 px-2`}>
                    <DynamicHtmlTag type="span" className="text-xs w-full">
                      <CustomDatePicker
                        selected={startDate}
                        onChange={(date: any) => handleDateOptionChange(date)}
                        dateFormat={"dd/MM/yyyy"}
                        placeholderText="jj/mm/aaaa"
                        className="w-full placeholder:font-normal font-semibold ps-2"
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>

                  <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row items-center mt-5 gap-1 lg:gap-3 w-full">
                    <CustomLabel className="text-2xs md:text-2xs font-semibold flex items-center gap-2 w-full md:w-9/12 custom-tooltip ps-2 pb-1">
                      Comment se manifeste cette allergie ?
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                      <CustomButton
                        type="button"
                        data-tooltip-id="cette-allergie"
                        data-tooltip-place="bottom-start"
                        data-tooltip-html="Comment se manifeste cette allergie">
                        <CustomImage src={"/images/tooltip-icon.svg"} alt="banner" width={15} height={15} className="img-fluid lg:w-4 lg:h-4" />
                      </CustomButton>
                      {errors?.howAllergyManifest && (
                        <DynamicHtmlTag type="span" className="text-red-500 font-normal text-[9px] line-clamp-1">
                          {errors?.howAllergyManifest}
                        </DynamicHtmlTag>
                      )}
                      <ReactTooltip id="cette-allergie" place="bottom" />
                    </CustomLabel>
                    <DynamicHtmlTag type="div" className="flex items-center gap-1 lg:gap-4 w-full lg:w-3/12 ps-2 lg:ps-0">
                      <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                        <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                          <CustomInput
                            className=""
                            checked={isUnknownSelected} // Bind state
                            onChange={handleUnknownCheckboxChange} // Handle change
                            type="checkbox"
                            id="ne-sais"
                          />
                          <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="ne-sais">
                            <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                          </CustomLabel>
                        </DynamicHtmlTag>
                        <CustomLabel htmlFor="affection" className="ps-2 text-2xs sm:text-xs font-normal cstm-lable">
                          Je ne sais pas
                        </CustomLabel>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>

                  <CustomTextarea
                    className={`${errors?.howAllergyManifest ? "border-red-400" : "border-gray-200"} text-xs resize-none w-full border border-gray-100 outline-none h-24 mt-1 lg:mt-0.5 py-1 px-2 rounded-md placeholder:font-normal font-semibold ps-4`}
                    placeholder="Saisir votre texte ici"
                    onChange={handleFieldChange}
                    name="howAllergyManifest"
                    disabled={isUnknownSelected} // Disable when "Je ne sais pas" is selected
                    value={medicalProfileAllergy.howAllergyManifest?.toString()} // Convert to primitive string
                  />

                  <CustomButton
                    as="button"
                    onClick={handleSubmit}
                    className={`text-xs 2xl:text-xs card-btn cstm-btn mb-3 lg:mb-auto mt-6 flex py-2 px-1 justify-center float-end w-2/5 md:w-3/12 view-more-btn rounded-full text-white font-semibold`}>
                    {modalMode === "edit" ? "Modifier" : "Ajouter"}
                  </CustomButton>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
        {/* Edit Modal Box End */}

        {/* Delete Modal Start */}
        <DeleteModal
          isOpen={isModalOpen}
          onClose={closeDeleteModal}
          modalInputTitle={AllergyDeleteName}
          modalSubTitle={"Allergie"}
          onConfirm={() => {
            if (listDelete !== undefined) {
              deleteAllergy(listDelete); // Ensure listDelete is defined
            }
          }}
          title="Supprimer une allergie"
          paragraph={`Êtes vous sur de vouloir supprimer cette allergie : ${AllergyDeleteName} ?`}
        />
        {/* Delete Modal End */}
      </DynamicHtmlTag>
      {/* Empty Screen Without Content */}
      {/* <DynamicHtmlTag type="div" className="empty-history-content h-full hidden">
        <EmptyHistory title="Vous n’avez pas renseigné d’allergie" paragraph="Je n’ai pas d’allergies" button="Ajouter un allergies" uniqueId="3" />
      </DynamicHtmlTag> */}
    </DynamicHtmlTag>
  );
};

export default Allergies;
