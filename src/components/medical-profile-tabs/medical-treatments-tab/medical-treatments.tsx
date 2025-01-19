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
  CustomDatePicker,
  EmptyHistory,
  CustomModal,
  CustomFullScreenLoader,
  VisioLogo,
} from "@/components";
import { IoCloseSharp } from "react-icons/io5";
import {
  AddMedicalTreatmentSchema,
  fetchMedicalTreatmentApi,
  getFormateDate,
  getFormateDatetwoDateformate,
  MedicalProfileTreatment,
  treatmentMotifOption,
  TreatmentMotifType,
  UpdateMedicalTreatmentSchema,
  addisNoLongerTakeThisTreatmentUpdateApi,
  addTreatmentApi,
  addTreatmentUpdateApi,
  getListTreatmentApi,
  deleteTreatmentApi,
  profileMedicalDeleteMessage,
} from "@/utility";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { RootState } from "@/store";
import { toast } from "react-toastify";
import { selectPatientDetailsData } from "@/store/reducers/patientDetailsSlice";

const createtreatmentParams = {
  patientId: "",
  treatmentMotif: "",
  isRegular: false,
  isPunctual: false,
  isNoLongerTakeThisTreatment: false,
  frequence: "",
  startDate: "",
  endDate: "",
};
const UpdatetreatmentParams = {
  patientId: "",
  treatmentMotif: "",
  isRegular: false,
  isPunctual: false,
  isNoLongerTakeThisTreatment: false,
  frequence: "",
  startDate: "",
  endDate: "",
};
const itemsPerPage = 10;

const MedicalTreatments = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [listDelete, setListDelete] = useState<number | undefined>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [updatestartDate, setUpdateStartDate] = useState<Date>();
  const [updateendDate, setUpdateEndDate] = useState<Date>();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [editModalOpen, editIsModalOpen] = useState(false);
  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const [errors, setErrors] = useState<MedicalProfileTreatment>();
  const [Updateerrors, setUpdateErrors] = useState<MedicalProfileTreatment>();
  const [Treatmentlist, setTreatment] = useState<TreatmentMotifType[]>([]);
  const [TreatmentId, setTreatmentId] = useState(String);
  const fetchPatientData = useSelector(selectPatientDetailsData);

  const [isRegularTreatment, setIsRegularTreatment] = useState<boolean>(false);
  const [UpdatemedicalProfileTreatment, setUpdatemedicalProfileTreatment] = useState<MedicalProfileTreatment>(UpdatetreatmentParams);
  const [TreatmentDeleteName, setTreatmentDeleteName] = useState();

  const [defaulttreatmentMotifOptions, setDefaulttreatmentMotifOptions] = useState<treatmentMotifOption[]>([]);
  const [medicalProfileTreatment, setmedicalProfileTreatment] = useState<MedicalProfileTreatment>(createtreatmentParams);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const loggedInUser = useSelector(selectLoginResponse);
  const dispatch = useDispatch();

  const fetchTreatmentList = useCallback(
    async (isRegular = isRegularTreatment) => {
      try {
        const data = await getListTreatmentApi(fetchPatientData?.id, currentPage, itemsPerPage, isRegular);
        setTotalPages(data?.data?.totalPage || 0);
        setTotalItems(data?.data?.totalCount || 0);
        setTreatment(data?.data?.results || []);
      } catch (error) {}
    },
    [currentPage, fetchPatientData?.id, itemsPerPage, isRegularTreatment]
  );

  const fetchMedicalTreatment = useCallback(async () => {
    try {
      const response: any[] = await fetchMedicalTreatmentApi();
      const treatmentMotifOptions: treatmentMotifOption[] = response.map(treatment => ({
        value: treatment.id,
        label: treatment.name,
      }));
      setDefaulttreatmentMotifOptions(treatmentMotifOptions);
    } catch (error) {
      setDefaulttreatmentMotifOptions([]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("medical-profile"));
      try {
        await fetchMedicalTreatment();
        await fetchTreatmentList();
      } catch (err) {
      } finally {
        dispatch(hideLoader());
      }
    };
    fetchData();
  }, [fetchMedicalTreatment, fetchTreatmentList, isRegularTreatment]);

  const handleRadioChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = event.target;
    dispatch(showLoader("update-patient"));
    try {
      let isRegular = false;

      if (id === "treatments-regular") {
        isRegular = true;
        setIsRegularTreatment(true);
      } else if (id === "all-treatments") {
        isRegular = false;
        setIsRegularTreatment(false);
      }

      // Fetch the treatment list immediately with the new value
      await fetchTreatmentList(isRegular);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  // Handle change for various form fields
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof medicalProfileTreatment) => {
      const { type, checked, value } = e.target;

      // If the field is a checkbox, use 'checked' as the value (true/false).
      // If it's a radio button, use 'value' and convert "on" to true.
      const updatedValue = type === "checkbox" ? checked : value === "on";

      // Update the state with the new field value
      let updatedState = { ...medicalProfileTreatment, [field]: updatedValue };

      // If `isRegular` is checked, set `isPunctual` to false
      if (field === "isRegular" && updatedValue) {
        updatedState = {
          ...updatedState,
          isPunctual: false, // Set `isPunctual` to false when `isRegular` is checked
        };
      }

      // If `isPunctual` is checked, set `isRegular` to false
      if (field === "isPunctual" && updatedValue) {
        updatedState = {
          ...updatedState,
          isRegular: false, // Set `isRegular` to false when `isPunctual` is checked
        };
      }

      // Update the state
      setmedicalProfileTreatment(updatedState);

      // Error handling logic
      const { isRegular, isPunctual, isNoLongerTakeThisTreatment } = updatedState;

      // Clear the error for isNoLongerTakeThisTreatment if any checkbox is selected
      if (isRegular || isPunctual || isNoLongerTakeThisTreatment) {
        setErrors((prevErrors: any) => ({ ...prevErrors, isNoLongerTakeThisTreatment: undefined }));
      } else {
        // Handle validation for the specific field
        try {
          // Validate the updated field and remove any previous errors
          AddMedicalTreatmentSchema.validateSyncAt(field, updatedState);
          setErrors((prevErrors: any) => ({ ...prevErrors, [field]: undefined }));
        } catch (err: any) {
          // Capture and set the error for the updated field
          setErrors((prevErrors: any) => ({
            ...prevErrors,
            [field]: err.message,
          }));
        }
      }
    },
    [medicalProfileTreatment]
  );

  const handleUpdateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof UpdatemedicalProfileTreatment) => {
      const { type, checked, value } = e.target;

      // Determine the new value
      const updatedValue = type === "checkbox" ? checked : value === "on";

      let updatedState = { ...UpdatemedicalProfileTreatment, [field]: updatedValue };

      // Logic for radio buttons: Ensure mutual exclusivity
      if (field === "isRegular" && updatedValue) {
        updatedState = {
          ...updatedState,
          isRegular: true,
          isPunctual: false, // Unselect the other radio button
        };
      }
      if (field === "isPunctual" && updatedValue) {
        updatedState = {
          ...updatedState,
          isRegular: false, // Unselect the other radio button
          isPunctual: true,
        };
      }

      // Update the state
      setUpdatemedicalProfileTreatment(updatedState);

      // Error handling logic
      const { isRegular, isPunctual, isNoLongerTakeThisTreatment } = updatedState;

      // Clear error for `isNoLongerTakeThisTreatment` if any selection is made
      if (isRegular || isPunctual || isNoLongerTakeThisTreatment) {
        setUpdateErrors((prevErrors: any) => ({ ...prevErrors, isNoLongerTakeThisTreatment: undefined }));
      } else {
        // Revalidate the specific field
        try {
          UpdateMedicalTreatmentSchema.validateSyncAt(field, updatedState);
          setUpdateErrors((prevErrors: any) => ({ ...prevErrors, [field]: undefined }));
        } catch (err: any) {
          setUpdateErrors((prevErrors: any) => ({
            ...prevErrors,
            [field]: err.message,
          }));
        }
      }
    },
    [UpdatemedicalProfileTreatment]
  );

  const handleDeleteModal = (item: any) => {
    setListDelete(item.id); // Ensure item is a number here
    setTreatmentDeleteName(item?.treatmentMotif?.name);
    openDeleteModal();
  };
  const deleteTreatment = async (treatmentId: number) => {
    const pateientId = fetchPatientData?.id;
    try {
      const response = await deleteTreatmentApi(pateientId, treatmentId);
      toast.success(profileMedicalDeleteMessage.TraitementDeleteMessage);
      closeDeleteModal();
      fetchTreatmentList();
    } catch (error: any) {
      // const errorMessage = error.response?.data?.message;
    } finally {
    }
  };
  // Toggle the checked state
  const handleToggle = async (id: number, newSurgeryStatus: boolean, item: any) => {
    setIsChecked(!isChecked);
    // setUpdatemedicalProfileBackground(prevState => ({
    //   ...prevState,
    //   surgery: newSurgeryStatus, // Update the surgery status with the new value
    //   id: id, // Send the id along with the updated surgery status
    // }));
    setUpdateErrors(createtreatmentParams);
    setUpdatemedicalProfileTreatment(prevState => ({
      ...prevState,
      treatmentMotif: {
        value: item.treatmentMotif.id, // Use `id` as value
        label: item.treatmentMotif.name, // Use `name` as label
      },
      isRegular: item.regular,
      isPunctual: item.punctual,
      isNoLongerTakeThisTreatment: newSurgeryStatus,
      frequence: item.frequence,
      startDate: item.startDate,
      endDate: item.endDate,
    }));
    setTreatmentId(item.id);
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
    // Create the model object
    const model = {
      patientId: fetchPatientData?.id.toString(),
      treatmentId: id.toString(),
      isNoLongerTakeThisTreatment: newSurgeryStatus,
    };
    try {
      dispatch(showLoader("update-patient"));

      // Call the API to update the surgery status
      await addisNoLongerTakeThisTreatmentUpdateApi(model);
      // Fetch the antecedent list (if needed)
      fetchTreatmentList();
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
    setUpdateErrors(createtreatmentParams);
    setUpdatemedicalProfileTreatment(prevState => ({
      ...prevState,
      treatmentMotif: {
        value: rowId.treatmentMotif.id, // Use `id` as value
        label: rowId.treatmentMotif.name, // Use `name` as label
      },
      isRegular: rowId.regular,
      isPunctual: rowId.punctual,
      isNoLongerTakeThisTreatment: rowId.noLongerTakeThisTreatment,
      frequence: rowId.frequence,
      startDate: rowId.startDate,
      endDate: rowId.endDate,
    }));
    setTreatmentId(rowId.id);
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

  const handleDateOptionUpdateChange = (date: any) => {
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";

    setUpdateStartDate(date);
    setUpdatemedicalProfileTreatment((prevState: MedicalProfileTreatment) => ({
      ...prevState,
      startDate: formattedDate,
    }));
    setUpdateErrors((prevErrors: any) => ({ ...prevErrors, startDate: undefined }));
  };

  const handleDateOptionChange = (date: any) => {
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";

    setStartDate(date);
    setmedicalProfileTreatment((prevState: MedicalProfileTreatment) => ({
      ...prevState,
      startDate: formattedDate,
    }));
    try {
      AddMedicalTreatmentSchema.validateSyncAt("startDate", {
        ...medicalProfileTreatment,
        startDate: formattedDate,
      });
      setErrors((prevErrors: any) => ({ ...prevErrors, startDate: undefined }));
    } catch (err: any) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        startDate: err.message,
      }));
    }
  };

  const handleEndDateChange = (date: any) => {
    setEndDate(date);
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";
    setmedicalProfileTreatment((prevState: MedicalProfileTreatment) => ({
      ...prevState,
      endDate: formattedDate,
    }));
    try {
      AddMedicalTreatmentSchema.validateSyncAt("endDate", {
        ...medicalProfileTreatment,
        endDate: formattedDate,
      });
      setErrors((prevErrors: any) => ({ ...prevErrors, endDate: undefined }));
    } catch (err: any) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        endDate: err.message,
      }));
    }
  };
  const handleEndDateUpdateChange = (date: any) => {
    setUpdateEndDate(date);
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";
    setUpdatemedicalProfileTreatment((prevState: MedicalProfileTreatment) => ({
      ...prevState,
      endDate: formattedDate,
    }));
    setUpdateErrors((prevErrors: any) => ({ ...prevErrors, endDate: undefined }));
  };
  const openAddModal = () => {
    editIsModalOpen(true);
    setModalMode("add");
  };
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the field value in state
    setmedicalProfileTreatment(prevState => ({ ...prevState, [name]: value }));

    // Validate the field and update errors
    AddMedicalTreatmentSchema.validateAt("frequence", { ...medicalProfileTreatment, [name]: value })
      .then(() => {
        // Clear error if validation passes
        setErrors((prevErrors: any) => ({ ...prevErrors, frequence: undefined }));
      })
      .catch((err: any) => {
        // Set error message if validation fails
        setErrors((prevErrors: any) => ({ ...prevErrors, frequence: err.message }));
      });
  };
  const handleFieldUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Update the field value in state
    setUpdatemedicalProfileTreatment(prevState => ({ ...prevState, [name]: value }));
    // Clear error if validation passes
    setUpdateErrors((prevErrors: any) => ({ ...prevErrors, frequence: undefined }));
  };

  // Pagination
  const handlePageChange = (selected: { selected: number }) => {
    setCurrentPage(selected.selected);
  };

  // DeleteModalBox
  const openDeleteModal = () => setIsModalOpen(true);
  const closeDeleteModal = () => setIsModalOpen(false);

  const Treatment = [
    { value: "Ventoline", label: "Ventoline" },
    { value: "Ventoline2", label: "Ventoline2" },
    { value: "Ventoline3", label: "Ventoline3" },
  ];
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
  };
  const closeEditModal = () => {
    setmedicalProfileTreatment(createtreatmentParams);
    setStartDate(undefined);
    setEndDate(undefined);
    setErrors(createtreatmentParams);
    editIsModalOpen(false);
  };
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const model: any = {
      patientId: fetchPatientData?.id,
      treatmentMotif: medicalProfileTreatment.treatmentMotif,
      isRegular: medicalProfileTreatment.isRegular,
      isPunctual: medicalProfileTreatment.isPunctual,
      isNoLongerTakeThisTreatment: medicalProfileTreatment.isNoLongerTakeThisTreatment,
      frequence: medicalProfileTreatment.frequence,
      startDate: medicalProfileTreatment.startDate,
    };

    if (medicalProfileTreatment.isNoLongerTakeThisTreatment === true) {
      model.endDate = medicalProfileTreatment.endDate;
    }

    try {
      // Validate data
      await AddMedicalTreatmentSchema.validate(medicalProfileTreatment, { abortEarly: false });
      dispatch(showLoader("medical-profile"));
      // Call API
      await addTreatmentApi(model);
      // Reset state
      fetchTreatmentList();
      setmedicalProfileTreatment(createtreatmentParams);
      setStartDate(undefined);
      setEndDate(undefined);
      setErrors(createtreatmentParams);
      closeEditModal();
    } catch (err: any) {
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setErrors(validationErrors);
      }
    } finally {
      // Add a small delay to ensure loader visibility
      setTimeout(() => dispatch(hideLoader()), 300);
    }
  };

  const handleUpdateSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Conditionally add endDate if isFinished is true
    const model: any = {
      patientId: fetchPatientData?.id.toString(),
      treatmentId: TreatmentId.toString(),
      frequence: UpdatemedicalProfileTreatment.frequence,
      treatmentMotif: UpdatemedicalProfileTreatment.treatmentMotif?.value,
      isRegular: UpdatemedicalProfileTreatment.isRegular,
      isPunctual: UpdatemedicalProfileTreatment.isPunctual,
      startDate: getFormateDatetwoDateformate(UpdatemedicalProfileTreatment.startDate || ""),
      isNoLongerTakeThisTreatment: UpdatemedicalProfileTreatment.isNoLongerTakeThisTreatment,
    };

    // Explicitly check if isFinished is true
    if (UpdatemedicalProfileTreatment.isNoLongerTakeThisTreatment === true) {
      model.endDate = getFormateDatetwoDateformate(UpdatemedicalProfileTreatment.endDate || "");
    }

    try {
      await UpdateMedicalTreatmentSchema.validate(UpdatemedicalProfileTreatment, { abortEarly: false });
      dispatch(showLoader("medical-profile"));
      // Call API to add medical history
      await addTreatmentUpdateApi(model);
      setExpandedRow(null);
      // Reset form fields and errors after successful submission
      fetchTreatmentList();
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
  // if (isLoading) {
  //   return <CustomFullScreenLoader />; // Render loader if loading
  // }
  return (
    <DynamicHtmlTag type="div" className="bg-white rounded-xl h-[92%]">
      <DynamicHtmlTag type="div" className="bg-gradient-to-t from-[#E8386F] to-[#D594C1] rounded-t-xl pt-0">
        <HeadingTag type="h3" className="font-semibold text-sm text-white text-center py-1 px-3">
          Traitements médicaux
        </HeadingTag>
      </DynamicHtmlTag>

      {/* Tab Content Screen */}
      <DynamicHtmlTag type="div" className="w-full px-3 py-2 relative h-full main-tab-inner">
        <DynamicHtmlTag
          type="div"
          className={`max-h-table overflow-auto min-w-full bg-white ${Treatmentlist.length === 0 ? "h-full" : "h-[82%] xl:h-[90%] 2xl:h-[95%]"} pt-10 lg:pt-0`}>
          <DynamicHtmlTag type="div" className="w-full h-12 bg-white absolute top-0 z-10 left-0 right-0 block lg:hidden ps-2">
            <CustomButton
              as="button"
              onClick={openAddModal}
              className="card-btn text-2xs lg:text-xs text-white py-1.5 lg:py-2 px-3 font-semibold rounded-2xl absolute top-2 lg:hidden">
              Ajouter un traitement
            </CustomButton>
          </DynamicHtmlTag>
          {Treatmentlist.length === 0 ? (
            ""
          ) : (
            <DynamicHtmlTag type="div" className="inline-flex py-3 px-2 w-full">
              <DynamicHtmlTag type="span" className="text-[2vw] md:text-xs font-semibold">
                Tier par :
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="[&&]:flex gap-2 custom-radio-parent">
                <DynamicHtmlTag type="div" className="flex items-center ps-1 md:ps-2">
                  <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-1 md:gap-2">
                    <CustomInput className="" onChange={handleRadioChange} type="radio" id="all-treatments" name="treatments" />
                    <CustomLabel
                      className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px] [&&]:border-blue"
                      htmlFor="all-treatments">
                      <CustomImage src="/images/black-checkbox.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                    </CustomLabel>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="ps-1 md:ps-3 text-[2vw] md:text-xs font-semibold cstm-lable">
                    Tous les traitements
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex items-center ps-1 md:ps-2">
                  <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-1 md:gap-2">
                    <CustomInput className="" onChange={handleRadioChange} type="radio" id="treatments-regular" name="treatments" />
                    <CustomLabel
                      className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px] [&&]:border-blue"
                      htmlFor="treatments-regular">
                      <CustomImage src="/images/black-checkbox.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                    </CustomLabel>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="span" className="ps-1 md:ps-3 text-[2vw] md:text-xs font-semibold cstm-lable">
                    Traitement(s) régulier(s)
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          )}
          <DynamicHtmlTag
            type="div"
            className={`w-full lg:px-3 lg:py-2 relative main-tab-inner ${Treatmentlist.length === 0 ? "h-full" : "lg:h-[82%] xl:h-[88%] 2xl:h-[92%]"}`}>
            <DynamicHtmlTag
              type="div"
              className={`max-h-table lg:overflow-auto min-w-full bg-white lg:h-[96%] xl:h-[94%] 2xl::h-[86%] table-mobile-height treatment-tab ${Treatmentlist.length === 0 ? "pb-0" : "pb-12 lg:pb-0"}`}>
              {isLoading ? (
                <CustomFullScreenLoader />
              ) : (
                <table className={`min-w-full bg-white border-collapse ${Treatmentlist.length === 0 ? "h-full" : "h-auto"}`}>
                  {Treatmentlist.length === 0 ? (
                    ""
                  ) : (
                    <thead>
                      <tr className="sticky top-[-2px] z-10 border-t lg:border-t-0 border-b border-slate-100 text-[2vw] md:text-2xs bg-white">
                        <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100">
                          <DynamicHtmlTag type="div" className="line-clamp-1">
                            Traitement{" "}
                          </DynamicHtmlTag>{" "}
                        </th>
                        <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100">
                          <DynamicHtmlTag type="div" className="line-clamp-1">
                            Fréquence
                          </DynamicHtmlTag>
                        </th>
                        <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100">
                          <DynamicHtmlTag type="div" className="line-clamp-1">
                            Traitement en cours{" "}
                          </DynamicHtmlTag>
                        </th>
                        <th className="p-1 lg:py-2 lg:px-2 text-center lg:text-left font-medium text-slate-100 hidden md:table-cell">
                          <DynamicHtmlTag type="div" className="line-clamp-1">
                            Date de début{" "}
                          </DynamicHtmlTag>
                        </th>
                        <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100 hidden md:table-cell">
                          <DynamicHtmlTag type="div" className="line-clamp-1">
                            Date de fin
                          </DynamicHtmlTag>{" "}
                        </th>
                        <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100 hidden md:table-cell">
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
                    {Treatmentlist.length === 0 ? (
                      <EmptyHistory
                        onConfirm={openAddModal}
                        title="Vous n’avez pas renseigné de traitement"
                        paragraph={`Aucune mesure de traitements médicaux n{"'"}a été enregistrée pour le moment.`}
                        button="Ajouter un traitement"
                        uniqueId="2"
                      />
                    ) : (
                      // <DynamicHtmlTag
                      //   type="span"
                      //   className="max-w-max text-center text-xs lg:text-base py-1 md:absolute top-1/2 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 empty-image-main">
                      //   <CustomImage src={VisioLogo} alt="logo" className="loader-logo mx-auto mb-2" width={500} height={200} />
                      //   Aucune mesure de traitements médicaux n{"'"}a été enregistrée pour le moment.
                      // </DynamicHtmlTag>
                      Treatmentlist.map(treatment => (
                        <React.Fragment key={treatment.id}>
                          <tr
                            className="cursor-pointer text-[2vw] md:text-3xs xl:text-2xs 2xl:text-xs font-bold lg:border-t lg:border-slate-100"
                            onClick={() => handleToggleRow(treatment)}>
                            <td className="p-1 lg:py-3 lg:px-3">
                              <DynamicHtmlTag type="span" className="line-clamp-1">
                                {treatment?.treatmentMotif?.name}
                              </DynamicHtmlTag>
                            </td>
                            <td className="p-1 lg:py-3 lg:px-3 ">
                              <DynamicHtmlTag type="span" className="line-clamp-1">
                                {treatment?.frequence}
                              </DynamicHtmlTag>
                            </td>
                            <td>
                              <DynamicHtmlTag type="span" className="flex items-center">
                                <DynamicHtmlTag
                                  type="span"
                                  className="text-[2vw] md:text-xs font-medium text-slate-100 ml-1 mr-1 lg:ml-2 lg:mr-4 w-6 lg:w-8">
                                  {treatment.noLongerTakeThisTreatment == true ? "Oui" : "Non"}
                                </DynamicHtmlTag>
                                <CustomLabel className="inline-flex relative items-center mr-5 cursor-pointer">
                                  <CustomInput
                                    type="checkbox"
                                    className="sr-only peer switch-input text-sm "
                                    value=""
                                    checked={treatment.noLongerTakeThisTreatment}
                                    onChange={() => handleToggle(treatment.id, !treatment.noLongerTakeThisTreatment, treatment)}
                                  />
                                  <DynamicHtmlTag
                                    type="div"
                                    className="switch-peer-style w-8 lg:w-10 h-4 lg:h-5 bg-white border-red border rounded-full peer peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-[#45AAE0] after:content-[''] after:absolute after:top-[4px] lg:after:top-[3px] after:left-[4px] lg:after:left-[6px] after:rounded-full after:h-[8px] lg:after:h-[13px] after:w-[8px] lg:after:w-[13px] peer-checked:after:left-[10px] after:transition-all peer-checked:bg-gradient-to-r from-[#335FA8] to-[#43ABE1]"></DynamicHtmlTag>
                                </CustomLabel>
                              </DynamicHtmlTag>
                            </td>
                            <td className="p-1 lg:py-3 lg:px-3 text-center lg:text-left hidden md:table-cell">
                              <DynamicHtmlTag type="span" className="line-clamp-1">
                                {treatment.startDate}
                              </DynamicHtmlTag>
                            </td>

                            <td className="p-1 lg:py-3 lg:px-3 hidden md:table-cell">
                              <DynamicHtmlTag type="span" className="line-clamp-1">
                                {treatment.endDate == null ? "-" : treatment.endDate}
                              </DynamicHtmlTag>
                            </td>
                            <td className="p-1 lg:py-3 lg:px-3 hidden md:table-cell">
                              <DynamicHtmlTag type="span" className="line-clamp-1">
                                {treatment.createdAt}
                              </DynamicHtmlTag>
                            </td>
                            <td className="p-1 lg:py-3 lg:px-3 w-1/6">
                              <DynamicHtmlTag type="div" className="flex items-center space-x-4 justify-center">
                                <CustomButton type="button">
                                  <CustomImage className="w-4 h-4 max-w-max" src="/images/pencil-edit.svg" alt="pencil-edit" width={16} height={16} />
                                </CustomButton>
                                <CustomButton
                                  onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                    event.stopPropagation();
                                    handleDeleteModal(treatment);
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
                                    {treatment?.startDate == null ? (
                                      <DynamicHtmlTag type="span">{`-`} </DynamicHtmlTag>
                                    ) : (
                                      <DynamicHtmlTag type="span"> {treatment?.startDate}</DynamicHtmlTag>
                                    )}
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                                <DynamicHtmlTag type="div" className="py-2 w-2/6 text-[2vw] md:text-3xs">
                                  <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                                    Dates fin
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="span" className="font-semibold">
                                    {treatment?.endDate == null ? (
                                      <DynamicHtmlTag type="span">{`-`} </DynamicHtmlTag>
                                    ) : (
                                      <DynamicHtmlTag type="span"> {treatment?.endDate}</DynamicHtmlTag>
                                    )}
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                                <DynamicHtmlTag type="div" className="py-2 w-2/6 text-[2vw] md:text-3xs">
                                  <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                                    Ajouté le
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="span" className="font-semibold">
                                    {treatment?.createdAt}
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                            </td>
                          </tr>

                          {/* Collapsible Row */}
                          {expandedRow === treatment.id && (
                            <tr className="bg-base-100">
                              <td colSpan={8}>
                                <DynamicHtmlTag type="div" className="max-h-auto">
                                  <DynamicHtmlTag type="div" className="w-full flex items-center justify-between gap-2">
                                    <DynamicHtmlTag type="div" className="w-1/2">
                                      <DynamicHtmlTag type="div" className="form-group gap-3 w-full">
                                        <DynamicHtmlTag type="div" className="flex items-center justify-between">
                                          <CustomLabel className="text-[2vw] lg:text-xs font-semibold px-2">Traitement</CustomLabel>
                                          {Updateerrors?.treatmentMotif && (
                                            <DynamicHtmlTag type="div" className="text-red-500 text-[2vw] lg:text-xs">
                                              {Updateerrors?.treatmentMotif}
                                            </DynamicHtmlTag>
                                          )}
                                        </DynamicHtmlTag>
                                        <CustomSelect
                                          name="treatment"
                                          value={
                                            defaulttreatmentMotifOptions.find(
                                              option => option.value === UpdatemedicalProfileTreatment.treatmentMotif?.value
                                            ) || null
                                          }
                                          onChange={(selectedOption: { value: number; label: string } | null) => {
                                            setUpdatemedicalProfileTreatment(prevState => ({
                                              ...prevState,
                                              treatmentMotif: selectedOption || "", // Store the full selected option or empty string
                                            }));

                                            setUpdateErrors((prevState: any) => ({
                                              ...prevState,
                                              treatmentMotif: "", // Clear any existing error
                                            }));
                                          }}
                                          isClearable
                                          options={defaulttreatmentMotifOptions}
                                          placeholder="Sélectionnez un treatment"
                                          className={`${Updateerrors?.treatmentMotif ? "border-red-400" : "border-gray-400"} w-full p-2 countries-select text-[2vw] lg:text-xs  text-black placeholder-black border rounded-lg mb-1`}
                                        />
                                      </DynamicHtmlTag>
                                    </DynamicHtmlTag>
                                    <DynamicHtmlTag type="div" className="w-1/2">
                                      <DynamicHtmlTag type="div" className="form-group gap-3 w-full">
                                        <DynamicHtmlTag type="div" className="flex items-center justify-between">
                                          <CustomLabel className="text-[2vw] lg:text-xs font-semibold px-2">Fréquence</CustomLabel>
                                          {Updateerrors?.frequence && (
                                            <DynamicHtmlTag type="div" className="text-red-500 text-[2vw] lg:text-xs">
                                              {Updateerrors?.frequence}
                                            </DynamicHtmlTag>
                                          )}
                                        </DynamicHtmlTag>
                                        <DynamicHtmlTag type="div" className="w-full">
                                          <CustomLabel
                                            className={`${Updateerrors?.frequence ? "border-red-400" : "border-gray-400"} input border p-2 flex items-center gap-2 rounded-md h-8 mb-1`}>
                                            <CustomInput
                                              type="text"
                                              name="frequence"
                                              onChange={handleFieldUpdateChange}
                                              value={UpdatemedicalProfileTreatment.frequence}
                                              className="grow input outline-none focus:outline-none border-none h-auto text-[2vw] lg:text-xs w-full"
                                              placeholder="Indiquer la fréquence"
                                            />
                                          </CustomLabel>
                                        </DynamicHtmlTag>
                                      </DynamicHtmlTag>
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div" className="flex w-full items-center justify-between lg:my-2 gap-2">
                                    <DynamicHtmlTag type="div" className="w-1/2">
                                      <DynamicHtmlTag className="flex items-center justify-between" type="div">
                                        <CustomLabel className="text-[2vw] lg:text-xs font-semibold px-2">Date de début</CustomLabel>
                                        {Updateerrors?.startDate && (
                                          <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                                            {Updateerrors?.startDate}
                                          </DynamicHtmlTag>
                                        )}
                                      </DynamicHtmlTag>
                                      <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-md h-8 mb-1 w-full">
                                        <DynamicHtmlTag
                                          type="div"
                                          className="form-date-picker date-picker medical-tabs flex items-center outline-none [&&]:text-2xs">
                                          <DynamicHtmlTag type="span" className="text-[2vw] lg:text-xs ">
                                            <CustomDatePicker
                                              selected={updatestartDate}
                                              onChange={(date: any) => handleDateOptionUpdateChange(date)}
                                              dateFormat={"dd/MM/yyyy"}
                                              placeholderText="jj/mm/aaaa"
                                            />
                                          </DynamicHtmlTag>
                                        </DynamicHtmlTag>
                                      </CustomLabel>
                                      {Updateerrors?.startDate && (
                                        <DynamicHtmlTag type="div" className="text-red-500 text-[2vw] lg:text-xs">
                                          {Updateerrors?.startDate}
                                        </DynamicHtmlTag>
                                      )}
                                    </DynamicHtmlTag>
                                    <DynamicHtmlTag type="div" className="w-1/2">
                                      <DynamicHtmlTag className="flex items-center justify-between" type="div">
                                        <CustomLabel className="text-[2vw] lg:text-xs font-semibold px-2">Date de fin</CustomLabel>
                                        {Updateerrors?.endDate && (
                                          <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                                            {Updateerrors?.endDate}
                                          </DynamicHtmlTag>
                                        )}
                                      </DynamicHtmlTag>
                                      <CustomLabel
                                        className={` ${Updateerrors?.endDate ? "border-red-400" : "border-gray-400"} input border p-2 flex items-center gap-2 rounded-md h-8 mb-1 w-full `}>
                                        <DynamicHtmlTag
                                          type="div"
                                          className="form-date-picker date-picker medical-tabs flex items-center outline-none [&&]:text-2xs">
                                          <DynamicHtmlTag type="span" className="text-[2vw] lg:text-xs">
                                            <CustomDatePicker
                                              selected={updateendDate}
                                              onChange={(date: any) => handleEndDateUpdateChange(date)}
                                              dateFormat={"dd/MM/yyyy"}
                                              placeholderText="jj/mm/aaaa"
                                              disabled={UpdatemedicalProfileTreatment.isNoLongerTakeThisTreatment === false}
                                            />
                                          </DynamicHtmlTag>
                                        </DynamicHtmlTag>
                                      </CustomLabel>
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag
                                    type="div"
                                    className="w-full flex justify-between items-end lg:items-center lg:flex-row flex-col mb-2">
                                    <DynamicHtmlTag type="div" className="custom-radio-parent [&&]:flex items-center justify-start">
                                      <DynamicHtmlTag type="div" className="flex gap-2 pe-2">
                                        {/* Regular Treatment */}
                                        <DynamicHtmlTag type="div" className="flex items-center ps-1">
                                          <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                            <CustomInput
                                              className=""
                                              checked={UpdatemedicalProfileTreatment.isRegular === true}
                                              onChange={e => handleUpdateChange(e, "isRegular")}
                                              type="radio" // Change to "radio" for mutual exclusivity
                                              id="check-regular"
                                              name="treatment-radio" // Grouped name for mutual exclusivity
                                            />
                                            <CustomLabel
                                              className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]"
                                              htmlFor="check-regular">
                                              <CustomImage
                                                src="/images/checkbox-img.svg"
                                                alt="checkbox"
                                                width={100}
                                                height={100}
                                                className="checkmark w-full"
                                              />
                                            </CustomLabel>
                                          </DynamicHtmlTag>
                                          <DynamicHtmlTag type="span" className="ps-2 text-[1.8vw] line-clamp-1 md:text-2xs font-semibold cstm-lable">
                                            Traitement régulier
                                          </DynamicHtmlTag>
                                        </DynamicHtmlTag>

                                        {/* Punctual Treatment */}
                                        <DynamicHtmlTag type="div" className="flex items-center ps-1">
                                          <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                            <CustomInput
                                              className=""
                                              checked={UpdatemedicalProfileTreatment.isPunctual === true}
                                              onChange={e => handleUpdateChange(e, "isPunctual")}
                                              type="radio" // Change to "radio" for mutual exclusivity
                                              id="spot-treatment"
                                              name="treatment-radio" // Grouped name for mutual exclusivity
                                            />
                                            <CustomLabel
                                              className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]"
                                              htmlFor="spot-treatment">
                                              <CustomImage
                                                src="/images/checkbox-img.svg"
                                                alt="checkbox"
                                                width={100}
                                                height={100}
                                                className="checkmark w-full"
                                              />
                                            </CustomLabel>
                                          </DynamicHtmlTag>
                                          <DynamicHtmlTag type="span" className="ps-2 text-[1.8vw] line-clamp-1 md:text-2xs font-semibold cstm-lable">
                                            Traitement ponctuel
                                          </DynamicHtmlTag>
                                        </DynamicHtmlTag>

                                        {/* No Longer Taking Treatment */}
                                        <DynamicHtmlTag type="div" className="flex items-center ps-1">
                                          <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                            <CustomInput
                                              className=""
                                              type="checkbox"
                                              onChange={e => handleUpdateChange(e, "isNoLongerTakeThisTreatment")}
                                              checked={UpdatemedicalProfileTreatment.isNoLongerTakeThisTreatment === true}
                                              id="no-treatment"
                                              name="treatment-checkbox" // Independent name for the checkbox
                                            />
                                            <CustomLabel
                                              className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]"
                                              htmlFor="no-treatment">
                                              <CustomImage
                                                src="/images/checkbox-img.svg"
                                                alt="checkbox"
                                                width={100}
                                                height={100}
                                                className="checkmark w-full"
                                              />
                                            </CustomLabel>
                                          </DynamicHtmlTag>
                                          <DynamicHtmlTag type="span" className="ps-2 text-[1.8vw] line-clamp-1 md:text-2xs font-semibold cstm-lable">
                                            Je ne prends plus ce traitement
                                          </DynamicHtmlTag>
                                        </DynamicHtmlTag>
                                      </DynamicHtmlTag>

                                      {Updateerrors?.isNoLongerTakeThisTreatment && (
                                        <DynamicHtmlTag type="div" className="text-red-500 text-[2vw] lg:text-3xs line-clamp-1">
                                          {Updateerrors?.isNoLongerTakeThisTreatment}
                                        </DynamicHtmlTag>
                                      )}
                                    </DynamicHtmlTag>
                                    <CustomButton
                                      as="button"
                                      onClick={handleUpdateSubmit}
                                      className="my-1 lg:my-0 card-btn text-[2vw] lg:text-2xs 2xl:text-xs text-white py-1 lg:py-2 px-3 font-semibold rounded-full inline-block">
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
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {Treatmentlist.length === 0 ? (
          ""
        ) : (
          <DynamicHtmlTag
            type="div"
            className="flex flex-row-reverse lg:flex-row justify-center lg:justify-end absolute lg:mt-0 bottom-2 left-0 right-0 items-center mx-2 md:mx-3 border-t-slate-100 border-t-[1px] pt-3 bg-white">
            <DynamicHtmlTag type="div" className="flex items-center justify-between lg:w-7/12">
              <Pagination
                currentPage={currentPage}
                pageCount={totalPages}
                onPageChange={handlePageChange}
                pageClassName="inline-block px-3 py-1 border border-blue rounded-full mx-1 text-blue"
                activeClassName="bg-primary text-white border-primary"
                previousClassName="text-[#CCCACA] py-2 px-3 xl:px-4"
                nextClassName="text-[#CCCACA] py-2 px-3 xl:px-4"
                disabledClassName="opacity-50  pointer-events-none"
                breakLabel={"..."}
                breakClassName="inline-block px-3 py-1 border rounded-full mx-1"
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
              />
              <CustomButton
                as="button"
                onClick={openAddModal}
                className="card-btn text-2xs 2xl:text-xs text-white py-2 px-3 font-semibold rounded-full hidden lg:inline-block">
                Ajouter un traitement
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        )}
        <CustomModal isOpen={editModalOpen} onClose={closeEditModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 py-2 px-2 lg:py-4 lg:px-6">
              <DynamicHtmlTag type="div" className="flex flex-col">
                {/* Modal Header */}
                <DynamicHtmlTag type="div" className="flex items-center justify-between gap-2">
                  <HeadingTag type="h2" className="text-blue font-bold text-lg">
                    {modalMode === "edit" ? "Modifier un traitement" : "Ajouter un traitement"}
                  </HeadingTag>
                  <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={closeEditModal}>
                    <IoCloseSharp className="w-5 h-5" />
                  </CustomButton>
                </DynamicHtmlTag>

                {/* Antécédent Selection */}
                <DynamicHtmlTag type="div" className="w-full lg:w-8/12 mt-5">
                  <DynamicHtmlTag type="div" className="flex items-center justify-between">
                    <CustomLabel className="pb-1 ps-2 text-xs">
                      Traitement
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </CustomLabel>
                    {errors?.treatmentMotif && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                        {errors?.treatmentMotif}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className={`${errors?.treatmentMotif ? "border-red-400" : "border-gray-400"} h-[2.063rem] input border p-2 flex items-center gap-2 rounded-md mb-1 relative`}>
                    <CustomSelect
                      value={defaulttreatmentMotifOptions.find(option => option.value === medicalProfileTreatment.treatmentMotif) || null}
                      onChange={(selectedOption: treatmentMotifOption | null) => {
                        setmedicalProfileTreatment((prevState: any) => ({
                          ...prevState,
                          treatmentMotif: selectedOption?.value ?? "",
                        }));
                        setErrors((prevState: any) => ({
                          ...prevState,
                          treatmentMotif: "",
                        }));
                      }}
                      isClearable
                      options={defaulttreatmentMotifOptions}
                      placeholder="Séléctionnez un traitement"
                      className="w-full timing-select outline-none [&&]:text-xs countries-select"
                    />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>

                {/* Surgical Checkbox */}
                <DynamicHtmlTag type="div" className="relative lg:pb-2 lg:mb-1">
                  <DynamicHtmlTag type="div" className="cstm-form-group flex items-center my-2 xl:mb-0 capitalize gap-x-2">
                    {/* Regular Treatment Radio Button */}
                    <DynamicHtmlTag type="div" className="w-1/4 flex items-center justify-start gap-1">
                      <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                        <CustomInput
                          className="input-checked"
                          type="radio"
                          id="amasddnan"
                          name="treatmentType" // Same name for both radio buttons
                          checked={medicalProfileTreatment.isRegular}
                          onChange={e => handleChange(e, "isRegular")}
                        />
                        <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="amasddnan">
                          <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                        </CustomLabel>
                      </DynamicHtmlTag>
                      <CustomLabel className="text-2xs lg:text-xs xl:text-3xs 2xl:text-xs 2xl:leading-tight xl:leading-none font-semibold cstm-lable line-clamp-1">
                        traitement régulier
                      </CustomLabel>
                    </DynamicHtmlTag>

                    {/* Punctual Treatment Radio Button */}
                    <DynamicHtmlTag type="div" className="w-1/4 flex items-center justify-start gap-1">
                      <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                        <CustomInput
                          className="input-checked"
                          type="radio"
                          id="amasddnan1"
                          name="treatmentType" // Same name for both radio buttons
                          checked={medicalProfileTreatment.isPunctual}
                          onChange={e => handleChange(e, "isPunctual")}
                        />
                        <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="amasddnan1">
                          <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                        </CustomLabel>
                      </DynamicHtmlTag>
                      <CustomLabel className="text-2xs lg:text-xs xl:text-3xs 2xl:text-xs 2xl:leading-tight xl:leading-none font-semibold cstm-lable line-clamp-1">
                        traitement ponctuel
                      </CustomLabel>
                    </DynamicHtmlTag>

                    {/* No Longer Take Treatment Checkbox */}
                    <DynamicHtmlTag type="div" className="w-2/4 flex items-center justify-start gap-1">
                      <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                        <CustomInput
                          className="input-checked"
                          type="checkbox"
                          id="amasddnan2"
                          checked={medicalProfileTreatment.isNoLongerTakeThisTreatment}
                          onChange={e => handleChange(e, "isNoLongerTakeThisTreatment")}
                        />
                        <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="amasddnan2">
                          <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                        </CustomLabel>
                      </DynamicHtmlTag>
                      <CustomLabel className="text-2xs lg:text-xs xl:text-3xs 2xl:text-xs 2xl:leading-tight xl:leading-none font-semibold cstm-lable line-clamp-1">
                        Je ne prends plus ce traitement
                      </CustomLabel>
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>

                  {/* Error Message */}
                  {errors?.isNoLongerTakeThisTreatment && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-3xs absolute bottom-0">
                      {errors?.isNoLongerTakeThisTreatment}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>

                {/* Date Picker for Start Date */}

                <DynamicHtmlTag type="div" className="flex items-center gap-4 teleconsultations-date-picker mt-1 lg:mt-4">
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
                      className={`border w-full py-2 px-2 flex items-center justify-between rounded-md gap-2 ${errors?.startDate ? "border-red-400" : "border-gray-400"} `}>
                      <DynamicHtmlTag type="span" className={`form-date-picker date-picker text-xs xl:leading-none w-full`}>
                        <CustomDatePicker
                          selected={startDate}
                          onChange={(date: any) => handleDateOptionChange(date)}
                          dateFormat={"dd/MM/yyyy"}
                          placeholderText="jj/mm/yyyy"
                          className="w-full placeholder:font-normal"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>

                {/* Date Picker for End Date */}
                <DynamicHtmlTag
                  type="div"
                  className={`flex items-center gap-4 teleconsultations-date-picker mt-3 ${medicalProfileTreatment.isNoLongerTakeThisTreatment === false ? "opacity-35" : "opacity-100"} `}>
                  <DynamicHtmlTag type="div" className="w-full md:w-8/12 gap-2">
                    <DynamicHtmlTag type="div" className="flex items-center justify-between">
                      <DynamicHtmlTag type="span" className="text-xs pb-1 ps-2">
                        Date de fin
                      </DynamicHtmlTag>
                      {errors?.endDate && (
                        <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                          {errors?.endDate}
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                    <DynamicHtmlTag
                      type="div"
                      className={`border w-full py-2 px-2 flex items-center justify-between rounded-md gap-2 ${errors?.endDate ? "border-red-400" : "border-gray-400"} `}>
                      <DynamicHtmlTag type="span" className={`form-date-picker date-picker text-xs xl:leading-none w-full`}>
                        <CustomDatePicker
                          selected={endDate}
                          onChange={(date: any) => handleEndDateChange(date)}
                          dateFormat={"dd/MM/yyyy"}
                          placeholderText="jj/mm/yyyy"
                          className="w-full placeholder:font-normal"
                          disabled={medicalProfileTreatment.isNoLongerTakeThisTreatment === false} // Disable if checked (true)
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>

                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="div" className="form-group gap-3 w-full lg:w-8/12 mt-2">
                    <DynamicHtmlTag type="div" className="flex items-center justify-between">
                      <CustomLabel className="text-xs pb-1 ps-2">
                        Fréquence{" "}
                        <DynamicHtmlTag type="span" className="text-red-500">
                          *
                        </DynamicHtmlTag>
                      </CustomLabel>
                      {errors?.frequence && (
                        <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                          {errors?.frequence}
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="w-full">
                      <CustomLabel
                        className={`input border ${errors?.frequence ? "border-red-400" : "border-gray-400"} p-2 flex items-center gap-2 rounded-md h-[2.063rem] mb-1`}>
                        <CustomInput
                          type="text"
                          name="frequence"
                          onChange={handleFieldChange}
                          value={medicalProfileTreatment.frequence}
                          className="grow input outline-none focus:outline-none placeholder:font-normal border-none h-auto text-xs"
                          placeholder="Indiquer la fréquence"
                        />
                      </CustomLabel>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>

                {/* Submit Button */}
                <DynamicHtmlTag type="div" className="w-full flex justify-end pb-5 lg:pb-0">
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

        {/* Delete Modal Start */}
        <DeleteModal
          isOpen={isModalOpen}
          onClose={closeDeleteModal}
          modalInputTitle={TreatmentDeleteName}
          modalSubTitle={"Traitement"}
          onConfirm={() => {
            if (listDelete !== undefined) {
              deleteTreatment(listDelete); // Ensure listDelete is defined
            }
          }}
          title="Supprimer un traitement"
          paragraph={`Êtes vous sur de vouloir supprimer ce traitement : ${TreatmentDeleteName} ?`}
        />
      </DynamicHtmlTag>

      {/* Empty Screen Without Content */}
      {/* <DynamicHtmlTag type="div" className="empty-history-content h-full hidden">
        <EmptyHistory
          title="Vous n’avez pas renseigné de traitement"
          paragraph="Je ne prends aucun traitement"
          button="Ajouter un traitement"
          uniqueId="2"
        />
      </DynamicHtmlTag> */}
    </DynamicHtmlTag>
  );
};

export default MedicalTreatments;
