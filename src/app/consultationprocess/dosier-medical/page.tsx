"use client";

import {
  CustomButton,
  CustomDatePicker,
  CustomForm,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomSelect,
  CustomTextarea,
  DynamicHtmlTag,
  HeadingTag,
} from "@/components";
import React, { act, useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { closeModal, openModal, resetModal } from "@/store/reducers/modalSlice";
import { Tooltip } from "react-tooltip";
import { selectConsultationBooking, setCompletedStep } from "@/store/reducers/consultationBookingSlice";
import {
  addMedicalSituationDocumentApi,
  API_URL,
  deletedosierMedicalDocumentApi,
  dosierMedicalDocumentListingApi,
  DosierMedicalDocumentsType,
  fetchMedicalCategoryDocumentsApi,
  handleProcessError,
  medicalRecordsAdd,
} from "@/utility";
import { useRouter } from "next/navigation";
import { selectPatientDetailsData, setPatientDetailsData } from "@/store/reducers/patientDetailsSlice";
import { toast } from "react-toastify";
import { getActiveProcess, setMedicalStateData, setProcessCompletedSteps } from "@/store/reducers/consultationProcessReducerSlice";
import ProcessNoticeModal from "@/components/process-notice-modal/processNoticeModal";

const DosierMedical = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const consultationBooking = useSelector(selectConsultationBooking);
  const activePatient = useSelector(getActiveProcess);
  const patient = useSelector(selectPatientDetailsData);
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [medicalData, setMedicalData] = useState({
    weight: "",
    height: "",
    medicalHistory: patient.patientData?.medicalHistory ?? "",
    longTermTreatment: patient.patientData?.longTermTreatment ?? "",
    medicationTakenPreviously: patient.patientData?.medicationTakenPreviously ?? "",
    allergies: patient.patientData?.allergies ?? "",
  });
  const [documents, setDocuments] = useState<DosierMedicalDocumentsType[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DosierMedicalDocumentsType | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const [documentFormData, setDocumentFormData] = useState({
    practitionerId: consultationBooking.practitionerId,
    patientId: consultationBooking.patientId,
    rdvId: consultationBooking.rdvId ?? null,
    categoryId: "",
    date: "",
    name: "",
    file: null,
  });
  const [categories, setCategories] = useState([]);
  const [buttonText, setButtonText] = useState("Passer cette étape");
  const [processNoticeMessage, setProcessNoticeMessage] = useState("");

  useEffect(() => {
    setMedicalData({
      ...medicalData,
      weight: activePatient?.profile?.patientData?.weight ?? "",
      height: activePatient?.profile?.patientData?.height ?? "",
    });
  }, [activePatient]);

  useEffect(() => {
    const hasData = Object.values(medicalData).some(value => value.toString().trim() !== "");
    setButtonText(hasData ? "Suivant" : "Passer cette étape");
  }, [medicalData]);

  const handleInputChange = (field: string, value: string) => {
    setMedicalData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentInputChange = (field: string, value: any) => {
    setDocumentFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setDocumentFormData((prev: any) => ({ ...prev, file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleNextStep = (stepNumber: number, nextPath: string) => {
    dispatch(setCompletedStep(stepNumber));
    dispatch(setProcessCompletedSteps({ patientId: activePatient?.patientId || null, completedSteps: stepNumber }));
    router.push(nextPath);
  };

  const handleSubmit = async () => {
    const payload = {
      practitionerId: consultationBooking.practitionerId,
      patientId: consultationBooking.patientId,
      rdvId: consultationBooking.rdvId ?? null,
      ...medicalData,
    };

    try {
      const response = await medicalRecordsAdd(payload);
      if (response?.data?.codeMessage === "RDV_NOT_AVAILABLE") {
        router.push("/search");
        return;
      }

      const updatetedPatientData = {
        ...patient,
        patientData: {
          ...patient.patientData,
          medicalHistory: medicalData.medicalHistory,
          longTermTreatment: medicalData.longTermTreatment,
          medicationTakenPreviously: medicalData.medicationTakenPreviously,
          allergies: medicalData.allergies,
        },
      };

      const medicalDataPayload = {
        medicalHistory: medicalData.medicalHistory,
        longTermTreatment: medicalData.longTermTreatment,
        medicationTakenPreviously: medicalData.medicationTakenPreviously,
        allergies: medicalData.allergies,
      };
      dispatch(setPatientDetailsData(updatetedPatientData));
      dispatch(setMedicalStateData({ medicalData: medicalDataPayload, patientId: activePatient?.patientId || null }));

      handleNextStep(4, "/consultationprocess/informations");
    } catch (error: any) {
      const errorHandlingResult = handleProcessError(error);

      if (errorHandlingResult.action === "redirect") {
        setProcessNoticeMessage(errorHandlingResult.message || "");
        openProcessNoticeModal();
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openDocumentModal = () => {
    setPreviewImage(null);
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("addDosierMedicalDocument")));
  };

  const closeDocumentModal = () => {
    setPreviewImage(null);
    setDocumentFormData({
      practitionerId: consultationBooking.practitionerId,
      patientId: consultationBooking.patientId,
      rdvId: consultationBooking.rdvId ?? null,
      categoryId: "",
      date: "",
      name: "",
      file: null,
    });
    dispatch(closeModal());
  };

  const openDocumentShowModal = () => {
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("documentShowModal")));
  };

  const closeDocumentShowModal = () => {
    dispatch(closeModal());
  };

  const openDocumentPreviePdfModal = (doc: DosierMedicalDocumentsType) => {
    setSelectedDocument(doc);
    setPreviewImage(`${API_URL}${doc.file.url}`);
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("previewDocumentModal")));
  };

  const closeDocumentPreviewPdfModal = () => {
    openDocumentShowModal();
  };

  const openDocumentDeleteModal = (docId: number) => {
    setDocumentToDelete(docId);
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("documentDeleteModal")));
  };

  const openProcessNoticeModal = () => {
    dispatch(openModal("processNoticeModal"));
  };

  const closeProcessNoticeModal = () => {
    dispatch(closeModal());
    setProcessNoticeMessage("");
    router.push("/search");
  };
  const closeDocumentDeleteModal = () => {
    openDocumentShowModal();
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBackModal = () => {
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("documentShowModal")));
  };

  const fetchDocuments = async () => {
    try {
      const payload = {
        practitionerId: activePatient?.practitionerId,
        patientId: activePatient?.patientId,
        rdvId: activePatient?.rdvId ?? null,
      };
      const response = await dosierMedicalDocumentListingApi(payload, 10, 0);
      setDocuments(Array.isArray(response.data.results) ? response.data.results : []);
    } catch (error) {
      setDocuments([]);
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    const payload = {
      practitionerId: activePatient?.practitionerId,
      patientId: activePatient?.patientId,
      rdvId: activePatient?.rdvId ?? null,
      docId,
    };

    try {
      await deletedosierMedicalDocumentApi(payload);
      fetchDocuments();
      openDocumentShowModal();
    } catch (error) {}
  };

  const handleAddDocument = async () => {
    try {
      const formData = new FormData();
      const formattedDate = new Date(documentFormData.date).toISOString().slice(0, 10);

      Object.entries({ ...documentFormData, date: formattedDate }).forEach(([key, value]) => {
        formData.append(key, value as any);
      });

      await addMedicalSituationDocumentApi(formData);
      fetchDocuments();
      setDocumentFormData({
        practitionerId: activePatient?.practitionerId,
        patientId: activePatient?.patientId || undefined,
        rdvId: activePatient?.rdvId ?? null,
        categoryId: "",
        date: "",
        name: "",
        file: null,
      });
      setPreviewImage(null);
      closeDocumentModal();
    } catch (error) {}
  };

  const fetchCategories = async () => {
    try {
      const data = await fetchMedicalCategoryDocumentsApi();
      const formattedCategories = data.map((category: any) => ({
        value: category.id,
        label: category.name,
      }));
      setCategories(formattedCategories);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategories();
    fetchDocuments();
  }, []);

  return (
    <>
      <DynamicHtmlTag type="div" className="situation-screen-main situation-section lg:px-5 h-full mb-12 lg:mb-0 lg:relative">
        <HeadingTag type="h2" className="font-bold sm:text-sm lg:text-lg">
          Votre dossier médical
        </HeadingTag>
        <DynamicHtmlTag type="div" className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20 mt-3 items-end">
          <DynamicHtmlTag type="div" className="col-span-1">
            <DynamicHtmlTag type="div" className="flex gap-2 md:gap-5 justify-between max-w-[98%]">
              <DynamicHtmlTag type="div" className="w-[47%] lg:w-52 form-group">
                <HeadingTag type="h3" className="text-[10px] lg:text-sm font-bold text-customBlue mb-1">
                  Poids{" "}
                </HeadingTag>
                <DynamicHtmlTag type="div" className="flex flex-wrap w-full items-stretch relative">
                  <CustomInput
                    type="text"
                    className="text-xs md:text-sm flex-auto leading-normal w-[70%] border h-10 lg:h-12 border-grey-light rounded-lg rounded-r-none px-2 lg:px-3 relative focus-visible:outline-none"
                    placeholder="Votre poids"
                    name="weight"
                    value={medicalData.weight}
                    onChange={e => handleInputChange("weight", e.target.value)}
                  />
                  <DynamicHtmlTag type="div" className="w-[25%] flex items-center">
                    <span className="content-center text-2xs lg:text-sm leading-normal bg-grey-lighter rounded-lg rounded-l-none border border-l-0 border-grey-light px-2 lg:px-3 whitespace-no-wrap font-bold h-full">
                      Kg
                    </span>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-[47%] lg:w-52 form-group">
                <HeadingTag type="h3" className=" text-[10px] lg:text-sm font-bold text-customBlue mb-1">
                  Taille{" "}
                </HeadingTag>
                <DynamicHtmlTag type="div" className="flex flex-wrap w-full items-stretch relative">
                  <CustomInput
                    type="text"
                    className="text-xs md:text-sm flex-auto leading-normal w-[70%] border h-10 lg:h-12 border-grey-light rounded-lg rounded-r-none px-2 lg:px-3 relative focus-visible:outline-none"
                    placeholder="Votre taille"
                    name="height"
                    value={medicalData.height}
                    onChange={e => handleInputChange("height", e.target.value)}
                  />
                  <DynamicHtmlTag type="div" className="w-[25%] flex items-center">
                    <span className="content-center text-2xs leading-normal bg-grey-lighter rounded-lg rounded-l-none border border-l-0 border-grey-light px-2 lg:px-3 whitespace-no-wrap font-bold lg:text-sm h-full">
                      Cm
                    </span>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="lg:pt-1">
              <DynamicHtmlTag type="div" className="mt-3">
                <DynamicHtmlTag type="div" className="w-full flex gap-2 justify-start md:justify-start mb-1 relative">
                  <HeadingTag type="h3" className="font-bold text-xs lg:text-sm text-customBlue">
                    Antécédents médicaux et chirurgicaux
                  </HeadingTag>
                  <button
                    data-tooltip-id="teleconsult-tooltip"
                    className="lg:block"
                    data-tooltip-place="bottom-start"
                    data-tooltip-html="Rentrez ici vos antécédents, il peut s’agir d’une maladie chronique, d’une maladie passée et/ou guérie, d’une intervention chirurgicale">
                    <CustomImage src={"/images/tooltip-icon.svg"} alt="banner" width={15} height={15} className="img-fluid" />
                  </button>
                  <Tooltip id="teleconsult-tooltip" />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full">
                  <CustomTextarea
                    name="medicalHistory"
                    className="w-full rounded-lg border text-xs md:text-sm border-gray-400 min-h-20 px-3 py-2 resize-none focus-visible:outline-none"
                    placeholder="Saisir votre texte ici"
                    value={medicalData.medicalHistory}
                    onChange={e => handleInputChange("medicalHistory", e.target.value)}
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="mt-3">
                <DynamicHtmlTag type="div" className="w-full flex gap-2 justify-start md:justify-start mb-1 relative">
                  <HeadingTag type="h3" className="font-bold text-xs lg:text-sm text-customBlue">
                    Traitements de longue durée
                  </HeadingTag>
                  <button
                    data-tooltip-id="teleconsult-tooltip"
                    className="lg:block"
                    data-tooltip-place="bottom-start"
                    data-tooltip-html="Rentrez ici, si vous en avez, les médicaments que vous prenez régulièrement, nous vous recommandons également de renseigner les doses et depuis quand vous prenez ce traitement">
                    <CustomImage src={"/images/tooltip-icon.svg"} alt="banner" width={15} height={15} className="img-fluid" />
                  </button>
                  <Tooltip id="teleconsult-tooltip" />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full">
                  <CustomTextarea
                    name="longTermTreatment"
                    className="w-full rounded-lg border text-xs md:text-sm border-gray-400 min-h-20 px-3 py-2 resize-none focus-visible:outline-none"
                    placeholder="Saisir votre texte ici"
                    value={medicalData.longTermTreatment}
                    onChange={e => handleInputChange("longTermTreatment", e.target.value)}
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div">
            <DynamicHtmlTag type="div" className="w-full lg:flex flex-col lg:flex-row lg:gap-2 justify-between items-center hidden">
              <DynamicHtmlTag
                type="div"
                className="flex items-center bg-lightBlue p-2 rounded-lg border border-gray-500 w-full lg:w-auto lg:absolute top-0 xl:static">
                <DynamicHtmlTag type="div" className="flex items-center space-x-2">
                  <CustomImage src="/images/document-icon.svg" alt="document" width={20} height={20} />
                  <DynamicHtmlTag type="div">
                    <DynamicHtmlTag type="div" className="font-semibold text-black text-[10px]">
                      Tous mes documents
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-gray-500 text-[9px] text-start">
                      {documents.length} document(s){" "}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="h-8 w-px bg-gray-500 mx-4"></DynamicHtmlTag>
                <CustomImage src="/images/eye.svg" alt="eye" className="cursor-pointer" width={20} height={20} onClick={openDocumentShowModal} />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="mt-4 lg:mt-0">
                <CustomButton
                  type="button"
                  className="card-btn text-xs 2xl:text-sm py-2 px-3 text-base-100 rounded-full font-semibold w-full lg:max-w-max"
                  onClick={openDocumentModal}>
                  Ajouter un document
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="lg:pt-1">
              <DynamicHtmlTag type="div" className="mt-3">
                <DynamicHtmlTag type="div" className="w-full flex gap-2 mb-1 relative">
                  <HeadingTag type="h3" className="font-bold text-xs lg:text-sm text-customBlue">
                    Médicaments pris récemment
                  </HeadingTag>
                  <button
                    data-tooltip-id="teleconsult-tooltip"
                    className="lg:block"
                    data-tooltip-place="bottom-start"
                    data-tooltip-html="Rentrez ici les médicaments que vous avez pris récemment (au moins les deux dernières semaines) associés ou non au motif qui vous amène à téléconsulter">
                    <CustomImage src={"/images/tooltip-icon.svg"} alt="banner" width={15} height={15} className="img-fluid" />
                  </button>
                  <Tooltip id="teleconsult-tooltip" />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full">
                  <CustomTextarea
                    name="medicationTakenPreviously"
                    className="w-full rounded-lg border text-xs md:text-sm border-gray-400 min-h-20 px-3 py-2 resize-none focus-visible:outline-none"
                    placeholder="Saisir votre texte ici"
                    value={medicalData.medicationTakenPreviously}
                    onChange={e => handleInputChange("medicationTakenPreviously", e.target.value)}
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full mt-3">
                <DynamicHtmlTag type="div" className="w-full flex gap-2 mb-1 relative">
                  <HeadingTag type="h3" className="font-bold text-xs lg:text-sm text-customBlue">
                    Allergies
                  </HeadingTag>
                  <button
                    data-tooltip-id="teleconsult-tooltip"
                    className="lg:block"
                    data-tooltip-place="bottom-start"
                    data-tooltip-html="Rentrez ici vos allergies (médicaments, produits médicaux, animaux, pollens, etc…), pensez également, si vous le savez, les effets de ces allergies (éruption, gonflement, difficultés à respirer, etc…) ">
                    <CustomImage src={"/images/tooltip-icon.svg"} alt="banner" width={15} height={15} className="img-fluid" />
                  </button>
                  <Tooltip id="teleconsult-tooltip" />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-full">
                  <CustomTextarea
                    name="allergies"
                    className="w-full rounded-lg border text-xs md:text-sm border-gray-400 min-h-20 px-3 py-2 resize-none focus-visible:outline-none"
                    placeholder="Saisir votre texte ici"
                    value={medicalData.allergies}
                    onChange={e => handleInputChange("allergies", e.target.value)}
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag
            type="div"
            className="w-full flex flex-col-reverse lg:flex-row gap-3 lg:gap-2 justify-between items-end lg:items-center lg:hidden">
            <DynamicHtmlTag type="div" className="flex items-center bg-lightBlue p-2 rounded-lg border border-gray-500 w-full lg:w-auto">
              <DynamicHtmlTag type="div" className="flex items-center space-x-2 w-full">
                <CustomImage src="/images/document-icon.svg" alt="document" width={20} height={20} />
                <DynamicHtmlTag type="div" className="flex gap-2 items-end flex-nowrap">
                  <DynamicHtmlTag type="div" className="font-semibold text-black text-[10px]">
                    Tous mes documents
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="text-gray-500 text-[9px] text-center">
                    0 document(s)
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="h-8 w-px bg-gray-500 mx-2"></DynamicHtmlTag>
              <CustomImage src="/images/eye.svg" alt="eye" className="cursor-pointer" width={20} height={20} onClick={openDocumentShowModal} />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="mt-4 lg:mt-0">
              <CustomButton
                type="button"
                className="card-btn text-xs 2xl:text-sm py-2 px-3 text-base-100 rounded-full font-semibold w-full lg:max-w-max"
                onClick={openDocumentModal}>
                Ajouter un document
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="max-w-44 lg:max-w-full ms-auto lg:w-full pt-2 xl:pt-0 flex justify-center lg:justify-end mt-2 lg:mt-0">
        <DynamicHtmlTag type="div" className="w-full lg:max-w-max lg:px-5">
          <CustomButton
            type="button"
            className="card-btn lg:w-full text-xs 2xl:text-sm py-2 px-10 text-base-100 rounded-full font-semibold lg:max-w-max absolute bottom-3 right-7 lg:static lg:right-7 lg:bottom-0"
            onClick={handleSubmit}>
            {buttonText}{" "}
          </CustomButton>
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      {/* Add Ducoment Modal Start */}
      {modalType === "addDosierMedicalDocument" && (
        <CustomModal
          id="add_document_modal"
          isOpen={isModalOpen && modalType === "addDosierMedicalDocument"}
          onClose={closeDocumentModal}
          modalClassName="w-full sm:max-w-1/2 md:max-w-xl rounded-xl">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 p-4">
              <HeadingTag type="h3" className="text-blue font-semibold text-sm md:text-base 2xl:text-lg flex items-center gap-2">
                Ajouter un document
                <MdClose
                  onClick={closeDocumentModal}
                  className="ms-auto cursor-pointer text-blue border border-blue rounded-full h-6 p-1 hover:bg-primary hover:border-primary hover:text-white w-6"
                />
              </HeadingTag>
              <CustomForm className="pt-5 space-y-3" onSubmit={e => e.preventDefault()}>
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <DynamicHtmlTag type="div" className="flex items-center px-2 gap-1 pb-1">
                    <DynamicHtmlTag type="span" className="text-xs md:text-xs 2xl:text-sm font-semibold text-blue">
                      Choisir une catégorie
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="span" className="text-4xs xl:text-3xs 2xl:text-2xs font-semibold text-pink-400">
                      (*Champ obligatoire)
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <CustomSelect
                    options={categories}
                    className="w-full text-xs md:text-xs 2xl:text-sm countries-select ville-select border border-gray-400 placeholder-black rounded-lg"
                    placeholder="Select Category"
                    onChange={(selectedOption: any) => handleDocumentInputChange("categoryId", selectedOption.value)}
                  />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <DynamicHtmlTag type="div" className="flex items-center px-2 gap-1 pb-1">
                    <DynamicHtmlTag type="span" className="text-xs md:text-xs 2xl:text-sm font-semibold text-blue">
                      Date du document
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="span" className=" text-4xs xl:text-3xs 2xl:text-2xs font-semibold text-pink-400">
                      (*Champ obligatoire)
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="border border-gray-400 p-2 flex items-center gap-2 rounded-lg mb-1">
                    <DynamicHtmlTag type="div" className="form-date-picker date-picker text-xs md:text-xs 2xl:text-sm w-full">
                      <CustomDatePicker
                        selected={documentFormData.date ? new Date(documentFormData.date) : null}
                        onChange={(date: any) => handleDocumentInputChange("date", date.toISOString().slice(0, 10))}
                        dateFormat={"yyyy-MM-dd"}
                        inline={false}
                        placeholderText="YYYY-MM-DD"
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="form-group w-full items-start">
                  <DynamicHtmlTag type="p" className="text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                    Renommez votre document
                  </DynamicHtmlTag>
                  <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-lg mb-1">
                    <CustomInput
                      type="text"
                      name="name"
                      className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0 text-xs md:text-xs 2xl:text-sm"
                      placeholder="Document Name"
                      value={documentFormData.name}
                      onChange={e => handleDocumentInputChange("name", e.target.value)}
                    />
                  </CustomLabel>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="form-group w-full items-start">
                  <DynamicHtmlTag type="p" className="text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                    Ajoutez un fichier{" "}
                    <DynamicHtmlTag type="span" className="font-normal text-2xs 2xl:text-xs">
                      (pdf, jgp, png)
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div">
                    <CustomLabel htmlFor="file-change" className="">
                      <CustomInput type="file" className="hidden" id="file-change" ref={fileInputRef} onChange={handleFileInputChange} />{" "}
                      <DynamicHtmlTag type="div" className="w-full h-auto">
                        <DynamicHtmlTag type="div" className="flex items-center justify-center min:h-40 md:h-[346px] cstm-file-upload rounded-lg">
                          {previewImage ? (
                            <CustomImage
                              key={previewImage}
                              src={previewImage}
                              alt="preview"
                              width={100}
                              height={100}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
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
                                    onClick={handleButtonClick}
                                    className="bg-[white] text-[#00AFC7] text-sm md:text-xs 2xl:text-sm px-5 md:px-10 py-2 rounded-full">
                                    importer
                                  </CustomButton>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                          )}
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </CustomLabel>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex justify-between items-center">
                  <HeadingTag type="h3" className="text-xs md:text-sm font-bold">
                    Vos documents seront visibles par le médecin
                  </HeadingTag>
                  <CustomButton
                    type="button"
                    className="card-btn btn btn-primary text-xs 2xl:text-sm rounded-full px-3 py-2"
                    onClick={handleAddDocument}>
                    Ajouter
                  </CustomButton>
                </DynamicHtmlTag>
              </CustomForm>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
      )}
      {/* Add Ducoment Modal End */}

      {/* My Document Show Modal Start */}
      {modalType === "documentShowModal" && (
        <CustomModal
          id="my_document_show_modal"
          isOpen={isModalOpen && modalType === "documentShowModal"}
          onClose={closeDocumentShowModal}
          modalClassName="w-full sm:max-w-1/2 md:max-w-xl rounded-xl outline-none">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 p-4">
              <HeadingTag type="h3" className="text-blue font-semibold text-sm md:text-lg flex items-center gap-2">
                Mes documents
                <MdClose
                  onClick={closeDocumentShowModal}
                  className="ms-auto cursor-pointer text-blue border border-blue rounded-full h-6 p-1 hover:bg-primary hover:border-primary hover:text-white w-6"
                />
              </HeadingTag>
              <HeadingTag type="h3" className="my-2 md:my-5 text-sm font-bold">
                <DynamicHtmlTag type="span">Total : </DynamicHtmlTag>
                <DynamicHtmlTag type="span">{documents.length > 0 ? documents.length : 0}</DynamicHtmlTag>
              </HeadingTag>
              <DynamicHtmlTag type="div" className="flex flex-wrap justify-start items-center md:items-start gap-2 md:gap-3">
                {Array.isArray(documents) && documents.length > 0 ? (
                  documents.map(doc => (
                    <DynamicHtmlTag key={doc.id} type="div" className="w-[48%] md:w-[30%] min-h-56 shadow-md border rounded-lg px-4">
                      <DynamicHtmlTag type="div" className="flex justify-between my-2">
                        <CustomImage
                          src="/images/eye.svg"
                          alt="eye"
                          className="cursor-pointer"
                          width={20}
                          height={20}
                          onClick={() => openDocumentPreviePdfModal(doc)}
                        />
                        <CustomImage
                          src="/images/trash.svg"
                          alt="trash"
                          className="cursor-pointer"
                          width={15}
                          height={15}
                          onClick={() => openDocumentDeleteModal(doc.id)}
                        />
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="text-center flex flex-col justify-between min-h-44 mb-3">
                        <CustomImage src={`${API_URL}${doc.file.url}`} alt={doc.name} width={75} height={75} className="mx-auto" />
                        <DynamicHtmlTag type="p" className="font-bold text-2xs lg:text-xs">
                          {doc.name}
                        </DynamicHtmlTag>
                        <DynamicHtmlTag type="div" className="text-start">
                          <DynamicHtmlTag type="p" className="text-3xs">
                            <DynamicHtmlTag type="strong">Catégorie: </DynamicHtmlTag>
                            <DynamicHtmlTag type="span">{doc.category.name}</DynamicHtmlTag>
                          </DynamicHtmlTag>
                          <DynamicHtmlTag type="p" className="text-3xs">
                            <DynamicHtmlTag type="strong">Date d’ajout: </DynamicHtmlTag>
                            <DynamicHtmlTag type="span">{doc.createdAt}</DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  ))
                ) : (
                  <DynamicHtmlTag type="p" className="text-center text-gray-500">
                    Aucun document trouvé
                  </DynamicHtmlTag>
                )}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
      )}
      {/*  My Document Show Modal End */}

      {/* My Document Preview Modal Start */}
      {modalType === "previewDocumentModal" && (
        <CustomModal
          id="my_document_preview_modal"
          isOpen={isModalOpen && modalType === "previewDocumentModal"}
          onClose={closeDocumentPreviewPdfModal}
          modalClassName="w-full sm:max-w-1/2 md:max-w-xl rounded-xl outline-none">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 p-4">
              <DynamicHtmlTag type="div" className="flex justify-between items-center">
                <CustomImage
                  src={"/images/back-btn.svg"}
                  alt="back-arrow"
                  width={30}
                  height={30}
                  className=" text-start rounded-full"
                  onClick={handleBackModal}
                />
                <CustomButton className="w-fit inline-block p-1 revert-light-gradient rounded-full" as="button">
                  <IoCloseSharp className="w-5 h-5" onClick={closeDocumentPreviewPdfModal} />
                </CustomButton>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className=" my-2 lg:my-5">
                <HeadingTag type="h1" className="font-bold text-sm">
                  {selectedDocument?.name || "Document"}
                </HeadingTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full border border-gray-400 rounded-lg p-2 bg-[#D2D2D4]">
                {selectedDocument?.file.extension === "pdf" ? (
                  <iframe
                    src={`${API_URL}${selectedDocument?.file.url}`}
                    title={selectedDocument?.name || "Document Preview"}
                    className="w-full h-[500px] border rounded-lg"
                  />
                ) : (
                  <CustomImage
                    src={`${API_URL}${selectedDocument?.file.url}`}
                    alt={selectedDocument?.name || "Document Preview"}
                    width={300}
                    height={300}
                    className="mx-auto"
                  />
                )}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
      )}
      {/* My Document Preview Modal End */}

      {/* Delete Document Modal Start */}
      {modalType === "documentDeleteModal" && (
        <CustomModal
          id="delete_user_modal"
          isOpen={isModalOpen && modalType === "documentDeleteModal"}
          onClose={closeDocumentDeleteModal}
          modalClassName="w-full sm:max-w-1/2 md:max-w-xl rounded-xl outline-none">
          <DynamicHtmlTag type="div" className="modal-box rounded-xl bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 p-4">
              <HeadingTag type="h3" className="font-bold text-base md:text-lg flex gap-4 items-center">
                <FaTrash className="text-red-500" />
                Supprimer un document
                <MdClose
                  onClick={closeDocumentDeleteModal}
                  className="ms-auto cursor-pointer text-blue border border-blue rounded-full w-6 h-6 p-1 hover:bg-primary hover:border-primary hover:text-white"
                />
              </HeadingTag>
              <DynamicHtmlTag type="div" className="modal-head py-12">
                <DynamicHtmlTag type="h6" className="mb-3 text-blue text-lg font-medium text-center">
                  Êtes-vous sûre de vouloir
                </DynamicHtmlTag>
                <DynamicHtmlTag type="h6" className="text-blue text-lg font-medium text-center">
                  supprimer votre document ?
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="modal-action flex justify-around items-center gap-3 mt-0 mb-5">
                <CustomButton type="button" className="btn btn-danger text-xs md:text-xs 2xl:text-sm rounded-full" onClick={closeDocumentDeleteModal}>
                  ANNULER
                </CustomButton>
                <CustomButton
                  type="button"
                  className="btn btn-primary text-xs md:text-xs 2xl:text-sm card-btn rounded-full"
                  onClick={() => documentToDelete && handleDeleteDocument(documentToDelete)}>
                  SUPPRIMER
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
      )}
      {/* Delete Document Modal End */}

      {modalType === "processNoticeModal" && (
        <ProcessNoticeModal isOpen={modalType === "processNoticeModal"} onClose={closeProcessNoticeModal} message={processNoticeMessage} />
      )}
    </>
  );
};

export default DosierMedical;
