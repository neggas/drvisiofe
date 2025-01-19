"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  CustomButton,
  CustomImage,
  DeleteTeleconsultationsModal,
  DynamicHtmlTag,
  HeadingTag,
  Pagination,
  UpcomingConsultationsEmpty,
  JoinMeetingModal,
  CustomModal,
  CustomFullScreenLoader,
  VisioLogo,
} from "@/components";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  deleteTeleconsultationApi,
  getteleconsultationfutureApi,
  PatientTeleconsultationsNearbyResponse,
  Teleconsultation_Message,
  teleconsultationListMedicalSituationDocumentApi,
} from "@/utility";
import { selectPatientDetailsData } from "@/store/reducers/patientDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { closeModal, openModal, resetModal } from "@/store/reducers/modalSlice";
import { MdClose } from "react-icons/md";
import { RootState } from "@/store";
import { toast } from "react-toastify";
import CustomIFrame from "@/components/ui/custom-iframe/Iframe";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useRouter } from "next/navigation";

const itemsPerPage = 10;

const UpcomingConsultations = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [Teleconsultations, setTeleconsultations] = useState<PatientTeleconsultationsNearbyResponse[]>([]);
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter(); // To handle redirection

  const dispatch = useDispatch();
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const isModalOpens = useSelector((state: RootState) => state.modal.isOpen);
  const [addhealthPreviewImage, setAddHealthPreviewImage] = useState<string | null>(null);
  const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const [listDelete, setListDelete] = useState<number | undefined>();
  const [pdfName, setPdfName] = useState<string>(""); // Use the lowercase `string` type
  const [doclist, setDocList] = useState<PatientTeleconsultationsNearbyResponse[]>([]);
  // DeleteModalBox
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openDeleteModal = () => setIsModalOpen(true);
  const closeDeleteModal = () => setIsModalOpen(false);

  // Join MeetingModal
  const [isJoinModalOpen, SetIsJoinModalOpen] = useState(false);
  const openJoinMeetingModal = () => SetIsJoinModalOpen(true);
  const closeJoinMeetingModal = () => SetIsJoinModalOpen(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchteleconsultationList = useCallback(async () => {
    try {
      const data = await getteleconsultationfutureApi(fetchPatientData?.id, currentPage, itemsPerPage);
      setTotalPages(data?.data?.totalPage || 0);
      setTotalItems(data?.data?.totalCount || 0);
      setTeleconsultations(data?.data?.results || []);
    } catch (error) {}
  }, [currentPage, fetchPatientData]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("teleconsultationfuture"));
      try {
        await fetchteleconsultationList();
      } catch (err) {
      } finally {
        dispatch(hideLoader());
      }
    };
    fetchData();
  }, [fetchteleconsultationList]);

  const handlePageChange = (selected: { selected: number }) => {
    setCurrentPage(selected.selected);
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
      // .catch((error) => console.error("Error fetching PDF file:", error));
    }
    if (fileExtension === "application/msword" || fileExtension === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${fileUrl}`;
      setPreviewImage(fullUrl);
    } else {
      setPreviewImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}${fileUrl}`);
    }
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("showTeleConsultationsDocument")), 0);
  };

  const [loadedDocs, setLoadedDocs] = useState<Record<number, boolean>>({}); // Tracks loaded status for each row

  const toggleRow = async (index: number, item: any) => {
    // Check if the documents for this row are already loaded
    if (loadedDocs[index]) {
      setOpenRows(prevState => ({
        ...prevState,
        [index]: !prevState[index], // Toggle the specific row
      }));
      return; // Skip fetching if documents are already loaded
    }

    const model = {
      practitionerId: item?.consultedPractitioner.id,
      patientId: item?.patient?.id,
      rdvId: item?.id,
    };

    const response = await teleconsultationListMedicalSituationDocumentApi(model, currentPage, itemsPerPage);

    setDocList(response?.data?.results);

    // Mark the documents for this row as loaded
    setLoadedDocs(prevState => ({
      ...prevState,
      [index]: true, // Set this row as loaded
    }));

    setOpenRows(prevState => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the specific row
    }));
  };

  const handleReprendre = (id: any) => {
    router.push(`/practitioner-profile/${id}`);
  };
  const closeShowPreviewModal = () => {
    setPreviewImage(null);
    dispatch(closeModal());
  };

  const handleDeleteModal = (item: any) => {
    setListDelete(item.id); // Ensure item is a number here
    openDeleteModal();
  };

  const deleteTeleconsultation = async (TeleconsultationId: number) => {
    const pateientId = fetchPatientData?.id;
    try {
      const response = await deleteTeleconsultationApi(TeleconsultationId);
      toast.success(Teleconsultation_Message.Delete_Appointment);
      closeDeleteModal();
      fetchteleconsultationList();
    } catch (error: any) {
      // const errorMessage = error.response?.data?.message;
    } finally {
    }
  };
  return (
    <DynamicHtmlTag type="div" className="bg-white rounded-xl h-auto lg:h-[92%]">
      <DynamicHtmlTag type="div" className="bg-gradient-to-t from-[#3A7DC0] to-[#7BCBDF] rounded-t-xl pt-0">
        <HeadingTag type="h3" className="font-semibold text-2xs xl:text-sm text-white text-center py-1 px-3">
          Consultations à venir
        </HeadingTag>
      </DynamicHtmlTag>
      {Teleconsultations.length === 0 ? (
        // <DynamicHtmlTag
        //   type="span"
        //   className="max-w-max text-center lg:text-[1vw] xl:text-lg py-1 md:absolute top-1/2 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 empty-image-main">
        //   <CustomImage src={VisioLogo} alt="logo" className="loader-logo mx-auto mb-2" width={500} height={200} />
        //   Vous n{`'`} avez aucune consultation à venir.
        // </DynamicHtmlTag>
        <UpcomingConsultationsEmpty />
      ) : (
        <DynamicHtmlTag type="div" className="px-3 lg:px-4 h-[96%] xl:h-full">
          {/* Table Header Start  */}
          <DynamicHtmlTag type="div" className="flex mt-2 xl:mt-5 border-b-2 pb-2">
            <DynamicHtmlTag type="p" className="text-3xs lg:text-[.5vw] xl:text-[.6vw] text-slate-100 font-bold text-left w-5/12 lg:w-3/12">
              Date et heure
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-3xs lg:text-[.5vw] xl:text-[.6vw] text-slate-100 font-bold text-left w-4/12">
              Médecin
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-3xs lg:text-[.5vw] xl:text-[.6vw] text-slate-100 font-bold text-left hidden lg:block w-3/12">
              Bénéficiare
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p" className="text-3xs lg:text-[.5vw] xl:text-[.6vw] text-slate-100 font-bold text-left hidden lg:block w-2/12">
              Statut
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          {/* Table Header End  */}
          {/* First Content Row Start  */}
          {isLoading ? (
            <CustomFullScreenLoader />
          ) : (
            <>
              <DynamicHtmlTag type="div" className="teleconsult-table 2xl:h-[30rem] overflow-y-auto">
                {Teleconsultations.map((item: any, index: number) => {
                  const isRowOpen = openRows[index] || false; // Check if the current row is open

                  return (
                    <DynamicHtmlTag type="div" key={index}>
                      <DynamicHtmlTag type="div" className="flex mt-3 pb-0 lg:pb-2 items-center">
                        <DynamicHtmlTag type="div" className="text-3xs text-black font-bold w-5/12 lg:w-3/12">
                          {item?.startDate} - {item?.startTime}
                        </DynamicHtmlTag>
                        <DynamicHtmlTag type="div" className="text-3xs text-black font-bold flex items-center gap-2 w-7/12 lg:w-4/12 text-left">
                          {/* "/images/doctor-img.svg" */}
                          <CustomImage
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.consultedPractitioner.avatar.url}`}
                            alt="doctor-img"
                            width={33}
                            height={33}
                          />{" "}
                          <DynamicHtmlTag type="span">
                            {item?.consultedPractitioner.firstName} {item?.consultedPractitioner.lastName}
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        <DynamicHtmlTag type="div" className="text-3xs text-black font-bold w-3/12 hidden lg:block">
                          {`${item?.patient.firstName} ${item?.patient.lastName}`}
                        </DynamicHtmlTag>
                        <DynamicHtmlTag type="div" className="text-3xs text-black font-bold text-left w-2/12 hidden lg:block">
                          {item?.status}
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="flex justify-between items-center lg:hidden">
                        <DynamicHtmlTag type="p" className="text-3xs text-slate-100 font-bold text-left">
                          Bénéficiare :
                          <DynamicHtmlTag type="span" className="text-3xs text-black font-bold ps-1">
                            Charlotte
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        <DynamicHtmlTag type="p" className="text-3xs text-slate-100 font-bold text-left">
                          Statut :
                          <DynamicHtmlTag type="span" className="text-3xs text-black font-bold ps-1">
                            À venir
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="border-b pb-2 border-black">
                        <DynamicHtmlTag
                          type="div"
                          className="sm:flex-col-reverse lg:flex-row flex sm:justify-center lg:justify-between bg-gray-600 px-1 lg:px-3 py-2 rounded-lg mt-2">
                          <DynamicHtmlTag type="div" className="patient-dashboard-consultations-dropdown sm:w-full lg:w-[40%] sm:mt-5 lg:mt-0">
                            <CustomButton
                              className={`px-1 py-1 font-bold text-[11px] border-0 bg-white rounded-md text-black flex gap-2 sm:m-auto items-center ${
                                isRowOpen ? "drop-icon" : ""
                              }`}
                              onClick={() => toggleRow(index, item)} // Toggle this specific row
                            >
                              Documents de la téléconsultation <CustomImage src="/images/dropdown.svg" alt="dropdown-icon" width={13} height={7} />
                            </CustomButton>
                          </DynamicHtmlTag>
                          <DynamicHtmlTag type="div" className="flex justify-between items-center lg:gap-6 custom-light-tooltip">
                            <CustomButton
                              onClick={openJoinMeetingModal}
                              className="px-2 md:px-3 py-1 text-3xs md:text-3xs border-0 bg-green-100 rounded-3xl text-white flex gap-1 md:gap-2 items-center font-semibold">
                              <CustomImage src="/images/video-icon.svg" alt="video-icon" width={12} height={7} />
                              Rejoindre
                            </CustomButton>
                            <CustomButton
                              data-tooltip-id="resume-call"
                              data-tooltip-place="bottom-start"
                              onClick={() => handleReprendre(item?.consultedPractitioner.id)}
                              data-tooltip-html={`Vous allez être redirigé vers la prise de rendez-vous avec les disponibilités du ${item?.consultedPractitioner.firstName} ${item?.consultedPractitioner.lastName}`}
                              className="px-2 md:px-3 py-1 text-3xs md:text-3xs border-0 bg-sky-700 rounded-3xl text-white flex gap-1 justify-center items-center font-semibold">
                              <CustomImage src="/images/tick-icon.svg" alt="tick-icon" width={13} height={13} />
                              Reprendre rdv
                            </CustomButton>
                            <ReactTooltip id="resume-call" place="bottom" />
                            <CustomButton
                              onClick={() => handleDeleteModal(item)}
                              className="px-2 md:px-3 py-1 text-3xs md:text-3xs border-0 bg-red-600 rounded-3xl text-white flex gap-1 md:gap-2 items-center font-semibold">
                              <CustomImage src="/images/close-icon.svg" alt="close-icon" width={13} height={13} />
                              Annuler
                            </CustomButton>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                        {isRowOpen && doclist.length == 0 ? (
                          <DynamicHtmlTag type="span" className="py-2 font-semibold text-center text-xs md:text-xs lg:text-sm block">
                            {/* <CustomImage src={VisioLogo} alt="logo" className="loader-logo mx-auto mb-2" width={500} height={200} /> */}
                            Aucun document n’a été enregistré pour ce rendez-vous.
                          </DynamicHtmlTag>
                        ) : (
                          doclist.map((doc: any, index: number) => (
                            <DynamicHtmlTag type="div" key={index}>
                              <DynamicHtmlTag type="div" className="mt-2 flex justify-between px-5 py-2 border-b border-black">
                                <DynamicHtmlTag type="div">
                                  <DynamicHtmlTag type="p" className="text-3xs font-semibold">
                                    {doc.name || "Radio du genou.pdf"}
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                                <DynamicHtmlTag type="div" className="flex gap-4">
                                  <CustomButton type="button" onClick={() => openShowPreviewModal(doc.file.url, doc?.file?.extension)}>
                                    <CustomImage src="/images/eye.svg" alt="View file" width={18} height={8} />
                                  </CustomButton>
                                  <CustomButton
                                    type="button"
                                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL}${doc.file.url}`, "_blank")}>
                                    <CustomImage src="/images/download.svg" alt="Download file" width={13} height={12} />
                                  </CustomButton>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                          ))
                        )}
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  );
                })}
              </DynamicHtmlTag>
              {modalType === "showTeleConsultationsDocument" && (
                <CustomModal
                  id="show_Image"
                  isOpen={isModalOpens && modalType === "showTeleConsultationsDocument"}
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
                        ) : pdfName === "application/msword" ||
                          pdfName === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
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
            </>
          )}
          {/* First Content Row End  */}
          <DynamicHtmlTag
            type="div"
            className="bg-white flex flex-row-reverse lg:flex-row justify-center lg:justify-between absolute mt-14 lg:mt-0 bottom-0 left-0 right-0 items-center mx-2 md:mx-3 border-t-slate-100 border-t-[1px] px-0 md:px-4 xl:px-5 pt-1 pb-2">
            <DynamicHtmlTag type="div" className="flex items-center justify-end lg:w-7/12">
              <Pagination
                currentPage={currentPage}
                pageCount={totalPages}
                onPageChange={handlePageChange}
                pageClassName="inline-block px-3 py-1 border border-blue rounded-full mx-1 text-blue w-8 h-8 flex items-center justify-center"
                activeClassName="bg-primary text-white border-primary"
                previousClassName="text-slate-300 py-2 px-3 xl:px-4"
                nextClassName="text-slate-300 py-2 px-3 xl:px-4"
                disabledClassName="opacity-50 cursor-not-allowed pointer-events-none"
                breakLabel={"...."}
                breakClassName="inline-block px-3 py-1 border rounded-full mx-1"
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
              />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="span" className="text-blue text-xs text-right font-semibold lg:w-5/12 absolute right-6 lg:right-0 lg:relative">
              {/* 1 sur 1 */}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}

      {/* Empty Screen Without Content */}
      <DynamicHtmlTag type="div" className="empty-consultation-content h-full hidden">
        <UpcomingConsultationsEmpty />
      </DynamicHtmlTag>
      <DeleteTeleconsultationsModal
        onConfirm={() => {
          if (listDelete !== undefined) {
            deleteTeleconsultation(listDelete); // Ensure listDelete is defined
          }
        }}
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
      />
      {/* Join Meeting Modal Start */}
      <JoinMeetingModal isOpen={isJoinModalOpen} onClose={closeJoinMeetingModal} />
      {/* Join Meeting Modal End */}
    </DynamicHtmlTag>
  );
};

export default UpcomingConsultations;
