"use client";
import {
  CustomButton,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomSelect,
  DynamicHtmlTag,
  HeadingTag,
  PractitionerDocumentUploadModal,
} from "@/components";
import { RootState } from "@/store";
import { closeModal, openModal, resetModal } from "@/store/reducers/modalSlice";
import React, { useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

function ProfessionalProfile() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isDiplomaModalOpen, setIsDiplomaModalOpen] = useState(false);
  const [isCouncilModalOpen, setIsCouncilModalOpen] = useState(false);
  const [isDiplomaDUModalOpen, setIsDiplomaDUModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isAddIdModalOpen, setIsAddIdModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const openShowPractitionerDocumentModal = () => {
    setPreviewImage(null);
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("showPractitionerDoc")));
  };

  const closeShowPractitionerDocumentModal = () => {
    setPreviewImage(null);
    dispatch(closeModal());
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(null);
        setTimeout(() => {
          setPreviewImage(reader.result as string); // new image
        }, 0);
      };
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const typedactivité = [
    { value: "education", label: "Éducation" },
    { value: "health", label: "Santé" },
    { value: "libérale", label: "Libérale" },
  ];
  const médecingénéraliste = [{ value: "medecine", label: "Médecin généraliste" }];
  const sector = [{ value: "sector", label: "Sector1" }];
  const payment = [{ value: "payment", label: "Payment" }];
  const medicalDoc = [{ value: "doc", label: "Documents médicaux" }];
  const du = [{ value: "du", label: "DU/DUI" }];

  return (
    <>
      <DynamicHtmlTag type="div" className="md:px-5 situation-screen-main h-full">
        <DynamicHtmlTag type="div" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <DynamicHtmlTag type="div" className="w-full px-4 lg:px-4">
            <DynamicHtmlTag type="div" className="hidden lg:flex gap-5">
              <DynamicHtmlTag type="div">
                <CustomLabel htmlFor="file-change" className="">
                  <CustomInput type="file" className="hidden" id="file-change" ref={fileInputRef} onChange={handleFileChange} />
                  <DynamicHtmlTag type="div" className="">
                    <DynamicHtmlTag type="div" className="w-20 h-20 flex items-center justify-center cstm-file-upload rounded-full cursor-pointer">
                      {previewImage ? (
                        <CustomImage
                          key={previewImage}
                          src={previewImage}
                          alt="preview"
                          width={100}
                          height={100}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <DynamicHtmlTag type="div" className="flex flex-col items-center rounded-lg ">
                          <DynamicHtmlTag type="div" className="text-center">
                            <DynamicHtmlTag type="div" className="w-full flex justify-center items-center mt-2">
                              <CustomImage src="/images/cloud-icon.svg" alt="cloud" width={30} height={30} />
                            </DynamicHtmlTag>
                            <DynamicHtmlTag type="div" className="text-base-100 font-bold mt-2">
                              <CustomButton onClick={handleButtonClick} className="bg-base-100 mt-1 text-sky-200 text-4xs px-2 py-1 rounded-full">
                                importer
                              </CustomButton>
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </CustomLabel>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="mt-4">
                <DynamicHtmlTag type="div" className="flex gap-2 cursor-pointer " onClick={handleButtonClick}>
                  <CustomImage src="/images/camera-icon.svg" alt="camera" width={20} height={20} />
                  <CustomButton type="button" className="text-xs xl:text-sm font-semibold underline text-indigo-500 ">
                    Photo de profil
                  </CustomButton>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="span" className="text-2xs">
                    Cette photo sera visible par les patients, merci de prendre
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="text-2xs">
                    une photo avec une expression neutre, sur fond blanc.
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            {/* For Mobile Screen */}
            <DynamicHtmlTag type="div" className="flex justify-center mt-4 lg:hidden">
              <DynamicHtmlTag type="div">
                <CustomLabel htmlFor="file-change" className="">
                  <CustomInput type="file" className="hidden" id="file-change" ref={fileInputRef} onChange={handleFileChange} />
                  <DynamicHtmlTag type="div">
                    <DynamicHtmlTag type="div" className="w-20 h-20 relative left-[70px] flex items-center justify-center bg-sky-900 rounded-full">
                      {previewImage ? (
                        <CustomImage
                          key={previewImage}
                          src={previewImage}
                          alt="preview"
                          width={100}
                          height={100}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <DynamicHtmlTag type="div" className="text-center">
                          <CustomImage src="/images/camera-icon.svg" alt="camera" width={20} height={20} />
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="flex justify-center mt-5">
                      <CustomButton onClick={handleButtonClick} className="w-20 h-8 bg-sky-300 text-base-100 text-xs px-2 py-2 rounded-2xl">
                        importer
                      </CustomButton>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div">
                    <DynamicHtmlTag type="span" className="text-2xs">
                      Cette photo sera visible par les patients,
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-2xs text-center">
                      merci de prendre une photo avec une ex-
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-2xs text-center">
                      neutre, sur fond blanc.
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </CustomLabel>
              </DynamicHtmlTag>
            </DynamicHtmlTag>

            <DynamicHtmlTag type="div" className="mt-1">
              <DynamicHtmlTag type="div" className="flex flex-col">
                <DynamicHtmlTag type="div" className="flex justify-between">
                  <DynamicHtmlTag type="span" className="text-2xs xl:text-sm 2xl:text-lg px-2">
                    Type d’activité
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="text-red-500 text-2xs" />
                </DynamicHtmlTag>
                <CustomSelect
                  name="type"
                  options={typedactivité}
                  placeholder="Type d’activité"
                  isClearable
                  className={`w-full countries-select ville-select text-xs text-black placeholder-black border rounded-lg border-grey-400 outline-none`}
                />
              </DynamicHtmlTag>

              <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-4 mt-1">
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <DynamicHtmlTag type="div" className="flex justify-between">
                    <DynamicHtmlTag type="span" className="text-xs lg:text-sm px-2">
                      Spécialité
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs" />
                  </DynamicHtmlTag>
                  <CustomSelect
                    name="medecine"
                    options={médecingénéraliste}
                    placeholder="Médecin généraliste"
                    isClearable
                    className={`w-full countries-select ville-select  text-xs text-black placeholder-black border rounded-lg border-grey-400 outline-none`}
                  />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <DynamicHtmlTag type="div" className="flex justify-between">
                    <DynamicHtmlTag type="span" className="text-xs xl:text-sm px-2">
                      Secteur
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs" />
                  </DynamicHtmlTag>
                  <CustomSelect
                    name="sector"
                    options={sector}
                    placeholder="Secteur"
                    isClearable
                    className={`w-full countries-select ville-select text-xs text-black  placeholder-black border rounded-lg border-grey-400 outline-none`}
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>

              <DynamicHtmlTag type="div" className="grid grid-cols-3 gap-4 mt-2">
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="div" className="flex justify-between">
                    <DynamicHtmlTag type="span" className="text-xs xl:text-sm lg:px-2">
                      Tarif minimum
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs" />
                  </DynamicHtmlTag>
                  <CustomInput type="text" className="w-full border h-8 rounded-md py-2 px-2 outline-none bg-gray-300" placeholder="Tarif min." />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="div" className="flex justify-between">
                    <DynamicHtmlTag type="span" className="text-xs xl:text-sm lg:px-2">
                      Tarif maxmum
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs" />
                  </DynamicHtmlTag>
                  <CustomInput type="text" className="w-full border h-8 rounded-md py-2 px-2 bg-gray-300 outline-none" placeholder="Tarif max." />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="div" className="flex justify-between">
                    <DynamicHtmlTag type="span" className="text-xs xl:text-sm 2xl:text-lg lg:px-2">
                      Tiers payant
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs" />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="relative">
                    <CustomSelect
                      name="payment"
                      options={payment}
                      placeholder="Oui"
                      isClearable
                      className={`w-full countries-select ville-select text-xs text-black placeholder-black  rounded-lg border border-grey-400 outline-none`}
                    />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>

              <DynamicHtmlTag type="div" className="flex gap-5">
                <DynamicHtmlTag type="div" className="w-full flex flex-col mt-2">
                  <DynamicHtmlTag type="div" className="flex justify-between">
                    <DynamicHtmlTag type="span" className="text-xs xl:text-sm lg:px-2">
                      Délivrance de documents médicaux
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs" />
                  </DynamicHtmlTag>
                  <CustomSelect
                    name="medical-doc"
                    options={medicalDoc}
                    placeholder="Documents médicaux"
                    isClearable
                    className={`w-full countries-select ville-select text-xs text-black placeholder-black border rounded-lg border-grey-400 outline-none`}
                  />
                </DynamicHtmlTag>

                <DynamicHtmlTag type="div" className="w-full flex flex-col mt-7">
                  <DynamicHtmlTag type="div" className="flex justify-between">
                    <DynamicHtmlTag type="span" className="text-xs lg:text-sm lg:px-2">
                      Liste des DU/DIU
                      <DynamicHtmlTag type="span" className="text-red-500">
                        *
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-red-500 text-2xs" />
                  </DynamicHtmlTag>
                  <CustomSelect
                    name="document-du"
                    options={du}
                    placeholder="DU/DUI"
                    isClearable
                    className={`w-full countries-select ville-select text-xs text-black placeholder-black border rounded-lg border-grey-400 outline-none`}
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div">
              <DynamicHtmlTag type="span" className="text-2xs text-sky-700">
                Si vous ajoutez un DU ou DIU vous devez obligatoirement nous ajouter le diplôme obtenu.
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div">
              <DynamicHtmlTag type="span" className="text-xs text-red-500">
                Les champs munis d’un (*) sont obligatoires
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="mt-5 px-4 lg:px-0 practitioner-doc">
            <DynamicHtmlTag type="div" className="flex items-center justify-center">
              <DynamicHtmlTag type="div" className="flex h-auto rounded-lg w-full items-center justify-between px-2 bg-base-100 identification py-1">
                <DynamicHtmlTag type="span" className="text-2xs xl:text-sm 2xl:text-lg">
                  Pièce d’identité (passeport ou CNI)
                </DynamicHtmlTag>
                <CustomButton
                  type="button"
                  className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-2xs xl:text-xs 2xl:text-sm text-base-100 font-semibold px-4 py-1"
                  onClick={() => setIsAddIdModalOpen(true)}>
                  Ajouter
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="mt-3 flex items-center justify-center">
              <DynamicHtmlTag type="div" className="flex h-auto rounded-lg w-full items-center justify-between px-2 bg-base-100 curriculum py-1">
                <DynamicHtmlTag type="span" className="text-2xs xl:text-sm 2xl:text-lg">
                  Curriculum vitæ
                </DynamicHtmlTag>
                <CustomButton
                  type="button"
                  className="rounded-full bg-gradient-to-r from-pink-600 to-pink-300 text-2xs xl:text-xs 2xl:text-sm text-base-100 font-semibold px-4 py-1"
                  onClick={() => setIsCVModalOpen(true)}>
                  Ajouter
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="mt-3 flex items-center justify-center">
              <DynamicHtmlTag type="div" className="flex h-auto rounded-lg w-full items-center justify-between px-2 bg-base-100 diploma py-1">
                <DynamicHtmlTag type="span" className="text-2xs xl:text-sm 2xl:text-lg">
                  Diplôme de doctorat en médecine
                </DynamicHtmlTag>
                <CustomButton
                  type="button"
                  className="rounded-full bg-gradient-to-r from-coolBlue-500 to-coolBlue-400 text-2xs xl:text-xs 2xl:text-sm text-base-100 font-semibold px-4 py-1"
                  onClick={() => setIsDiplomaModalOpen(true)}>
                  Ajouter
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="mt-3 flex items-center justify-center">
              <DynamicHtmlTag type="div" className="flex h-auto w-full rounded-lg items-center justify-between px-2 bg-base-100 certificate py-1">
                <DynamicHtmlTag type="span" className="text-2xs xl:text-sm 2xl:text-lg">
                  Attestation d’inscription au conseil de l’ordre
                </DynamicHtmlTag>
                <CustomButton
                  type="button"
                  className="rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 text-2xs xl:text-xs 2xl:text-sm text-base-100 font-semibold px-4 py-1"
                  onClick={() => setIsCouncilModalOpen(true)}>
                  Ajouter
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="mt-3 flex items-center justify-center">
              <DynamicHtmlTag type="div" className="flex h-auto w-full rounded-lg items-center justify-between px-2 bg-base-100 diu-diploma py-1">
                <DynamicHtmlTag type="span" className="text-2xs xl:text-sm 2xl:text-xl">
                  Diplôme DU/DIU
                </DynamicHtmlTag>
                <CustomButton
                  type="button"
                  className="rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-2xs xl:text-xs 2xl:text-sm text-base-100 font-semibold px-4 py-1"
                  onClick={() => setIsDiplomaDUModalOpen(true)}>
                  Ajouter
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="mt-3 flex items-center justify-center">
              <DynamicHtmlTag type="div" className="flex h-auto w-full rounded-lg items-center justify-between px-2 bg-base-100 signature py-1">
                <DynamicHtmlTag type="span" className="text-2xs xl:text-sm 2xl:text-lg">
                  Signature
                </DynamicHtmlTag>
                <CustomButton
                  type="button"
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-2xs xl:text-xs 2xl:text-sm text-base-100 font-semibold px-4 py-1"
                  onClick={() => setIsSignatureModalOpen(true)}>
                  Ajouter
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex gap-2 mt-3 cursor-pointer" onClick={openShowPractitionerDocumentModal}>
              <FaEye className="h-5 w-5 text-indigo-500" />
              <DynamicHtmlTag type="span" className="text-indigo-500 underline text-xs xl:text-sm 2xl:text-lg">
                Tous les documents
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-full mt-4 px-2 lg:px-1 flex justify-end gap-5">
              <CustomButton
                type="submit"
                className="text-xs w-36 h-10 text-base-100 xl:text-sm font-bold rounded-full card-btn bg-gradient-to-b from-sky-500 to-indigo-500 cursor-pointer">
                Valider
              </CustomButton>
              <CustomButton
                type="submit"
                className="text-xs w-48 h-10 text-base-100 xl:text-sm font-bold rounded-full card-btn bg-gradient-to-b from-sky-500 to-indigo-500 cursor-pointer">
                Passer cette étape
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      {/* Upload Document Modal Start */}
      <PractitionerDocumentUploadModal
        isOpen={isAddIdModalOpen}
        title="Ajouter une pièce d’identité"
        onClose={() => setIsAddIdModalOpen(false)}
        isDocumentFieldRequired={true}
      />
      {/* Upload Document Modal End */}

      {/* Diploma Modal Start */}
      <PractitionerDocumentUploadModal
        isOpen={isDiplomaModalOpen}
        title="Diplôme de doctorat en médecine"
        onClose={() => setIsDiplomaModalOpen(false)}
        isDocumentFieldRequired={false}
      />
      {/* Diploma Modal End */}

      {/* CV Modal Start */}
      <PractitionerDocumentUploadModal
        isOpen={isCVModalOpen}
        title="Ajouter un CV"
        onClose={() => setIsCVModalOpen(false)}
        isDocumentFieldRequired={false}
      />

      {/* CV Modal End */}

      {/* Council Modal Start */}
      <PractitionerDocumentUploadModal
        isOpen={isCouncilModalOpen}
        title="Attestation d’inscription au conseil de l’ordre"
        onClose={() => setIsCouncilModalOpen(false)}
        isDocumentFieldRequired={false}
      />
      {/* Council Modal End */}
      {/* DiplomaDU Modal Start */}
      <PractitionerDocumentUploadModal
        isOpen={isDiplomaDUModalOpen}
        title="Diplôme DU/DIU"
        onClose={() => setIsDiplomaDUModalOpen(false)}
        isDocumentFieldRequired={true}
      />
      {/* DiplomaDU Modal End */}

      {/* Signature Modal Start */}
      <PractitionerDocumentUploadModal
        isOpen={isSignatureModalOpen}
        title="Signature"
        onClose={() => setIsSignatureModalOpen(false)}
        isDocumentFieldRequired={false}
      />

      {/* Signature Modal End */}

      {/* Show All Documents Modal Start */}
      {modalType === "showPractitionerDoc" && (
        <CustomModal
          id="show_document"
          isOpen={isModalOpen && modalType === "showPractitionerDoc"}
          onClose={closeShowPractitionerDocumentModal}
          modalClassName="w-full sm:max-w-1/2 md:max-w-4xl rounded-xl">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 p-4">
              <HeadingTag type="h3" className="text-blue font-semibold text-sm md:text-lg flex items-center gap-2">
                Tous mes documents
                <MdClose
                  onClick={closeShowPractitionerDocumentModal}
                  className="ms-auto cursor-pointer text-blue border border-blue rounded-full h-6 p-1 hover:bg-primary hover:border-primary hover:text-white w-6"
                />
              </HeadingTag>
              <DynamicHtmlTag type="div" className="flex flex-wrap gap-5 pl-2">
                <DynamicHtmlTag type="div" className="text-center mt-10">
                  <DynamicHtmlTag type="span" className="text-xs lg:text-sm">
                    Passeport
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className="relative w-40 h-28 lg:w-48 lg:h-36 flex gap-2 rounded-lg justify-center items-center bg-white">
                    <DynamicHtmlTag type="div" className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 p-[1px]">
                      <DynamicHtmlTag type="div" className="w-full h-full rounded-lg bg-white flex justify-center items-center gap-2">
                        <CustomImage src="/images/passport.svg" alt="passport" width={100} height={100} className="w-full h-full" />
                        <CustomImage
                          src="/images/pencil-edit.svg"
                          alt="edit"
                          width={20}
                          height={20}
                          className="absolute left-[121px] lg:left-[165px] bottom-[8px]"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="text-center mt-10">
                  <DynamicHtmlTag type="span" className="text-xs lg:text-sm">
                    CV
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className="relative w-40 h-28 lg:w-48 lg:h-36 flex gap-2 rounded-lg justify-center items-center bg-white">
                    <DynamicHtmlTag type="div" className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-600 to-pink-300 p-[1px]">
                      <DynamicHtmlTag type="div" className="w-full h-full rounded-lg bg-white flex justify-center items-center gap-2">
                        <CustomImage src="/images/CV.svg" alt="CV" width={100} height={100} className="w-full h-full" />
                        <CustomImage
                          src="/images/pencil-edit.svg"
                          alt="edit"
                          width={20}
                          height={20}
                          className="absolute left-[121px] lg:left-[165px] bottom-[8px]"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>

                <DynamicHtmlTag type="div" className="text-center mt-5">
                  <DynamicHtmlTag type="span" className="text-xs lg:text-sm">
                    Diplôme de doctorat
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="text-xs lg:text-sm">
                    en médecine
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className="relative w-40 h-28 lg:w-48 lg:h-36 flex gap-2 rounded-lg justify-center items-center bg-white">
                    <DynamicHtmlTag type="div" className="absolute inset-0 rounded-lg bg-gradient-to-r from-coolBlue-500 to-coolBlue-400 p-[1px]">
                      <DynamicHtmlTag type="div" className="w-full h-full rounded-lg bg-white flex justify-center items-center gap-2">
                        <CustomImage src="/images/diploma-doc.svg" alt="diploma" width={100} height={80} className="w-full h-2/3" />
                        <CustomImage
                          src="/images/pencil-edit.svg"
                          alt="edit"
                          width={20}
                          height={20}
                          className="absolute left-[121px] lg:left-[165px] bottom-[8px]"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>

                <DynamicHtmlTag type="div" className="text-center mt-5">
                  <DynamicHtmlTag type="span" className="text-xs lg:text-sm">
                    Attestation d’inscription
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="text-xs lg:text-sm">
                    au conseil de l’ordre
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className="relative w-40 h-28 lg:w-48 lg:h-36 flex gap-2 rounded-lg justify-center items-center bg-white">
                    <DynamicHtmlTag type="div" className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-300 p-[1px]">
                      <DynamicHtmlTag type="div" className="w-full h-full rounded-lg bg-white flex justify-center items-center gap-2">
                        <CustomImage src="/images/council-order.svg" alt="council" width={100} height={100} className="w-full h-full" />
                        <CustomImage
                          src="/images/pencil-edit.svg"
                          alt="edit"
                          width={20}
                          height={20}
                          className="absolute left-[121px] lg:left-[165px] bottom-[8px]"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>

                <DynamicHtmlTag type="div" className="text-center mt-5">
                  <DynamicHtmlTag type="span" className="text-xs lg:text-sm">
                    Diplôme DU gynécologie
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="text-xs lg:text-sm">
                    médicale
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className="relative w-40 h-28 lg:w-48 lg:h-36 flex gap-2 rounded-lg justify-center items-center bg-white">
                    <DynamicHtmlTag type="div" className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 p-[1px]">
                      <DynamicHtmlTag type="div" className="w-full h-full rounded-lg bg-white flex justify-center items-center gap-2">
                        <CustomImage src="/images/diploma-doc.svg" alt="diploma" width={100} height={80} className="w-full h-2/3" />
                        <CustomImage
                          src="/images/pencil-edit.svg"
                          alt="edit"
                          width={20}
                          height={20}
                          className="absolute left-[121px] lg:left-[165px] bottom-[8px]"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>

                <DynamicHtmlTag type="div" className="text-center mt-10">
                  <DynamicHtmlTag type="span" className="text-xs lg:text-sm">
                    Diplôme DIU pédiatrie
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className="relative w-40 h-28 lg:w-48 lg:h-36 flex gap-2 rounded-lg justify-center items-center bg-white">
                    <DynamicHtmlTag type="div" className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 p-[1px]">
                      <DynamicHtmlTag type="div" className="w-full h-full rounded-lg bg-white flex justify-center items-center gap-2">
                        <CustomImage src="/images/diploma-doc.svg" alt="diploma" width={80} height={50} className="w-full h-2/3" />
                        <CustomImage
                          src="/images/pencil-edit.svg"
                          alt="edit"
                          width={20}
                          height={20}
                          className="absolute left-[121px] lg:left-[165px] bottom-[8px]"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>

                <DynamicHtmlTag type="div" className="text-center mt-10">
                  <DynamicHtmlTag type="span" className="text-xs lg:text-sm">
                    Signature
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className="relative w-40 h-28 lg:w-48 lg:h-36 flex gap-2 rounded-lg justify-center items-center bg-white">
                    <DynamicHtmlTag type="div" className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 p-[1px]">
                      <DynamicHtmlTag type="div" className="w-full h-full rounded-lg bg-white flex justify-center items-center gap-2">
                        <CustomImage src="/images/signature.svg" alt="signature" width={100} height={100} className="w-full h-full" />
                        <CustomImage
                          src="/images/pencil-edit.svg"
                          alt="edit"
                          width={20}
                          height={20}
                          className="absolute left-[121px] lg:left-[165px] bottom-[8px]"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
      )}
      {/* Show All Documents Modal End */}
    </>
  );
}

export default ProfessionalProfile;
