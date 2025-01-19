"use client";
import { CustomImage, CustomInput, DynamicHtmlTag, Pagination } from "@/components";
import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaRegCalendarDays } from "react-icons/fa6";

const PractitionerRefferingPhysician = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
                  <th className="py-1 xl:py-2 px-2 text-center font-medium text-slate-100">Accepter</th>
                  <th className="py-1 xl:py-2 px-2 text-center font-medium text-slate-100">Refuser</th>
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
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">20 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">7</td>
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
                      className="bg-green-200 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Accepter
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-red-100 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Refuser
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/parient-2.svg" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Jade Fageau</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">76 ans</td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">13</td>
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
                      className="bg-green-200 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Accepter
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-red-100 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Refuser
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
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">41 ans</td>
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
                      className="bg-green-200 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Accepter
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-red-100 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Refuser
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
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">33 ans</td>
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
                      className="bg-green-200 bg-opacity-30 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Acceptee
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="text-red-100 opacity-65 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-center mx-auto">
                      Refusee
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/parient-2.svg" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Dennis Louise</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">81 ans</td>
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
                      className="bg-green-200 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Accepter
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-red-100 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Refuser
                    </DynamicHtmlTag>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Ambre Dupont</DynamicHtmlTag>
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
                      className="bg-green-200 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Accepter
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-red-100 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Refuser
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
                      className="bg-green-200 bg-opacity-30 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Acceptee
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="text-red-100 opacity-65 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-center mx-auto">
                      Refusee
                    </DynamicHtmlTag>
                  </td>
                </tr>{" "}
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/profile-patient.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Noah Louis</DynamicHtmlTag>
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
                      className="bg-green-200 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Accepter
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-red-100 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Refuser
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
                      className="bg-green-200 bg-opacity-30 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Acceptee
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="text-red-100 opacity-65 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-center mx-auto">
                      Refusee
                    </DynamicHtmlTag>
                  </td>
                </tr>{" "}
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/parient-2.svg" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Arthur Noah</DynamicHtmlTag>
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
                      className="bg-green-200 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Accepter
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-red-100 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Refuser
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
                  <td className="py-1 xl:py-2 px-2 text-center w-1/12 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">26 ans</td>
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
                      className="text-green-100 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-center mx-auto">
                      Acceptee
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-red-50 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Refusee
                    </DynamicHtmlTag>
                  </td>
                </tr>{" "}
                <tr className="border-b border-slate-100">
                  <td className="py-1 xl:py-2 px-2 text-left w-2/12">
                    <DynamicHtmlTag type="div" className="w-full flex items-center gap-1 text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs">
                      <CustomImage src="/images/patient-boy.png" alt="profile-patient" width={25} height={25} className="rounded-full w-6 h-6" />
                      <DynamicHtmlTag type="span">Patrick Lucas</DynamicHtmlTag>
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
                      className="bg-green-200 p-1 px-5 cursor-pointer rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Accepter
                    </DynamicHtmlTag>
                  </td>
                  <td className="py-1 xl:py-2 px-2 text-center text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold">
                    <DynamicHtmlTag
                      type="span"
                      className="bg-red-100 p-1 px-5 rounded-xl w-fit block text-3xs lg:text-[.4rem] xl:text-2xs 2xl:text-xs font-semibold text-white text-center mx-auto">
                      Refuser
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
    </DynamicHtmlTag>
  );
};

export default PractitionerRefferingPhysician;
