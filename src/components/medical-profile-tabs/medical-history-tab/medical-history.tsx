"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  CustomButton,
  CustomImage,
  CustomInput,
  CustomLabel,
  DynamicHtmlTag,
  Pagination,
  DeleteModal,
  HeadingTag,
  CustomSelect,
  EmptyHistory,
  CustomDatePicker,
  CustomModal,
  CustomTextarea,
  CustomAsyncSelect,
  CustomFullScreenLoader,
  VisioLogo,
} from "@/components";
import { IoCloseSharp } from "react-icons/io5";
import {
  AddMedicalHistorySchema,
  antecedentMotifApiResponse,
  antecedentMotifOption,
  AntecedentMotifType,
  antecedentOption,
  fetchmedicalAntecedentApi,
  getFormateDate,
  getFormateDatetwoDateformate,
  getLocalStorageData,
  GlobalArticleListType,
  ListOption,
  medicalAntecedentListingApi,
  MedicalProfileBackground,
  PatientsType,
  profileMedicalDeleteMessage,
  UpdateMedicalHistorySchema,
} from "@/utility";
import {
  addantecedentApi,
  addantecedentSurgeryUpdateApi,
  addantecedentUpdateApi,
  deleteAntecedentApi,
  getListAntecedentApi,
} from "@/utility/apis/patient-dashboard";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { RootState } from "@/store";
import { number } from "yup";
import { toast } from "react-toastify";
import { selectPatientDetailsData } from "@/store/reducers/patientDetailsSlice";
const createbackgroundParams = {
  patientId: "",
  antecedentMotif: "",
  isSurgery: "",
  startDate: "",
  endDate: "",
  isFinished: "",
};
const UpdatebackgroundParams = {
  patientId: "",
  antecedentMotif: "",
  isSurgery: false,
  startDate: "",
  endDate: "",
  isFinished: "",
};
const itemsPerPage = 10;

const MedicalHistory = () => {
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [editModalOpen, editIsModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [updatestartDate, setUpdateStartDate] = useState<Date>();
  const [updateendDate, setUpdateEndDate] = useState<Date>();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  // const [isChecked, setIsChecked] = useState(UpdatebackgroundParams.isSurgery||false);
  const [medicalProfileBackground, setmedicalProfileBackground] = useState<MedicalProfileBackground>(createbackgroundParams);
  const [UpdatemedicalProfileBackground, setUpdatemedicalProfileBackground] = useState<MedicalProfileBackground>(UpdatebackgroundParams);
  const [updateList, setUpdateList] = useState();
  const [defaultantecedentMotifOptions, setDefaultantecedentMotifOptions] = useState<antecedentMotifOption[]>([]);
  const loggedInUser = useSelector(selectLoginResponse);
  const [errors, setErrors] = useState<MedicalProfileBackground>();
  const [Updateerrors, setUpdateErrors] = useState<MedicalProfileBackground>();
  const [AntecedentId, setAntecedentId] = useState(String);
  const dispatch = useDispatch();
  const [listDelete, setListDelete] = useState<number | undefined>();
  const [Antecedentlist, setAntecedent] = useState<AntecedentMotifType[]>([]);
  const fetchPatientData = useSelector(selectPatientDetailsData);

  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const [AntecedentDeleteName, setAntecedentDeleteName] = useState();
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPatientId, setCurrentPatientId] = useState(() => getLocalStorageData("PatientId", null)); // Initialize from local storage

  // const pageCount = Math.ceil(Antecedentlist.length / itemsPerPage);
  const fetchAntecedentList = useCallback(async () => {
    try {
      const data = await getListAntecedentApi(fetchPatientData?.id, currentPage, itemsPerPage);
      setTotalPages(data?.data?.totalPage || 0);
      setTotalItems(data?.data?.totalCount || 0);
      setAntecedent(data?.data?.results || []);
    } catch (error) {}
  }, [currentPage, fetchPatientData?.id]);

  const fetchMedicalAntecedent = useCallback(async () => {
    try {
      // Fetch API data
      const response: any[] = await fetchmedicalAntecedentApi();
      // Map the response to create options for the dropdown
      const antecedentMotifOptions: antecedentMotifOption[] = response.map(antecedent => ({
        value: antecedent.id, // Use `id` directly as value
        label: antecedent.name, // Use `name` for the label
      }));

      // Set the options in state
      setDefaultantecedentMotifOptions(antecedentMotifOptions);
    } catch (error) {
      setDefaultantecedentMotifOptions([]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("medical-profile"));
      try {
        await fetchMedicalAntecedent();
        await fetchAntecedentList();
      } catch (err) {
      } finally {
        dispatch(hideLoader());
      }
    };
    fetchData();
  }, [fetchMedicalAntecedent, fetchAntecedentList]);
  const handlePageChange = (selected: { selected: number }) => {
    setCurrentPage(selected.selected);
  };

  // Toggle the checked state
  const handleToggle = async (id: number, newSurgeryStatus: boolean, item: any) => {
    // Update the state with the new surgery status and id

    setUpdatemedicalProfileBackground(prevState => ({
      ...prevState,
      antecedentMotif: {
        value: item.antecedentMotif.id, // Use `id` as value
        label: item.antecedentMotif.name, // Use `name` as label
      },
      isSurgery: newSurgeryStatus,
      startDate: item.startDate,
      endDate: item.endDate,
      isFinished: item.finished,
    }));
    setAntecedentId(item.id);
    if (item.startDate) {
      const [day, month, year] = item.startDate.split("/").map(Number);
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate.getTime())) setUpdateStartDate(parsedDate);
      else {
      }
    }
    if (item.endDate) {
      const [day, month, year] = item.endDate.split("/").map(Number);
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate.getTime())) setUpdateEndDate(parsedDate);
      else {
      }
    }

    setUpdatemedicalProfileBackground(prevState => ({
      ...prevState,
      surgery: newSurgeryStatus, // Update the surgery status with the new value
      id: id, // Send the id along with the updated surgery status
    }));

    // Create the model object
    const model = {
      patientId: fetchPatientData?.id.toString(),
      antecedentId: id.toString(),
      isSurgery: newSurgeryStatus,
    };
    try {
      dispatch(showLoader("update-patient"));

      // Call the API to update the surgery status
      await addantecedentSurgeryUpdateApi(model);
      // Fetch the antecedent list (if needed)
      fetchAntecedentList();
    } catch (error) {
      // Handle any errors that occur during the API call or state update
      // Optionally, you can display an error message to the user
    } finally {
      // Code that will always run after try/catch (like stopping a loading spinner)
      dispatch(hideLoader());
    }
  };

  const handleToggleRow = (rowId: any) => {
    setExpandedRow(prevExpandedRow => (prevExpandedRow === rowId.id ? null : rowId.id));
    setUpdateErrors(UpdatebackgroundParams);
    setUpdatemedicalProfileBackground(prevState => ({
      ...prevState,
      antecedentMotif: {
        value: rowId.antecedentMotif.id, // Use `id` as value
        label: rowId.antecedentMotif.name, // Use `name` as label
      },
      isSurgery: rowId.surgery,
      startDate: rowId.startDate,
      endDate: rowId.endDate,
      isFinished: rowId.finished,
    }));
    setAntecedentId(rowId.id);
    setUpdateErrors(UpdatebackgroundParams); // Reset errors to empty object
    if (rowId.startDate) {
      const [day, month, year] = rowId.startDate.split("/").map(Number);
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate.getTime())) setUpdateStartDate(parsedDate);
      else {
      }
    }
    if (rowId.endDate) {
      const [day, month, year] = rowId.endDate.split("/").map(Number);
      const parsedDate = new Date(year, month - 1, day);

      if (!isNaN(parsedDate.getTime())) {
        setUpdateEndDate(parsedDate);
      } else {
        setUpdateEndDate(undefined);
      }
    } else {
      setUpdateEndDate(undefined);
    }
  };
  const handleRadioChange = (value: boolean) => {
    // Update the state
    setmedicalProfileBackground((prevState: MedicalProfileBackground) => ({
      ...prevState,
      isFinished: value,
    }));

    // Validate the isFinished field
    try {
      AddMedicalHistorySchema.validateSyncAt("isFinished", {
        ...medicalProfileBackground,
        isFinished: value,
      });
      setErrors((prevErrors: any) => ({ ...prevErrors, isFinished: undefined })); // Clear the error if valid
    } catch (err: any) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        isFinished: err.message, // Set the error message
      }));
    }
  };

  const handleUpdateDateOptionChange = (date: any) => {
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";

    setUpdateStartDate(date);
    setUpdatemedicalProfileBackground((prevState: MedicalProfileBackground) => ({
      ...prevState,
      startDate: formattedDate,
    }));
    // Validate the startDate field only
    setUpdateErrors((prevErrors: any) => ({ ...prevErrors, startDate: undefined }));
  };

  const handleUpdateEndDateChange = (date: any) => {
    setUpdateEndDate(date);
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";
    setUpdatemedicalProfileBackground((prevState: MedicalProfileBackground) => ({
      ...prevState,
      endDate: formattedDate,
    }));
    // Validate the startDate field only
    setUpdateErrors((prevErrors: any) => ({ ...prevErrors, endDate: undefined }));
  };

  //Add Date
  const handleDateOptionChange = (date: any) => {
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";

    setStartDate(date);
    setmedicalProfileBackground((prevState: MedicalProfileBackground) => ({
      ...prevState,
      startDate: formattedDate,
    }));
    setErrors((prevErrors: any) => ({ ...prevErrors, startDate: undefined }));
  };

  const handleEndDateChange = (date: any) => {
    setEndDate(date);
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";
    setmedicalProfileBackground((prevState: MedicalProfileBackground) => ({
      ...prevState,
      endDate: formattedDate,
    }));
    // Validate the startDate field only
    setErrors((prevErrors: any) => ({ ...prevErrors, endDate: undefined }));
  };

  const openAddModal = () => {
    editIsModalOpen(true);
    setModalMode("add");
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;

    // Update the state
    setmedicalProfileBackground((prevState: MedicalProfileBackground) => ({
      ...prevState,
      isSurgery: isChecked,
    }));

    // Validate the isSurgery field
    try {
      AddMedicalHistorySchema.validateSyncAt("isSurgery", {
        ...medicalProfileBackground,
        isSurgery: isChecked,
      });
      setErrors((prevErrors: any) => ({ ...prevErrors, isSurgery: undefined })); // Clear the error if valid
    } catch (err: any) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        isSurgery: err.message, // Set the error message
      }));
    }
  };
  const deleteAntecedent = async (antecedentId: number) => {
    const pateientId = fetchPatientData?.id;
    try {
      const response = await deleteAntecedentApi(pateientId, antecedentId);
      toast.success(profileMedicalDeleteMessage.AntécédentDeleteMessage);
      closeDeleteModal();
      fetchAntecedentList();
    } catch (error: any) {
      // const errorMessage = error.response?.data?.message;
    } finally {
    }
  };

  // DeleteModalBox
  const openDeleteModal = () => setIsModalOpen(true);
  const closeDeleteModal = () => setIsModalOpen(false);
  const handleDeleteModal = (item: any) => {
    setListDelete(item.id); // Ensure item is a number here
    setAntecedentDeleteName(item?.antecedentMotif?.name);
    openDeleteModal();
  };

  // Add / Edit / Close ModalBox
  const closeEditModal = () => {
    editIsModalOpen(false);
    setmedicalProfileBackground(createbackgroundParams);
    setStartDate(undefined);
    setEndDate(undefined);
    setErrors(createbackgroundParams); // Reset errors to empty object
  };

  const handleUpdateSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const startDate = getFormateDatetwoDateformate(UpdatemedicalProfileBackground.startDate || "", "YYYY-MM-DD");
    const endDate = getFormateDatetwoDateformate(UpdatemedicalProfileBackground.endDate || "", "YYYY-MM-DD");
    // Conditionally add endDate if isFinished is true
    const model: any = {
      patientId: fetchPatientData?.id.toString(),
      antecedentId: AntecedentId.toString(),
      antecedentMotif: UpdatemedicalProfileBackground.antecedentMotif?.value,
      isSurgery: UpdatemedicalProfileBackground.isSurgery,
      startDate: startDate,
      isFinished: UpdatemedicalProfileBackground.isFinished,
    };

    // Explicitly check if isFinished is true
    if (UpdatemedicalProfileBackground.isFinished === true) {
      model.endDate = endDate;
    }

    try {
      await UpdateMedicalHistorySchema.validate(UpdatemedicalProfileBackground, { abortEarly: false });
      dispatch(showLoader("medical-profile"));
      setExpandedRow(null);
      // Call API to add medical history
      await addantecedentUpdateApi(model);

      // Reset form fields and errors after successful submission
      fetchAntecedentList();
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

    // Conditionally add endDate if isFinished is true
    const model: any = {
      patientId: fetchPatientData?.id.toString(),
      antecedentMotif: medicalProfileBackground.antecedentMotif,
      isSurgery: medicalProfileBackground.isSurgery,
      startDate: medicalProfileBackground.startDate,
      isFinished: medicalProfileBackground.isFinished,
    };

    // Explicitly check if isFinished is true
    if (medicalProfileBackground.isFinished === true) {
      model.endDate = medicalProfileBackground.endDate;
    }

    try {
      await AddMedicalHistorySchema.validate(medicalProfileBackground, { abortEarly: false });
      dispatch(showLoader("medical-profile"));
      // Call API to add medical history
      await addantecedentApi(model);

      // Reset form fields and errors after successful submission
      fetchAntecedentList();
      setmedicalProfileBackground(createbackgroundParams);
      setStartDate(undefined);
      setEndDate(undefined);
      setErrors(createbackgroundParams); // Reset errors to empty object
      closeEditModal();
    } catch (err: any) {
      // Yup validation errors
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setErrors(validationErrors);
      }
      // API other errors
      let errorMessage = err.response?.data?.message;
      // setRegisterError(errorMessage);
    } finally {
      // setIsLoading(false);
      dispatch(hideLoader());
    }
  };
  return (
    <DynamicHtmlTag type="div" className="bg-white rounded-xl h-[92%]">
      <DynamicHtmlTag type="div" className="bg-gradient-to-t from-[#3A7DC0] to-[#7BCBDF] rounded-t-xl pt-0">
        <HeadingTag type="h3" className="font-semibold text-sm text-white text-center py-1 px-3">
          Antécédents médicaux
        </HeadingTag>
      </DynamicHtmlTag>

      {/* Tab Content Screen */}
      <DynamicHtmlTag type="div" className="w-full px-3 py-2 relative h-full main-tab-inner">
        <DynamicHtmlTag
          type="div"
          className={`max-h-table overflow-auto min-w-full bg-white ${Antecedentlist.length === 0 ? "h-full" : "h-[88%]"} pt-10 lg:pt-0`}>
          <DynamicHtmlTag type="div" className="w-full h-12 bg-white absolute top-0 z-10 left-0 right-0 block lg:hidden ps-2">
            <CustomButton
              as="button"
              onClick={openAddModal}
              className="card-btn text-2xs lg:text-xs text-white py-1.5 lg:py-2 px-3 font-semibold rounded-2xl absolute top-2 lg:hidden">
              Ajouter un antécédent
            </CustomButton>
          </DynamicHtmlTag>
          {isLoading ? (
            <CustomFullScreenLoader />
          ) : (
            <table className={`min-w-full bg-white border-collapse ${Antecedentlist.length === 0 ? "h-full" : "h-auto"}`}>
              {Antecedentlist.length === 0 ? (
                ""
              ) : (
                <thead>
                  <tr className="sticky top-[-2px] z-10 border-t lg:border-t-0 border-b border-slate-100 text-[2vw] md:text-2xs bg-white">
                    <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100">
                      <DynamicHtmlTag type="div" className="line-clamp-1">
                        Antécédent
                      </DynamicHtmlTag>
                    </th>
                    <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100">
                      <DynamicHtmlTag type="div" className="line-clamp-1">
                        {" "}
                        Opération chirurgicale
                      </DynamicHtmlTag>
                    </th>
                    <th className="p-1 lg:py-2 lg:px-2 text-center lg:text-left font-medium text-slate-100 hidden md:table-cell">
                      <DynamicHtmlTag type="div" className="line-clamp-1">
                        Dates début
                      </DynamicHtmlTag>
                    </th>
                    <th className="p-1 lg:py-2 lg:px-2 text-center lg:text-left font-medium text-slate-100 hidden md:table-cell">
                      <DynamicHtmlTag type="div" className="line-clamp-1">
                        Dates fin
                      </DynamicHtmlTag>
                    </th>
                    <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100">
                      <DynamicHtmlTag type="div" className="line-clamp-1">
                        Ajouté le
                      </DynamicHtmlTag>{" "}
                    </th>
                    {/* <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100 hidden md:table-cell">Ajouté par</th> */}
                    <th className="p-1 lg:py-2 lg:px-2 text-center font-medium text-slate-100 w-1/6">
                      <DynamicHtmlTag type="div" className="line-clamp-1">
                        Action
                      </DynamicHtmlTag>
                    </th>
                  </tr>
                </thead>
              )}
              <tbody>
                {Antecedentlist.length === 0 ? (
                  // <DynamicHtmlTag
                  //   type="span"
                  //   className="max-w-max text-center text-xs lg:text-base py-1 md:absolute top-1/2 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 empty-image-main">
                  //   <CustomImage src={VisioLogo} alt="logo" className="loader-logo mx-auto mb-2" width={500} height={200} />
                  //   Aucune mesure de antécédents médicaux n{"'"}a été enregistrée pour le moment.
                  // </DynamicHtmlTag>
                  <EmptyHistory
                    onConfirm={openAddModal}
                    title="Aucune mesure d’antécédents médicaux n'a été enregistrée pour le moment"
                    paragraph={`Aucune mesure de antécédents médicaux n{"'"}a été enregistrée pour le moment.`}
                    button="Ajouter un antécédent"
                    uniqueId="1"
                  />
                ) : (
                  Antecedentlist.map(history => (
                    <React.Fragment key={history.id}>
                      <tr
                        className="cursor-pointer text-[2vw] md:text-3xs xl:text-2xs 2xl:text-xs font-bold lg:border-t lg:border-slate-100"
                        onClick={() => handleToggleRow(history)}>
                        <td className="p-1 lg:py-3 lg:px-3">
                          <DynamicHtmlTag type="span" className="line-clamp-1">
                            {history?.antecedentMotif?.name}
                          </DynamicHtmlTag>
                        </td>
                        <td className="p-1 lg:py-3 lg:px-3 ">
                          <DynamicHtmlTag type="span" className="flex items-center">
                            <DynamicHtmlTag
                              type="span"
                              className="text-[2vw] md:text-3xs xl:text-2xs 2xl:text-xs font-medium text-slate-100 ml-1 mr-1 lg:ml-2 lg:mr-4 w-6 lg:w-8">
                              {history.surgery == true ? "Oui" : "Non"}
                            </DynamicHtmlTag>
                            <CustomLabel className="inline-flex relative items-center lg:mr-5 cursor-pointer">
                              <CustomInput
                                type="checkbox"
                                className="sr-only peer switch-input text-sm"
                                value=""
                                checked={history.surgery} // Convert to boolean if needed
                                onChange={() => handleToggle(history.id, !history.surgery, history)} // Pass the id and the toggled state
                              />
                              <DynamicHtmlTag
                                type="div"
                                className="switch-peer-style w-8 lg:w-10 h-4 lg:h-5 bg-white border-red border rounded-full peer peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-[#45AAE0] after:content-[''] after:absolute after:top-[4px] lg:after:top-[3px] after:left-[4px] lg:after:left-[6px] after:rounded-full after:h-[8px] lg:after:h-[13px] after:w-[8px] lg:after:w-[13px] peer-checked:after:left-[10px] after:transition-all peer-checked:bg-gradient-to-r from-[#335FA8] to-[#43ABE1]"></DynamicHtmlTag>
                            </CustomLabel>
                            {/* Display "Oui" or "Non" based on the checked status */}
                          </DynamicHtmlTag>
                        </td>
                        <td className="p-1 lg:py-3 lg:px-3 text-center lg:text-left hidden md:table-cell">
                          {history?.endDate == null ? (
                            <DynamicHtmlTag type="span">{history?.startDate}</DynamicHtmlTag>
                          ) : (
                            <DynamicHtmlTag type="span">{history?.startDate}</DynamicHtmlTag>
                          )}
                        </td>
                        <td className="p-1 lg:py-3 lg:px-3 hidden md:table-cell">
                          {history?.endDate == null ? (
                            <DynamicHtmlTag type="span">{`-`} </DynamicHtmlTag>
                          ) : (
                            <DynamicHtmlTag type="span"> {history?.endDate}</DynamicHtmlTag>
                          )}
                        </td>
                        <td className="p-1 lg:py-3 lg:px-3">
                          <DynamicHtmlTag type="span">{history?.createdAt}</DynamicHtmlTag>
                        </td>
                        <td className="p-1 lg:py-3 lg:px-3 w-1/6">
                          <DynamicHtmlTag type="div" className="flex items-center space-x-4 justify-center">
                            <CustomButton type="button">
                              <CustomImage className="w-4 h-4 max-w-max" src="/images/pencil-edit.svg" alt="pencil-edit" width={16} height={16} />
                            </CustomButton>
                            <CustomButton
                              onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                event.stopPropagation();
                                handleDeleteModal(history);
                              }}
                              as="button"
                              title="delete">
                              <CustomImage className="w-4 h-4 max-w-max" src="/images/trash.svg" alt="trash" width={16} height={16} />
                            </CustomButton>
                          </DynamicHtmlTag>
                        </td>
                      </tr>
                      <tr className="md:hidden">
                        <td colSpan={5}>
                          <DynamicHtmlTag type="div" className="bg-gray-400 bg-opacity-40 rounded-lg font-bold w-full flex px-2 gap-2">
                            <DynamicHtmlTag type="div" className="py-2 w-2/6 text-[2vw] md:text-3xs">
                              <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                                Dates début
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="span" className="font-semibold">
                                {history?.startDate == null ? (
                                  <DynamicHtmlTag type="span">{`-`} </DynamicHtmlTag>
                                ) : (
                                  <DynamicHtmlTag type="span"> {history?.startDate}</DynamicHtmlTag>
                                )}
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                            <DynamicHtmlTag type="div" className="py-2 w-2/6 text-[2vw] md:text-3xs">
                              <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                                Dates fin
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="span" className="font-semibold">
                                {history?.endDate == null ? (
                                  <DynamicHtmlTag type="span">{`-`} </DynamicHtmlTag>
                                ) : (
                                  <DynamicHtmlTag type="span"> {history?.endDate}</DynamicHtmlTag>
                                )}
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </td>
                      </tr>
                      {/* Collapsible Row */}
                      {expandedRow === history.id && (
                        <tr className="bg-base-100">
                          <td colSpan={6}>
                            <DynamicHtmlTag type="div" className="max-h-auto">
                              <DynamicHtmlTag type="div" className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-2">
                                <DynamicHtmlTag type="div" className="col-span-1">
                                  <DynamicHtmlTag type="div" className="w-full mt-2">
                                    <DynamicHtmlTag type="div" className="flex items-center justify-between">
                                      <CustomLabel className="px-2 text-xs font-semibold">Antécédent</CustomLabel>
                                      {Updateerrors?.antecedentMotif && (
                                        <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                                          {Updateerrors?.antecedentMotif}
                                        </DynamicHtmlTag>
                                      )}
                                    </DynamicHtmlTag>
                                    <CustomSelect
                                      name="background"
                                      value={
                                        defaultantecedentMotifOptions.find(
                                          option => option.value === UpdatemedicalProfileBackground.antecedentMotif?.value
                                        ) || null
                                      }
                                      onChange={(selectedOption: { value: number; label: string } | null) => {
                                        setUpdatemedicalProfileBackground(prevState => ({
                                          ...prevState,
                                          antecedentMotif: selectedOption || "", // Store the full selected option or empty string
                                        }));

                                        setUpdateErrors((prevState: any) => ({
                                          ...prevState,
                                          antecedentMotif: "", // Clear any existing error
                                        }));
                                      }}
                                      isClearable
                                      options={defaultantecedentMotifOptions}
                                      placeholder="Sélectionnez un antécédent"
                                      className={`${Updateerrors?.antecedentMotif ? "border-red-400" : "border-gray-400"} w-full p-2 countries-select text-xs text-black placeholder-black border rounded-lg mb-1 `}
                                    />
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div" className="cstm-form-group flex items-center gap-2 mt-3">
                                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                      <CustomInput
                                        className="surgical-check"
                                        checked={UpdatemedicalProfileBackground.isSurgery === true}
                                        onChange={() =>
                                          setUpdatemedicalProfileBackground(prevState => ({
                                            ...prevState,
                                            isSurgery: !prevState.isSurgery, // Toggle `isSurgery` value
                                          }))
                                        }
                                        type="checkbox"
                                        id="surgical"
                                      />
                                      <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="surgical">
                                        <CustomImage
                                          src="/images/checkbox-img.svg"
                                          alt="checkbox"
                                          width={100}
                                          height={100}
                                          className="checkmark w-full"
                                        />
                                      </CustomLabel>
                                    </DynamicHtmlTag>
                                    <CustomLabel htmlFor="affection" className="text-2xs font-semibold cstm-lable">
                                      Cochez la case s{"’"}il s{"’"}agit d{"’"}une opération chirurgicale
                                    </CustomLabel>
                                    {Updateerrors?.isSurgery && (
                                      <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                                        {Updateerrors?.isSurgery}
                                      </DynamicHtmlTag>
                                    )}
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                                <DynamicHtmlTag type="div" className="mt-2">
                                  <DynamicHtmlTag type="div" className="w-full custom-radio-parent lg:mt-7">
                                    <DynamicHtmlTag type="div" className="flex gap-5 xl:gap-2">
                                      <DynamicHtmlTag type="div" className="flex items-center">
                                        <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                          <CustomInput
                                            className="progress-radio"
                                            checked={UpdatemedicalProfileBackground.isFinished === false} // Convert to boolean
                                            onChange={() =>
                                              setUpdatemedicalProfileBackground(prevState => ({
                                                ...prevState,
                                                isFinished: false, // Set `isFinished` to false
                                              }))
                                            }
                                            type="radio"
                                            id="progress"
                                            // name="process"
                                          />
                                          <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="progress">
                                            <CustomImage
                                              src="/images/checkbox-img.svg"
                                              alt="checkbox"
                                              width={100}
                                              height={100}
                                              className="checkmark w-full"
                                            />
                                          </CustomLabel>
                                          {Updateerrors?.startDate && (
                                            <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                                              {Updateerrors?.isFinished}
                                            </DynamicHtmlTag>
                                          )}
                                        </DynamicHtmlTag>
                                        <DynamicHtmlTag type="span" className="ps-1 xl:ps-3 text-2xs xl:text-xs 2xl:text-sm font-semibold cstm-lable">
                                          En cours
                                        </DynamicHtmlTag>
                                      </DynamicHtmlTag>
                                      <DynamicHtmlTag type="div" className="flex items-center xl:ps-2">
                                        <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                          <CustomInput
                                            className="finished-radio"
                                            checked={UpdatemedicalProfileBackground.isFinished == true} // Convert to boolean
                                            onChange={() =>
                                              setUpdatemedicalProfileBackground(prevState => ({
                                                ...prevState,
                                                isFinished: true, // Set `isFinished` to true
                                              }))
                                            }
                                            type="radio"
                                            id="finished"
                                            // name="process"
                                          />
                                          <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="finished">
                                            <CustomImage
                                              src="/images/checkbox-img.svg"
                                              alt="checkbox"
                                              width={100}
                                              height={100}
                                              className="checkmark w-full"
                                            />
                                          </CustomLabel>
                                        </DynamicHtmlTag>
                                        <DynamicHtmlTag type="span" className="ps-1 xl:ps-3 text-2xs xl:text-xs 2xl:text-sm font-semibold cstm-lable">
                                          Terminé
                                        </DynamicHtmlTag>
                                      </DynamicHtmlTag>
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="flex items-center justify-between my-2 gap-4 xl:gap-2">
                                <DynamicHtmlTag type="div" className="w-1/2">
                                  <DynamicHtmlTag type="div" className="flex items-center justify-between">
                                    <CustomLabel className="px-2 text-xs font-semibold">Date de début</CustomLabel>
                                    {Updateerrors?.startDate && (
                                      <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                                        {Updateerrors?.startDate}
                                      </DynamicHtmlTag>
                                    )}
                                  </DynamicHtmlTag>
                                  <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-md h-8 w-full">
                                    <DynamicHtmlTag
                                      type="div"
                                      className="form-date-picker date-picker medical-tabs flex items-center outline-none [&&]:text-2xs">
                                      <DynamicHtmlTag type="span" className="text-xs">
                                        <CustomDatePicker
                                          selected={updatestartDate}
                                          onChange={(date: any) => handleUpdateDateOptionChange(date)}
                                          dateFormat={"dd/MM/yyyy"}
                                          placeholderText="jj/mm/aaaa"
                                        />
                                      </DynamicHtmlTag>
                                    </DynamicHtmlTag>
                                  </CustomLabel>
                                </DynamicHtmlTag>
                                {UpdatemedicalProfileBackground.isFinished === true && (
                                  <DynamicHtmlTag type="div" className="w-1/2">
                                    <DynamicHtmlTag type="div" className="flex items-center justify-between">
                                      <CustomLabel className="px-2 text-xs font-semibold">Date de fin</CustomLabel>
                                      {Updateerrors?.endDate && (
                                        <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                                          {Updateerrors?.endDate}
                                        </DynamicHtmlTag>
                                      )}
                                    </DynamicHtmlTag>
                                    <CustomLabel
                                      className={`${Updateerrors?.endDate ? "border-red-400" : "border-gray-400"} input border p-2 flex items-center gap-2 rounded-md h-8 w-full`}>
                                      <DynamicHtmlTag
                                        type="div"
                                        className="form-date-picker date-picker medical-tabs flex items-center outline-none [&&]:text-2xs">
                                        <DynamicHtmlTag type="span" className="text-xs">
                                          <CustomDatePicker
                                            selected={updateendDate}
                                            onChange={(date: any) => handleUpdateEndDateChange(date)}
                                            dateFormat={"dd/MM/yyyy"}
                                            placeholderText="jj/mm/aaaa"
                                          />
                                        </DynamicHtmlTag>
                                      </DynamicHtmlTag>
                                    </CustomLabel>
                                  </DynamicHtmlTag>
                                )}
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="w-full flex justify-end my-1">
                                <CustomButton
                                  ty="button"
                                  onClick={handleUpdateSubmit}
                                  className="card-btn text-2xs 2xl:text-xs text-white py-2 px-3 font-semibold rounded-full inline-block">
                                  Enregistrer
                                </CustomButton>
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
        {Antecedentlist.length === 0 ? (
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
                breakLabel="..."
                breakClassName="inline-block px-3 py-1 border rounded-full mx-1"
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
              />
              <CustomButton
                as="button"
                onClick={openAddModal}
                className="card-btn text-2xs 2xl:text-xs text-white py-2 px-3 font-semibold rounded-full hidden lg:inline-block">
                Ajouter un antécédent
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        )}
        {/* Edit Modal Box Start */}
        <CustomModal isOpen={editModalOpen} onClose={closeEditModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 py-2 lg:py-4 px-2 lg:px-6">
              <DynamicHtmlTag type="div" className="flex flex-col mt-2 lg:mt-0">
                <DynamicHtmlTag type="div" className="flex items-center justify-between gap-2">
                  <HeadingTag type="h2" className="text-blue font-bold text-lg">
                    {modalMode === "edit" ? "Modifier un antécédent" : "Ajouter une antécédent"}
                  </HeadingTag>
                  <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={closeEditModal}>
                    <IoCloseSharp className="w-5 h-5" />
                  </CustomButton>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="div" className="w-full mt-8">
                    <DynamicHtmlTag type="div" className="flex justify-between items-center w-full md:w-8/12">
                      <CustomLabel className="pb-1 ps-2 text-xs">
                        Antécédent
                        <DynamicHtmlTag type="span" className="text-red-500">
                          *
                        </DynamicHtmlTag>
                      </CustomLabel>
                      {errors?.antecedentMotif && (
                        <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                          {errors?.antecedentMotif}
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                    <CustomSelect
                      value={defaultantecedentMotifOptions.find(option => option.value === medicalProfileBackground.antecedentMotif) || null}
                      onChange={(selectedOption: antecedentMotifOption | null) => {
                        setmedicalProfileBackground((prevState: any) => ({
                          ...prevState,
                          antecedentMotif: selectedOption?.value ?? "",
                        }));
                        setErrors((prevState: any) => ({
                          ...prevState,
                          antecedentMotif: "",
                        }));
                      }}
                      isClearable
                      placeholder="Sélectionnez un antécédent"
                      options={defaultantecedentMotifOptions}
                      className={`${errors?.antecedentMotif ? "border-red-400" : "border-gray-400"} border w-full md:w-8/12 outline-none text-2xs 2xl:text-xs xl:leading-none rounded-md modal-select-box`}
                    />

                    {/* <CustomAsyncSelect
                    name="antecedentMotif"
                    value={medicalProfileBackground?.antecedentMotif}
                    onChange={handleantecedentMotifChange}
                    defaultOptions={defaultantecedentMotifOptions}
                    loadOptions={handleSearchAnteceden}
                    placeholder="Rechercher un allergie"
                    isClearable
                    cacheOptions
                    noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucune option trouvée")}
                    className={`${errors?.antecedentMotif ? "border-red-500" : ""} w-full lg:w-3/4 timing-select outline-none [&&]:text-xs rounded-md border border-slate-200 font-semibold`}
                  /> */}
                  </DynamicHtmlTag>

                  <DynamicHtmlTag type="div" className="cstm-form-group flex items-center mt-5">
                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                      <CustomInput
                        className="surgical-check"
                        type="checkbox"
                        id="surgical1"
                        checked={!!medicalProfileBackground.isSurgery}
                        onChange={handleCheckboxChange}
                      />
                      <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="surgical1">
                        <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                      </CustomLabel>
                    </DynamicHtmlTag>

                    <CustomLabel htmlFor="affection" className="ps-2 sm:text-xs font-semibold cstm-lable">
                      Cochez la case s{"’"}il s{"’"}agit d{"’"}une opération chirurgicale
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </CustomLabel>
                    {errors?.isSurgery && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                        {errors?.isSurgery}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>

                  <DynamicHtmlTag type="div" className="flex items-center gap-4 teleconsultations-date-picker mt-5">
                    <DynamicHtmlTag type="div" className="w-full md:w-8/12 gap-2">
                      <DynamicHtmlTag type="div" className="flex items-center justify-between">
                        <DynamicHtmlTag type="span" className="text-xs pb-1 ps-2">
                          Date de début
                          <DynamicHtmlTag type="span" className="text-red-500">
                            *
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        {errors?.startDate && (
                          <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                            {errors?.startDate}
                          </DynamicHtmlTag>
                        )}
                      </DynamicHtmlTag>
                      <DynamicHtmlTag
                        type="div"
                        className={`border w-full py-2 p-1 flex items-center justify-between rounded-md gap-2 ${errors?.startDate ? "border-red-400" : "border-gray-400"} `}>
                        <DynamicHtmlTag type="span" className={`form-date-picker date-picker text-xs xl:leading-none w-full`}>
                          <CustomDatePicker
                            selected={startDate}
                            maxDate={new Date()}
                            onChange={(date: Date | null) => {
                              handleDateOptionChange(date);
                            }}
                            dateFormat={"dd/MM/yyyy"}
                            placeholderText="jj/mm/aaaa"
                            className="outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs rounded-md w-full ps-2"
                            // className="w-full"
                          />
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>

                  <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row justify-between gap-3 lg:items-center mt-5">
                    <DynamicHtmlTag type="div" className="w-full md:w-5/12 custom-radio-parent md:mt-5 [&&]:flex items-center justify-between pb-3">
                      <DynamicHtmlTag type="div" className="flex gap-2 ">
                        <DynamicHtmlTag type="div" className="flex items-center">
                          <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                            <CustomInput
                              className="progress-radio"
                              type="radio"
                              id="progress1"
                              onChange={() => handleRadioChange(false)} // Send false for "En cours"
                              // name="process"
                              checked={medicalProfileBackground.isFinished === false} // Reflect the state
                            />
                            <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="progress1">
                              <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                            </CustomLabel>
                          </DynamicHtmlTag>
                          <DynamicHtmlTag type="span" className="ps-2 text-2xs lg:text-xs font-semibold cstm-lable">
                            En cours
                            <DynamicHtmlTag type="span" className="text-red-500">
                              *
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        <DynamicHtmlTag type="div" className="flex items-center">
                          <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                            <CustomInput
                              className="finished-radio"
                              type="radio"
                              id="finished1"
                              onChange={() => handleRadioChange(true)} // Send true for "Terminé"
                              //name="process"
                              checked={medicalProfileBackground.isFinished === true} // Reflect the state
                            />
                            <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="finished1">
                              <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                            </CustomLabel>
                          </DynamicHtmlTag>
                          <DynamicHtmlTag type="span" className="ps-2 sm:text-xs font-semibold cstm-lable">
                            Terminé
                            <DynamicHtmlTag type="span" className="text-red-500">
                              *
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      {errors?.isFinished && (
                        <DynamicHtmlTag type="div" className="text-red-500 text-[9px] ps-2 absolute bottom-0">
                          {errors?.isFinished}
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>

                    <DynamicHtmlTag
                      type="div"
                      className={`w-full md:w-7/12 flex items-center gap-4 teleconsultations-date-picker ${medicalProfileBackground.isFinished === true ? "" : "opacity-40 pointer-events-none"}`}>
                      <DynamicHtmlTag type="div" className="w-full gap-2">
                        <DynamicHtmlTag type="div" className="flex items-center justify-between">
                          <DynamicHtmlTag type="span" className="text-xs pb-1 ps-2 w-3/6">
                            Date de fin
                            <DynamicHtmlTag type="span" className="text-red-500">
                              *
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                          {errors?.endDate && (
                            <DynamicHtmlTag type="div" className="text-red-500 text-[9px] line-clamp-1">
                              {errors?.endDate}
                            </DynamicHtmlTag>
                          )}
                        </DynamicHtmlTag>

                        <DynamicHtmlTag
                          type="div"
                          className={`border w-full py-2 p-1 flex items-center justify-between rounded-md gap-2 ${errors?.endDate ? "border-red-400" : "border-gray-400"} `}>
                          <DynamicHtmlTag type="span" className={`form-date-picker date-picker text-xs xl:leading-none w-full`}>
                            <CustomDatePicker
                              selected={endDate}
                              onChange={(date: any) => handleEndDateChange(date)}
                              dateFormat={"dd/MM/yyyy"}
                              placeholderText="jj/mm/aaaa"
                              className="outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs rounded-md w-full ps-2"
                            />
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <CustomButton
                    as="button"
                    onClick={handleSubmit}
                    className={`text-xs 2xl:text-xs card-btn cstm-btn mb-3 lg:mb-auto mt-6 flex py-2 px-1 justify-center float-end w-2/5 md:w-3/12 view-more-btn rounded-full text-white font-semibold`}>
                    {modalMode === "edit" ? "Enregistrer" : "Ajouter"}
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
          modalInputTitle={AntecedentDeleteName}
          modalSubTitle={"Antécédent"}
          onConfirm={() => {
            if (listDelete !== undefined) {
              deleteAntecedent(listDelete); // Ensure listDelete is defined
            }
          }}
          title="Supprimer un antécédent"
          paragraph={`Êtes vous sur de vouloir supprimer ce antécédent : ${AntecedentDeleteName} ?`}
        />
        {/* Delete Modal End */}
      </DynamicHtmlTag>

      {/* Empty Screen Without Content */}
      {/* <DynamicHtmlTag type="div" className="empty-history-content h-full hidden">
        <EmptyHistory
          title="Vous n’avez pas renseigné d’antécédent"
          paragraph="Je n’ai aucun problème de santé"
          button="Ajouter un antécédent"
          uniqueId="1"
        />
      </DynamicHtmlTag> */}
    </DynamicHtmlTag>
  );
};

export default MedicalHistory;
