"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  DynamicHtmlTag,
  CustomButton,
  HeadingTag,
  CustomInput,
  CustomLabel,
  CustomImage,
  CustomForm,
  CustomModal,
  CustomDatePicker,
  CustomLoader,
} from "@/components";
import { MdClose } from "react-icons/md";
import { selectPatientDetailsData, setPatientDetailsData } from "@/store/reducers/patientDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  addSituation,
  addSituationHelthCompl,
  API_URL,
  getPatientDeatils,
  handleCancelRdv,
  handleProcessError,
  HealthRight,
  HealthRightsResponse,
  listOfDynamicSituations,
  listOfWhySituations,
  PatientsType,
  removeMutuelleCard,
  WhySituation,
  WhySituationsResponse,
} from "@/utility";
import { RootState } from "@/store";
import { closeModal, openModal } from "@/store/reducers/modalSlice";
import { selectConsultationBooking, setCompletedStep } from "@/store/reducers/consultationBookingSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import RdvAlreadyStartedModal from "@/components/rvdModal/RdvAlreadyStartedModal";
import { getActiveProcess, setProcessCompletedSteps, setProfileMutuelle, setSituation } from "@/store/reducers/consultationProcessReducerSlice";
import ProcessNoticeModal from "@/components/process-notice-modal/processNoticeModal";

const Situation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const [situationDynamicList, setSituationDynamicList] = useState<HealthRight[]>([]);
  const [whySituationsList, setWhySituationsList] = useState<WhySituation[]>([]);
  const [isMaternityChecked, setIsMaternityChecked] = useState(false);
  const [deleteDocument, setDeleteDocument] = useState(false);
  const [patientProfile, setPatientProfile] = useState<PatientsType | null>(null);
  const activeConsultationProcess = useSelector(getActiveProcess);

  const [healthComplNumber, setHealthComplNumber] = useState<string>(activeConsultationProcess?.profile?.patientData?.healthComplNumber || "");
  const [healthComplStartDate, setHealthComplStartDate] = useState<Date | null>(
    activeConsultationProcess?.profile?.patientData?.healthComplStartDate
      ? new Date(activeConsultationProcess?.profile.patientData?.healthComplStartDate.split("/").reverse().join("/"))
      : null
  );

  const [healthComplEndDate, setHealthComplEndDate] = useState<Date | null>(
    activeConsultationProcess?.profile?.patientData?.healthComplEndDate
      ? new Date(activeConsultationProcess?.profile?.patientData?.healthComplEndDate.split("/").reverse().join("/"))
      : null
  );

  const [healthPreviewImage, setHealthPreviewImage] = useState<string | null>(
    activeConsultationProcess?.profile?.patientData?.healthCompl?.url
      ? `${API_URL}${activeConsultationProcess?.profile?.patientData.healthCompl.url}`
      : null
  );

  // Local state variables for modal inputs
  const [localHealthComplNumber, setLocalHealthComplNumber] = useState<string>(healthComplNumber);

  const [localStartDate, setLocalStartDate] = useState<Date | null>(healthComplStartDate);

  const [localEndDate, setLocalEndDate] = useState<Date | null>(healthComplEndDate);

  const [localHealthPreviewImage, setLocalHealthPreviewImage] = useState<string | null>(healthPreviewImage);

  // State variables for Add Mutuelle
  const [addMutuelleNumber, setAddMutuelleNumber] = useState<string>("");
  const [addMutuelleStartDate, setAddMutuelleStartDate] = useState<Date | null>(null);
  const [addMutuelleEndDate, setAddMutuelleEndDate] = useState<Date | null>(null);
  const [addMutuelleImage, setAddMutuelleImage] = useState<string | null>(null);

  const [selectedHealthRights, setSelectedHealthRights] = useState<number[]>([]);
  const [selectedWhyConsultation, setSelectedWhyConsultation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [healthFile, setHealthFile] = useState<File | null>(null);

  const [socialSecurityNumber, setSocialSecurityNumber] = useState<string>("");
  const [processNoticeMessage, setProcessNoticeMessage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const patientDetails = useCallback(async () => {
    try {
      const data = await getPatientDeatils();
      setPatientProfile(data.data);
      dispatch(setPatientDetailsData(data.data));
    } catch (error) {}
  }, [dispatch]);

  const situationList = useCallback(async () => {
    try {
      const response: HealthRightsResponse = await listOfDynamicSituations();
      setSituationDynamicList(response.data);
    } catch (error) {
      setSituationDynamicList([]);
    }
  }, []);

  const fetchWhySituations = useCallback(async () => {
    try {
      const response: WhySituationsResponse = await listOfWhySituations();
      setWhySituationsList(response.data);
    } catch (error) {
      setWhySituationsList([]);
    }
  }, []);

  const handleStartDateChange = (date: Date) => {
    if (date) setStartDate(date);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalHealthComplNumber(e.target.value);
  };

  const handleStartDatePickerChange = (date: Date | null) => {
    setLocalStartDate(date);
  };

  const handleEndDatePickerChange = (date: Date | null) => {
    setLocalEndDate(date);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHealthFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setLocalHealthPreviewImage(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, description: string) => {
    const { value, checked } = e.target;
    if (description === "Maternité") {
      setIsMaternityChecked(checked);
    }

    setSelectedHealthRights(prev => (checked ? [...prev, Number(value)] : prev.filter(id => id !== Number(value))));
  };

  const handleHealthRightChange = (id: number, isChecked: boolean) => {
    setSelectedHealthRights(prev => (isChecked ? [...prev, id] : prev.filter(item => item !== id)));
  };

  const handleSocialSecurityNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 15) {
      input = input.slice(0, 15);
    }
    setSocialSecurityNumber(input);
  };

  useEffect(() => {
    patientDetails();
    situationList();
    fetchWhySituations();
  }, [patientDetails, situationList, fetchWhySituations]);

  useEffect(() => {
    if (activeConsultationProcess && activeConsultationProcess.profile?.patientData) {
      const { patientData } = activeConsultationProcess.profile;
      const ssn = patientData?.socialSecurityNumber || "";
      const cleanedSSN = ssn.replace(/\D/g, "").slice(0, 15);
      setSocialSecurityNumber(cleanedSSN);
      const { healthComplStartDate, healthComplEndDate } = patientData || {};

      setHealthComplNumber(patientData?.healthComplNumber || "");
      setHealthComplStartDate(
        healthComplStartDate && healthComplStartDate !== "" ? new Date(healthComplStartDate.split("/").reverse().join("/")) : null
      );
      setHealthComplEndDate(healthComplEndDate && healthComplEndDate !== "" ? new Date(healthComplEndDate.split("/").reverse().join("/")) : null);
      setHealthPreviewImage(patientData?.healthCompl?.url ? `${API_URL}${patientData.healthCompl.url}` : null);

      // Update local states as well
      setLocalHealthComplNumber(patientData?.healthComplNumber || "");
      setLocalStartDate(healthComplStartDate && healthComplStartDate !== "" ? new Date(healthComplStartDate.split("/").reverse().join("/")) : null);
      setLocalEndDate(healthComplEndDate && healthComplEndDate !== "" ? new Date(healthComplEndDate.split("/").reverse().join("/")) : null);
      setLocalHealthPreviewImage(patientData?.healthCompl?.url ? `${API_URL}${patientData.healthCompl.url}` : null);
    }
  }, [activeConsultationProcess]);

  useEffect(() => {
    if (activeConsultationProcess) {
      setSelectedWhyConsultation(activeConsultationProcess?.rdvWhyId || null);
      setSelectedHealthRights(activeConsultationProcess?.healthRightIds || []);
      setSocialSecurityNumber(activeConsultationProcess?.profile?.patientData?.socialSecurityNumber || "");
      setAddMutuelleNumber(activeConsultationProcess?.profile?.patientData?.healthComplNumber || "");
      setAddMutuelleStartDate(
        activeConsultationProcess?.profile?.patientData?.healthComplStartDate
          ? new Date(activeConsultationProcess?.profile.patientData?.healthComplStartDate.split("/").reverse().join("/"))
          : null
      );
      setAddMutuelleEndDate(
        activeConsultationProcess?.profile?.patientData?.healthComplEndDate
          ? new Date(activeConsultationProcess?.profile?.patientData?.healthComplEndDate.split("/").reverse().join("/"))
          : null
      );
      setAddMutuelleImage(
        activeConsultationProcess?.profile?.patientData?.healthCompl?.url
          ? `${API_URL}${activeConsultationProcess?.profile?.patientData?.healthCompl?.url}`
          : null
      );
    }
  }, [activeConsultationProcess]);

  const openEditMutelleModal = () => {
    dispatch(openModal("editMutelleConsultationProcess"));
  };

  const openDeleteMutelleModal = () => {
    dispatch(openModal("deleteMutelleConsultationProcess"));
  };

  const closeEditMutelleModal = () => {
    dispatch(closeModal());
    if (activeConsultationProcess) {
      const patientData = activeConsultationProcess.profile?.patientData;

      setLocalHealthComplNumber(patientData?.healthComplNumber || "");
      setLocalStartDate(healthComplStartDate);
      setLocalEndDate(healthComplEndDate);
      setLocalHealthPreviewImage(patientData?.healthCompl?.url ? `${API_URL}${patientData.healthCompl.url}` : null);
    }
  };

  const closeDeleteMutelleModal = () => {
    dispatch(closeModal());
  };

  const closeProcessNoticeModal = () => {
    dispatch(closeModal());
    router.push("/search");
  };

  const handleDeleteDocument = async () => {
    try {
      const formData = new FormData();
      formData.append("rdvId", activeConsultationProcess?.rdvId?.toString() || "");
      formData.append("patientId", activeConsultationProcess?.patientId?.toString() || "");
      formData.append("practitionerId", activeConsultationProcess?.practitioner?.id?.toString() || "");

      const response = await removeMutuelleCard(formData);

      if (response) {
        toast.success("Mutuelle supprimée avec succès");
        setDeleteDocument(true);
        setHealthComplNumber("");
        setHealthComplStartDate(null);
        setHealthComplEndDate(null);
        setHealthPreviewImage(null);
        dispatch(closeModal());
        dispatch(
          setProfileMutuelle({
            mutelle: {
              healthCompl: {
                id: 0,
                name: "",
                extension: "",
                size: 0,
                url: "",
              },
              healthComplNumber: "",
              healthComplStartDate: "",
              healthComplEndDate: "",
            },
            patientId: activeConsultationProcess?.patientId || null,
          })
        );
      }
    } catch (error) {
      dispatch(closeModal());
      const errorHandlingResult = handleProcessError(error);

      if (errorHandlingResult.action === "openModal") {
        dispatch(openModal("rdvAlreadyStarted"));
        return;
      }

      if (errorHandlingResult.action === "redirect") {
        setProcessNoticeMessage(errorHandlingResult.message || "");
        dispatch(openModal("processNoticeModal"));
        return;
      }
    }
  };

  const handleEditMutuelleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveMutelle();
    setHealthComplNumber(localHealthComplNumber);
    setHealthComplStartDate(localStartDate);
    setHealthComplEndDate(localEndDate);
    setHealthPreviewImage(localHealthPreviewImage);
    dispatch(closeModal());
  };

  const fetchImageAsFile = async (imageUrl: string): Promise<File | null> => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const filename = imageUrl.split("/").pop() || "image.jpg";
      const file = new File([blob], filename, { type: blob.type });
      return file;
    } catch (error) {
      return null;
    }
  };

  const handleAddMutuelleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddMutuelleNumber(e.target.value);
  };

  const handleAddMutuelleStartDateChange = (date: Date | null) => {
    setAddMutuelleStartDate(date);
  };

  const handleAddMutuelleEndDateChange = (date: Date | null) => {
    setAddMutuelleEndDate(date);
  };

  const handleAddMutuelleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHealthFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setAddMutuelleImage(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
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

  const handleNextStep = (stepNumber: number, nextPath: string) => {
    dispatch(setCompletedStep(stepNumber));
    dispatch(setProcessCompletedSteps({ completedSteps: stepNumber, patientId: activeConsultationProcess?.patientId || null }));
    router.push(nextPath);
  };

  const handleAddSituationSubmit = async () => {
    // Check if the "Numéro de sécurité sociale" field is empty
    if (!socialSecurityNumber.trim()) {
      dispatch(openModal("emptySSNModal"));
      return;
    }

    const formData = new FormData();

    formData.append("practitionerId", activeConsultationProcess?.practitioner?.id?.toString() || "");
    formData.append("patientId", activeConsultationProcess?.patientId?.toString() || "");
    formData.append("rdvId", activeConsultationProcess?.rdvId?.toString() || "");
    formData.append("socialSecurityNumber", socialSecurityNumber);
    formData.append("healthComplNumber", addMutuelleNumber || localHealthComplNumber);
    formData.append("healthComplStartDate", formatDate(addMutuelleStartDate || localStartDate));
    formData.append("healthComplEndDate", formatDate(addMutuelleEndDate || localEndDate));
    formData.append("healthRightIds", selectedHealthRights.join(","));
    formData.append("rdvWhyId", selectedWhyConsultation?.toString() || "");
    formData.append("pregnancyDate", isMaternityChecked ? formatDate(startDate) : "");

    if (healthFile) {
      formData.append("healthFile", healthFile);
    }

    let fileToUpload = healthFile;

    if (!fileToUpload && localHealthPreviewImage) {
      // Fetch the image as a File
      fileToUpload = await fetchImageAsFile(localHealthPreviewImage);
    }

    if (fileToUpload) {
      formData.append("healthFile", fileToUpload);
    } else {
    }

    try {
      const response = await addSituation(formData);
      if (response?.data?.codeMessage === "RDV_NOT_AVAILABLE") {
        router.push("/search");
        return;
      }

      const updatedPatientData = {
        ...fetchPatientData,
        patientData: {
          ...fetchPatientData.patientData,
          healthComplNumber: response.data.healthComplNumber,
          healthComplStartDate: response.data.healthComplStartDate,
          healthComplEndDate: response.data.healthComplEndDate,
          healthRightIds: selectedHealthRights,
          rdvWhyId: selectedWhyConsultation,
        },
      };

      const situation = {
        healthComplNumber: response.data.healthComplNumber,
        healthComplStartDate: response.data.healthComplStartDate,
        healthComplEndDate: response.data.healthComplEndDate,
        healthRightIds: selectedHealthRights,
        rdvWhyId: response.data.rdvWhy.id,
        socialSecurityNumber: response.data.socialSecurityNumber,
        healthCompl: response.data.healthCompl,
      };

      dispatch(setSituation({ situation, patientId: activeConsultationProcess?.patientId || null }));
      dispatch(setPatientDetailsData(updatedPatientData));
      handleNextStep(3, "/consultationprocess/dosier-medical");
    } catch (error) {
      dispatch(closeModal());
      const errorHandlingResult = handleProcessError(error);

      if (errorHandlingResult.action === "openModal") {
        dispatch(openModal("rdvAlreadyStarted"));
        return;
      }

      if (errorHandlingResult.action === "redirect") {
        setProcessNoticeMessage(errorHandlingResult.message || "");
        dispatch(openModal("processNoticeModal"));
        return;
      }
    }
  };

  const handleSaveMutelle = async () => {
    setIsLoading(true);
    dispatch(closeModal());

    const formData = new FormData();

    formData.append("practitionerId", activeConsultationProcess?.practitioner?.id?.toString() || "");
    formData.append("patientId", activeConsultationProcess?.profile?.id?.toString() || "");
    formData.append("rdvId", activeConsultationProcess?.rdvId?.toString() || "");
    formData.append("healthComplNumber", addMutuelleNumber || localHealthComplNumber);
    formData.append("healthComplStartDate", formatDate(addMutuelleStartDate || localStartDate));
    formData.append("healthComplEndDate", formatDate(addMutuelleEndDate || localEndDate));

    if (healthFile) {
      formData.append("healthFile", healthFile);
    }

    let fileToUpload = healthFile;

    if (!fileToUpload && localHealthPreviewImage) {
      // Fetch the image as a File
      fileToUpload = await fetchImageAsFile(localHealthPreviewImage);
    }

    if (fileToUpload) {
      formData.append("healthFile", fileToUpload);
    }

    try {
      const response = await addSituationHelthCompl(formData);

      if (response.data) {
        toast.success("La mutuelle a été enregistrée avec succès");
        dispatch(setProfileMutuelle({ mutelle: response.data, patientId: activeConsultationProcess?.patientId || null }));
      }
    } catch (error) {
      const errorHandlingResult = handleProcessError(error);

      if (errorHandlingResult.action === "openModal") {
        dispatch(openModal("rdvAlreadyStarted"));
        return;
      }

      if (errorHandlingResult.action === "redirect") {
        setProcessNoticeMessage(errorHandlingResult.message || "");
        dispatch(openModal("processNoticeModal"));
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMutelle = async () => {
    setIsLoading(true);
    dispatch(closeModal());

    const formData = new FormData();

    formData.append("practitionerId", activeConsultationProcess?.practitioner?.id?.toString() || "");
    formData.append("patientId", activeConsultationProcess?.profile?.id?.toString() || "");
    formData.append("rdvId", activeConsultationProcess?.rdvId?.toString() || "");
    formData.append("healthComplNumber", localHealthComplNumber);
    formData.append("healthComplStartDate", formatDate(localStartDate));
    formData.append("healthComplEndDate", formatDate(localEndDate));

    if (healthFile) {
      formData.append("healthFile", healthFile);
    }

    let fileToUpload = healthFile;
    if (localHealthPreviewImage) {
      fileToUpload = await fetchImageAsFile(localHealthPreviewImage);
    }

    try {
      const response = await addSituationHelthCompl(formData);

      if (response.data) {
        toast.success("La mutuelle a été enregistrée avec succès");
        dispatch(setProfileMutuelle({ mutelle: response.data, patientId: activeConsultationProcess?.patientId || null }));
      }
    } catch (error) {
      const errorHandlingResult = handleProcessError(error);

      if (errorHandlingResult.action === "openModal") {
        dispatch(openModal("rdvAlreadyStarted"));
        return;
      }

      if (errorHandlingResult.action === "redirect") {
        setProcessNoticeMessage(errorHandlingResult.message || "");
        dispatch(openModal("processNoticeModal"));
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CustomLoader showImage />;
  }

  return (
    <DynamicHtmlTag type="div" className="situation-screen-main situation-section lg:px-5 flex justify-between flex-col h-full mb-12 lg:mb-0">
      <DynamicHtmlTag
        type="div"
        className="sm:flex-col md:flex-row lg:flex-row md:flex lg:flex md:gap-2 lg:gap-1 xl:gap-16 2xl:gap-24 sm:items-start md:items-start">
        <DynamicHtmlTag type="div" className="w-full md:w-1/3 lg:w-[33%] flex justify-between items-center md:block gap-4 md:gap-0">
          <DynamicHtmlTag type="div" className="w-full">
            <HeadingTag type="h2" className="text-xs lg:text-sm xl:text-lg font-bold pb-1 lg:pb-3">
              Numéro de sécurité sociale
            </HeadingTag>
            <CustomInput
              value={formatSocialSecurityNumber(socialSecurityNumber)}
              onChange={handleSocialSecurityNumberChange}
              type="text"
              placeholder="0 00 00 00 000 000 00"
              name="card-number"
              className="p-2 border border-gray-300 h-auto font-medium text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug text-black rounded-lg w-full"
            />
            <DynamicHtmlTag type="span" className="block pt-1 pe-1 text-right text-xs">
              {15 - socialSecurityNumber.length} caractères
            </DynamicHtmlTag>
          </DynamicHtmlTag>

          <CustomImage
            src={"/images/dummy-card.svg"}
            alt="banner"
            width={126}
            height={89}
            className="img-fluid max-w-[20%] md:max-w-[50%] lg:max-h-full"
          />
        </DynamicHtmlTag>

        {!healthComplNumber || !healthComplStartDate || !healthComplEndDate || !healthPreviewImage ? ( //Add Mutelle Block Starts
          <DynamicHtmlTag
            type="div"
            className="flex flex-col lg:flex-row justify-end gap-2 xl:gap-x-5 mt-3 lg:mt-0 ssn-update-date-picker w-full lg:w-[65%] xl:w-[50%]">
            <DynamicHtmlTag type="div" className="w-full lg:w-8/12 xl:w-9/12 flex flex-col justify-around">
              <HeadingTag type="h4" className="text-xs lg:text-sm xl:text-base 2xl:text-lg xl:leading-snug font-bold">
                Mutuelle
              </HeadingTag>
              <DynamicHtmlTag type="div" className="form-group mt-0">
                <DynamicHtmlTag type="div" className="flex justify-between">
                  <DynamicHtmlTag type="span" className="px-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug">
                    Numéro de la carte
                    <DynamicHtmlTag type="span" className="text-red-500 hidden">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <CustomLabel className="w-full input border py-1 px-2 xl:p-1 flex items-center gap-2 rounded-md mb-1">
                  <CustomInput
                    type="number"
                    name="healthComplNumber"
                    value={addMutuelleNumber}
                    onChange={handleAddMutuelleNumberChange}
                    className="grow input outline-none focus:outline-none border-none p-1 h-auto font-medium text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug"
                    placeholder="Numéro"
                  />
                </CustomLabel>
                <DynamicHtmlTag type="div" className="flex flex-col md:flex-row justify-between mt-0 2xl:mt-4">
                  <DynamicHtmlTag type="div" className="form-group w-full md:w-[49%]">
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
                      className="date-picker relative flex items-center space-x-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug grow input border register-field border-gray-400 py-1 px-2 gap-2 rounded-md">
                      <CustomDatePicker
                        maxDate={addMutuelleEndDate || undefined}
                        selected={addMutuelleStartDate}
                        onChange={handleAddMutuelleStartDateChange}
                        dateFormat={"dd/MM/yyyy"}
                        todayButton="Aujourd'hui"
                        placeholderText="jj/mm/aaaa"
                        className="grow input outline-none focus:outline-none border-none h-auto text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug w-11/12 p-1 react-datepicker-ignore-onclickoutside"
                        inline={false}
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="form-group w-full md:w-[49%]">
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
                      className="date-picker relative flex items-center space-x-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug grow w-full input border register-field border-gray-400 py-1 px-2 gap-2 rounded-md">
                      <CustomDatePicker
                        minDate={addMutuelleStartDate ? new Date(addMutuelleStartDate.getTime() + 24 * 60 * 60 * 1000) : undefined}
                        selected={addMutuelleEndDate}
                        onChange={handleAddMutuelleEndDateChange}
                        dateFormat={"dd/MM/yyyy"}
                        todayButton="Aujourd'hui"
                        placeholderText="jj/mm/aaaa"
                        className="grow input outline-none focus:outline-none border-none h-auto text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug w-11/12 p-1 react-datepicker-ignore-onclickoutside"
                        inline={false}
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className="w-full lg:w-4/12 xl:w-5/12 flex flex-col md:flex-row items-center justify-around xl:justify-end pb-7 lg:pb-0 pt-5 lg:pt-0 gap-0 flex-row lg:flex-col relative">
              <DynamicHtmlTag
                type="div"
                className="mb-2 relative group rounded-xl border-4 border-gray-100 h-[8.125rem] w-36 lg:w-14 lg:h-14 xl:w-20 xl:h-20 flex items-center justify-center overflow-hidden">
                <CustomImage
                  src={addMutuelleImage || "/images/mutual-img.svg"}
                  alt="mutual-doc"
                  width={120}
                  height={60}
                  className="w-20 h-20 lg:w-14 lg:h-14 xl:w-20 xl:h-20"
                />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="lg:w-full flex items-center gap-2">
                <DynamicHtmlTag type="div" className="w-full">
                  <CustomButton
                    className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug cstm-btn mx-auto flex px-8 py-1 lg:px-2 lg:py-2 justify-center lg:w-full view-more-btn rounded-full text-white"
                    onClick={() => fileInputRef.current?.click()}>
                    Importer
                  </CustomButton>
                  <CustomInput type="file" ref={fileInputRef} className="hidden" onChange={handleAddMutuelleImageChange} />
                </DynamicHtmlTag>

                <DynamicHtmlTag type="div" className="w-full">
                  <CustomButton
                    className=" text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug cstm-btn mx-auto flex px-8 py-1 lg:px-2 lg:py-2 justify-center lg:w-full view-more-btn rounded-full text-white disabled:opacity-50"
                    onClick={handleSaveMutelle}
                    disabled={!addMutuelleNumber || !addMutuelleStartDate || !addMutuelleEndDate || !addMutuelleImage}>
                    Enregistrer
                  </CustomButton>
                </DynamicHtmlTag>
              </DynamicHtmlTag>{" "}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        ) : (
          //Add Mutelle Block Ends
          <>
            <DynamicHtmlTag className="flex md:gap-8 lg:gap-2 xl:gap-8 items-center lg:items-end md:w-2/3 lg:w-[58%]" type="div">
              <DynamicHtmlTag type="div" className="lg:w-[72%]">
                <HeadingTag type="h2" className="text-xs lg:text-sm xl:text-lg font-bold pb-1 lg:pb-3 sm:mt-4 md:mt-0">
                  Mettre à jour votre mutuelle
                </HeadingTag>
                <DynamicHtmlTag type="div" className="mutual-fund-main px-4 py-2 rounded-xl">
                  <HeadingTag type="h3" className="text-xs lg:text-sm xl:text-base font-bold pb-3">
                    Votre mutuelle est à jour
                  </HeadingTag>
                  <DynamicHtmlTag type="div" className="flex sm:gap-2 md:gap-2 lg:gap-5 align-middle">
                    <CustomImage src={"/images/card-check.svg"} alt="banner" width={112} height={84} className="w-20 lg:w-16 xl:w-28 img-fluid" />
                    <DynamicHtmlTag type="div">
                      <DynamicHtmlTag type="p" className="font-semibold text-2xs lg:text-xs">
                        <DynamicHtmlTag type="span">N° carte : </DynamicHtmlTag>
                        <DynamicHtmlTag type="span">{healthComplNumber}</DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="p" className="font-semibold text-2xs lg:text-xs">
                        <DynamicHtmlTag type="span">Validité : </DynamicHtmlTag>
                        <DynamicHtmlTag type="span">
                          {healthComplStartDate && healthComplEndDate
                            ? `Du ${formatDate(healthComplStartDate)} au ${formatDate(healthComplEndDate)}`
                            : ""}
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="lg:flex sm:gap-3 md:gap-2 lg:gap-3 justify-center pb-2 hidden">
                        <CustomButton className="card-btn cstm-btn mt-2 w-full lg:w-1/2 text-[9px]" onClick={openEditMutelleModal}>
                          Changer
                        </CustomButton>
                        <CustomButton as="button" onClick={openDeleteMutelleModal} className="card-btn cstm-btn mt-2 w-full lg:w-1/2 text-[9px]">
                          Supprimer
                        </CustomButton>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex lg:hidden sm:gap-3 md:gap-2 lg:gap-3 justify-center pb-2 mt-3">
                    <CustomButton className="card-btn cstm-btn mt-2 w-full lg:w-1/2 text-[9px]" onClick={openEditMutelleModal}>
                      Changer
                    </CustomButton>
                    <CustomButton as="button" onClick={openDeleteMutelleModal} className="card-btn cstm-btn mt-2 w-full lg:w-1/2 text-[9px]">
                      Supprimer
                    </CustomButton>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="lg:w-[20%] lg:mb-2">
                <CustomImage
                  src={healthPreviewImage || "/images/vector-card.svg"}
                  alt="banner"
                  width={146}
                  height={171}
                  className="img-fluid max-w-[50%] lg:max-w-[100%] sm:hidden md:block"
                />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </>
        )}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="pb-2 lg:pb-0 md:min-h-[200px]">
        <DynamicHtmlTag type="div" className="mt-2 mb-2 flex flex-col gap-2">
          <HeadingTag
            type="h4"
            className="text-xs lg:text-sm xl:text-base 2xl:text-lg font-bold mb-2 flex flex-col md:flex-row md:items-center md:gap-2">
            Si je suis dans une de ces situations, le signaler
            <DynamicHtmlTag type="span" className="text-2xs sm:block font-normal">
              (plusieurs situations possible)
            </DynamicHtmlTag>
          </HeadingTag>
          {Array.isArray(situationDynamicList) &&
            situationDynamicList.map((situation, index) => (
              <DynamicHtmlTag key={situation.id} type="div" className="cstm-form-group flex items-center mb-2">
                <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                  <CustomInput
                    className=""
                    type="checkbox"
                    id={`checkbox-${index}`}
                    value={situation.id.toString()}
                    name="healthRights"
                    checked={selectedHealthRights.includes(situation.id)}
                    onChange={e =>
                      situation.description === "Maternité"
                        ? handleCheckboxChange(e, situation.description)
                        : handleHealthRightChange(situation.id, e.target.checked)
                    }
                  />
                  <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor={`checkbox-${index}`}>
                    <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                  </CustomLabel>
                </DynamicHtmlTag>
                <CustomLabel htmlFor={`checkbox-${index}`} className="ps-3 text-2xs lg:text-xs 2xl:text-sm font-normal cstm-lable">
                  {situation.description}
                </CustomLabel>{" "}
                {/* Conditional DatePicker Starts */}
                {situation.description === "Maternité" && isMaternityChecked && (
                  <DynamicHtmlTag type="div" className="flex items-center gap-2 mt-2 ml-4">
                    <DynamicHtmlTag className="border border-gray-400 p-2 flex items-center gap-2 rounded-lg" type="div">
                      <DynamicHtmlTag type="div" className="form-date-picker date-picker text-xs md:text-xs 2xl:text-sm">
                        <CustomDatePicker selected={startDate} onChange={handleStartDateChange} dateFormat={"dd/MM/yyyy"} inline={false} />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="span" className="text-2xs sm:block font-normal">
                      (Préciser la date du début de grossesse)
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                )}
                {/* Conditional DatePicker Ends */}
              </DynamicHtmlTag>
            ))}
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="mt-2 flex flex-col gap-2">
          <HeadingTag
            type="h4"
            className="text-xs lg:text-sm xl:text-base 2xl:text-lg font-bold mb-2 flex flex-col md:flex-row md:items-center md:gap-2">
            Pourquoi consulter ce praticien?
            <DynamicHtmlTag type="span" className="text-2xs lg:text-xs font-normal text-red-500">
              *
            </DynamicHtmlTag>
            <DynamicHtmlTag type="span" className="text-2xs lg:text-xs font-normal text-red-500">
              (Champ obligatoire)
            </DynamicHtmlTag>
          </HeadingTag>
          <DynamicHtmlTag
            type="div"
            className="sm:flex-col md:flex-row lg:flex-row flex md:gap-7 lg:gap-20 items-start xl:items-center justify-between">
            <DynamicHtmlTag
              type="div"
              className="sm:flex-col md:flex-row lg:flex-row flex-wrap flex md:gap-7 lg:gap-0 items-start xl:items-center justify-between">
              {whySituationsList.map(situation => (
                <DynamicHtmlTag key={situation.id} type="div" className="flex items-center mb-3 md:mb-2 lg:mb-2 lg:w-[47%]">
                  <CustomInput
                    type="radio"
                    name="situation"
                    value={situation.id}
                    checked={selectedWhyConsultation === situation.id}
                    onChange={() => setSelectedWhyConsultation(situation.id)}
                    className="radio situation-radio"
                  />
                  <CustomLabel htmlFor={`situation-${situation.id}`} className="ps-3 text-2xs lg:txt-xs 2xl:text-sm cstm-lable">
                    {situation.description}
                  </CustomLabel>
                </DynamicHtmlTag>
              ))}
            </DynamicHtmlTag>
            <CustomButton
              disabled={!selectedWhyConsultation}
              className="card-btn cstm-btn text-xs 2xl:text-sm text-white py-2 px-10 lg:px-9 2xl:px-10 font-semibold rounded-full disabled:opacity-50 md:mt-4 absolute bottom-3 right-7 lg:static lg:right-0 lg:bottom-0"
              onClick={handleAddSituationSubmit}>
              Valider
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      {/* Edit Mutuelle Modal Starts */}
      <CustomModal
        id="edit_mutelle_modal"
        isOpen={modalType === "editMutelleConsultationProcess"}
        onClose={closeEditMutelleModal}
        modalClassName="w-full sm:max-w-1/2 md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 p-4">
            <HeadingTag type="h3" className="text-blue font-semibold text-sm md:text-base 2xl:text-lg flex items-center gap-2">
              {activeConsultationProcess?.profile?.patientData?.healthComplNumber ? "Modifier votre carte mutuelle" : "Ajouter votre carte mutuelle"}
              <MdClose
                onClick={closeEditMutelleModal}
                className="ms-auto cursor-pointer text-blue border border-blue rounded-full h-6 p-1 hover:bg-primary hover:border-primary hover:text-white w-6"
              />
            </HeadingTag>
            <CustomForm className="pt-5 space-y-3" onSubmit={handleEditMutuelleSubmit}>
              <DynamicHtmlTag type="div" className="form-group w-full items-start">
                <DynamicHtmlTag type="p" className="text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                  Entrez le numéro de votre carte mutuelle
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="">
                  <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-lg mb-1">
                    <CustomInput
                      type="text"
                      name="healthComplNumber"
                      value={localHealthComplNumber}
                      onChange={handleNumberChange}
                      className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0 text-xs md:text-xs 2xl:text-sm"
                      placeholder="Numéro de la carte"
                    />
                  </CustomLabel>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="form-group w-full items-start">
                <DynamicHtmlTag type="p" className="text-xs md:text-xs 2xl:text-sm font-semibold text-blue">
                  Entrez la période de validité
                </DynamicHtmlTag>
                <DynamicHtmlTag type="p" className="text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                  Date de début{" "}
                  <DynamicHtmlTag type="span" className="font-normal text-2xs 2xl:text-xs">
                    (champ obligatoire)
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag className="border border-gray-400 p-2 flex items-center gap-2 rounded-lg mb-1" type="div">
                  <DynamicHtmlTag type="div" className="form-date-picker date-picker text-xs md:text-xs 2xl:text-sm">
                    <CustomDatePicker
                      maxDate={localStartDate ? new Date(localStartDate.getTime() + 24 * 60 * 60 * 1000) : undefined}
                      inline={false}
                      selected={localStartDate}
                      onChange={handleStartDatePickerChange}
                      dateFormat="dd/MM/yyyy"
                    />{" "}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="form-group w-full items-start">
                <DynamicHtmlTag type="p" className="text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                  Date de fin{" "}
                  <DynamicHtmlTag type="span" className="font-normal text-2xs 2xl:text-xs">
                    (champ obligatoire)
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag className="border border-gray-400 p-2 flex items-center gap-2 rounded-lg mb-1" type="div">
                  <DynamicHtmlTag type="div" className="form-date-picker date-picker text-xs md:text-xs 2xl:text-sm">
                    <CustomDatePicker
                      minDate={localStartDate ? new Date(localStartDate.getTime() + 24 * 60 * 60 * 1000) : undefined}
                      inline={false}
                      selected={localEndDate}
                      onChange={handleEndDatePickerChange}
                      dateFormat="dd/MM/yyyy"
                    />{" "}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="form-group w-full items-start">
                <DynamicHtmlTag type="p" className="text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                  Ajoutez un fichier{" "}
                  <DynamicHtmlTag type="span" className="font-normal text-2xs 2xl:text-xs">
                    (pdf, jpg, png)
                  </DynamicHtmlTag>
                </DynamicHtmlTag>

                {localHealthPreviewImage ? (
                  <CustomLabel htmlFor="file-change" className="">
                    <CustomInput type="file" id="file-change" className="hidden" onChange={handleImageChange} />{" "}
                    <DynamicHtmlTag type="div" className="w-full h-auto px-2 mt-5">
                      <DynamicHtmlTag type="div" className="flex items-center justify-center h-52 rounded-lg cursor-pointer">
                        <CustomImage src={`${localHealthPreviewImage}`} alt="cloud" width={100} height={100} className="w-full h-52 object-contain" />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </CustomLabel>
                ) : (
                  <>
                    <CustomLabel htmlFor="file-change" className="">
                      <CustomInput type="file" id="file-change" className="hidden" onChange={handleImageChange} />
                      <DynamicHtmlTag type="div" className="w-full h-auto">
                        <DynamicHtmlTag type="div" className="flex items-center justify-center h-40 md:h-[230px] rounded-lg cstm-file-upload">
                          <DynamicHtmlTag type="div" className="flex flex-col items-center border-blue-300 rounded-lg p-8">
                            <DynamicHtmlTag type="div" className="text-center">
                              <DynamicHtmlTag type="div" className="w-full flex justify-center items-center">
                                <CustomImage src={"/images/cloud-icon.svg"} alt="cloud" width={100} height={100} className="w-14 md:w-28" />
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="text-base-100 font-bold mt-2">
                                Faites glisser votre fichier ici ou{" "}
                                <CustomButton
                                  href={"#"}
                                  className="bg-[white] text-[#00AFC7] text-sm md:text-xs 2xl:text-sm px-5 md:px-10 py-2 rounded-full">
                                  Importer
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
                <CustomButton type="button" className="btn btn-danger text-xs 2xl:text-sm rounded-full" onClick={closeEditMutelleModal}>
                  Annuler
                </CustomButton>
                <CustomButton
                  type="submit"
                  className="btn btn-primary text-xs 2xl:text-sm rounded-full card-btn disabled:opacity-50"
                  onClick={handleUpdateMutelle}
                  disabled={!localHealthComplNumber || !localStartDate || !localEndDate || !localHealthPreviewImage}>
                  Valider
                </CustomButton>
              </DynamicHtmlTag>
            </CustomForm>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>
      {/* Edit Mutuelle Modal Ends */}

      {/* Delete Mutuelle Modal Starts */}
      <CustomModal
        id="add_user_modal"
        isOpen={modalType === "deleteMutelleConsultationProcess"}
        onClose={closeDeleteMutelleModal}
        modalClassName="sm:w-11/12 w-full sm:max-w-1/2 md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 p-4">
            <DynamicHtmlTag type="div" className="p-8">
              <DynamicHtmlTag type="p" className="text-center sm:text-sm lg:text-base text-[#0F2133] font-semibold lg:leading-8">
                Voulez vous supprimer votre carte mutuelle?
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex gap-8  justify-center mt-5">
              <CustomButton className="btn btn-danger text-xs 2xl:text-sm rounded-full uppercase" onClick={closeDeleteMutelleModal}>
                Annuler
              </CustomButton>
              <CustomButton className="btn btn-primary text-xs 2xl:text-sm rounded-full card-btn uppercase" onClick={handleDeleteDocument}>
                Valider
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>
      {/* Delete Mutuelle Modal Ends */}

      {/* Empty SSN Input Modal Starts */}
      <CustomModal
        id="empty_ssn__modal"
        isOpen={modalType === "emptySSNModal"}
        onClose={closeDeleteMutelleModal}
        modalClassName="sm:w-11/12 w-full sm:max-w-1/2 md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 p-4">
            <DynamicHtmlTag type="div" className="p-8">
              <DynamicHtmlTag type="p" className="text-center sm:text-sm lg:text-base text-[#0F2133] font-semibold lg:leading-8">
                Vous n'avez pas renseigné de numéro de sécurité sociale, vous devrez régler la téléconsultation en totalité.{" "}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex gap-8  justify-center mt-5">
              <CustomButton className="btn btn-danger text-xs 2xl:text-sm rounded-full uppercase" onClick={closeDeleteMutelleModal}>
                Retour
              </CustomButton>
              <CustomButton className="btn btn-primary text-xs 2xl:text-sm rounded-full card-btn uppercase" onClick={closeDeleteMutelleModal}>
                Suivant
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>

      {/* Empty SSN Input Modal Modal Ends */}

      {modalType === "rdvAlreadyStarted" && (
        <RdvAlreadyStartedModal
          isOpen={modalType === "rdvAlreadyStarted"}
          onClose={() => dispatch(closeModal())}
          consultationBooking={activeConsultationProcess}
          existingRdv={Number(activeConsultationProcess?.profile?.patientData?.rdvWhyId) || null}
          handleCancelRdv={() =>
            handleCancelRdv(Number(activeConsultationProcess?.profile?.patientData?.rdvWhyId) || null, router, () => dispatch(closeModal()))
          }
        />
      )}

      {modalType === "processNoticeModal" && (
        <ProcessNoticeModal isOpen={modalType === "processNoticeModal"} onClose={closeProcessNoticeModal} message={processNoticeMessage} />
      )}
    </DynamicHtmlTag>
  );
};

export default Situation;
