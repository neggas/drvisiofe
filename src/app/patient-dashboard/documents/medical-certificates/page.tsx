"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  CustomButton,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomLink,
  CustomModal,
  DeleteDocument,
  DynamicHtmlTag,
  HeadingTag,
  Pagination,
  VisioLogo,
} from "@/components";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { resetModal, openModal, closeModal } from "@/store/reducers/modalSlice";
import { FaTrash } from "react-icons/fa";
import {
  selectPatientDetailsData,
  setMedicalDocumentCategoryID,
  setMedicalDocumentCategoryList,
  setMedicalDocumentUpateCategoryID,
} from "@/store/reducers/patientDetailsSlice";
import {
  deleteMedicalDocumentApi,
  deleteMedicalListDocumentApi,
  DOCUMENT_DELETION_MESSAGES,
  DocumentDetails,
  DocumentOption,
  fetchMedicalCategoryDocumentApi,
  MedicalCategoryDocumentByListApi,
} from "@/utility";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import CustomIFrame from "@/components/ui/custom-iframe/Iframe";
import { useRouter } from "next/navigation";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const itemsPerPage = 10;

const MedicalCartificate = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const [defaultDocumentCategoryOptions, setDefaultDocumentCategoryOptions] = useState<DocumentOption[]>([]);
  const [CategoryList, setCategoryList] = useState<DocumentDetails[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [listDelete, setListDelete] = useState<number | undefined>();
  const [MedicalDocumentName, setMedicalDocumentName] = useState();
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const isModalOpens = useSelector((state: RootState) => state.modal.isOpen);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [MultilistDelete, setMultiListDelete] = useState<string[]>([]);
  const [pdfName, setPdfName] = useState<string>(""); // Use the lowercase `string` type
  const router = useRouter();

  const isAllSelected = selectedCheckboxes.length === CategoryList.length;
  const isDeleteDisabled = selectedCheckboxes.length < 1;
  const [checkboxes, setCheckboxes] = useState({
    checkbox_one: false,
    checkbox_two: false,
  });

  type CheckboxKeys = keyof typeof checkboxes;

  const fetchCategoryTypeList = useCallback(async () => {
    try {
      const response: any[] = await fetchMedicalCategoryDocumentApi();
      const categoryOptions: DocumentOption[] = response
        .filter(category => category.code === "CEME")
        .map(category => ({
          value: category.id,
          label: category.name,
          code: category.code,
        }));
      setDefaultDocumentCategoryOptions(categoryOptions);
    } catch (error) {
      setDefaultDocumentCategoryOptions([]);
    }
  }, []);
  // État pour le tri
  const [byCreatedDateDesc, setByCreatedDateDesc] = useState(false);

  // Fonction de récupération avec tri
  const fetchCategoryList = useCallback(async () => {
    if (!defaultDocumentCategoryOptions[0]?.value || !fetchPatientData?.id) return;

    try {
      const data = await MedicalCategoryDocumentByListApi(
        defaultDocumentCategoryOptions[0].value,
        fetchPatientData.id,
        currentPage,
        itemsPerPage,
        byCreatedDateDesc // Ajoutez cette variable pour le tri
      );
      setTotalPages(data?.totalPage || 0);
      setTotalItems(data?.totalCount || 0);
      setCategoryList(data?.results || []);
      dispatch(setMedicalDocumentCategoryList(data?.results));
    } catch (error) {
      setCategoryList([]);
    }
  }, [currentPage, fetchPatientData?.id, defaultDocumentCategoryOptions, byCreatedDateDesc]);
  const handleClickSort = () => {
    setByCreatedDateDesc(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Avoid multiple fetches
      if (defaultDocumentCategoryOptions.length === 0 || !fetchPatientData?.id) return;

      dispatch(showLoader("medical-document"));
      try {
        await fetchCategoryList();
      } catch (err) {
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchData();
  }, [fetchPatientData?.id, defaultDocumentCategoryOptions, fetchCategoryList]);

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      dispatch(showLoader("medical-document"));
      try {
        await fetchCategoryTypeList();
      } catch (err) {
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchCategoryOptions();
  }, [fetchCategoryTypeList]);
  const deleteDocument = async (allergyId: number) => {
    const pateientId = fetchPatientData?.id;
    try {
      const response = await deleteMedicalDocumentApi(pateientId, allergyId);
      toast.success(DOCUMENT_DELETION_MESSAGES.SINGLE_DOCUMENT);
      closeDeleteDocumentModal();
      fetchCategoryList();
    } catch (error: any) {
      // const errorMessage = error.response?.data?.message;
    } finally {
    }
  };
  const handleaddCategoryList = () => {
    // If no item is provided, dispatch with the default category
    const defaultCategory = defaultDocumentCategoryOptions[0]?.value ?? null; // Fallback to null if no category available
    dispatch(setMedicalDocumentCategoryID(defaultCategory));
    dispatch(setMedicalDocumentUpateCategoryID(null));
  };
  const handleUpdateCategoryList = (item: any) => {
    if (item) {
      // If item is provided, dispatch with item and navigate
      router.push("/patient-dashboard/documents/category");
      dispatch(setMedicalDocumentUpateCategoryID(item));
      dispatch(setMedicalDocumentCategoryID(null));
    }
  };
  const openDeleteDocumentModal = (item: any) => {
    dispatch(resetModal());
    setListDelete(item?.id); // Ensure item is a number here
    setMedicalDocumentName(item?.name);

    setTimeout(() => dispatch(openModal("deleteDocumentModal")));
  };

  const handleSelectAllChange = () => {
    if (selectedCheckboxes.length === CategoryList.length) {
      setSelectedCheckboxes([]); // Deselect all
    } else {
      setSelectedCheckboxes(CategoryList.map(item => item.id.toString())); // Select all
    }
  };
  const handleCheckboxChange = (id: number) => {
    const idString = id.toString(); // Convert id to string
    setSelectedCheckboxes(prevSelected => {
      if (prevSelected.includes(idString)) {
        return prevSelected.filter(item => item !== idString);
      } else {
        return [...prevSelected, idString];
      }
    });
  };

  const deleteMultiPleDocument = async (allergyId: any) => {
    const pateientId = fetchPatientData?.id;
    const model = {
      patientId: pateientId,
      docMedicalId: allergyId,
    };

    try {
      const response = await deleteMedicalListDocumentApi(model);
      toast.success(DOCUMENT_DELETION_MESSAGES.MULTIPLE_DOCUMENTS);

      closeDeleteDocumentModal();
      setSelectedCheckboxes([]);
      fetchCategoryList();
    } catch (error: any) {
      // const errorMessage = error.response?.data?.message;
    } finally {
    }
  };
  const openDeleteDocumentModalMultiPle = () => {
    dispatch(resetModal());
    setMultiListDelete(selectedCheckboxes); // Ensure item is a number here
    //  setMedicalDocumentName(item?.type?.name);
    setMedicalDocumentName(undefined);
    setTimeout(() => dispatch(openModal("deleteDocumentModal")));
  };
  const closeDeleteDocumentModal = () => {
    dispatch(closeModal());
  };

  const openShowPreviewModal = (fileUrl: string, fileExtension: string) => {
    setPdfName(fileExtension); // Directly set the MIME type
    //setPreviewImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}${fileUrl}`);
    if (fileExtension === "application/pdf") {
      const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${fileUrl}`;
      fetch(fullUrl)
        .then(response => {
          if (!response.ok) throw new Error("Failed to fetch file");
          return response.blob();
        })
        .then(blob => {
          const objectUrl = URL.createObjectURL(blob);
          setPreviewImage(objectUrl); // Use object URL for preview
        });
    }
    if (fileExtension === "application/msword" || fileExtension === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${fileUrl}`;
      setPreviewImage(fullUrl);
    } else {
      setPreviewImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}${fileUrl}`);
    }
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("showMedicalDocument")), 0);
  };
  const handlePageChange = (selected: { selected: number }) => {
    setCurrentPage(selected.selected);
  };

  const closeShowPreviewModal = () => {
    setPreviewImage(null);
    dispatch(closeModal());
  };

  return (
    <DynamicHtmlTag type="div" className="bg-white shadow-lg rounded-lg h-full overflow-auto">
      <DynamicHtmlTag type="div" className="tabs-content rounded-t-lg pt-0" id="certificate">
        <HeadingTag type="h3" className="font-semibold text-sm text-white text-center py-1 px-3">
          Certificats médicaux
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex lg:hidden items-center justify-between mt-2 pb-4 lg:border-b border-slate-100 mx-4">
        <CustomButton onClick={handleaddCategoryList}>
          <CustomLink
            href="/patient-dashboard/documents/category"
            className="card-btn text-2xs md:text-3xs text-white py-2 px-3 font-semibold rounded-2xl lg:hidden">
            Ajouter un document
          </CustomLink>
        </CustomButton>
        <CustomLink href="/patient-dashboard/documents">
          <CustomButton className="w-fit inline-block p-1 revert-light-gradient rounded-full" as="button">
            <IoCloseSharp className="w-5 h-5" />
          </CustomButton>
        </CustomLink>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className={`w-full px-3 py-2 relative rounded-b-lg ${CategoryList.length === 0 ? "h-[90%]" : ""}`}>
        {CategoryList.length === 0 ? (
          <DynamicHtmlTag type="div" className="w-full px-1 xl:px-3 py-2 relative h-full main-tab-inner overflow-hidden">
            <DynamicHtmlTag
              type="div"
              className="flex max-h-table overflow-auto min-w-full bg-white lg:h-[88%] lg:max-h-[15rem] xl:max-h-[32rem] table-mobile-height pb-10 lg:pb-0 mt-5">
              <DynamicHtmlTag type="span" className="max-w-max text-center text-sm xl:text-base lg:py-1 pb-10 block m-auto font-semibold">
                <CustomImage
                  src="/images/empty-doc-img.svg"
                  alt="not-document"
                  width={400}
                  height={400}
                  className="max-w-max mx-auto w-40 lg:w-52 xl:w-80 mb-1"
                />
                Vous n{`'`}avez pas encore enregistré de certificat médical.
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        ) : (
          <DynamicHtmlTag type="div" className="max-h-table overflow-auto min-w-full bg-white">
            <DynamicHtmlTag type="div" className="flex justify-between px-3 xl:mt-2">
              <DynamicHtmlTag type="div" className="flex gap-3">
                <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                  <CustomInput
                    type="checkbox"
                    id="select-all"
                    checked={isAllSelected && CategoryList?.length > 0} // Make sure the checkbox is only checked if data exists and is selected
                    onChange={handleSelectAllChange}
                  />
                  <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="select-all">
                    <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                  </CustomLabel>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="h-5 border border-r bg-gray-500"></DynamicHtmlTag>
                <CustomImage src="/images/doc-file-icon.svg" alt="file" width={20} height={20} className="hidden" />
                <CustomButton title={isDeleteDisabled ? "Vous devez selectionnez au moins un document." : ""}>
                  <CustomImage
                    src="/images/doc-delete-icon.svg"
                    alt="file"
                    className={`transition-opacity duration-200 ${isDeleteDisabled ? "opacity-40 cursor-not-allowed" : "opacity-100 cursor-pointer"}`}
                    width={15}
                    height={15}
                    onClick={isDeleteDisabled ? undefined : openDeleteDocumentModalMultiPle}
                  />
                </CustomButton>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex gap-3 items-center" onClick={handleClickSort}>
                <DynamicHtmlTag type="span" className="font-bold text-[2vw] md:text-2xs">
                  Trier
                </DynamicHtmlTag>
                <CustomImage src="/images/doc-filter-icon.svg" alt="filter" width={20} height={20} />
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full px-1 xl:px-3 py-2 relative h-full main-tab-inner overflow-hidden">
              <DynamicHtmlTag
                type="div"
                className="max-h-table overflow-auto min-w-full bg-white lg:h-[88%] lg:max-h-[15rem] xl:max-h-[32rem] table-mobile-height pb-10 lg:pb-0">
                <table className="min-w-full bg-white lg:mt-5">
                  <thead>
                    <tr className="sticky top-[-2px] z-10 border-t lg:border-t-0 border-b border-slate-100 text-[2vw] md:text-3xs xl:text-2xs bg-white">
                      <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100">
                        <DynamicHtmlTag type="div" className="line-clamp-1">
                          Type
                        </DynamicHtmlTag>
                      </th>
                      <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100 hidden lg:table-cell">
                        <DynamicHtmlTag type="div" className="line-clamp-1">
                          Nom du document
                        </DynamicHtmlTag>
                      </th>

                      <th className="p-1 lg:py-2 lg:px-2 text-left font-medium text-slate-100">
                        <DynamicHtmlTag type="div" className="line-clamp-1">
                          Date
                        </DynamicHtmlTag>
                      </th>
                      <th className="p-1 lg:py-2 lg:px-2 text-center font-medium text-slate-100 w-1/6">
                        <DynamicHtmlTag type="div" className="line-clamp-1">
                          Action
                        </DynamicHtmlTag>
                      </th>
                    </tr>
                  </thead>
                  {CategoryList?.map((item, index) => {
                    return (
                      <tbody key={index}>
                        <tr className="cursor-pointer text-[2vw] md:text-[6px] xl:text-2xs 2xl:text-xs font-bold lg:border-b lg:border-slate-100">
                          <td className="py-1 px-1 2xl:py-3 2xl:px-3 text-left">
                            <DynamicHtmlTag type="div" className="flex gap-0 lg:gap-5 text-left">
                              <DynamicHtmlTag type="div" className="custom-checkbox hidden lg:flex items-center gap-2 overflow-hidden">
                                <CustomInput
                                  type="checkbox"
                                  id={`checkbox-${item?.id}`}
                                  checked={selectedCheckboxes.includes(item?.id.toString())} // Convert to string for comparison
                                  onChange={() => handleCheckboxChange(item?.id)}
                                />
                                <CustomLabel
                                  className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px] hidden lg:block"
                                  htmlFor={`checkbox-${item?.id}`}>
                                  <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                                </CustomLabel>
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="span" className="line-clamp-1">
                                {item?.type?.name}
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                          </td>
                          <td className="py-1 px-1 2xl:py-3 2xl:px-3 text-left hidden lg:block ">
                            <DynamicHtmlTag type="span" className="flex items-center line-clamp-1">
                              {item?.name}
                            </DynamicHtmlTag>
                          </td>
                          <td className="py-1 px-1 2xl:py-3 2xl:px-3 text-left">
                            <DynamicHtmlTag type="span" className="line-clamp-1">
                              {item?.date}
                            </DynamicHtmlTag>
                          </td>
                          <td className="py-1 px-1 2xl:py-3 2xl:px-3 text-left w-1/6">
                            <DynamicHtmlTag type="div" className="flex items-center space-x-2 lg:space-x-4 justify-center">
                              <CustomButton type="button" onClick={() => openShowPreviewModal(item?.file?.url, item?.file?.extension)}>
                                <CustomImage
                                  className="w-3 h-3 md:w-4 md:h-4 lg:w-3 lg:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 max-w-max"
                                  src="/images/eye.svg"
                                  alt="pencil-edit"
                                  width={22}
                                  height={22}
                                />
                              </CustomButton>
                              <CustomButton onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL}${item?.file?.url}`)} as="button">
                                <CustomImage
                                  className="w-3 h-3 md:w-4 md:h-4 lg:w-3 lg:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 max-w-max"
                                  src="/images/download-doc-icon.svg"
                                  alt="download"
                                  width={22}
                                  height={22}
                                />
                              </CustomButton>
                              <CustomButton onClick={() => handleUpdateCategoryList(item?.id)} as="button">
                                <CustomImage
                                  className="w-3 h-3 md:w-4 md:h-4 lg:w-3 lg:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 max-w-max"
                                  src="/images/file-doc-icon.svg"
                                  alt="file"
                                  width={22}
                                  height={22}
                                />
                              </CustomButton>
                              <CustomButton
                                className="cursor-pointer"
                                as="button"
                                title="delete"
                                // title={
                                //   selectedCheckboxes.includes(item.id.toString()) && selectedCheckboxes.length === 1
                                //     ? ""
                                //     : "Vous devez selectionnez au moins un document."
                                // }
                              >
                                <CustomImage
                                  // className="w-3 h-3 md:w-4 md:h-4 lg:w-3 lg:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 max-w-max"
                                  src="/images/trash.svg"
                                  className={`w-3 h-3 md:w-4 md:h-4 lg:w-3 lg:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 max-w-max 
                                    
                                    `}
                                  alt="trash"
                                  width={22}
                                  height={22}
                                  onClick={() => openDeleteDocumentModal(item)}
                                />
                              </CustomButton>
                            </DynamicHtmlTag>
                          </td>
                        </tr>
                        <tr className="md:hidden pb-1 border-b border-slate-100">
                          <td colSpan={4} className="pb-2">
                            <DynamicHtmlTag
                              type="div"
                              className="bg-gray-400 bg-opacity-40 rounded-lg text-[2vw] md:text-[6px] xl:text-2xs 2xl:text-xs font-bold w-full px-3 gap-4">
                              <DynamicHtmlTag type="div" className="text-gray-500">
                                Nom du document
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="span" className=" font-semibold text-black">
                                {item?.type?.name}
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        )}
      </DynamicHtmlTag>
      {modalType === "showMedicalDocument" && (
        <CustomModal
          id="show_Image"
          isOpen={isModalOpens && modalType === "showMedicalDocument"}
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
              <DynamicHtmlTag
                type="div"
                className={`w-full flex items-center justify-center mt-5 ${pdfName === "application/msword" || pdfName === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? "h-[70vh]" : ""} `}>
                {pdfName === "application/pdf" ? (
                  <CustomIFrame src={previewImage || ""} title="PDF Preview" className="w-full h-96 border rounded-lg" />
                ) : pdfName === "application/msword" || pdfName === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                  <DocViewer
                    pluginRenderers={DocViewerRenderers}
                    documents={[{ uri: previewImage || "" }]}
                    config={{
                      header: {
                        disableHeader: true,
                        disableFileName: false,
                        retainURLParams: false,
                      },
                    }}
                    className="w-full h-96 border rounded-lg"
                    style={{ height: "100%" }} // Optional if you want to apply custom height directly
                  />
                ) : (
                  // <CustomIFrame src={previewImage || ""} title="DOC/DOCX Preview" className="w-full h-96 border rounded-lg" />
                  <CustomImage
                    src={previewImage || ""}
                    alt="preview-image"
                    width={300}
                    height={300}
                    className="mx-auto w-full max-h-[80vh] object-cover"
                  />
                )}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
      )}
      <DynamicHtmlTag
        type="div"
        className={`bg-white flex flex-row-reverse lg:flex-row justify-center lg:justify-end absolute mt-0 bottom-0 left-0 right-0 items-center mx-2 md:mx-3 lg:border-t-slate-100 ${CategoryList.length === 0 ? "border-t-[0px] justify-end" : "border-t-[1px] justify-center lg:justify-end"}  px-0 md:px-4 xl:px-5 py-2 lg:py-2`}>
        {/* <DynamicHtmlTag type="span" className="text-blue text-xs text-left font-semibold lg:w-5/12 absolute right-0 lg:relative">
          1 sur 1
        </DynamicHtmlTag> */}
        <DynamicHtmlTag
          type="div"
          className={`flex items-center ${CategoryList.length === 0 ? "justify-end" : "justify-center lg:justify-between"} lg:w-7/12 `}>
          {CategoryList.length === 0 ? (
            ""
          ) : (
            <Pagination
              currentPage={currentPage}
              pageCount={totalPages}
              onPageChange={handlePageChange}
              pageClassName="text-2xs inline-block px-2 py-0.5 border border-blue rounded-full mx-1 text-blue"
              activeClassName="bg-primary text-white border-primary"
              previousClassName="text-[#CCCACA] py-2 px-3 xl:px-4"
              nextClassName="text-[#CCCACA] py-2 px-3 xl:px-4"
              disabledClassName="opacity-50 cursor-not-allowed pointer-events-none"
              breakLabel={"..."}
              breakClassName="inline-block px-3 py-1 border rounded-full mx-1"
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
            />
          )}
          <CustomButton
            as="div"
            onClick={handleaddCategoryList}
            className="card-btn text-3xs xl:text-xs text-white py-1 xl:py-2 px-3 font-semibold rounded-full hidden lg:inline-block">
            <CustomLink href="/patient-dashboard/documents/category">Ajouter un document</CustomLink>
          </CustomButton>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      {/* Delete Document Modal  */}
      <DeleteDocument
        isOpen={isModalOpen && modalType === "deleteDocumentModal"}
        onClose={closeDeleteDocumentModal}
        onConfirm={() => {
          if (listDelete) {
            deleteDocument(listDelete);
          } else if (MultilistDelete?.length) {
            deleteMultiPleDocument(MultilistDelete);
          } else {
            //toast.error("Aucun document sélectionné pour la suppression");
          }
        }}
        icon={<FaTrash className="text-red-500" />}
        title={MedicalDocumentName ? "Supprimer un certificat médical" : "Supprimer les certificats médicaux"}
        paragraph={
          MedicalDocumentName
            ? `Êtes vous sur de vouloir supprimer ce certificat médical : ${MedicalDocumentName} ?`
            : "Êtes vous sur de vouloir supprimer la liste des certificats médicaux ?"
        }
        description={`Êtes-vous sûr de vouloir supprimer \n ?`}
      />
    </DynamicHtmlTag>
  );
};

export default MedicalCartificate;
