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

const MedicalHistoryData = [
  { id: 1, name: "Asthme", effect: " Oui", discovered: "-", addedOn: "10.07.2024", addedBy: "Arpin Adeline" },
  { id: 2, name: "Asthme", effect: " Oui", discovered: "2020/2021", addedOn: "08.10.2024", addedBy: "Arpin Adeline" },
  { id: 3, name: "Asthme", effect: " Oui", discovered: "-", addedOn: "02.11.2024", addedBy: "Aripin Adeline" },
  { id: 4, name: "Asthme", effect: " Oui", discovered: "2019/2019", addedOn: "02.11.2024", addedBy: "Apin Adeliine" },
  { id: 5, name: "Asthme", effect: " Oui", discovered: "-", addedOn: "02.11.2024", addedBy: "Arine" },
  { id: 6, name: "Asthme", effect: " Oui", discovered: "2020/2021", addedOn: "08.10.2024", addedBy: "Arpin Adeli" },
  { id: 7, name: "Asthme", effect: " Oui", discovered: "2008/2008", addedOn: "06.11.2024", addedBy: "pin Adelie" },
  { id: 8, name: "Asthme", effect: " Oui", discovered: "-", addedOn: "02.11.2024", addedBy: "Adel Arine" },
];
const AgendaMedicalHistory = () => {
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
  const openAddHistoryModal = () => setIsModalOpen(true);
  const closeAddHistoryModal = () => setIsModalOpen(false);

  const Antecedent = [
    { value: "Appendicectomie", label: "Appendicectomie" },
    { value: "Appendicectomie2", label: "Appendicectomie2" },
    { value: "Appendicectomie3", label: "Appendicectomie3" },
    { value: "Appendicectomie4", label: "Appendicectomie4" },
  ];

  return (
    <DynamicHtmlTag type="div" className="bg-white rounded-xl px-4 lg:h-[28.5rem] 2xl:h-[28rem] overflow-y-auto relative">
      {/* Tab Content Screen */}
      <DynamicHtmlTag type="div" className="w-full relative">
        <DynamicHtmlTag type="div" className="max-h-table overflow-auto min-w-full bg-white lg:h-[27rem] 2xl:h-[26rem] lg:pb-12 xl:pb-8 2xl:pb-6">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="sticky top-0 z-10 border-t lg:border-t-0 border-b border-slate-100 lg:text-3xs 2xl:text-2xs bg-white">
                <th className="py-2 px-2 text-left font-medium text-slate-100">Antécédent</th>
                <th className="py-2 px-2 text-left font-medium text-slate-100">Opération chirurgicale</th>
                <th className="py-2 px-2 text-center lg:text-left font-medium text-slate-100">Dates début / fin</th>
                <th className="py-2 px-2 text-left font-medium text-slate-100 hidden md:table-cell">Ajouté le</th>
                <th className="py-2 px-2 text-left font-medium text-slate-100 hidden md:table-cell">Ajouté par</th>
                <th className="py-2 px-2 text-center font-medium text-slate-100 w-1/6">Action</th>
              </tr>
            </thead>
            <tbody>
              {MedicalHistoryData.map(history => (
                <React.Fragment key={history.id}>
                  <tr className="cursor-pointer text-2xs font-bold lg:border-t lg:border-slate-100" onClick={() => handleToggleRow(history.id)}>
                    <td className="py-3 px-3">
                      <DynamicHtmlTag type="span">{history.name}</DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-3">
                      <DynamicHtmlTag type="span" className="flex items-center">
                        <DynamicHtmlTag type="span" className="text-xs font-medium text-slate-100 ml-2 mr-4">
                          {isChecked ? "Oui" : "Non"}
                        </DynamicHtmlTag>
                        <CustomLabel className="inline-flex relative items-center mr-5 cursor-pointer">
                          <CustomInput type="checkbox" className="sr-only peer switch-input text-sm" checked={isChecked} onChange={handleToggle} />
                          <DynamicHtmlTag
                            type="div"
                            className="switch-peer-style w-10 h-5 bg-white border-red border rounded-full peer peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-[#45AAE0] after:content-[''] after:absolute after:top-[3px] after:left-[6px] after:rounded-full after:h-[13px] after:w-[13px] after:transition-all peer-checked:bg-gradient-to-r from-[#335FA8] to-[#43ABE1]"></DynamicHtmlTag>
                        </CustomLabel>
                        {/* Display "Oui" or "Non" based on the checked status */}
                      </DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-3 text-center lg:text-left">
                      <DynamicHtmlTag type="span">{history.discovered}</DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell">
                      <DynamicHtmlTag type="span">{history.addedOn}</DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell">
                      <DynamicHtmlTag type="span">{history.addedBy}</DynamicHtmlTag>
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
                  {expandedRow === history.id && (
                    <tr className="bg-base-100">
                      <td colSpan={6}>
                        <DynamicHtmlTag type="div" className="max-h-auto">
                          <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-4 xl:gap-10">
                            <DynamicHtmlTag type="div" className="col-span-1">
                              <DynamicHtmlTag type="div" className="w-full mt-2">
                                <CustomLabel className="px-2 text-xs font-semibold">Antécédent</CustomLabel>
                                <CustomSelect
                                  name="background"
                                  options={Antecedent}
                                  placeholder="Antecedent"
                                  className={`w-full p-2 countries-select text-xs text-black placeholder-black border border-gray-400 rounded-lg mb-1`}
                                />
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="cstm-form-group flex items-center gap-2 mt-3">
                                <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                  <CustomInput className="surgical-check" type="checkbox" id="surgical" />
                                  <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="surgical">
                                    <CustomImage
                                      src="/images/checkbox-img.svg"
                                      alt="checkbox"
                                      width={100}
                                      height={100}
                                      className="checkmark w-full"
                                    />
                                  </CustomLabel>
                                </DynamicHtmlTag>
                                <CustomLabel htmlFor="affection" className="text-2xs font-semibold cstm-lable">
                                  Cochez la case s{"’"}il s{"’"}agit d{"’"}une opération chirurgicale
                                </CustomLabel>
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="mt-3">
                                <CustomLabel className="px-2 text-xs font-semibold">Date de début</CustomLabel>
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
                            <DynamicHtmlTag type="div" className="mt-2">
                              <DynamicHtmlTag type="div" className="w-full custom-radio-parent mt-8 xl:mt-7">
                                <DynamicHtmlTag type="div" className="flex gap-5 xl:gap-10">
                                  <DynamicHtmlTag type="div" className="flex items-center ps-2">
                                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                      <CustomInput className="progress-radio" type="radio" id="progress" name="process" />
                                      <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="progress">
                                        <CustomImage
                                          src="/images/checkbox-img.svg"
                                          alt="checkbox"
                                          width={100}
                                          height={100}
                                          className="checkmark w-full"
                                        />
                                      </CustomLabel>
                                    </DynamicHtmlTag>
                                    <DynamicHtmlTag type="span" className="ps-1 xl:ps-3 text-2xs xl:text-xs 2xl:text-sm font-semibold cstm-lable">
                                      En cours
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div" className="flex items-center xl:ps-2">
                                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                      <CustomInput className="finished-radio" type="radio" id="finished" name="process" />
                                      <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="finished">
                                        <CustomImage
                                          src="/images/checkbox-img.svg"
                                          alt="checkbox"
                                          width={100}
                                          height={100}
                                          className="checkmark w-full"
                                        />
                                      </CustomLabel>
                                    </DynamicHtmlTag>
                                    <DynamicHtmlTag type="span" className="ps-1 xl:ps-3 text-2xs xl:text-xs 2xl:text-sm font-semibold cstm-lable">
                                      Terminé
                                    </DynamicHtmlTag>
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="w-full mt-[74px] xl:mt-12 lg:mt-[42px]">
                                <CustomLabel className="px-2 text-xs font-semibold">Date de fin</CustomLabel>
                                <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-md h-8 w-full">
                                  <DynamicHtmlTag
                                    type="div"
                                    className="form-date-picker date-picker medical-tabs flex items-center outline-none [&&]:text-2xs  py-1 xl:px-2">
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
                          </DynamicHtmlTag>
                          <DynamicHtmlTag type="div" className="w-full flex justify-end my-1">
                            <CustomButton
                              as="button"
                              className="card-btn text-xs text-white py-2 px-3 font-semibold rounded-2xl hidden lg:inline-block">
                              Enregistrer
                            </CustomButton>
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
        <CustomButton as="button" className="card-btn text-xs text-white py-2 px-3 font-semibold rounded-full" onClick={openAddHistoryModal}>
          Ajouter un antécédent
        </CustomButton>
      </DynamicHtmlTag>
      {/* Delete Modal Start */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        title="Supprimer un antécédent"
        paragraph="Êtes-vous sûre de vouloir supprimer cet antécédent ?"
      />
      {/* Delete Modal End */}
      {/* Add History Modal Box Start */}
      <CustomModal isOpen={isModalOpen} onClose={closeAddHistoryModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
          <DynamicHtmlTag type="div" className="bg-base-100 py-4 px-6">
            <DynamicHtmlTag type="div" className="flex flex-col">
              <DynamicHtmlTag type="div" className="flex items-center justify-between gap-2">
                <HeadingTag type="h2" className="text-blue font-bold text-lg mb-3">
                  Ajouter une antecedent
                </HeadingTag>
                <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={closeAddHistoryModal}>
                  <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
                </CustomButton>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div">
                <DynamicHtmlTag type="div" className="mt-5">
                  <CustomLabel className="text-xs font-semibold">Antecedent</CustomLabel>
                  <CustomSelect
                    options={Antecedent}
                    className="w-8/12 countries-select ville-select outline-none [&&]:text-xs rounded-md border border-gray-400 font-semibold"
                    placeholder="Diabète"
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
                    <CustomLabel htmlFor="affection" className="ps-2 text-2xs sm:text-xs cstm-lable font-semibold">
                      Cochez la case s’il s’agit d’une opération chirurgicale
                    </CustomLabel>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <CustomLabel className="text-xs font-semibold mt-5">Date de début de</CustomLabel>
                <CustomLabel className="input border border-gray-400 p-2 flex items-center gap-2 rounded-md h-8 mb-1 w-8/12">
                  <DynamicHtmlTag
                    type="div"
                    className="form-date-picker date-picker medical-tabs flex items-center outline-none [&&]:text-2xs py-1 px-2">
                    <DynamicHtmlTag type="span" className="text-xs">
                      <CustomDatePicker selected={startDate} onChange={(date: any) => handleDateOptionChange(date)} dateFormat={"dd/MM/yyyy"} />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </CustomLabel>
                <DynamicHtmlTag type="div" className="flex items-center mt-5 gap-3 w-full">
                  <DynamicHtmlTag type="div" className="flex items-center ps-2">
                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                      <CustomInput className="progress-radio" type="radio" id="progress" name="process" />
                      <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="progress">
                        <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                      </CustomLabel>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="span" className="ps-1 xl:ps-3 text-2xs xl:text-xs 2xl:text-sm font-semibold cstm-lable">
                      En cours
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex items-center xl:ps-2">
                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                      <CustomInput className="finished-radio" type="radio" id="finished" name="process" />
                      <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="finished">
                        <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                      </CustomLabel>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="span" className="ps-1 xl:ps-3 text-2xs xl:text-xs 2xl:text-sm font-semibold cstm-lable">
                      Terminé
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
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
      {/* Add History Modal Box End */}
    </DynamicHtmlTag>
  );
};

export default AgendaMedicalHistory;
