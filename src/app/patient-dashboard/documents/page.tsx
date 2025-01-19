"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CustomButton,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomSelect,
  DynamicHtmlTag,
  HeadingTag,
  CustomDatePicker,
  CustomFullScreenLoader,
} from "@/components";
import { IoCloseSharp } from "react-icons/io5";
import CustomIFrame from "@/components/ui/custom-iframe/Iframe";
import { useDispatch, useSelector } from "react-redux";
import {
  AddMedicalDocument,
  AddMedicalDocumentSchema,
  AddSampleFile,
  DocumentOption,
  DocumentOptionAny,
  fetchMedicalCategoryDocumentApi,
  fetchMedicalConsultationTypeListApi,
  fetchMedicallateralityListApi,
  fetchMedicalPartExamListApi,
  getFormateDate,
  MedicalDocument,
  MedicalDocumentUploadFileSchema,
  medicalTypeDocumentApi,
} from "@/utility";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { RootState } from "@/store";
import { selectAddMedicalDocumentValue, selectPatientDetailsData, setMobileTabAddDocument } from "@/store/reducers/patientDetailsSlice";
import { useRouter } from "next/navigation";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const createMedicalDocumentParams = {
  category: "",
  name: "",
  partExamined: "",
  date: "",
  laterality: "",
  file: "",
  typeId: "",
  consultationTypeId: "",
};
const DocumentTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [previewImageDocuments, setPreviewImageDocuments] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [medicalDocument, setmedicalDocument] = useState<MedicalDocument>(createMedicalDocumentParams);
  const [errors, setErrors] = useState<MedicalDocument>();
  const [Imageerrors, setImageErrors] = useState<MedicalDocument>();
  const router = useRouter();

  const dispatch = useDispatch();
  const [defaultDocumentCategoryOptions, setDefaultDocumentCategoryOptions] = useState<DocumentOption[]>([]);
  const [defaultMedicalPartExamOptions, setDefaultMedicalPartExamOptions] = useState<DocumentOptionAny[]>([]);
  const [defaultMedicalLaterality, setDefaultMedicalLaterality] = useState<DocumentOptionAny[]>([]);
  const [defaultMedicalconsultation, setDefaultMedicalconsultation] = useState<DocumentOptionAny[]>([]);
  const [defaultTypeDocument, setDefaultTypeDocument] = useState<DocumentOption[]>([]);
  const [selectCategoryType, setSelectCategoryType] = useState<string | null>(null);
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const fetchAddMedicalDocumentValue = useSelector(selectAddMedicalDocumentValue);

  const [fileResponse, setFileResponse] = useState<any | null>(null);

  const isLoading = useSelector((state: RootState) => state.loader.isLoading);

  const fetchTCategoryypeList = useCallback(async () => {
    try {
      const response: any[] = await fetchMedicalCategoryDocumentApi();
      const allergyMotifOptions: DocumentOption[] = response.map(treatment => ({
        value: treatment.id,
        label: treatment.name,
        code: treatment.code,
      }));
      setDefaultDocumentCategoryOptions(allergyMotifOptions);
    } catch (error) {
      setDefaultDocumentCategoryOptions([]);
    }
  }, []);
  const fetchMedicalPartExamList = useCallback(async () => {
    try {
      const response: any[] = await fetchMedicalPartExamListApi();
      const allergyMotifOptions: DocumentOptionAny[] = response.map(treatment => ({
        value: treatment.id,
        label: treatment.name,
      }));
      setDefaultMedicalPartExamOptions(allergyMotifOptions);
    } catch (error) {
      setDefaultMedicalPartExamOptions([]);
    }
  }, []);
  const fetchTLateralityList = useCallback(async () => {
    try {
      const response: any[] = await fetchMedicallateralityListApi();
      const allergyMotifOptions: DocumentOptionAny[] = response.map(treatment => ({
        value: treatment.id,
        label: treatment.name,
      }));
      setDefaultMedicalLaterality(allergyMotifOptions);
    } catch (error) {
      setDefaultMedicalLaterality([]);
    }
  }, []);
  const fetchTTypeDocumentList = useCallback(async (category: number) => {
    try {
      const response = await medicalTypeDocumentApi(category); // Use `category` from arguments
      const allergyMotifOptions = response.data.map((treatment: any) => ({
        value: treatment.id,
        label: treatment.name, // Adjust if needed
      }));

      setDefaultTypeDocument(allergyMotifOptions);
    } catch (error) {
      setDefaultTypeDocument([]);
    }
  }, []);
  const fetchconsultationTypeList = useCallback(async () => {
    try {
      const response: any[] = await fetchMedicalConsultationTypeListApi();
      const allergyMotifOptions: DocumentOptionAny[] = response.map(treatment => ({
        value: treatment.id,
        label: treatment.name,
      }));
      setDefaultMedicalconsultation(allergyMotifOptions);
    } catch (error) {
      setDefaultMedicalconsultation([]);
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("medical-document"));
      try {
        await fetchTCategoryypeList();
        await fetchMedicalPartExamList();
        await fetchTLateralityList();
        await fetchconsultationTypeList();

        if (medicalDocument.category.value) {
          fetchTTypeDocumentList(medicalDocument.category.value);
        }
      } catch (err) {
      } finally {
        dispatch(hideLoader());
      }
    };
    fetchData();
  }, [
    medicalDocument.category,
    fetchTCategoryypeList,
    fetchMedicalPartExamList,
    fetchTLateralityList,
    fetchTTypeDocumentList,
    fetchconsultationTypeList,
  ]);

  const handleDateOptionChange = (date: any) => {
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";
    setStartDate(date);
    setmedicalDocument((prevState: MedicalDocument) => ({
      ...prevState,
      date: formattedDate,
    }));
    setErrors((prevErrors: any) => ({ ...prevErrors, date: undefined }));
  };

  const handleNext = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handleSubmit = () => {
    handleNext();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCloseStep = () => {
    dispatch(setMobileTabAddDocument(false)); // Dispatch the new state directly
    if (step > 0) {
      setStep(prevStep => prevStep - 1);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file, or undefined if none.

    if (!file) {
      // If no file is selected, do not reset state.
      return;
    }

    setPreviewImageDocuments(null); // Reset the preview only when a valid file is selected.
    setFileType(null); // Reset file type only when a valid file is selected.

    try {
      // Validate the file using Yup schema
      await MedicalDocumentUploadFileSchema.validate({ file }, { abortEarly: false });
      setImageErrors((prevErrors: any) => ({ ...prevErrors, file: undefined }));

      const type = file.type;
      setFileType(type); // Store file type for conditional rendering.
      setmedicalDocument(prevState => ({
        ...prevState,
        file: file, // Save the file in the state
        name: file?.name?.replace(/\.[^/.]+$/, ""), // Save the name without extension
      }));

      // File preview logic
      if (type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImageDocuments(reader.result as string);
        };
        reader.onerror = () => {};
        reader.readAsDataURL(file); // Use Base64 for images.
      } else if (type === "application/pdf") {
        const objectUrl = URL.createObjectURL(file);
        setPreviewImageDocuments(objectUrl); // Use object URL for PDFs.
      } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        let formData = new FormData();
        formData.append("patientId", fetchPatientData?.id);
        formData.append("file", file);
        const fileresonse = await AddSampleFile(formData);
        setFileResponse(fileresonse.data);
        const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${fileresonse.data.url}`;
        setPreviewImageDocuments(fullUrl);
      } else {
        setPreviewImageDocuments(null);
        setFileType(null);
      }
    } catch (err: any) {
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setImageErrors(validationErrors);
      }
    }
  };

  const handleAddDocumentSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      // Validate the form data
      // Prepare FormData
      const formData = new FormData();
      formData.append("patientId", fetchPatientData?.id);
      formData.append("categoryId", medicalDocument.category?.value);
      formData.append("name", medicalDocument.name);
      formData.append("partExaminedId", medicalDocument.partExamined);
      formData.append("lateralityId", medicalDocument.laterality);
      formData.append("date", medicalDocument.date);
      formData.append("typeId", medicalDocument.typeId);
      formData.append("consultationTypeId", medicalDocument.consultationTypeId);
      formData.append("file", medicalDocument.file);

      // Show loader and submit form
      await AddMedicalDocumentSchema.validate(medicalDocument, { abortEarly: false });
      dispatch(showLoader("medical-profile"));
      await AddMedicalDocument(formData);
      // Redirect based on category type
      const categoryRoutes: Record<string, string> = {
        CORE: "/patient-dashboard/documents/comptes-rendus",
        REBI: "/patient-dashboard/documents/biology-result",
        ORDO: "/patient-dashboard/documents/prescriptions-care",
        RESI: "/patient-dashboard/documents/x-ray-ultrasound",
        CEME: "/patient-dashboard/documents/medical-certificates",
        PIDE: "/patient-dashboard/documents/prevention-screening",
        AUDO: "/patient-dashboard/documents/other-document",
        PIAD: "/patient-dashboard/documents/administrative-documents",
      };

      const redirectRoute = categoryRoutes[selectCategoryType || ""];
      if (redirectRoute) {
        router.push(redirectRoute);
      }
    } catch (err: any) {
      if (err.inner) {
        // Extract validation errors
        const validationErrors = err.inner.reduce((acc: Record<string, string>, { path, message }: { path: string; message: string }) => {
          acc[path] = message;
          return acc;
        }, {});
        setErrors(validationErrors);
      } else {
        // Handle other API errors
        const errorMessage = err.response?.data?.message;
        // Optionally display API error messages
        // setRegisterError(errorMessage);
      }
    } finally {
      // Hide loader
      dispatch(hideLoader());
    }
  };

  const handleFieldChange = (e: any) => {
    const { name, value } = e.target;
    // Update the field value in state
    setmedicalDocument(prevState => ({ ...prevState, [name]: value }));
    setErrors((prevErrors: any) => ({ ...prevErrors, name: undefined }));
  };
  return (
    <DynamicHtmlTag type="div" className="flex-col lg:flex-row h-full rounded-b-xl">
      <DynamicHtmlTag type="div" className="flex gap-4 flex-wrap lg:flex-nowrap h-full">
        {/* left side screen content  and default show screen */}
        {(fetchAddMedicalDocumentValue || step === 1) && (
          <DynamicHtmlTag
            type="div"
            className={`w-full bg-white lg:shadow-lg rounded-lg lg:overflow-auto ${activeTab !== null ? "hidden" : "h-[69vh] lg:h-full"}`}>
            <DynamicHtmlTag
              type="div"
              className="flex justify-between lg:justify-center ps-2 pe-1 lg:px-0 h-[10%] md:h-[7%] lg:h-[8%] sticky top-0 bg-white z-10">
              <HeadingTag type="h2" className="text-xs 2xl:text-sm font-semibold py-1 lg:py-0 mt-2 lg:mt-3">
                AJOUTER UN DOCUMENT
              </HeadingTag>
              <DynamicHtmlTag type="div" className="text-end lg:hidden pe-0 lg:px-2 mt-2">
                <CustomButton className="w-fit inline-block p-1 revert-light-gradient shadow-md shadow-slate-400 rounded-full" as="button">
                  <IoCloseSharp className="w-4 lg:w-5 h-4 lg:h-5" onClick={handleCloseStep} />
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full lg:w-[95%] h-[90%] m-auto document-import-scroll">
              <DynamicHtmlTag type="div" className="flex flex-col justify-between h-full">
                <DynamicHtmlTag type="div" className="overflow-auto h-full">
                  <DynamicHtmlTag type="div">
                    <DynamicHtmlTag type="div" className="mt-1">
                      <CustomLabel htmlFor="file-change" className="">
                        <CustomInput type="file" className="hidden" id="file-change" ref={fileInputRef} onChange={handleFileChange} />
                        <DynamicHtmlTag type="div" className="w-full h-auto ps-2 pe-1 lg:px-2 mt-2">
                          <DynamicHtmlTag
                            type="div"
                            className="flex items-center justify-center h-full xl:h-[250px] 2xl:h-[405px] bg-gradient-to-t from-sky-200 to-purple-200 rounded-lg cursor-pointer">
                            {previewImageDocuments ? (
                              fileType?.startsWith("image/") ? (
                                <CustomImage
                                  key={previewImageDocuments}
                                  src={previewImageDocuments}
                                  alt="Preview"
                                  width={100}
                                  height={100}
                                  className="w-32 lg:w-full h-32 lg:h-full object-cover rounded-lg"
                                />
                              ) : fileType === "application/pdf" ? (
                                <CustomIFrame src={previewImageDocuments} title="PDF Preview" className="w-full h-full border rounded-lg" />
                              ) : fileType === "application/msword" ||
                                fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                                <DocViewer
                                  pluginRenderers={DocViewerRenderers}
                                  documents={[{ uri: previewImageDocuments || "" }]}
                                  config={{
                                    header: {
                                      disableHeader: true,
                                      disableFileName: false,
                                      retainURLParams: false,
                                    },
                                  }}
                                  className="w-full h-full border rounded-lg"
                                  style={{ height: "100%" }} // Optional if you want to apply custom height directly
                                />
                              ) : null
                            ) : (
                              <DynamicHtmlTag type="div" className="flex flex-col items-center border-blue-300 rounded-lg p-8 xl:p-0">
                                <DynamicHtmlTag type="div" className="text-center">
                                  <DynamicHtmlTag type="div" className="w-full flex justify-center items-center">
                                    <CustomImage
                                      src="/images/cloud-icon.svg"
                                      alt="cloud"
                                      width={50}
                                      height={50}
                                      className="w-10 lg:w-12 h-10 lg:h-12"
                                    />
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div" className="hidden lg:block text-base-100 font-bold mt-3">
                                    <DynamicHtmlTag type="div">Faites glisser votre fichier ici</DynamicHtmlTag>
                                    <DynamicHtmlTag type="div">ou</DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div">
                                    <CustomButton
                                      type="button"
                                      className="bg-base-100 mt-3 text-sky-300 font-semibold text-xs lg:text-sm py-1 lg:py-1.5 2xl:py-2 px-5 2xl:px-6 rounded-full hover:bg-blue-600 transition duration-200"
                                      onClick={handleButtonClick}>
                                      importer
                                    </CustomButton>
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div" className="lg:hidden text-xs font-bold text-base-100 mt-2">
                                    votre fichier ici
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                            )}
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      </CustomLabel>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {/* For Desktop Modifier Button */}
                  <DynamicHtmlTag type="div" className="hidden lg:flex mt-2 ps-2 pe-1 lg:px-2 items-center">
                    {Imageerrors?.file && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-3xs md:text-2xs 2xl:text-xs w-full font-semibold">
                        {Imageerrors?.file}
                      </DynamicHtmlTag>
                    )}
                    {fileType === "application/pdf" ||
                    fileType === "application/msword" ||
                    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                      <DynamicHtmlTag type="div" className="flex gap-0.5 items-center">
                        <CustomImage src="/images/pencil-edit.svg" alt="edit" width={20} height={20} className="w-4 lg:w-5 h-4 lg:h-5" />
                        <CustomButton
                          type="button"
                          className="text-blue font-semibold text-3xs md:text-2xs lg:text-xs 2xl:text-sm"
                          onClick={handleButtonClick}>
                          Modifier
                        </CustomButton>
                      </DynamicHtmlTag>
                    ) : (
                      ""
                    )}
                    <DynamicHtmlTag type="span" className="text-3xs md:text-2xs lg:text-xs 2xl:text-sm font-semibold flex justify-end w-full">
                      Ajoutez un fichier (pdf, jgp, png)
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {/* For Mobile Modifier Button */}
                  <DynamicHtmlTag type="div" className="flex mt-1 lg:mt-2 ps-2 pe-1 lg:px-2 items-center lg:hidden relative h-[11%]">
                    {Imageerrors?.file && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-3xs md:text-2xs 2xl:text-xs w-full font-semibold leading-none">
                        {Imageerrors?.file}
                      </DynamicHtmlTag>
                    )}
                    {fileType === "application/pdf" ||
                    fileType === "application/msword" ||
                    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                      <DynamicHtmlTag type="div" className={`flex gap-0.5 items-center ${Imageerrors?.file ? "absolute left-2.5 -bottom-2.5" : ""}`}>
                        <CustomImage src="/images/pencil-edit.svg" alt="edit" width={20} height={20} className="w-4 lg:w-5 h-4 lg:h-5" />
                        <CustomButton
                          type="button"
                          className="text-blue font-semibold text-3xs md:text-2xs lg:text-xs 2xl:text-sm"
                          onClick={handleButtonClick}>
                          Modifier
                        </CustomButton>
                      </DynamicHtmlTag>
                    ) : (
                      ""
                    )}
                    <DynamicHtmlTag type="span" className="text-3xs md:text-2xs lg:text-xs 2xl:text-sm font-semibold flex justify-end w-full">
                      Ajoutez un fichier (pdf, jgp, png)
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="mt-2 ps-2 pe-1 lg:px-2">
                    <DynamicHtmlTag type="p" className="text-2xs 2xl:text-xs">
                      Ajoutez ici vos documents afin de compléter votre dossier médical.
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="p" className="text-2xs 2xl:text-xs">
                      Vous pouvez également choisir, de rendre ces documents visibles ou non par les médecins de DrVisio.
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="p" className="text-2xs 2xl:text-xs">
                      Seul les champs marqués par (*) sont obligatoires.
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="p" className="text-2xs 2xl:text-xs font-semibold">
                      Un dossier médical bien rempli permet d’optimiser votre prise en charge.
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex justify-end ps-2 pe-1 lg:px-4 mt-0 py-1 sticky bottom-0 bg-white">
                  <CustomButton
                    type="button"
                    className={`px-5 2xl:px-6 py-1 rounded-full text-xs 2xl:text-sm card-btn font-bold text-base-100 bg-gradient-to-l form-steelBlue-200 to-steelBlue-300 ${!previewImageDocuments ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={previewImageDocuments ? () => handleSubmit() : () => {}}>
                    Suivant
                  </CustomButton>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        )}
        {step === 2 && (
          <DynamicHtmlTag
            type="div"
            className={`w-full bg-white lg:shadow-lg rounded-lg lg:overflow-auto ${activeTab !== null ? "hidden" : "h-[69vh] lg:h-full"}`}>
            <DynamicHtmlTag type="div" className="flex justify-between lg:justify-start mt-2 px-2 xl:px-4 items-center">
              <DynamicHtmlTag type="div">
                <CustomImage src="/images/backicon.svg" alt="back" width={25} height={25} onClick={() => setStep(1)} />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex flex-col justify-center w-full">
                <DynamicHtmlTag type="span" className="text-2xs xl:text-xs 2xl:text-sm font-bold xl:mt-2 2xl:mt-3 text-center">
                  AJOUTER UN DOCUMENT
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="px-2 lg:px-4 text-4xs xl:text-3xs 2xl:text-2xs font-semibold text-pink-400 text-center">
                  « {medicalDocument?.file?.name} »
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="text-end px-2 lg:hidden">
                <CustomButton className="w-fit inline-block p-0.5 2xl:p-1 revert-light-gradient shadow-md shadow-slate-400 rounded-full" as="button">
                  <IoCloseSharp className="w-3.5 2xl:w-5 h-3.5 2xl:h-5" onClick={handleCloseStep} />
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="grid grid-col-1 lg:grid lg:grid-cols-3 mt-4 2xl:mt-5 px-2">
              <DynamicHtmlTag type="div" className="w-full lg:col-span-2">
                <DynamicHtmlTag type="div" className="w-full px-2 lg:px-0">
                  <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-5">
                    <DynamicHtmlTag type="div" className="col-span-1">
                      <DynamicHtmlTag type="span" className="px-2 lg:px-4 text-3xs xl:text-2xs 2xl:text-xs font-semibold pt-2 pb-0">
                        Choisir une catégorie
                        <DynamicHtmlTag type="strong" className="text-pink-400 font-semibold">
                          *
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="px-2 lg:px-4 text-4xs xl:text-3xs 2xl:text-2xs font-semibold text-pink-400 -mt-1">
                        (*Champ obligatoire)
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="w-full lg:w-[90%]">
                      <CustomSelect
                        value={defaultDocumentCategoryOptions.find(option => option.value === medicalDocument?.category?.value) || null}
                        onChange={(selectedOption: DocumentOption | null) => {
                          setmedicalDocument((prevState: any) => ({
                            ...prevState,
                            category: selectedOption ?? "",
                          }));
                          if (selectedOption) {
                            fetchTTypeDocumentList(selectedOption?.value);
                          }
                          if (selectedOption) {
                            setSelectCategoryType(selectedOption?.code);
                          }
                          setErrors((prevErrors: any) => ({
                            ...prevErrors,
                            category: undefined, // Clear the error for isMedicalProduct
                          }));
                        }}
                        // isClearable
                        options={defaultDocumentCategoryOptions}
                        className={`${errors?.category ? "border-red-500" : ""} w-full text-3xs xl:text-2xs 2xl:text-xs text-black font-semibold rounded-md placeholder:text-black document-select-dropdown`}
                        placeholder="Sélectionnez une catégorie"
                      />
                      {errors?.category && (
                        <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                          {errors?.category}
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-5 mt-2">
                    <DynamicHtmlTag type="div" className="col-span-1">
                      <DynamicHtmlTag type="span" className="px-2 lg:px-4 text-3xs xl:text-2xs 2xl:text-xs font-semibold pt-2 pb-0">
                        Date du document
                        <DynamicHtmlTag type="strong" className="text-pink-400 font-semibold">
                          *
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="px-2 lg:px-4 text-4xs xl:text-3xs 2xl:text-2xs font-semibold text-pink-400 -mt-1">
                        (*Champ obligatoire)
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="w-full lg:w-[90%]">
                      <DynamicHtmlTag
                        type="div"
                        className="form-date-picker date-picker flex items-center outline-none [&&]:text-2xs rounded-md border border-gray-400 h-[33px] 2xl:h-[38px] py-2 px-2 document-date-picker">
                        <DynamicHtmlTag type="span" className="text-3xs xl:text-2xs 2xl:text-xs w-full block">
                          <CustomDatePicker
                            selected={startDate}
                            onChange={(date: any) => handleDateOptionChange(date)}
                            placeholderText="jj/mm/aaaa"
                            dateFormat={"dd/MM/yyyy"}
                            className={`${errors?.date ? "border-red-500" : ""} text-3xs xl:text-2xs 2xl:text-xs text-black placeholder:text-black font-semibold uppercase`}
                          />
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      {errors?.date && (
                        <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                          {errors?.date}
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-5 mt-2">
                    <DynamicHtmlTag type="div" className="col-span-1">
                      <DynamicHtmlTag type="span" className="px-2 lg:px-4 text-3xs xl:text-2xs 2xl:text-xs font-semibold py-1">
                        Renommer
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="w-full lg:w-[90%]">
                      <CustomInput
                        type="text"
                        onChange={handleFieldChange}
                        value={medicalDocument?.name?.toString()} // Convert to primitive string
                        name="name"
                        className={`${errors?.name ? "border-red-500" : ""} w-full h-[33px] 2xl:h-[38px] text-3xs xl:text-2xs 2xl:text-xs rounded-md border border-gray-400 p-2 text-black placeholder:text-black font-semibold outline-none capitalize`}
                        placeholder=""
                      />
                      {errors?.name && (
                        <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                          {errors?.name}
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full lg:w-[95%] h-0.5 px-4 mt-3 2xl:mt-4 mb-3 2xl:mb-4 mx-auto border-b border-gray-400" />

            <DynamicHtmlTag type="div" className="hidden">
              <DynamicHtmlTag type="div" className="mt-4 px-4">
                <DynamicHtmlTag type="span" className="text-xs xl:text-sm 2xl:text-base font-bold">
                  Choisir la catégorie pour compléter le dossier
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex justify-center lg:justify-end px-4 mt-5">
                <CustomImage src="/images/patient-doc-img.svg" alt="patient-doc" className="" width={200} height={200} />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex justify-end px-4 mt-7">
                <CustomButton
                  type="button"
                  className="w-36 h-10 rounded-2xl text-sm card-btn font-bold text-base-100 bg-gradient-to-l form-steelBlue-200 to-steelBlue-300">
                  Ajouter
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            {isLoading ? (
              <CustomFullScreenLoader />
            ) : (
              <DynamicHtmlTag
                type="div"
                className="flex flex-col lg:grid grid-col-1 gap-1 xl:gap-0 document-half-list xl:h-[46%] 2xl:h-1/2 overflow-y-scroll lg:overflow-visible">
                {medicalDocument.category && ( // Render only if category is selected
                  <DynamicHtmlTag type="div" className="flex justify-center h-[30px] lg:h-auto">
                    <DynamicHtmlTag type="div">
                      {selectCategoryType == "RESI" ? (
                        <CustomButton
                          type="button"
                          className="bg-gradient-to-b from-yellow-300 to-yellow-500 px-6 2xl:px-8 py-1 2xl:py-2 rounded-lg text-base-100 font-bold text-3xs xl:text-2xs 2xl:text-xs pointer-events-none">
                          Radio, écho, scanner, IRM
                        </CustomButton>
                      ) : selectCategoryType == "CORE" ? (
                        <CustomButton
                          type="button"
                          className="bg-gradient-to-b from-indigo-400 to-indigo-800 px-6 2xl:px-8 py-1 2xl:py-2 rounded-lg text-base-100 font-bold text-3xs xl:text-2xs 2xl:text-xs pointer-events-none">
                          Comptes rendus
                        </CustomButton>
                      ) : selectCategoryType == "REBI" ? (
                        <CustomButton
                          type="button"
                          className="bg-gradient-to-b from-pink-300 to-pink-400 px-6 2xl:px-8 py-1 2xl:py-2 rounded-lg text-base-100 font-bold text-3xs xl:text-2xs 2xl:text-xs pointer-events-none">
                          Résultats de biologie
                        </CustomButton>
                      ) : selectCategoryType == "ORDO" ? (
                        <CustomButton
                          type="button"
                          className="bg-gradient-to-b from-coolBlue-400 to-coolBlue-500 px-6 2xl:px-8 py-1 2xl:py-2 rounded-lg text-base-100 font-bold text-3xs xl:text-2xs 2xl:text-xs pointer-events-none">
                          Ordonnances et soins
                        </CustomButton>
                      ) : selectCategoryType == "CEME" ? (
                        <CustomButton
                          type="button"
                          className="bg-gradient-to-b from-yellow-500 to-red-500 px-6 2xl:px-8 py-1 2xl:py-2 rounded-lg text-base-100 font-bold text-3xs xl:text-2xs 2xl:text-xs pointer-events-none">
                          Certificats médicaux
                        </CustomButton>
                      ) : selectCategoryType == "PIDE" ? (
                        <CustomButton
                          type="button"
                          className="bg-gradient-to-b from-indigo-700 to-indigo-600 px-6 2xl:px-8 py-1 2xl:py-2 rounded-lg text-base-100 font-bold text-3xs xl:text-2xs 2xl:text-xs pointer-events-none">
                          Prévention et dépistage
                        </CustomButton>
                      ) : selectCategoryType == "PIAD" ? (
                        <CustomButton
                          type="button"
                          className="bg-gradient-to-b from-purple-200 to-coolBlue-600 px-6 2xl:px-8 py-1 2xl:py-2 rounded-lg text-base-100 font-bold text-3xs xl:text-2xs 2xl:text-xs pointer-events-none">
                          Pièces administratives
                        </CustomButton>
                      ) : selectCategoryType == "AUDO" ? (
                        <CustomButton
                          type="button"
                          className="bg-gradient-to-b from-pink-500 to-purple-500 px-6 2xl:px-8 py-1 2xl:py-2 rounded-lg text-base-100 font-bold text-3xs xl:text-2xs 2xl:text-xs pointer-events-none">
                          Autres documents
                        </CustomButton>
                      ) : (
                        ""
                      )}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                )}
                <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row mt-1 xl:mt-3 ps-2 pe-0 lg:pe-2">
                  {selectCategoryType == "AUDO" ? (
                    ""
                  ) : medicalDocument.category ? ( // Render only if category is selected
                    <DynamicHtmlTag type="div" className="px-2 w-full lg:w-2/3">
                      <DynamicHtmlTag type="div" className="w-full ps-2 pe-0 lg:pe-2">
                        <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-3">
                          <DynamicHtmlTag type="div" className="text-3xs xl:text-2xs 2xl:text-xs font-semibold py-2">
                            {selectCategoryType == "CORE"
                              ? `Type de comptes rendus`
                              : selectCategoryType == "ORDO"
                                ? "Type d’ordonnance"
                                : selectCategoryType == "CEME"
                                  ? "Type de Certificat"
                                  : selectCategoryType == "CEME"
                                    ? "Type"
                                    : selectCategoryType == "PIAD"
                                      ? "Type"
                                      : selectCategoryType == "PIDE"
                                        ? "Type"
                                        : `Type d’examen`}
                          </DynamicHtmlTag>
                          <DynamicHtmlTag type="div" className="w-full lg:w-[95%]">
                            <CustomSelect
                              value={defaultTypeDocument.find(option => option.value === medicalDocument.typeId) || null}
                              onChange={(selectedOption: DocumentOption | null) => {
                                setmedicalDocument((prevState: any) => ({
                                  ...prevState,
                                  typeId: selectedOption?.value ?? "",
                                }));
                                setErrors((prevErrors: any) => ({
                                  ...prevErrors,
                                  typeId: undefined, // Clear the error for isMedicalProduct
                                }));
                              }}
                              // isClearable
                              options={defaultTypeDocument}
                              className="w-full text-3xs xl:text-2xs 2xl:text-xs text-black rounded-md placeholder-black font-semibold document-select-dropdown bottom-dropdown-list"
                              placeholder={
                                selectCategoryType == "CORE"
                                  ? `Sélectionnez un type de compte rendu`
                                  : selectCategoryType == "ORDO"
                                    ? "Sélectionnez un type d’ordonnance"
                                    : selectCategoryType == "CEME"
                                      ? "Sélectionnez un type de certificat"
                                      : selectCategoryType == "CEME"
                                        ? "Sélectionnez un type"
                                        : selectCategoryType == "PIAD"
                                          ? "Sélectionnez un type"
                                          : selectCategoryType == "PIDE"
                                            ? "Sélectionnez un type"
                                            : `Sélectionnez un type d’éxamen`
                              }
                              menuPlacement="auto"
                            />
                            {errors?.typeId && (
                              <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                                {errors?.typeId}
                              </DynamicHtmlTag>
                            )}
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        {selectCategoryType == "RESI" ? (
                          <>
                            <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-3 mt-2">
                              <DynamicHtmlTag type="div" className="text-3xs xl:text-2xs 2xl:text-xs font-semibold py-2">
                                Examen de
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="w-full lg:w-[95%]">
                                <CustomSelect
                                  value={defaultMedicalPartExamOptions.find(option => option.value === medicalDocument.partExamined) || null}
                                  onChange={(selectedOption: DocumentOption | null) => {
                                    setmedicalDocument((prevState: any) => ({
                                      ...prevState,
                                      partExamined: selectedOption?.value ?? "",
                                    }));
                                    setErrors((prevErrors: any) => ({
                                      ...prevErrors,
                                      partExamined: undefined, // Clear the error for isMedicalProduct
                                    }));
                                  }}
                                  // isClearable
                                  options={defaultMedicalPartExamOptions}
                                  className="w-full text-3xs xl:text-2xs 2xl:text-xs text-black rounded-md placeholder-black font-semibold document-select-dropdown bottom-dropdown-list"
                                  placeholder="Sélectionnez la partie à examiner"
                                />
                                {errors?.partExamined && (
                                  <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                                    {errors?.partExamined}
                                  </DynamicHtmlTag>
                                )}
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                            <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-3 mt-2">
                              <DynamicHtmlTag type="div" className="text-3xs xl:text-2xs 2xl:text-xs font-semibold py-2">
                                Latéralité
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="w-full lg:w-[95%] laterality-box-main">
                                <CustomSelect
                                  value={defaultMedicalLaterality.find(option => option.value === medicalDocument.laterality) || null}
                                  onChange={(selectedOption: DocumentOption | null) => {
                                    setmedicalDocument((prevState: any) => ({
                                      ...prevState,
                                      laterality: selectedOption?.value ?? "",
                                    }));
                                    setErrors((prevErrors: any) => ({
                                      ...prevErrors,
                                      laterality: undefined, // Clear the error for isMedicalProduct
                                    }));
                                  }}
                                  // isClearable
                                  options={defaultMedicalLaterality}
                                  className="w-full rounded-md text-3xs xl:text-2xs 2xl:text-xs text-black placeholder-black font-semibold document-select-dropdown bottom-dropdown-list"
                                  placeholder="Sélectionnez le coté à examiner"
                                  menuPlacement="top"
                                />
                                {errors?.laterality && (
                                  <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                                    {errors?.laterality}
                                  </DynamicHtmlTag>
                                )}
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                          </>
                        ) : (
                          ""
                        )}

                        {selectCategoryType == "CORE" ? (
                          <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-3 mt-2">
                            <DynamicHtmlTag type="div" className="col-span-1 text-3xs xl:text-2xs 2xl:text-xs font-semibold">
                              Consultation
                            </DynamicHtmlTag>
                            <DynamicHtmlTag type="div" className="w-full lg:w-[95%] laterality-box-main">
                              <CustomSelect
                                value={defaultMedicalconsultation.find(option => option.value === medicalDocument.consultationTypeId) || null}
                                onChange={(selectedOption: DocumentOption | null) => {
                                  setmedicalDocument((prevState: any) => ({
                                    ...prevState,
                                    consultationTypeId: selectedOption?.value ?? "",
                                  }));
                                  setErrors((prevErrors: any) => ({
                                    ...prevErrors,
                                    consultationTypeId: undefined, // Clear the error for isMedicalProduct
                                  }));
                                }}
                                // isClearable
                                options={defaultMedicalconsultation}
                                className="w-full rounded-md text-3xs xl:text-2xs 2xl:text-xs text-black placeholder-black font-semibold document-select-dropdown bottom-dropdown-list"
                                placeholder="Sélectionnez un type de consultation"
                                menuPlacement="auto"
                              />
                              {errors?.consultationTypeId && (
                                <DynamicHtmlTag type="div" className="text-red-500 text-3xs">
                                  {errors?.consultationTypeId}
                                </DynamicHtmlTag>
                              )}
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        ) : (
                          ""
                        )}
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  ) : (
                    <DynamicHtmlTag type="div" className="px-2 lg:px-4 w-full lg:w-2/3">
                      <DynamicHtmlTag type="span" className="text-xs xl:text-sm 2xl:text-base font-bold text-center lg:text-left block">
                        Choisir la catégorie pour compléter le dossier
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="flex justify-center lg:hidden mt-4">
                        <CustomImage src="/images/patient-doc-img.svg" alt="patient-doc-img" width={120} height={120} className="w-24 h-24" />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  )}
                  <DynamicHtmlTag type="div" className="w-full lg:w-1/3">
                    <DynamicHtmlTag type="div" className="flex justify-center">
                      <CustomImage
                        src="/images/patient-doc-img.svg"
                        alt="img"
                        className="hidden lg:block w-24 lg:w-28 xl:w-40 2xl:w-60 h-24 lg:h-28 xl:h-40 2xl:h-60"
                        width={120}
                        height={120}
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            )}
            <DynamicHtmlTag type="div" className="flex justify-end px-4 mt-2 bottom-1 lg:bottom-[unset] sticky lg:relative">
              <CustomButton
                type="button"
                onClick={handleAddDocumentSubmit}
                className={`rounded-full text-xs 2xl:text-sm card-btn font-bold text-base-100 px-5 2xl:px-6 py-1 2xl:py-2`}>
                Ajouter
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        )}
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default DocumentTabs;
