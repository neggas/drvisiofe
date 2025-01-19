"use client";
import React, { useCallback, useState } from "react";
import {
  CustomButton,
  CustomImage,
  DeleteTeleconsultationsModal,
  DynamicHtmlTag,
  HeadingTag,
  Pagination,
  TeleconsultationRequestsEmpty,
} from "@/components";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
// import { IoCloseSharp } from "react-icons/io5";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import { getteleconsultationpatientApi, PatientTeleconsultationsNearbyResponse } from "@/utility";
import { useSelector } from "react-redux";
import { selectPatientDetailsData } from "@/store/reducers/patientDetailsSlice";
const AllergiesList = [
  { value: "Ventoline", label: "Ventoline" },
  { value: "High Ventoline", label: "High Ventoline" },
];

const itemsPerPage = 10;
const TeleconsultationRequests = () => {
  const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [editModalOpen, editIsModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const [Teleconsultations, setTeleconsultations] = useState<PatientTeleconsultationsNearbyResponse[]>([]);
  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected);
  };
  // EditModalBox
  const openEditModal = () => {
    editIsModalOpen(true);
    setModalMode("edit");
  };
  const openAddtModal = () => {
    editIsModalOpen(true);
    setModalMode("add");
  };
  const closeEditModal = () => editIsModalOpen(false);

  // DeleteModalBox
  const openDeleteModal = () => setIsModalOpen(true);
  const closeDeleteModal = () => setIsModalOpen(false);

  const fetchteleconsultationList = useCallback(async () => {
    try {
      const data = await getteleconsultationpatientApi(fetchPatientData?.id, currentPage, itemsPerPage);
      setTotalPages(data?.data?.totalPage || 0);
      setTotalItems(data?.data?.totalCount || 0);
      setTeleconsultations(data?.data?.results || []);
    } catch (error) {}
  }, [currentPage, fetchPatientData]);

  return (
    <DynamicHtmlTag type="div" className="bg-white rounded-xl h-auto lg:h-[92%] lg:overflow-visible">
      <DynamicHtmlTag type="div" className="bg-gradient-to-t from-[#49BBBC] to-[#9DCB8C] rounded-t-xl pt-0">
        <HeadingTag type="h3" className="font-semibold text-2xs xl:text-sm text-white text-center py-1 px-3">
          Mes demandes de téléconsultation
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="px-3 lg:px-4 h-[96%] xl:h-full overflow-hidden">
        <DynamicHtmlTag type="div" className="teleconsult-table 2xl:h-[30rem] overflow-y-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-2 px-1 text-left font-medium text-slate-100 text-2xs">Médecin</th>
                <th className="py-2 px-1 text-left font-medium text-slate-100 text-2xs">Bénéficiare</th>
                <th className="py-2 px-1 text-center lg:text-left font-medium text-slate-100 text-2xs hidden md:table-cell">Date</th>
                <th className="py-2 px-1 text-left font-medium text-slate-100 text-2xs hidden md:table-cell">Créneau horaire</th>
                <th className="py-2 px-1 text-left font-medium text-slate-100 text-2xs w-1/6 hidden md:table-cell">Statut</th>
              </tr>
            </thead>
            <tbody>
              {/* First Doctor Row Start  */}
              <tr className="cursor-pointer text-2xs font-bold border-0 lg:border-1 lg:border-b lg:border-slate-100">
                <td className="py-1 md:py-3 px-1">
                  <DynamicHtmlTag type="div" className="flex items-center gap-2">
                    <CustomImage src="/images/doctor-img.svg" alt="doctor-img" width={25} height={25} />
                    <DynamicHtmlTag type="span" className="text-2xs text-black font-semibold">
                      Dr Franck Dupont
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </td>
                <td className="py-1 md:py-3 px-1 text-2xs font-semibold">
                  <DynamicHtmlTag type="span"> Charlotte </DynamicHtmlTag>
                </td>
                <td className="py-3 px-1 text-center lg:text-left font-bold hidden md:table-cell">
                  <DynamicHtmlTag type="span">24/09/2024</DynamicHtmlTag>
                </td>
                <td className="py-3 px-1 hidden md:table-cell text-2xs font-semibold">
                  <DynamicHtmlTag type="span">19h00 - 21h00</DynamicHtmlTag>
                </td>
                <td className="py-3 px-1 hidden md:table-cell text-[#F39200] text-2xs font-medium">
                  <DynamicHtmlTag type="span">Demande transmise</DynamicHtmlTag>
                </td>
              </tr>
              <tr className="md:hidden border-1 border-b border-slate-100">
                <td colSpan={4} className="pb-2">
                  <DynamicHtmlTag type="div" className="text-2xs font-bold w-full flex gap-4 mb-1">
                    <DynamicHtmlTag type="div" className="px-1 flex items-center gap-2 w-2/6">
                      <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                        Date
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="span" className="font-semibold">
                        04/10/2024
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="px-1 flex items-center justify-end gap-2 w-4/6">
                      <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                        Créneau horaire
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="span" className="font-semibold">
                        19h00 - 21h00
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="px-1 text-2xs font-bold flex items-center justify-start gap-2">
                    <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                      Statut
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="span" className="font-semibold text-[#F39200]">
                      Demande transmise
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </td>
              </tr>
              <tr className="hidden border-1 border-b border-slate-100 ">
                <td colSpan={5} className="pb-2">
                  <DynamicHtmlTag type="div" className="bg-gray-400 bg-opacity-40 rounded-lg text-xs font-bold w-full block px-3 gap-4">
                    <DynamicHtmlTag type="div" className="flex items-center justify-center py-2 sm:gap-3 md:gap-2 lg:gap-6 md:w-9/12 md:mx-auto">
                      <DynamicHtmlTag type="span" className="text-2xs w-4/12 md:w-6/12">
                        Votre demande a été acceptée pour 19h30
                      </DynamicHtmlTag>
                      <CustomButton className="px-1 py-1 text-2xs border-0 bg-green-100 rounded-3xl text-white flex gap-2 items-center justify-center w-4/12 md:w-3/12">
                        <CustomImage src="/images/video-icon.svg" alt="video-icon" width={12} height={7} />
                        <DynamicHtmlTag type="span">Rejoindre</DynamicHtmlTag>
                      </CustomButton>
                      <CustomButton className="px-1 py-1 text-2xs border-0 bg-red-600 rounded-3xl text-white flex gap-2 items-center justify-center w-4/12 md:w-3/12">
                        <CustomImage src="/images/close-icon.svg" alt="close-icon" width={13} height={13} />
                        <DynamicHtmlTag type="span">Annuler</DynamicHtmlTag>
                      </CustomButton>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </td>
              </tr>
              {/* First Doctor Row End  */}

              {/* Second Doctor Row Start  */}
              <tr className="cursor-pointer text-2xs font-bold">
                <td className="py-1 md:py-3 px-1">
                  <DynamicHtmlTag type="div" className="flex items-center gap-2">
                    <CustomImage src="/images/doctor-img.svg" alt="doctor-img" width={25} height={25} />
                    <DynamicHtmlTag type="span" className="text-2xs text-black font-semibold">
                      Dr Franck Dupont
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </td>
                <td className="py-1 md:py-3 px-1 text-2xs font-semibold">
                  <DynamicHtmlTag type="span"> Charlotte </DynamicHtmlTag>
                </td>
                <td className="py-3 px-1 text-center lg:text-left font-bold hidden md:table-cell">
                  <DynamicHtmlTag type="span">24/09/2024</DynamicHtmlTag>
                </td>
                <td className="py-3 px-1 hidden md:table-cell text-2xs font-semibold">
                  <DynamicHtmlTag type="span">19h00 - 21h00</DynamicHtmlTag>
                </td>
                <td className="py-3 px-1 hidden md:table-cell text-[#68A02F] text-2xs font-medium">
                  <DynamicHtmlTag type="span">Demande transmise</DynamicHtmlTag>
                </td>
              </tr>
              <tr className="md:hidden">
                <td colSpan={4} className="pb-2">
                  <DynamicHtmlTag type="div" className="text-2xs font-bold w-full flex gap-4 mb-1">
                    <DynamicHtmlTag type="div" className="px-1 flex items-center gap-2 w-2/6">
                      <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                        Date
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="span" className="font-semibold">
                        04/10/2024
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="px-1 flex items-center justify-end gap-2 w-4/6">
                      <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                        Créneau horaire
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="span" className="font-semibold">
                        19h00 - 21h00
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="px-1 text-2xs font-bold flex items-center justify-start gap-2">
                    <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                      Statut
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="span" className="font-semibold text-[#68A02F]">
                      Demande transmise
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </td>
              </tr>
              <tr className="border-1 border-b border-slate-100 ">
                <td colSpan={5} className="pb-2">
                  <DynamicHtmlTag type="div" className="bg-gray-400 bg-opacity-40 rounded-lg text-xs font-bold w-full block px-3 gap-4">
                    <DynamicHtmlTag type="div" className="flex items-center justify-center py-2 sm:gap-3 md:gap-2 lg:gap-6 md:w-9/12 md:mx-auto">
                      <DynamicHtmlTag type="span" className="text-3xs md:text-2xs leading-relaxed w-4/12 md:w-6/12">
                        Votre demande a été acceptée pour 19h30
                      </DynamicHtmlTag>
                      <CustomButton className="px-1 py-1 text-3xs md:text-2xs border-0 bg-green-100 rounded-3xl text-white flex gap-1 md:gap-2 items-center justify-center w-4/12 md:w-3/12">
                        <IoIosCheckmarkCircleOutline className="w-4 h-4" />
                        <DynamicHtmlTag type="span">Confirmer</DynamicHtmlTag>
                      </CustomButton>
                      <CustomButton
                        onClick={openDeleteModal}
                        className="px-1 py-1 text-3xs md:text-2xs border-0 bg-red-600 rounded-3xl text-white flex gap-1 md:gap-2 items-center justify-center w-4/12 md:w-3/12">
                        <CustomImage src="/images/close-icon.svg" alt="close-icon" width={13} height={13} />
                        <DynamicHtmlTag type="span">Annuler</DynamicHtmlTag>
                      </CustomButton>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </td>
              </tr>
              {/* Second Doctor Row End  */}
            </tbody>
          </table>
        </DynamicHtmlTag>
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
            {/* 1 sur 4 */}
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {/* Delete Modal Start */}
        <DeleteTeleconsultationsModal isOpen={isModalOpen} onClose={closeDeleteModal} />
        {/* Delete Modal End */}
      </DynamicHtmlTag>
      {/* Empty Screen Without Content */}
      <DynamicHtmlTag type="div" className="empty-consultation-content h-full hidden">
        <TeleconsultationRequestsEmpty />
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default TeleconsultationRequests;
