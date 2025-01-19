"use client";
import React, { useState } from "react";
import { CustomButton, CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";
import {
  PractitionerComptesRendus,
  PractitionerBiologyResult,
  PractitionerPrescriptionsCare,
  PractitionerXRayUltraSound,
  PractitionerMedicalCartificate,
  PractitionerAdministrativeDocument,
  PractitionerOtherDocument,
  PractitionerPreventionScreen,
} from "@/components/practitioner-modal-tabs/document";

const AgendaDocument: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const tabs = [
    { id: 0, label: "Comptes rendus", imgSrc: "/images/cardiologie-doc.svg", component: PractitionerComptesRendus },
    { id: 1, label: "Résultat de biologie", imgSrc: "/images/result-doc.svg", component: PractitionerBiologyResult },
    { id: 2, label: "Ordonnances et soins", imgSrc: "/images/order-care.svg", component: PractitionerPrescriptionsCare },
    { id: 3, label: "Radio, écho, scanner, IRM", imgSrc: "/images/radio-scan.svg", component: PractitionerXRayUltraSound },
    { id: 4, label: "Certificats médicaux", imgSrc: "/images/cartificate-medi.svg", component: PractitionerMedicalCartificate },
    { id: 5, label: "Prévention et dépistage", imgSrc: "/images/prevention-screen.svg", component: PractitionerPreventionScreen },
    { id: 6, label: "Pièces administratives", imgSrc: "/images/administrative-doc.svg", component: PractitionerAdministrativeDocument },
    { id: 7, label: "Autres documents", imgSrc: "/images/other-doc.svg", component: PractitionerOtherDocument },
  ];

  return (
    <DynamicHtmlTag type="div" className="relative mt-2">
      {/* Tabs List - Show only when no tab is selected */}
      {activeTab === null && (
        <DynamicHtmlTag type="div" className="flex flex-wrap gap-4 justify-center xl:mt-7 main-document-tabs px-2 xl:px-4 h-auto">
          {tabs.map(tab => (
            <CustomButton
              key={tab.id}
              id={`document_tab-${tab.id}`}
              className="relative flex flex-col rounded-xl items-center justify-center p-5 cursor-pointer w-[130px] lg:w-[140px] h-[100px] xl:w-[160px] xl:h-[130px]"
              onClick={() => setActiveTab(tab.id)}>
              <CustomImage src={tab.imgSrc} alt={tab.label} width={25} height={25} />
              <HeadingTag type="h5" className="mt-2 text-xs font-bold text-white">
                {tab.label}
              </HeadingTag>
            </CustomButton>
          ))}
        </DynamicHtmlTag>
      )}

      {/* Tab Content - Show only when a tab is selected */}
      {activeTab !== null && (
        <DynamicHtmlTag type="div" className="w-full rounded-lg h-full lg:h-auto bg-white relative overflow-auto p-4">
          {/* Back Button to return to the tab list */}
          <DynamicHtmlTag type="div" className="flex gap-5 mb-3 cursor-pointer" onClick={() => setActiveTab(null)}>
            <CustomImage src="/images/backicon.svg" alt="back" width={25} height={25} />
            <DynamicHtmlTag type="span" className="text-xs sm:text-sm md:text-base font-semibold">
              Retour aux documents
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          {/* Render the selected tab component */}
          {tabs.map(
            tab =>
              activeTab === tab.id && (
                <DynamicHtmlTag key={tab.id} type="div" role="tabpanel" className="tab-content h-full">
                  <tab.component />
                </DynamicHtmlTag>
              )
          )}
        </DynamicHtmlTag>
      )}
      <DynamicHtmlTag type="div" className="flex justify-end mb-2 lg:mb-0 mt-52 px-5 2xl:mt-80 pb-2 lg:py-0">
        <CustomButton as="button" className="card-btn text-xs text-white py-2 px-3 font-semibold rounded-full">
          Ajouter un document
        </CustomButton>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default AgendaDocument;
