"use client";
import React, { useEffect, useState } from "react";
import { CustomButton, CustomImage, CustomLink, CustomNav, DynamicHtmlTag, HeadingTag } from "@/components";
import { usePathname } from "next/navigation";
import { selectAddMedicalDocumentValue, setMobileTabAddDocument } from "@/store/reducers/patientDetailsSlice";
import { useDispatch, useSelector } from "react-redux";

function DocumentSteps() {
  const pathName = usePathname() || "";
  const dispatch = useDispatch();

  const getActiveRoute = (currentPath: string, linkPath: string, activeClass: string) => {
    return currentPath === linkPath ? activeClass : "";
  };

  useEffect(() => {}, [pathName]);
  const [isToggling, setIsToggling] = useState(false); // Prevent rapid toggles
  const fetchAddMedicalDocumentValue = useSelector(selectAddMedicalDocumentValue);

  const handleMobileTabDocumentAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default behavior

    if (isToggling) return; // Prevent double-click toggling
    setIsToggling(true);

    const newState = !fetchAddMedicalDocumentValue; // Toggle state
    dispatch(setMobileTabAddDocument(newState));

    setTimeout(() => {
      setIsToggling(false); // Reset the toggling flag
    }, 300); // Add a small delay to avoid rapid toggles
  };

  return (
    <DynamicHtmlTag
      type="div"
      className="bg-white p-1 xl:p-3 border-slate-200 h-full rounded-b-xl rounded-none lg:rounded-xl overflow-hidden document-menu">
      <DynamicHtmlTag
        type="div"
        className="flex items-center justify-between lg:justify-center lg:py-0 h-[10%] md:h-[5%] mt-[1%] lg:mt-0 mb-[1%] lg:items-start px-2 lg:px-4">
        <HeadingTag type="h4" className="text-black font-semibold text-center text-2xs md:text-3xs xl:text-xs 2xl:text-sm">
          VOS DOCUMENTS
        </HeadingTag>
        <CustomButton
          as="button"
          className="card-btn text-2xs text-white py-1.5 lg:py-2 px-3 font-semibold rounded-full lg:hidden"
          onClick={handleMobileTabDocumentAdd}>
          <CustomLink href="/patient-dashboard/documents" onClick={e => e.preventDefault()}>
            Ajouter un document
          </CustomLink>
        </CustomButton>
      </DynamicHtmlTag>
      <CustomNav
        defaultActiveKey="/patient-dashboard/documents/comptes-rendus"
        className="flex flex-wrap gap-0 justify-start h-[94%] overflow-y-auto nav-steps-links p-1">
        <CustomLink
          href="/patient-dashboard/documents/comptes-rendus"
          className={`steps-links my-[1%] lg:my-0 px-[2%] md:px-[1%] lg:px-[2%] w-1/2 lg:flex [&&]:shadow-none ${getActiveRoute(pathName, "/patient-dashboard/documents/comptes-rendus", "active")}`}>
          <DynamicHtmlTag
            type="div"
            className="bg-gradient-to-b from-indigo-400 to-indigo-800 flex flex-col items-center justify-center p-1 md:p-2 rounded-xl shadow-lg w-full h-full">
            <CustomImage
              src="/images/cardiologie-doc.svg"
              alt="Comptes rendus"
              width={25}
              height={25}
              className="lg:w-4 lg:h-4 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10"
            />
            <DynamicHtmlTag type="span" className="mt-2 text-white font-semibold text-center">
              Comptes rendus
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomLink>
        <CustomLink
          href="/patient-dashboard/documents/biology-result"
          className={`steps-links my-[1%] lg:my-0 px-[2%] md:px-[1%] lg:px-[2%] w-1/2 lg:flex [&&]:shadow-none ${getActiveRoute(pathName, "/patient-dashboard/documents/biology-result", "active")}`}>
          <DynamicHtmlTag
            type="div"
            className="bg-gradient-to-b from-pink-300 to-pink-400 flex flex-col items-center justify-center p-1 md:p-2 rounded-xl shadow-lg w-full h-full">
            <CustomImage
              src="/images/result-doc.svg"
              alt="Résultat de biologie"
              className="lg:w-4 lg:h-4 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 "
              width={20}
              height={20}
            />
            <DynamicHtmlTag type="span" className="mt-1 text-white font-semibold text-center">
              Résultat de biologie
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomLink>
        <CustomLink
          href="/patient-dashboard/documents/prescriptions-care"
          className={`steps-links my-[1%] lg:my-0 px-[2%] md:px-[1%] lg:px-[2%] w-1/2 lg:flex [&&]:shadow-none ${getActiveRoute(pathName, "/patient-dashboard/documents/prescriptions-care", "active")}`}>
          <DynamicHtmlTag
            type="div"
            className="bg-gradient-to-b from-coolBlue-400 to-coolBlue-500 flex flex-col items-center justify-center p-1 md:p-2 rounded-xl shadow-lg w-full h-full">
            <CustomImage
              src="/images/order-care.svg"
              alt="Ordonnances et soins"
              className="lg:w-4 lg:h-4 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10"
              width={20}
              height={20}
            />
            <HeadingTag type="h2" className="mt-2 text-white font-semibold text-center">
              Ordonnances et soins
            </HeadingTag>
          </DynamicHtmlTag>
        </CustomLink>
        <CustomLink
          href="/patient-dashboard/documents/x-ray-ultrasound"
          className={`steps-links my-[1%] lg:my-0 px-[2%] md:px-[1%] lg:px-[2%] w-1/2 lg:flex [&&]:shadow-none ${getActiveRoute(pathName, "/patient-dashboard/documents/x-ray-ultrasound", "active")}`}>
          <DynamicHtmlTag
            type="div"
            className="bg-gradient-to-b from-yellow-300 to-yellow-500 flex flex-col items-center justify-center p-1 md:p-2 rounded-xl shadow-lg w-full h-full">
            <CustomImage
              src="/images/radio-scan.svg"
              alt="Radio, écho, scanner, IRM"
              className="lg:w-4 lg:h-4 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10"
              width={35}
              height={35}
            />
            <HeadingTag type="h2" className="mt-2 text-white font-semibold text-center">
              Radio, écho, scanner, IRM
            </HeadingTag>
          </DynamicHtmlTag>
        </CustomLink>
        <CustomLink
          href="/patient-dashboard/documents/medical-certificates"
          className={`steps-links my-[1%] lg:my-0 px-[2%] md:px-[1%] lg:px-[2%] w-1/2 lg:flex [&&]:shadow-none ${getActiveRoute(pathName, "/patient-dashboard/documents/medical-certificates", "active")}`}>
          <DynamicHtmlTag
            type="div"
            className="bg-gradient-to-b from-yellow-500 to-red-500 flex flex-col items-center justify-center p-1 md:p-2 rounded-xl shadow-lg w-full h-full">
            <CustomImage
              src="/images/cartificate-medi.svg"
              alt="Certificats médicaux"
              className="lg:w-4 lg:h-4 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10"
              width={20}
              height={20}
            />
            <HeadingTag type="h2" className="mt-2 text-white font-semibold text-center">
              Certificats médicaux
            </HeadingTag>
          </DynamicHtmlTag>
        </CustomLink>
        <CustomLink
          href="/patient-dashboard/documents/prevention-screening"
          className={`steps-links my-[1%] lg:my-0 px-[2%] md:px-[1%] lg:px-[2%] w-1/2 lg:flex [&&]:shadow-none ${getActiveRoute(pathName, "/patient-dashboard/documents/prevention-screening", "active")}`}>
          <DynamicHtmlTag
            type="div"
            className="bg-gradient-to-b from-indigo-700 to-indigo-600 flex flex-col items-center justify-center p-1 md:p-2 rounded-xl shadow-lg w-full h-full">
            <CustomImage
              src="/images/prevention-screen.svg"
              alt="Prévention et dépistage"
              className="lg:w-4 lg:h-4 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10"
              width={20}
              height={20}
            />
            <HeadingTag type="h2" className="mt-2 text-white font-semibold text-center">
              Prévention et dépistage
            </HeadingTag>
          </DynamicHtmlTag>
        </CustomLink>
        <CustomLink
          href="/patient-dashboard/documents/administrative-documents"
          className={`steps-links my-[1%] lg:my-0 px-[2%] md:px-[1%] lg:px-[2%] w-1/2 lg:flex [&&]:shadow-none ${getActiveRoute(pathName, "/patient-dashboard/documents/administrative-documents", "active")}`}>
          <DynamicHtmlTag
            type="div"
            className="bg-gradient-to-b from-purple-200 to-coolBlue-600 flex flex-col items-center justify-center p-1 md:p-2 rounded-xl shadow-lg w-full h-full">
            <CustomImage
              src="/images/administrative-doc.svg"
              alt="Pièces administratives"
              className="lg:w-4 lg:h-4 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10"
              width={30}
              height={30}
            />
            <HeadingTag type="h2" className="mt-2 text-white font-semibold text-center">
              Pièces administratives
            </HeadingTag>
          </DynamicHtmlTag>
        </CustomLink>
        <CustomLink
          href="/patient-dashboard/documents/other-document"
          className={`steps-links my-[1%] lg:my-0 px-[2%] md:px-[1%] lg:px-[2%] w-1/2 lg:flex [&&]:shadow-none ${getActiveRoute(pathName, "/patient-dashboard/documents/other-document", "active")}`}>
          <DynamicHtmlTag
            type="div"
            className="bg-gradient-to-b from-pink-500 to-purple-500 flex flex-col items-center justify-center p-1 md:p-2 rounded-xl shadow-lg w-full h-full">
            <CustomImage
              src="/images/other-doc.svg"
              alt="Autres documents"
              className="lg:w-4 lg:h-4 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10"
              width={20}
              height={20}
            />
            <HeadingTag type="h2" className="mt-2 text-white font-semibold text-center">
              Autres documents
            </HeadingTag>
          </DynamicHtmlTag>
        </CustomLink>
      </CustomNav>
    </DynamicHtmlTag>
  );
}

export default DocumentSteps;
