"use client";
import React, { useState } from "react";
import { CustomButton, CustomImage, DynamicHtmlTag, Pagination } from "@/components";

interface Appointment {
  dateTime: string;
  doctorName: string;
  description: string;
  documents: string[];
}

const appointments: Appointment[] = [
  {
    dateTime: "28/10/2024 - 19h45",
    doctorName: "Dr Franck Dupont",
    description:
      "Renouvellement de traitement / Mal-être, anxiété / Problème de peau / J’ai une sensation de brûlure et des boutons qui sont apparus sur mon ventre.",
    documents: ["Document1.pdf", "Document2.pdf"],
  },
  {
    dateTime: "12/12/2024 - 19h30",
    doctorName: "Dr Franck Dupont",
    description: "Rhume / Fièvre",
    documents: ["Document3.pdf", "Document4.pdf"],
  },
];

const AgendaTeleconsultations = () => {
  const [openDocumentIndex, setOpenDocumentIndex] = useState<number | null>(null);

  const handleToggleDocuments = (index: number) => {
    setOpenDocumentIndex(openDocumentIndex === index ? null : index);
  };

  return (
    <DynamicHtmlTag type="div" className="bg-white rounded-xl h-auto lg:h-[92%]">
      <DynamicHtmlTag type="div" className="px-3 lg:px-4 h-full">
        {/* Table Header */}
        <DynamicHtmlTag type="div" className="flex mt-5 border-b-2 pb-2">
          <DynamicHtmlTag type="p" className="text-2xs text-slate-100 font-bold text-left w-5/12 lg:w-3/12">
            Date et heure
          </DynamicHtmlTag>
          <DynamicHtmlTag type="p" className="text-2xs text-slate-100 font-bold text-left w-4/12">
            Médecin
          </DynamicHtmlTag>
          <DynamicHtmlTag type="p" className="text-2xs text-slate-100 font-bold text-left hidden lg:block w-3/12">
            Motif
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {/* Table Rows */}
        {appointments.map((appointment, index) => (
          <DynamicHtmlTag key={index} type="div" className="mt-3 pb-0 lg:pb-2">
            <DynamicHtmlTag type="div" className="flex items-center border-b border-gray-300 pb-2">
              {/* Date and Time */}
              <DynamicHtmlTag type="div" className="text-2xs text-black font-bold w-5/12 lg:w-3/12">
                {appointment.dateTime}
              </DynamicHtmlTag>
              {/* Doctor and Image */}
              <DynamicHtmlTag type="div" className="text-2xs text-black font-bold flex items-center gap-2 w-7/12 lg:w-4/12 text-left">
                <CustomImage src="/images/doctor-img.svg" alt="doctor-img" width={33} height={33} />
                <DynamicHtmlTag type="span">{appointment.doctorName}</DynamicHtmlTag>
              </DynamicHtmlTag>
              {/* Description */}
              <DynamicHtmlTag type="div" className="text-2xs text-black font-bold w-2/5 hidden lg:block">
                {appointment.description}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            {/* Documents Dropdown */}
            <DynamicHtmlTag type="div" className="border-b border-gray-300">
              <DynamicHtmlTag type="div" className="flex justify-center bg-gray-100 mb-1 px-3 py-2 rounded-lg mt-2">
                <CustomButton
                  className="px-1 py-1 font-bold text-[11px] border-0 rounded-md text-black w-full flex justify-between"
                  onClick={() => handleToggleDocuments(index)}>
                  Documents de la téléconsultation
                  <CustomImage
                    src="/images/dropdown.svg"
                    alt="dropdown-icon"
                    className={`transform transition-transform relative top-[.30rem] ${openDocumentIndex === index ? "rotate-0" : "rotate-0"}`}
                    width={13}
                    height={7}
                  />
                </CustomButton>
              </DynamicHtmlTag>
              {openDocumentIndex === index && (
                <DynamicHtmlTag type="div">
                  {appointment.documents.map((document, docIndex) => (
                    <DynamicHtmlTag key={docIndex} type="div" className="mt-2 flex justify-between px-5 py-2 border-b border-gray-300">
                      <DynamicHtmlTag type="p" className="text-2xs font-semibold">
                        {document}
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="flex gap-4">
                        <CustomImage src="/images/eye.svg" alt="eye-icon" className="cursor-pointer" width={18} height={8} />
                        <CustomImage src="/images/download.svg" alt="download-icon" className="cursor-pointer" width={13} height={12} />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  ))}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        ))}
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default AgendaTeleconsultations;
