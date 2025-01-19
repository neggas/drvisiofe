"use client";
import React, { useState } from "react";
import {
  CustomButton,
  CustomDatePicker,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomSelect,
  CustomTextarea,
  DeleteModal,
  DynamicHtmlTag,
  HeadingTag,
} from "@/components";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IoCloseSharp } from "react-icons/io5";

const AllergiesData = [
  { id: 1, name: "Ventoline", effect: "Gonflement", discovered: "2010", addedOn: "10.07.2024", addedBy: "Arpin Adeline" },
  { id: 2, name: "Appendicectomie", effect: "Oui", discovered: "2019 / 2019", addedOn: "10.07.2024", addedBy: "Arpin Adeline" },
  { id: 3, name: "Appendicectomie", effect: "Oui", discovered: "2019 / 2019", addedOn: "10.07.2024", addedBy: "Arpin Adeline" },
];

const AgendaAllergies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleCheckboxChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleToggleRow = (rowId: number) => {
    setExpandedRow(prevExpandedRow => (prevExpandedRow === rowId ? null : rowId));
  };

  const handleDateOptionChange = (date: any) => {
    setStartDate(date);
  };

  // DeleteModalBox
  const openDeleteModal = () => setIsModalOpen(true);
  const closeDeleteModal = () => setIsModalOpen(false);
  const openAddAllergyModal = () => setIsModalOpen(true);
  const closeAddAllergyModal = () => setIsModalOpen(false);

  const AllergiesList = [
    { value: "ventoline", label: "Ventoline" },
    { value: "ventoline", label: "Ventoline" },
    { value: "ventoline", label: "Ventoline" },
  ];

  return (
    <DynamicHtmlTag type="div" className="bg-white rounded-xl h-auto lg:h-[92%]">
      <DynamicHtmlTag type="div" className="w-full px-3 py-2 relative h-full main-tab-inner">
        <DynamicHtmlTag type="div" className="max-h-table overflow-auto min-w-full bg-white h-[88%]">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-slate-100 bg-white">
                <th className="py-2 px-2 text-left font-medium text-slate-100 text-2xs">Allergie</th>
                <th className="py-2 px-2 text-left font-medium text-slate-100 text-2xs">Effet</th>
                <th className="py-2 px-2 text-center font-medium text-slate-100 text-2xs">Date de découverte</th>
                <th className="py-2 px-2 text-center font-medium text-slate-100 text-2xs">Action</th>
              </tr>
            </thead>
            <tbody>
              {AllergiesData.map(allergy => (
                <React.Fragment key={allergy.id}>
                  {/* Main Row */}
                  <tr className="cursor-pointer text-2xs font-bold border-t border-slate-100" onClick={() => handleToggleRow(allergy.id)}>
                    <td className="py-3 px-2">
                      <DynamicHtmlTag type="span">{allergy.name}</DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-2">
                      <DynamicHtmlTag type="span" className="font-bold">
                        {allergy.effect}
                      </DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <DynamicHtmlTag type="span">{allergy.discovered}</DynamicHtmlTag>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <DynamicHtmlTag type="div" className="flex items-center space-x-4 justify-center">
                        <CustomButton type="button">
                          <CustomImage className="w-4 h-4 max-w-max" src="/images/pencil-edit.svg" alt="Edit" width={16} height={16} />
                        </CustomButton>
                        <CustomButton
                          type="button"
                          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            event.stopPropagation();
                            openDeleteModal();
                          }}>
                          <CustomImage className="w-4 h-4 max-w-max" src="/images/trash.svg" alt="Delete" width={16} height={16} />
                        </CustomButton>
                      </DynamicHtmlTag>
                    </td>
                  </tr>

                  {/* Collapsible Row */}
                  {expandedRow === allergy.id && (
                    <tr className="bg-base-100">
                      <td colSpan={4} className="">
                        <DynamicHtmlTag type="div" className="max-h-auto">
                          <DynamicHtmlTag type="div" className="grid grid-cols-2 gap-5 pb-2 px-2">
                            <DynamicHtmlTag type="div" className="col-span-1">
                              <DynamicHtmlTag type="div">
                                <CustomLabel className="text-2xs 2xl:text-xs font-semibold">Allergie</CustomLabel>
                                <CustomSelect
                                  name="allergy"
                                  options={AllergiesList}
                                  placeholder="allergies"
                                  className={`w-full p-2 countries-select text-2xs 2xl:text-xs text-black placeholder-black border rounded-lg mb-1 `}
                                />
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="w-full xl:my-2">
                                <CustomLabel className="text-2xs 2xl:text-xs font-semibold w-8/12 md:w-8/12">
                                  S’agit t-il d’un médicament ou d’un produit médical ?
                                </CustomLabel>
                                <DynamicHtmlTag type="div" className="flex gap-10 mt-3">
                                  <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                      <CustomInput
                                        type="checkbox"
                                        id="affection-Oui"
                                        checked={selectedOption === "Oui"}
                                        onChange={() => handleCheckboxChange("Oui")}
                                      />
                                      <CustomLabel
                                        className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]"
                                        htmlFor="affection-Oui">
                                        <CustomImage
                                          src="/images/checkbox-img.svg"
                                          alt="checkbox"
                                          width={100}
                                          height={100}
                                          className="checkmark w-full"
                                        />
                                      </CustomLabel>
                                    </DynamicHtmlTag>
                                    <CustomLabel htmlFor="affection" className="ps-2 text-2xs 2xl:text-xs font-normal cstm-lable">
                                      Oui
                                    </CustomLabel>
                                  </DynamicHtmlTag>
                                  <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                      <CustomInput
                                        type="checkbox"
                                        id="affection-non"
                                        checked={selectedOption === "Non"}
                                        onChange={() => handleCheckboxChange("Non")}
                                      />
                                      <CustomLabel
                                        className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]"
                                        htmlFor="affection-non">
                                        <CustomImage
                                          src="/images/checkbox-img.svg"
                                          alt="checkbox"
                                          width={100}
                                          height={100}
                                          className="checkmark w-full"
                                        />
                                      </CustomLabel>
                                    </DynamicHtmlTag>
                                    <CustomLabel htmlFor="affection" className="ps-2 text-2xs 2xl:text-xs font-normal cstm-lable">
                                      Non
                                    </CustomLabel>
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                            </DynamicHtmlTag>
                            <DynamicHtmlTag type="div">
                              <DynamicHtmlTag type="div">
                                <CustomLabel className="text-2xs 2xl:text-xs font-semibold mt-5">Date de début de l’allergie</CustomLabel>
                                <DynamicHtmlTag
                                  type="div"
                                  className="form-date-picker date-picker w-full h-8 flex items-center outline-none [&&]:text-2xs rounded-md border border-gray-400 px-2">
                                  <DynamicHtmlTag type="span" className="text-2xs 2xl:text-xs">
                                    <CustomDatePicker
                                      selected={startDate}
                                      onChange={(date: any) => handleDateOptionChange(date)}
                                      dateFormat={"dd/MM/yyyy"}
                                    />
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="w-full xl:my-3">
                                <DynamicHtmlTag type="div" className="flex items-center gap-4 justify-between">
                                  <CustomLabel className="text-2xs 2xl:text-xs font-semibold flex gap-2 custom-tooltip">
                                    Comment se manifeste cette allergie ?
                                    <CustomButton
                                      type="button"
                                      data-tooltip-id="cette-allergie"
                                      data-tooltip-place="bottom-start"
                                      data-tooltip-html="Comment se manifeste cette allergie">
                                      <CustomImage
                                        src={"/images/tooltip-icon.svg"}
                                        alt="banner"
                                        width={15}
                                        height={15}
                                        className="img-fluid lg:w-4 lg:h-4"
                                      />
                                    </CustomButton>
                                    <ReactTooltip id="cette-allergie" place="bottom" />
                                  </CustomLabel>
                                  <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                                      <CustomInput type="checkbox" id="ne-sais" />
                                      <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="ne-sais">
                                        <CustomImage
                                          src="/images/checkbox-img.svg"
                                          alt="checkbox"
                                          width={100}
                                          height={100}
                                          className="checkmark w-full"
                                        />
                                      </CustomLabel>
                                    </DynamicHtmlTag>
                                    <CustomLabel htmlFor="affection" className="ps-2 text-2xs 2xl:text-xs font-normal cstm-lable">
                                      Je ne sais pas
                                    </CustomLabel>
                                  </DynamicHtmlTag>
                                </DynamicHtmlTag>
                                <CustomTextarea
                                  className="resize-none w-full border border-gray-400 outline-none h-16 mt-2 py-1 px-2 rounded-md text-2xs 2xl:text-xs"
                                  placeholder="Saisir votre texte ici"
                                />
                              </DynamicHtmlTag>
                              <DynamicHtmlTag type="div" className="w-full flex justify-end mt-1">
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
          <DynamicHtmlTag type="div" className="flex justify-end mb-2 lg:mb-0 mt-28 px-4 pb-2 lg:py-0">
            <CustomButton as="button" className="card-btn text-xs text-white py-2 px-3 font-semibold rounded-full" onClick={openAddAllergyModal}>
              Ajouter un Allergies
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {/* Delete Modal Start */}
        <DeleteModal
          isOpen={isModalOpen}
          onClose={closeDeleteModal}
          title="Supprimer un allergies"
          paragraph="Êtes-vous sûre de vouloir supprimer cet allergies ?"
        />
        {/* Delete Modal End */}
        {/* Add Allergy Modal Box Start */}
        <CustomModal isOpen={isModalOpen} onClose={closeAddAllergyModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 py-4 px-6">
              <DynamicHtmlTag type="div" className="flex flex-col">
                <DynamicHtmlTag type="div" className="flex items-center justify-between gap-2">
                  <HeadingTag type="h2" className="text-blue font-bold text-lg mb-3">
                    Ajouter une allergie
                  </HeadingTag>
                  <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={closeAddAllergyModal}>
                    <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
                  </CustomButton>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <DynamicHtmlTag type="div" className="mt-5">
                    <CustomLabel className="text-xs font-semibold">Allergie</CustomLabel>
                    <CustomSelect
                      options={AllergiesList}
                      className="w-8/12 countries-select ville-select  outline-none [&&]:text-xs rounded-md border border-gray-400 font-semibold"
                      placeholder="Ventoline"
                    />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="flex items-center my-4 gap-3 w-full mt-5">
                    <CustomLabel className="text-2xs md:text-xs font-semibold w-8/12 md:w-8/12">
                      S’agit t-il d’un médicament ou d’un produit médical ?
                    </CustomLabel>
                    <DynamicHtmlTag type="div" className="flex items-center gap-4">
                      <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                        <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                          <CustomInput className="" type="checkbox" id="affection-Oui" />
                          <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="affection-Oui">
                            <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                          </CustomLabel>
                        </DynamicHtmlTag>
                        <CustomLabel htmlFor="affection" className="ps-2 text-2xs sm:text-xs font-normal cstm-lable">
                          Oui
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
                          Non
                        </CustomLabel>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <CustomLabel className="text-xs font-semibold mt-5">Date de début de l’allergie</CustomLabel>
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
                    <CustomLabel className="text-2xs md:text-2xs font-semibold flex gap-2 w-8/12 md:w-8/12 custom-tooltip">
                      Comment se manifeste cette allergie ?
                      <CustomButton
                        type="button"
                        data-tooltip-id="cette-allergie"
                        data-tooltip-place="bottom-start"
                        data-tooltip-html="Comment se manifeste cette allergie">
                        <CustomImage src={"/images/tooltip-icon.svg"} alt="banner" width={15} height={15} className="img-fluid lg:w-4 lg:h-4" />
                      </CustomButton>
                      <ReactTooltip id="cette-allergie" place="bottom" />
                    </CustomLabel>
                    <DynamicHtmlTag type="div" className="flex items-center gap-4">
                      <DynamicHtmlTag type="div" className="cstm-form-group flex items-center justify-center">
                        <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
                          <CustomInput className="" type="checkbox" id="ne-sais" />
                          <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="ne-sais">
                            <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                          </CustomLabel>
                        </DynamicHtmlTag>
                        <CustomLabel htmlFor="affection" className="ps-2 text-2xs sm:text-xs font-normal cstm-lable">
                          Je ne sais pas
                        </CustomLabel>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <CustomTextarea
                    className="resize-none w-full border-2 border-gray-300 outline-none h-24 mt-2 py-1 px-2 rounded-md"
                    placeholder="Saisir votre texte ici"
                  />
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
        {/* Add Allergy Modal Box End */}
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default AgendaAllergies;
