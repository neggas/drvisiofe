"use client";
import {
  CustomButton,
  CustomDatePicker,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomTextarea,
  DynamicHtmlTag,
  HeadingTag,
  Pagination,
} from "@/components";
import React, { useState } from "react";
import { IoCloseSharp, IoSearchSharp } from "react-icons/io5";
import { FaRegCalendarDays } from "react-icons/fa6";

const PractitionerMyPatients = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const openAppointmentModal = () => setIsAppointmentModalOpen(true);
  const closeAppointmentModal = () => setIsAppointmentModalOpen(false);

  const openSendMessageModal = () => setIsSendMessageModalOpen(true);
  const closeSendMessageModal = () => setIsSendMessageModalOpen(false);

  const handleCheckboxChange = (option: string) => {
    setSelectedOption(option);
  };
  const handleToggleRow = (rowId: number) => {
    setExpandedRow(prevExpandedRow => (prevExpandedRow === rowId ? null : rowId));
  };

  const handleDateOptionChange = (date: any) => {
    setStartDate(date);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected);
  };
  return (
    <DynamicHtmlTag type="div" className="h-full rounded-md overflow-hidden bg-white relative">
      <DynamicHtmlTag type="div" className="p-[1%] w-full h-full">
        <DynamicHtmlTag type="div" className="w-full h-[98%]">
          <DynamicHtmlTag type="div" className="py-2 w-full mb-3 flex justify-between items-center">
            <DynamicHtmlTag type="div" className="bg-gray-100 p-1 xl:p-2 w-1/5 flex gap-2 rounded-full items-center">
              <IoSearchSharp className="text-xs" />
              <CustomInput
                type="text"
                placeholder="Recherche"
                className="w-[90%] bg-transparent text-gray-600 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs outline-none"
              />
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="max-h-table overflow-auto min-w-full h-[85%]">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="sticky top-0 z-10 text-2xs md:text-3xs xl:text-2xs border-b border-slate-100 bg-white">
                  <th className="py-1 xl:py-2 px-2 text-left font-medium text-slate-100">Patient</th>
                  <th className="py-1 xl:py-2 px-2 text-center font-medium text-slate-100">Âge</th>
                  <th className="py-1 xl:py-2 px-2 text-center font-medium text-slate-100">Téléconsultations</th>
                  <th className="py-1 xl:py-2 px-2 text-center font-medium text-slate-100">Dossier patient</th>
                  <th className="py-1 xl:py-2 px-2 text-center font-medium text-slate-100">Proposer un rendez-vous</th>
                  <th className="py-1 xl:py-2 px-2 text-center font-medium text-slate-100 w-fit">Message</th>
                </tr>
              </thead>
              <tbody className="overflow-y-scroll h-full">
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/patient-boy.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span"> Quentin Fageau</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">1</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/parient-2.svg" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Fageau Quentin</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">36 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">3</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span"> Quentin Fageau</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">54 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">4</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Isabel Wheeler</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">43 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">1</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/parient-2.svg" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Dennis Mendez</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">61 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">1</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Patrick Dupont</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">2</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Patrick Dupont</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">2</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>{" "}
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Patrick Dupont</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">2</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>{" "}
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/patient-boy.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Patrick Dupont</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">2</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>{" "}
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/parient-2.svg" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Patrick Dupont</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">2</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>{" "}
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Patrick Dupont</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">2</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>{" "}
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/patient-boy.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Patrick Dupont</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">2</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openAppointmentModal}
                      className="bg-customBlue p-1 px-3 rounded-xl w-fit block cursor-pointer text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Proposer un rendez-vous
                    </DynamicHtmlTag>
                  </td>
                  <td className="w-fit py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      onClick={openSendMessageModal}
                      className="bg-black p-1 px-3 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Envoyer un message
                    </DynamicHtmlTag>
                  </td>
                </tr>
              </tbody>
            </table>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag
        type="div"
        className="flex flex-row-reverse lg:flex-row justify-center lg:justify-between relative lg:absolute mt-14 lg:mt-0 bottom-0 left-0 right-0 items-center mx-2 md:mx-4 border-t-slate-100 border-t-[1px]">
        <DynamicHtmlTag type="div" className="flex items-center justify-end lg:w-6/12">
          <Pagination
            currentPage={page}
            pageCount={totalPages}
            pageClassName="inline-block px-3 py-1 border border-blue rounded-full mx-1 text-blue"
            activeClassName="bg-primary text-white border-primary"
            previousClassName="text-[#CCCACA] py-2 px-3 xl:px-4 text-2xs xl:text-xs"
            nextClassName="text-[#CCCACA] py-2 px-3 xl:px-4 text-2xs xl:text-xs"
            disabledClassName="opacity-50 cursor-not-allowed pointer-events-none"
            breakLabel={"..."}
            breakClassName="inline-block px-3 py-1 border rounded-full mx-1 bg-red-100"
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
          />
        </DynamicHtmlTag>
        <DynamicHtmlTag
          type="span"
          className="text-blue text-2xs lg:text-[.4rem] xl:text-2xs text-right font-semibold lg:w-5/12 absolute right-0 lg:relative">
          1 sur 1
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      {/* Appointment Modal Box Start */}
      <CustomModal isOpen={isAppointmentModalOpen} onClose={closeAppointmentModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 py-2 lg:py-4 px-2 lg:px-6">
            <DynamicHtmlTag type="div" className="flex flex-col">
              <DynamicHtmlTag type="div" className="flex items-center justify-between gap-2 mb-3">
                <HeadingTag type="h2" className="text-blue font-bold text-xs md:text-sm xl:text-lg">
                  Proposer un rendez-vous
                </HeadingTag>
                <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={closeAppointmentModal}>
                  <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
                </CustomButton>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div">
                <DynamicHtmlTag type="div" className="mt-2 text-center">
                  <CustomLabel className="text-sm md:text-xs xl:text-sm font-semibold text-center text-customBlue">
                    Bénéficiaire : Quentin Fageau
                  </CustomLabel>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex justify-between items-center flex-col lg:flex-row">
                  <DynamicHtmlTag type="div" className="w-full lg:w-1/2">
                    <DynamicHtmlTag type="div" className="flex items-center pb-3">
                      <DynamicHtmlTag type="div" className="cstm-form-group flex items-center  justify-center">
                        <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                          <CustomInput className="" type="checkbox" id="affection-non" />
                          <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="affection-non">
                            <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                          </CustomLabel>
                        </DynamicHtmlTag>
                        <CustomLabel htmlFor="affection" className="ps-2 text-2xs xl:text-xs font-semibold cstm-lable">
                          Choisir une date
                        </CustomLabel>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag
                      type="div"
                      className="form-date-picker date-picker w-full flex items-center justify-center lg:justify-start outline-none [&&]:text-2xs lg:ps-5">
                      <DynamicHtmlTag type="span" className="text-xs">
                        <CustomDatePicker
                          selected={startDate}
                          onChange={(date: any) => handleDateOptionChange(date)}
                          dateFormat={"dd/MM/yyyy"}
                          inline
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="flex items-center justify-center lg:justify-start lg:ps-11 gap-2">
                      <DynamicHtmlTag type="div" className="flex items-center gap-1 text-3xs">
                        <DynamicHtmlTag type="span" className="p-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full" /> date du jour
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="flex items-center gap-1 text-3xs">
                        <DynamicHtmlTag type="span" className="p-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full" /> date selectionnée
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex flex-row gap-x-3 items-center lg:block w-full lg:w-1/2 lg:ps-6 lg:pe-11 mt-4 lg:mt-0">
                    <DynamicHtmlTag type="div">
                      <CustomLabel className="text-2xs xl:text-xs font-semibold cstm-lable block">La date s’affichera ici</CustomLabel>
                      <CustomInput
                        type="text"
                        placeholder="Lundi 05 août"
                        className="w-full block my-1 bg-red-500 text-white outline-none text-center text-xs xl:text-sm font-semibold rounded-2xl py-1 xl:py-2"
                        name=""
                        value={"Lundi 05 août"}
                      />
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div">
                      <CustomLabel className="text-2xs xl:text-xs font-semibold cstm-lable lg:mt-8 block">Choisir un créneau horaire</CustomLabel>
                      <CustomInput
                        type="text"
                        placeholder=""
                        className="w-full block my-1 text-black outline-none text-left text-xs xl:text-sm font-semibold rounded-2xl py-1 xl:py-2 px-2 border border-gray-200"
                        name=""
                        value={"8h00 à 10h00"}
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="mt-5 gap-3 w-full">
                  <DynamicHtmlTag type="div" className="flex items-center gap-4">
                    <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                      <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                        <CustomInput className="" type="checkbox" id="ne-sais" />
                        <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="ne-sais">
                          <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                        </CustomLabel>
                      </DynamicHtmlTag>
                      <CustomLabel htmlFor="affection" className="ps-2 text-2xs sm:text-xs font-semibold cstm-lable">
                        Demander au patient de prendre rendez-vous sur votre agenda
                      </CustomLabel>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex items-start gap-2 mt-1 flex-col lg:flex-row">
                    <CustomLabel htmlFor="affection" className="ps-6 mt-1 text-2xs sm:text-xs font-semibold cstm-lable">
                      Vous souhaitez revoir le patient d’ici
                    </CustomLabel>
                    <DynamicHtmlTag type="div" className="flex flex-row items-center justify-between xl:block">
                      <DynamicHtmlTag type="div" className="flex items-center gap-1 mt-1">
                        <CustomInput
                          type="number"
                          placeholder=""
                          className="w-[50%] xl:w-[80%] block text-black outline-none text-left text-2xs xl:text-sm font-semibold rounded-2xl py-1 px-2 border border-gray-200"
                          name=""
                          value={"2"}
                        />
                        <DynamicHtmlTag type="span" className="text-2xs xl:text-xs w-[45%] xl:w-[18%] font-semibold">
                          Jours
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="flex items-center gap-1 mt-1">
                        <CustomInput
                          type="number"
                          placeholder=""
                          className="w-[50%] xl:w-[80%] block text-black outline-none text-left text-2xs xl:text-sm font-semibold rounded-2xl py-1 px-2 border border-gray-200"
                          name=""
                          value={"0"}
                        />
                        <DynamicHtmlTag type="span" className="text-2xs xl:text-xs w-[45%] xl:w-[18%] font-semibold">
                          Semaine
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="flex items-center gap-1 mt-1">
                        <CustomInput
                          type="number"
                          placeholder=""
                          className="w-[50%] xl:w-[80%] block text-black outline-none text-left text-2xs xl:text-sm font-semibold rounded-2xl py-1 px-2 border border-gray-200"
                          name=""
                          value={"0"}
                        />
                        <DynamicHtmlTag type="span" className="text-2xs xl:text-xs w-[45%] xl:w-[18%] font-semibold">
                          Mois
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="py-2 px-4 border-t border-gray-200 mt-4">
                  <CustomLabel className="text-2xs sm:text-xs font-semibold cstm-lable mt-1 block">Écrire un message</CustomLabel>
                  <CustomTextarea
                    className="placeholder:text-black resize-none w-full border-2 border-gray-200 outline-none h-24 mt-2 py-1 px-2 rounded-md text-xs lg:text-sm"
                    placeholder="Message"
                  />
                </DynamicHtmlTag>
                <CustomButton
                  as="button"
                  className={`text-xs lg:text-sm cstm-btn ms-auto mt-4 flex py-2 px-1 justify-center w-2/5 max-w-32 view-more-btn rounded-full text-white font-semibold`}>
                  Valider
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>
      {/* Appointment Modal Box End */}
      {/* Send Message Modal Box Start */}
      <CustomModal isOpen={isSendMessageModalOpen} onClose={closeSendMessageModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 py-2 lg:py-4 px-2 lg:px-6">
            <DynamicHtmlTag type="div" className="flex flex-col">
              <DynamicHtmlTag type="div" className="flex items-center justify-between gap-2 mb-3">
                <HeadingTag type="h2" className="text-blue font-bold text-lg">
                  Envoyer un message
                </HeadingTag>
                <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={closeSendMessageModal}>
                  <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
                </CustomButton>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div">
                <DynamicHtmlTag type="div" className="mt-2 text-center">
                  <CustomLabel className="text-sm font-semibold text-center text-customBlue">Bénéficiaire : Quentin Fageau</CustomLabel>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="p-2">
                  <CustomLabel className="text-xs lg:text-sm font-semibold cstm-lable mt-1 block">Écrire un message</CustomLabel>
                  <CustomTextarea
                    className="placeholder:text-black resize-none w-full border-2 border-gray-200 outline-none h-64 mt-2 py-1 px-2 rounded-md text-xs lg:text-sm"
                    placeholder="Message"
                  />
                </DynamicHtmlTag>
                <CustomButton
                  as="button"
                  className={`text-xs lg:text-sm cstm-btn ms-auto mt-4 flex py-1 px-1 justify-center w-2/5 max-w-32 view-more-btn rounded-full text-white font-semibold`}>
                  Envoyer
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>
      {/* Send Message Modal Box End */}
    </DynamicHtmlTag>
  );
};

export default PractitionerMyPatients;
