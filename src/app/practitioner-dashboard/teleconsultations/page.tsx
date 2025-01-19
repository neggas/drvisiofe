"use client";
import { CustomButton, CustomDatePicker, CustomImage, CustomInput, DynamicHtmlTag, HeadingTag, Pagination } from "@/components";
import React, { useState } from "react";
import page from "../page";
import { IoSearchSharp } from "react-icons/io5";
import { FaRegCalendarDays } from "react-icons/fa6";

const Teleconsultations = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [IsdateTabButtonActive, setIsdateTabButtonActive] = useState(true);
  const [IsnomTabButtonActive, setIsnomTabButtonActive] = useState(false);
  const dateTabButton = () => {
    setIsdateTabButtonActive(true);
    setIsnomTabButtonActive(false);
  };
  const nomTabButton = () => {
    setIsdateTabButtonActive(false);
    setIsnomTabButtonActive(true);
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleDateOptionChange = (date: any) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: any) => {
    setEndDate(date);
  };

  return (
    <DynamicHtmlTag type="div" className="h-[96%] rounded-md overflow-hidden bg-white relative m-[1%]">
      <DynamicHtmlTag type="div" className="custom-gradient-green mb-2 xl:mb-2 p-1 hidden lg:block">
        <HeadingTag type="h4" className="text-xs 2xl:text-sm 2xl:leading-relaxed leading-none font-semibold text-white lg:text-center capitalize">
          téléconsultations passées
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="p-[1%] w-full h-full">
        <DynamicHtmlTag type="div" className="w-full h-[98%]">
          <DynamicHtmlTag type="div" className="py-2 w-full mb-3 flex justify-between items-center h-[8%] overflow-hidden">
            <DynamicHtmlTag type="div" className="bg-gray-100 p-2 lg:p-1 xl:p-2 w-1/4 md:w-1/6 xl:w-1/5 flex gap-2 rounded-full items-center">
              <IoSearchSharp />
              <CustomInput
                type="text"
                placeholder="Recherche"
                className="w-[90%] bg-transparent text-black text-2xs lg:text-3xs xl:text-2xs outline-none"
              />
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex items-center gap-4 teleconsultations-date-picker pe-9">
              <DynamicHtmlTag
                type="div"
                className="bg-gray-300 w-fit rounded-lg shadow-sm text-xs lg:text-3xs xl:text-xs flex justify-between items-center xl:me-24 2xl:me-52">
                <CustomButton
                  onClick={dateTabButton}
                  type="button"
                  className={`capitalize px-5 py-2 md:py-0.5 xl:py-1 2xl:py-2 rounded-lg ${IsdateTabButtonActive ? "custom-gradient-green text-white" : "text-black"}`}>
                  date
                </CustomButton>
                <CustomButton
                  onClick={nomTabButton}
                  type="button"
                  className={`capitalize px-5 py-2 md:py-0.5 xl:py-1 2xl:py-2 rounded-lg ${IsnomTabButtonActive ? "custom-gradient-green text-white" : "text-black"}`}>
                  Nom
                </CustomButton>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex items-center gap-2">
                <DynamicHtmlTag type="span" className="text-xs lg:text-3xs xl:text-xs ">
                  du
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="border border-gray-400 w-full p-1 flex items-center justify-between rounded-md gap-2">
                  <FaRegCalendarDays className="w-3 h-3 xl:w-4 xl:h-4" />
                  <DynamicHtmlTag type="span" className="form-date-picker date-picker text-xs lg:text-3xs xl:text-xs xl:leading-none">
                    <CustomDatePicker
                      selected={startDate}
                      onChange={(date: any) => handleDateOptionChange(date)}
                      dateFormat={"dd/MM/yyyy"}
                      placeholderText="jj/mm/aaaa"
                      className="text-xs lg:text-3xs xl:text-xs"
                    />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex items-center gap-2">
                <DynamicHtmlTag type="span" className="text-xs lg:text-3xs xl:text-xs">
                  du
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="border border-gray-400 w-full p-1 flex items-center justify-between rounded-md gap-2">
                  <FaRegCalendarDays className="w-3 h-3 xl:w-4 xl:h-4" />
                  <DynamicHtmlTag type="span" className="form-date-picker date-picker text-xs lg:text-3xs xl:text-xs xl:leading-none">
                    <CustomDatePicker
                      selected={endDate}
                      onChange={(date: any) => handleEndDateChange(date)}
                      dateFormat={"dd/MM/yyyy"}
                      placeholderText="jj/mm/aaaa"
                      className="text-xs lg:text-3xs xl:text-xs"
                    />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="max-h-table overflow-auto min-w-full h-[85%]">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="sticky top-0 z-10 text-2xs md:text-3xs xl:text-2xs border-b border-slate-100 bg-white">
                  <th className="py-2 px-2 text-left font-medium text-slate-100">Date et heure</th>
                  <th className="py-2 px-2 text-left font-medium text-slate-100">Patient</th>
                  <th className="py-2 px-2 text-center lg:text-left font-medium text-slate-100">Âge</th>
                  <th className="py-2 px-2 text-left font-medium text-slate-100">Motif</th>
                  <th className="py-2 px-2 text-center font-medium text-slate-100">Dossier patient</th>
                  <th className="py-2 px-2 text-left font-medium text-slate-100">Statut</th>
                </tr>
              </thead>
              <tbody className="overflow-y-scroll h-full">
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-2 text-left w-auto text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30/09/2024 - 19h45</td>
                  <td className="py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span"> Quentin Fageau</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-2 px-2 text-left w-4-12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                    Renouvellement de traitement / Mal-être,anxiété / Problème de peau
                  </td>
                  <td className="py-2 px-2 text-left w-2/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-2-12">
                    <DynamicHtmlTag type="div" className="flex w-full gap-2 justify-between items-center">
                      <DynamicHtmlTag type="span" className="text-red-500 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                        En attente de clôture
                      </DynamicHtmlTag>
                      <DynamicHtmlTag
                        type="span"
                        className="w-fit bg-green-100 px-4 py-1 rounded-xl text-3xs lg:text-[.4rem] xl:text-2xs cursor-pointer 2xl:text-xs font-semibold text-white text-center flex items-center">
                        Ouvrir
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-2 text-left w-auto text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30/09/2024 - 19h45</td>
                  <td className="py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Isabel Wheeler</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-2 px-2 text-left w-4-12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                    Renouvellement de traitement / Mal-être,anxiété / Problème de peau
                  </td>
                  <td className="py-2 px-2 text-left w-2/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-2-12">
                    <DynamicHtmlTag type="div" className="flex w-full gap-2 justify-between items-center">
                      <DynamicHtmlTag type="span" className="text-red-500 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                        En attente de clôture
                      </DynamicHtmlTag>
                      <DynamicHtmlTag
                        type="span"
                        className="w-fit bg-green-100 px-4 py-1 rounded-xl text-3xs lg:text-[.4rem] xl:text-2xs cursor-pointer 2xl:text-xs font-semibold text-white text-center flex items-center">
                        Ouvrir
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-2 text-left w-auto text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">27/09/2024 - 18h15</td>
                  <td className="py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Dennis Mendez</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-2 px-2 text-left w-4-12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                    Renouvellement de traitement / Mal-être,anxiété / Problème de peau
                  </td>
                  <td className="py-2 px-2 text-left w-2/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-2-12">
                    <DynamicHtmlTag type="div" className="flex w-full gap-2 justify-between items-center">
                      <DynamicHtmlTag type="span" className="text-red-500 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                        En attente de clôture
                      </DynamicHtmlTag>
                      <DynamicHtmlTag
                        type="span"
                        className="w-fit bg-green-100 px-4 py-1 rounded-xl text-3xs lg:text-[.4rem] xl:text-2xs cursor-pointer 2xl:text-xs font-semibold text-white text-center flex items-center">
                        Ouvrir
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-2 text-left w-auto text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30/09/2024 - 19h45</td>
                  <td className="py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span"> Quentin Fageau</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-2 px-2 text-left w-4-12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                    Renouvellement de traitement / Mal-être,anxiété / Problème de peau
                  </td>
                  <td className="py-2 px-2 text-left w-2/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-2-12">
                    <DynamicHtmlTag type="div" className="flex w-full gap-2 justify-between items-center">
                      <DynamicHtmlTag type="span" className="text-red-500 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                        En attente de clôture
                      </DynamicHtmlTag>
                      <DynamicHtmlTag
                        type="span"
                        className="w-fit bg-green-100 px-4 py-1 rounded-xl text-3xs lg:text-[.4rem] xl:text-2xs cursor-pointer 2xl:text-xs font-semibold text-white text-center flex items-center">
                        Ouvrir
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-2 text-left w-auto text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30/09/2024 - 19h45</td>
                  <td className="py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Dennis Mendez</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">34 ans</td>
                  <td className="py-2 px-2 text-left w-4-12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                    Renouvellement de traitement / Mal-être,anxiété / Problème de peau
                  </td>
                  <td className="py-2 px-2 text-left w-2/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-2-12">
                    <DynamicHtmlTag type="div" className="flex w-full gap-2 justify-between items-center">
                      <DynamicHtmlTag type="span" className="text-red-500 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                        En attente de clôture
                      </DynamicHtmlTag>
                      <DynamicHtmlTag
                        type="span"
                        className="w-fit bg-green-100 px-4 py-1 rounded-xl text-3xs lg:text-[.4rem] xl:text-2xs cursor-pointer 2xl:text-xs font-semibold text-white text-center flex items-center">
                        Ouvrir
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-2 text-left w-auto text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">12/07/2024 - 17h45</td>
                  <td className="py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Dennis Mendez</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">22 ans</td>
                  <td className="py-2 px-2 text-left w-4-12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">Troubles urinaires</td>
                  <td className="py-2 px-2 text-left w-2/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-2-12">
                    <DynamicHtmlTag type="div" className="flex w-full gap-2 justify-between items-center">
                      <DynamicHtmlTag type="span" className="text-red-500 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                        En attente de clôture
                      </DynamicHtmlTag>
                      <DynamicHtmlTag
                        type="span"
                        className="w-fit bg-green-100 px-4 py-1 rounded-xl text-3xs lg:text-[.4rem] xl:text-2xs cursor-pointer 2xl:text-xs font-semibold text-white text-center flex items-center">
                        Ouvrir
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-2 text-left w-auto text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">27/09/2024 - 19h00</td>
                  <td className="py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span"> Quentin Fageau</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">45 ans</td>
                  <td className="py-2 px-2 text-left w-4-12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">Rhume / Fièvre</td>
                  <td className="py-2 px-2 text-left w-2/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-2-12">
                    <DynamicHtmlTag type="div" className="flex w-full gap-2 justify-between items-center">
                      <DynamicHtmlTag type="span" className="text-red-500 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                        En attente de clôture
                      </DynamicHtmlTag>
                      <DynamicHtmlTag
                        type="span"
                        className="w-fit bg-green-100 px-4 py-1 rounded-xl text-3xs lg:text-[.4rem] xl:text-2xs cursor-pointer 2xl:text-xs font-semibold text-white text-center flex items-center">
                        Ouvrir
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-2 text-left w-auto text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30/09/2024 - 19h45</td>
                  <td className="py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Dennis Mendez</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">62 ans</td>
                  <td className="py-2 px-2 text-left w-4-12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                    Renouvellement de traitement / Consultation
                  </td>
                  <td className="py-2 px-2 text-left w-2/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-2-12">
                    <DynamicHtmlTag type="div" className="flex w-full gap-2 justify-between items-center">
                      <DynamicHtmlTag type="span" className="text-green-500 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                        Clôturée
                      </DynamicHtmlTag>
                      <DynamicHtmlTag
                        type="span"
                        className="w-fit bg-green-100 px-4 py-1 rounded-xl text-3xs lg:text-[.4rem] xl:text-2xs cursor-pointer 2xl:text-xs font-semibold text-white text-center flex items-center">
                        Ouvrir
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                </tr>

                <tr className="border-b border-slate-100">
                  <td className="py-2 px-2 text-left w-auto text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30/09/2024 - 19h45</td>
                  <td className="py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span"> Quentin Fageau</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">30 ans</td>
                  <td className="py-2 px-2 text-left w-4-12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">Problème de peau</td>
                  <td className="py-2 px-2 text-left w-2/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-orange-400 p-1 px-3 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Dossier patient
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-2 px-2 text-left w-2-12">
                    <DynamicHtmlTag type="div" className="flex w-full gap-2 justify-between items-center">
                      <DynamicHtmlTag type="span" className="text-green-500 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                        Clôturée
                      </DynamicHtmlTag>
                      <DynamicHtmlTag
                        type="span"
                        className="w-fit bg-green-100 px-4 py-1 rounded-xl text-3xs lg:text-[.4rem] xl:text-2xs cursor-pointer 2xl:text-xs font-semibold text-white text-center flex items-center">
                        Ouvrir
                      </DynamicHtmlTag>
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
        className="bg-white flex flex-row-reverse lg:flex-row justify-center lg:justify-between relative lg:absolute mt-14 lg:mt-0 bottom-0 left-0 right-0 items-center mx-2 px-4 border-t-slate-100 border-t-[1px]">
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
    </DynamicHtmlTag>
  );
};

export default Teleconsultations;
