"use client";
import React, { FC, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { CustomModal, DynamicHtmlTag, HeadingTag, CustomButton, CustomForm, CustomSelect, CustomLabel, CustomInput, CustomImage } from "@/components";

interface PractitionerDocumentUploadModalProps {
  isOpen: boolean;
  title: string;
  documents?: { label: string; value: string }[];
  onClose: () => void;
  isDocumentFieldRequired?: boolean;
}

const PractitionerDocumentUploadModal: FC<PractitionerDocumentUploadModalProps> = ({
  isOpen,
  title,
  documents,
  onClose,
  isDocumentFieldRequired,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <CustomModal id="add_document" isOpen={isOpen} onClose={onClose} modalClassName="w-full sm:max-w-1/2 md:max-w-xl rounded-xl">
      <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
        <DynamicHtmlTag type="div" className="bg-base-100 p-4">
          <HeadingTag type="h3" className="text-blue font-semibold text-sm md:text-lg flex items-center gap-2">
            {title}
            <MdClose
              onClick={onClose}
              className="ms-auto cursor-pointer text-blue border border-blue rounded-full h-6 p-1 hover:bg-primary hover:border-primary hover:text-white w-6"
            />
          </HeadingTag>
          <CustomForm className="pt-5 space-y-3" onSubmit={e => e.preventDefault()}>
            {isDocumentFieldRequired && (
              <>
                <DynamicHtmlTag type="div" className="form-group w-full items-start">
                  <DynamicHtmlTag type="p" className="text-xs md:text-sm px-2 font-semibold text-blue">
                    Passeport ou Carte nationale d’identité
                  </DynamicHtmlTag>
                  <CustomSelect
                    name="documents"
                    options={documents}
                    placeholder="Passe-"
                    isClearable
                    className="w-full text-xs text-black placeholder-black border rounded-lg border-grey-400"
                  />
                </DynamicHtmlTag>
              </>
            )}
            <DynamicHtmlTag type="div" className="form-group w-full items-start">
              <CustomLabel htmlFor="file-change" className="">
                <CustomInput type="file" className="hidden" id="file-change" ref={fileInputRef} onChange={handleFileChange} />
                <DynamicHtmlTag type="div" className="w-full h-auto">
                  <DynamicHtmlTag type="div" className="flex items-center justify-center min:h-40 md:h-[411px] cstm-file-upload rounded-lg">
                    {imagePreview ? (
                      <CustomImage
                        key={imagePreview}
                        src={imagePreview}
                        alt="preview"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <DynamicHtmlTag type="div" className="flex flex-col items-center border-blue-300 rounded-lg p-8">
                        <CustomImage src="/images/cloud-icon.svg" alt="cloud" width={100} height={100} className="w-14 md:w-28" />
                        <DynamicHtmlTag type="div" className="text-base-100 font-bold mt-2">
                          <DynamicHtmlTag type="p" className="sm:text-2xs lg:text-sm">
                            Faites glisser votre fichier ici
                          </DynamicHtmlTag>
                          <DynamicHtmlTag type="p" className="mb-4 text-center sm:text-2xs lg:text-sm">
                            ou
                          </DynamicHtmlTag>
                          <CustomButton
                            onClick={handleButtonClick}
                            className="bg-white text-sky-200 text-sm md:text-base px-5 md:px-10 py-2 rounded-full relative left-8">
                            Importer
                          </CustomButton>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </CustomLabel>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex justify-end items-center">
              <CustomButton
                type="button"
                className={`w-36 btn btn-primary text-xs md:text-sm card-btn rounded-full ${!uploadedFile ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!uploadedFile}>
                Ajouter
              </CustomButton>
            </DynamicHtmlTag>
          </CustomForm>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </CustomModal>
  );
};

export default PractitionerDocumentUploadModal;
