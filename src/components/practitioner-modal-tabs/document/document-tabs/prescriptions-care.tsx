"use client";
import React, { useState } from "react";
import { CustomButton, CustomImage, CustomInput, CustomLabel, DeleteDocument, DynamicHtmlTag, HeadingTag } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { resetModal, openModal, closeModal } from "@/store/reducers/modalSlice";
import { FaTrash } from "react-icons/fa";

const PractitionerPrescriptionsCare = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const [checkboxes, setCheckboxes] = useState({
    checkbox_one: false,
    checkbox_two: false,
  });

  type CheckboxKeys = keyof typeof checkboxes;

  const handleCheckboxChange = (checkbox: CheckboxKeys) => {
    setCheckboxes(prev => {
      const isSelectAll = checkbox === "checkbox_one";
      let newCheckboxes;

      if (isSelectAll) {
        const newState = !prev.checkbox_one;
        newCheckboxes = {
          checkbox_one: newState,
          checkbox_two: newState,
        };
      } else {
        newCheckboxes = { ...prev, [checkbox]: !prev[checkbox] };
      }
      return newCheckboxes;
    });
  };

  const openDeleteDocumentModal = () => {
    dispatch(resetModal());
    setTimeout(() => dispatch(openModal("deleteDocumentModal")));
  };

  const closeDeleteDocumentModal = () => {
    dispatch(closeModal());
  };

  return (
    <DynamicHtmlTag type="div" className="rounded-t-lg h-full overflow-auto">
      <DynamicHtmlTag type="div" className="tabs-content rounded-lg pt-0" id="prescriptions-care">
        <HeadingTag type="h3" className="font-semibold text-sm text-white text-center py-1 px-3">
          Ordonnances et soins
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="w-full px-3 relative rounded-b-lg">
        <DynamicHtmlTag type="div" className="max-h-table overflow-auto min-w-full bg-white">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-slate-100">
                <th className="py-2 px-2 text-left font-medium text-slate-100 text-xs">Type</th>
                <th className="py-2 px-2 text-left font-medium text-slate-100 text-xs hidden md:table-cell">Nom du document</th>
                <th className="py-2 px-2 text-center lg:text-left font-medium text-slate-100 text-xs">Date</th>
                <th className="py-2 px-2 text-center font-medium text-slate-100 text-xs w-1/6">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="cursor-pointer text-xs font-bold border-none lg:border-b lg:border-slate-100">
                <td className="py-3 px-3">
                  <DynamicHtmlTag type="div" className="flex gap-3 lg:gap-5">
                    <DynamicHtmlTag type="div" className="custom-checkbox hidden lg:flex items-center gap-2 overflow-hidden">
                      <CustomInput
                        type="checkbox"
                        id="checkbox-two"
                        checked={checkboxes.checkbox_two}
                        onChange={() => handleCheckboxChange("checkbox_two")}
                      />
                      <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px] hidden lg:block" htmlFor="checkbox-two">
                        <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                      </CustomLabel>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="span">Prescription</DynamicHtmlTag>
                  </DynamicHtmlTag>
                </td>
                <td className="py-3 px-3 hidden lg:block ">
                  <DynamicHtmlTag type="span" className="flex items-center">
                    Ordonnance radio
                  </DynamicHtmlTag>
                </td>
                <td className="py-3 px-3 text-center lg:text-left">
                  <DynamicHtmlTag type="span">10.07.2024</DynamicHtmlTag>
                </td>
                <td className="py-3 px-3 w-1/6">
                  <DynamicHtmlTag type="div" className="flex items-center space-x-2 lg:space-x-4 justify-center">
                    <CustomButton type="button">
                      <CustomImage className="w-5 h-5 max-w-max" src="/images/eye.svg" alt="pencil-edit" width={22} height={22} />
                    </CustomButton>
                    <CustomButton className="cursor-not-allowed" disabled as="button">
                      <CustomImage className="w-5 h-5 max-w-max" src="/images/download-doc-icon.svg" alt="download" width={22} height={22} />
                    </CustomButton>
                    <CustomButton className="cursor-not-allowed" disabled as="button">
                      <CustomImage className="w-5 h-5 max-w-max" src="/images/file-doc-icon.svg" alt="file" width={22} height={22} />
                    </CustomButton>
                    <CustomButton className="cursor-pointer" as="button">
                      <CustomImage
                        className="w-5 h-5 max-w-max"
                        src="/images/trash.svg"
                        alt="trash"
                        width={22}
                        height={22}
                        onClick={openDeleteDocumentModal}
                      />
                    </CustomButton>
                  </DynamicHtmlTag>
                </td>
              </tr>
              <tr className="md:hidden">
                <td colSpan={4} className="pb-2 px-3">
                  <DynamicHtmlTag type="div" className="bg-gray-400 bg-opacity-40 rounded-lg text-xs font-bold w-full px-3 gap-4">
                    <DynamicHtmlTag type="div" className="text-gray-500">
                      Nom du type
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="span" className=" font-semibold text-black">
                      Ordonnance radio
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </td>
              </tr>
            </tbody>
          </table>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      {/* Delete Document Modal  */}
      <DeleteDocument
        isOpen={isModalOpen && modalType === "deleteDocumentModal"}
        onClose={closeDeleteDocumentModal}
        icon={<FaTrash className="text-red-500" />}
        title="Supprimer un formations"
        description={`Êtes-vous sûr de vouloir supprimer \n ?`}
      />
    </DynamicHtmlTag>
  );
};

export default PractitionerPrescriptionsCare;
