"use client";
import React, { useState } from "react";
import {
  CustomButton,
  CustomImage,
  CustomInput,
  CustomLabel,
  DynamicHtmlTag,
  DeleteModal,
  HeadingTag,
  CustomSelect,
  CustomDatePicker,
  CustomModal,
  CustomTextarea,
} from "@/components";
import { IoCloseSharp } from "react-icons/io5";
import { Tooltip as ReactTooltip } from "react-tooltip";

const MedicalTreatment = [
  { id: 1, name: "Ventoline", frequence: "Matin/midi/soir", addedOn: "12.07.2024", effect: " Oui", discovered: "2021", addedBy: "Arpine" },
  { id: 2, name: "Ventoline", frequence: "Matin/midi/soir", addedOn: "09.07.2024", effect: " Oui", discovered: "2012", addedBy: "Arpin Adele" },
  { id: 3, name: "Ventoline", frequence: "Matin/midi/soir", addedOn: "22.07.2024", effect: " Oui", discovered: "2016", addedBy: "Arpin Adeldeline" },
  { id: 4, name: "Ventoline", frequence: "Matin/midi/soir", addedOn: "16.07.2024", effect: " Oui", discovered: "2017", addedBy: "Arpin Adeline" },
  { id: 5, name: "Ventoline", frequence: "Matin/midi/soir", addedOn: "18.07.2024", effect: " Oui", discovered: "2011", addedBy: "Arine" },
  { id: 6, name: "Ventoline", frequence: "Matin/midi/soir", addedOn: "15.07.2024", effect: " Oui", discovered: "2022", addedBy: "Areline" },
  { id: 7, name: "Ventoline", frequence: "Matin/midi/soir", addedOn: "12.07.2024", effect: " Oui", discovered: "2023", addedBy: "Arpin Adeline" },
  { id: 8, name: "Ventoline", frequence: "Matin/midi/soir", addedOn: "06.07.2024", effect: " Oui", discovered: "2024", addedBy: "Arpin Adeline" },
  { id: 9, name: "Ventoline", frequence: "Matin/midi/soir", addedOn: "26.07.2024", effect: " Oui", discovered: "2016", addedBy: "Arpin Adelne" },
  { id: 10, name: "Ventoline", frequence: "Matin/midi/soir", addedOn: "13.07.2024", effect: " Oui", discovered: "2010", addedBy: "Bin Adelline" },
  { id: 11, name: "Ventoline", frequence: "Matin/midi/soir", addedOn: "19.07.2024", effect: " Oui", discovered: "2014", addedBy: "Ain Adelline" },
];
const AgendaMedicalTreatments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  // Toggle the checked state
  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleToggleRow = (rowId: number) => {
    setExpandedRow(prevExpandedRow => (prevExpandedRow === rowId ? null : rowId));
  };

  const handleDateOptionChange = (date: any) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date: any) => {
    setEndDate(date);
  };

  // DeleteModalBox
  const openDeleteModal = () => setIsModalOpen(true);
  const closeDeleteModal = () => setIsModalOpen(false);
  const openAddTreatmentModal = () => setIsModalOpen(true);
  const closeAddTreatmentModal = () => setIsModalOpen(false);

  const Treatment = [
    { value: "Ventoline", label: "Ventoline" },
    { value: "Ventoline2", label: "Ventoline2" },
    { value: "Ventoline3", label: "Ventoline3" },
  ];

  return (
    <DynamicHtmlTag type="div" className="bg-white rounded-xl px-4 xl:h-[28.5rem] 2xl:h-[28rem] overflow-y-auto relative">
      {/* Tab Content Screen */}
      <DynamicHtmlTag type="div" className="w-full relative">
        <DynamicHtmlTag type="div" className="max-h-table overflow-auto min-w-full bg-white xl:h-[27rem] 2xl:h-[26rem] xl:pb-8 2xl:pb-6">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="sticky top-0 z-10 text-2xs border-b border-slate-100 lg:text-3xs 2xl:text-2xs bg-white">
                <th className="py-2 px-2 text-left font-medium text-slate-100">Traitement</th>
                <th className="py-2 px-2 text-left font-medium text-slate-100">Fréquence</th>
                <th className="py-2 px-2 text-center lg:text-left font-medium text-slate-100">Date de début</th>
                <th className="py-2 px-2 text-left font-medium text-slate-100">Traitement en cours</th>
                <th className="py-2 px-2 text-left font-medium text-slate-100 hidden md:table-cell">Ajouté le</th>
                <th className="py-2 px-2 text-left font-medium text-slate-100 hidden md:table-cell">Ajouté par</th>
                <th className="py-2 px-2 text-center font-medium text-slate-100 w-1/6">Action</th>
              </tr>
            </thead>
            <tbody>
              {MedicalTreatment.map(treatment => (
                <React.Fragment key={treatment.id}>
                  <tr
                    className="cursor-pointer text-3xs 2xl:text-2xs font-bold lg:border-t lg:border-slate-100"
                    onClick={() => handleToggleRow(treatment.id)}>
                    <td className="py-3 px-3">
                      <DynamicHtmlTag type="span">{treatment.name}</DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-3 ">
                      <DynamicHtmlTag type="span">{treatment.frequence}</DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-3 text-center lg:text-left">
                      <DynamicHtmlTag type="span">{treatment.discovered}</DynamicHtmlTag>
                    </td>
                    <td>
                      <DynamicHtmlTag type="span" className="flex items-center">
                        <DynamicHtmlTag type="span" className="text-3xs 2xl:text-2xs font-medium text-slate-100 ml-2 mr-4">
                          {isChecked ? "Oui" : "Non"}
                        </DynamicHtmlTag>
                        <CustomLabel className="inline-flex relative items-center mr-5 cursor-pointer">
                          <CustomInput type="checkbox" className="sr-only peer switch-input text-sm " checked={isChecked} onChange={handleToggle} />
                          <DynamicHtmlTag
                            type="div"
                            className="switch-peer-style w-8 2xl:w-10 h-4 2xl:h-5 bg-white border-red border rounded-full peer peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-[#45AAE0] after:content-[''] after:absolute after:top-[3px] after:left-[6px] after:rounded-full after:h-[11px] 2xl:after:h-[13px] 2xl:after:w-[13px] after:w-[11px] after:transition-all peer-checked:bg-gradient-to-r from-[#335FA8] to-[#43ABE1]"></DynamicHtmlTag>
                        </CustomLabel>
                      </DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell">
                      <DynamicHtmlTag type="span">{treatment.addedOn}</DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell">
                      <DynamicHtmlTag type="span">{treatment.addedBy}</DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-3 w-1/6">
                      <DynamicHtmlTag type="div" className="flex items-center space-x-4 justify-center">
                        <CustomButton type="button">
                          <CustomImage className="w-4 h-4 max-w-max" src="/images/pencil-edit.svg" alt="pencil-edit" width={16} height={16} />
                        </CustomButton>
                        <CustomButton
                          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            event.stopPropagation();
                            openDeleteModal();
                          }}
                          as="button"
                          title="delete">
                          <CustomImage className="w-4 h-4 max-w-max" src="/images/trash.svg" alt="trash" width={16} height={16} />
                        </CustomButton>
                      </DynamicHtmlTag>
                    </td>
                  </tr>

                  {/* Collapsible Row */}
                  {expandedRow === treatment.id && (
                    <tr className="bg-base-100">
                      <td colSpan={8}>
                        <DynamicHtmlTag type="div" className="max-h-auto">
                          <DynamicHtmlTag type="div" className="grid grid-cols-1 xl:grid-cols-2 gap-3 xl:gap-5">
                            <DynamicHtmlTag type="div" className="col-span-1">
                              <DynamicHtmlTag type="div" className="w-full">
                                <CustomLabel className="text-xs font-semibold">Traitement</CustomLabel>
                                <CustomSelect
                                  name="treatment"
                                  options={Treatment}
                                  placeholder="treatment"
                                  className={`w-full p-2 countries-select text-xs text-black placeholder-black border rounded-lg mb-1`}
                                />
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div">
                                <CustomLabel className="text-xs font-semibold">Date de début</CustomLabel>
                                <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-md h-8 mb-1 w-full">
                                  <DynamicHtmlTag
                                    type="div"
                                    className="form-date-picker date-picker medical-tabs flex items-center outline-none [&&]:text-2xs py-1 px-2">
                                    <DynamicHtmlTag type="span" className="text-xs">
                                      <CustomDatePicker
                                        selected={startDate}
                                        onChange={(date: any) => handleDateOptionChange(date)}
                                        dateFormat={"dd/MM/yyyy"}
                                      />
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                </CustomLabel>
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                            <DynamicHtmlTag type="div">
                              <DynamicHtmlTag type="div" className="form-group gap-3 w-full">
                                <CustomLabel className="text-xs font-semibold">Fréquence</CustomLabel>
                                <DynamicHtmlTag type="div" className="w-full">
                                  <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-md font-semibold h-8 mb-1">
                                    <CustomInput
                                      type="text"
                                      name="frequency"
                                      className="grow input outline-none focus:outline-none border-none h-auto text-xs"
                                      placeholder="Indiquer la fréquence"
                                    />
                                  </CustomLabel>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="mt-1">
                                <CustomLabel className="text-xs font-semibold">Date de fin</CustomLabel>
                                <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-md h-8 mb-1 w-full">
                                  <DynamicHtmlTag
                                    type="div"
                                    className="form-date-picker date-picker medical-tabs flex items-center outline-none [&&]:text-2xs  py-1 px-2">
                                    <DynamicHtmlTag type="span" className="text-xs">
                                      <CustomDatePicker
                                        selected={endDate}
                                        onChange={(date: any) => handleEndDateChange(date)}
                                        dateFormat={"dd/MM/yyyy"}
                                      />
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                </CustomLabel>
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                            <DynamicHtmlTag type="div" className="w-full flex justify-between items-center col-span-2">
                              <DynamicHtmlTag type="div" className="custom-radio-parent">
                                <DynamicHtmlTag type="div" className="flex gap-2">
                                  <DynamicHtmlTag type="div" className="flex items-center ps-1">
                                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                      <CustomInput className="" type="radio" id="check-regular" name="treatment-check" />
                                      <CustomLabel
                                        className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]"
                                        htmlFor="check-regular">
                                        <CustomImage
                                          src="/images/checkbox-img.svg"
                                          alt="checkbox"
                                          width={100}
                                          height={100}
                                          className="checkmark w-full"
                                        />
                                      </CustomLabel>
                                    </DynamicHtmlTag>
                                    <DynamicHtmlTag type="span" className="ps-2 text-2xs font-semibold cstm-lable">
                                      Traitement régulier
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div" className="flex items-center ps-1">
                                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                      <CustomInput type="radio" id="spot-treatment" name="treatment-check" />
                                      <CustomLabel
                                        className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]"
                                        htmlFor="spot-treatment">
                                        <CustomImage
                                          src="/images/checkbox-img.svg"
                                          alt="checkbox"
                                          width={100}
                                          height={100}
                                          className="checkmark w-full"
                                        />
                                      </CustomLabel>
                                    </DynamicHtmlTag>
                                    <DynamicHtmlTag type="span" className="ps-2 text-2xs font-semibold cstm-lable">
                                      Traitement ponctuel
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div" className="flex items-center ps-1">
                                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                      <CustomInput className="" type="radio" id="no-treatment" name="treatment-check" />
                                      <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="no-treatment">
                                        <CustomImage
                                          src="/images/checkbox-img.svg"
                                          alt="checkbox"
                                          width={100}
                                          height={100}
                                          className="checkmark w-full"
                                        />
                                      </CustomLabel>
                                    </DynamicHtmlTag>
                                    <DynamicHtmlTag type="span" className="ps-2 text-2xs font-semibold cstm-lable">
                                      Je ne prends plus ce traitement
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="w-fit flex justify-end my-1">
                                <CustomButton
                                  as="button"
                                  className="card-btn text-xs text-white py-2 px-3 font-semibold rounded-2xl hidden lg:inline-block">
                                  Enregistrer
                                </CustomButton>
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                        </DynamicHtmlTag>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              <tr className="md:hidden">
                <td colSpan={5} className="pb-2 px-3">
                  <DynamicHtmlTag type="div" className="bg-gray-400 bg-opacity-40 rounded-lg text-xs font-bold w-full flex px-3 gap-4">
                    <DynamicHtmlTag type="div" className="py-2 w-2/6">
                      <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                        Ajouté le
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="span" className="font-semibold">
                        10.07.2024
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="py-2 w-2/6">
                      <DynamicHtmlTag type="p" className="text-slate-100 font-semibold">
                        Par
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="span" className="font-semibold">
                        Arpin Adeline
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </td>
              </tr>
            </tbody>
          </table>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex justify-end mb-2 lg:mb-0 px-4 py-2 mt-2 w-full absolute bottom-0 left-0 bg-white">
        <CustomButton as="button" className="card-btn text-xs text-white py-2 px-3 font-semibold rounded-full" onClick={openAddTreatmentModal}>
          Ajouter un traitement
        </CustomButton>
      </DynamicHtmlTag>
      {/* Delete Modal Start */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        title="Supprimer un traitement"
        paragraph="Êtes-vous sûre de vouloir supprimer cet traitement ?"
      />
      {/* Delete Modal End */}
      {/* Add Treatment Modal Box Start */}
      <CustomModal isOpen={isModalOpen} onClose={closeAddTreatmentModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 py-4 px-6">
            <DynamicHtmlTag type="div" className="flex flex-col">
              <DynamicHtmlTag type="div" className="flex items-center justify-between gap-2">
                <HeadingTag type="h2" className="text-blue font-bold text-lg mb-3">
                  Ajouter une treatment
                </HeadingTag>
                <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={closeAddTreatmentModal}>
                  <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
                </CustomButton>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div">
                <DynamicHtmlTag type="div" className="mt-5">
                  <CustomLabel className="text-xs font-semibold px-1">Treatment</CustomLabel>
                  <CustomSelect
                    options={Treatment}
                    className="w-8/12 countries-select ville-select outline-none [&&]:text-xs rounded-md border border-gray-400 font-semibold"
                    placeholder="Ventoline"
                  />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex items-center my-4 gap-3 w-full mt-5">
                  <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                      <CustomInput className="" type="checkbox" id="affection-Oui" />
                      <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="affection-Oui">
                        <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                      </CustomLabel>
                    </DynamicHtmlTag>
                    <CustomLabel htmlFor="affection" className="ps-2 text-2xs sm:text-xs font-normal cstm-lable">
                      Traitement régulier
                    </CustomLabel>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex items-center gap-4">
                    <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                      <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                        <CustomInput className="" type="checkbox" id="affection-Oui" />
                        <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="affection-Oui">
                          <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                        </CustomLabel>
                      </DynamicHtmlTag>
                      <CustomLabel htmlFor="affection" className="ps-2 text-2xs sm:text-xs font-normal cstm-lable">
                        Traitement ponctuel
                      </CustomLabel>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                      <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                        <CustomInput className="" type="checkbox" id="affection-non" />
                        <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="affection-non">
                          <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                        </CustomLabel>
                      </DynamicHtmlTag>
                      <CustomLabel htmlFor="affection" className="ps-2 text-2xs sm:text-xs font-normal cstm-lable">
                        Je ne prends plus ce traitement
                      </CustomLabel>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <CustomLabel className="text-xs font-semibold mt-5 px-1">Date de début de l’treatment</CustomLabel>
                <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-md h-8 mb-1 w-8/12">
                  <DynamicHtmlTag
                    type="div"
                    className="form-date-picker date-picker medical-tabs flex items-center outline-none [&&]:text-2xs py-1 px-2">
                    <DynamicHtmlTag type="span" className="text-xs">
                      <CustomDatePicker selected={startDate} onChange={(date: any) => handleDateOptionChange(date)} dateFormat={"dd/MM/yyyy"} />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </CustomLabel>
                <DynamicHtmlTag type="div" className="mt-5 w-full">
                  <CustomLabel className="text-xs font-semibold mt-5 px-1">Date de fin</CustomLabel>
                  <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-md h-8 mb-1 w-8/12">
                    <DynamicHtmlTag
                      type="div"
                      className="form-date-picker date-picker medical-tabs flex items-center outline-none [&&]:text-2xs py-1 px-2">
                      <DynamicHtmlTag type="span" className="text-xs">
                        <CustomDatePicker selected={startDate} onChange={(date: any) => handleDateOptionChange(date)} dateFormat={"dd/MM/yyyy"} />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </CustomLabel>
                </DynamicHtmlTag>
                <CustomLabel className="px-1 text-2xs xl:text-xs 2xl:text-sm 2xl:leading-relaxed xl:leading-none font-semibold">
                  Fréquence
                </CustomLabel>
                <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-md h-8 mb-1 w-8/12">
                  <CustomInput type="text" name="frequence" placeholder="Indiquer la fréquence" />
                </CustomLabel>
                <CustomButton
                  as="button"
                  className={`text-xs lg:text-sm cstm-btn ms-auto mt-6 flex py-2 px-1 justify-center w-2/6  md:w-2/6 view-more-btn rounded-full text-white font-semibold`}>
                  Ajouter
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>
      {/* Add Treatment Modal Box End */}
    </DynamicHtmlTag>
  );
};

export default AgendaMedicalTreatments;
