"use client";
import React, { useState } from "react";
import {
  CustomButton,
  CustomDatePicker,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomModal,
  DynamicHtmlTag,
  EmptyHistory,
  HeadingTag,
} from "@/components";
import { IoCloseSharp } from "react-icons/io5";

const AgendaMeasurements = () => {
  const [MesureModalOpen, MesureIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  // EditModalBox
  const openPoidsModal = () => {
    MesureIsModalOpen(true);
    setModalMode("edit");
  };
  const openTailleModal = () => {
    MesureIsModalOpen(true);
    setModalMode("add");
  };
  const closeMesureModal = () => MesureIsModalOpen(false);

  const handleDateOptionChange = (date: any) => {
    setStartDate(date);
  };

  const [startDate, setStartDate] = useState(new Date());

  return (
    <DynamicHtmlTag type="div" className="bg-white rounded-xl h-auto lg:h-[92%]">
      {/* Tab Content Screen */}
      <DynamicHtmlTag type="div" className="w-full px-3 py-2 relative h-full main-tab-inner overflow-auto">
        <DynamicHtmlTag type="div">
          <DynamicHtmlTag type="div" className="flex justify-start gap-3">
            <DynamicHtmlTag type="div" className="flex gap-2 max-w-max">
              <DynamicHtmlTag type="div" className="flex flex-col">
                <CustomLabel className="pb-1 ps-2 text-2xs xl:text-xs 2xl:text-sm xl:leading-none">Poids</CustomLabel>
                <DynamicHtmlTag type="div" className="rounded-md border border-gray-200 font-semibold py-1 px-2 flex items-center w-full">
                  <CustomInput
                    type="text"
                    name="weight"
                    placeholder="Poids"
                    className="text-2xs xl:text-3xs 2xl:text-xs xl:leading-none w-1/2 outline-none pe-1"
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="span" className="text-[.6rem] opacity-50 xl:text-2xs relative top-[18px]">
                kg
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <CustomButton
              as="button"
              onClick={openPoidsModal}
              className={`text-xs lg:text-sm cstm-btn flex py-2 xl:py-0 px-1 ms-0 mt-2 md:ms-4 me-3 md:me-0 justify-center w-2/6 md:w-1/6 view-more-btn rounded-full text-white font-semibold`}>
              Ajouter
            </CustomButton>
          </DynamicHtmlTag>
          <CustomImage src="/images/poids-graph.svg" alt="poids-graph" width={800} height={300} className="mt-2 w-full" />
          <DynamicHtmlTag type="div" className="flex justify-start gap-3 my-3">
            <DynamicHtmlTag type="div" className="flex gap-2 max-w-max">
              <DynamicHtmlTag type="div" className="flex flex-col">
                <CustomLabel className="pb-1 ps-2 text-2xs xl:text-xs 2xl:text-sm xl:leading-none">Taille</CustomLabel>
                <DynamicHtmlTag type="div" className="rounded-md border border-gray-200 font-semibold py-1 px-2 flex items-center w-full">
                  <CustomInput
                    type="text"
                    name="weight"
                    placeholder="Poids"
                    className="text-2xs xl:text-3xs 2xl:text-xs xl:leading-none w-1/2 outline-none pe-1"
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="span" className="text-[.6rem] opacity-50 xl:text-2xs relative top-[18px]">
                cm
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <CustomButton
              as="button"
              onClick={openTailleModal}
              className={`text-xs lg:text-sm cstm-btn flex py-2 xl:py-0 px-1 mt-2 ms-0 md:ms-4 me-3 md:me-0 justify-center w-2/6 md:w-1/6 view-more-btn rounded-full text-white font-semibold`}>
              Ajouter
            </CustomButton>
          </DynamicHtmlTag>
          <CustomImage src="/images/taille-graph.svg" alt="poids-graph" width={800} height={300} className="mt-2 w-full" />
          <DynamicHtmlTag type="div" className="flex items-center justify-center gap-3">
            <CustomLabel className="text-2xs font-semibold">IMC</CustomLabel>
            <DynamicHtmlTag type="div" className="text-pink-500 font-semibold">
              <CustomLabel className="border border-gray-300 p-2 rounded-sm text-xs">22</CustomLabel>
              <DynamicHtmlTag type="span" className="text-xs px-2">
                poids ideal
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <CustomImage src="/images/imc-graph.svg" alt="poids-graph" width={800} height={300} className="mt-2 w-full" />
        </DynamicHtmlTag>

        {/* Add Mesures Modal Box Start */}
        <CustomModal isOpen={MesureModalOpen} onClose={closeMesureModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-indigo-500 to-sky-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 px-6 gap-y-5 flex flex-col py-4">
              <DynamicHtmlTag type="div" className="flex flex-col">
                <DynamicHtmlTag type="div" className="flex items-center justify-between gap-2 mb-4">
                  <HeadingTag type="h2" className="text-blue font-bold text-lg">
                    {modalMode === "edit" ? "Ajouter un Poids" : "Ajouter un Taille"}
                  </HeadingTag>
                  <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={closeMesureModal}>
                    <IoCloseSharp className="w-5 h-5" />
                  </CustomButton>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="div" className="mt-4">
                    <CustomLabel className="text-xs font-semibold">{modalMode === "edit" ? "Poids" : "Taille"}</CustomLabel>
                    <DynamicHtmlTag type="div" className="flex w-full items-center gap-x-3">
                      <CustomInput
                        type="text"
                        className="[&&]:text-2xs leading-1 font-semibold w-8/12 block rounded-md outline-none border border-gray-400 px-4 py-2"
                      />
                      <DynamicHtmlTag type="span" className="text-xs font-semibold text-gray-400">
                        {modalMode === "edit" ? "kg" : "cm"}
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="mt-16">
                    <CustomLabel className="text-xs font-semibold">Date de début</CustomLabel>
                    <DynamicHtmlTag
                      type="div"
                      className="form-date-picker date-picker items-center leading-1 font-semibold w-8/12 block outline-none rounded-md border-2 border-gray-200 py-1 px-2">
                      <DynamicHtmlTag type="span" className="text-2xs w-full">
                        <CustomDatePicker selected={startDate} onChange={(date: any) => handleDateOptionChange(date)} dateFormat={"dd/MM/yyyy"} />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="mt-5 flex justify-end">
                    <CustomButton as="button" className="card-btn text-xs text-white py-2 px-3 font-semibold rounded-2xl hidden lg:inline-block">
                      Ajouter
                    </CustomButton>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
        {/*Add Mesures Modal Box End */}
      </DynamicHtmlTag>
      {/* Empty Screen Without Content */}
      <DynamicHtmlTag type="div" className="empty-history-content h-full hidden">
        <EmptyHistory
          title="Vous n’avez pas renseigné d’mesures"
          paragraph="Je n’ai aucun problème de mesures"
          button="Ajouter un mesures"
          uniqueId="4"
        />
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default AgendaMeasurements;
