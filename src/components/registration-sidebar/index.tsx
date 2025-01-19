"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CustomButton, CustomImage, CustomInput, CustomLabel, CustomLink, DynamicHtmlTag, HeadingTag } from "@/components";
import { fetchAvatarsApi, createPatientAvatarSchema } from "@/utility";
import { selectCreatePatientData, setCreatePatientData } from "@/store/reducers/createPatientsSlice";
import { FaCamera, FaRegTrashAlt, FaEye } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

export default function RegisterSidebar() {
  const dispatch = useDispatch();
  const createPatientData = useSelector(selectCreatePatientData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [avatars, setAvatars] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    // dispatch(setCreatePatientData(null));
    fetchAvatars();
  }, []);

  useEffect(() => {
    if (createPatientData?.avatar?.url) {
      setPreviewImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}${createPatientData.avatar.url}`);
    }
  }, [avatars]);

  const fetchAvatars = async () => {
    try {
      const data = await fetchAvatarsApi();
      // const avatars = data?.map((avatar: any) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${avatar?.file?.url}`);
      const avatars = data?.map((avatar: any) => avatar);
      setAvatars(avatars);
    } catch (error) {
      setAvatars([]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setPreviewImage("");
    const file = e.target.files?.[0];
    if (file) {
      try {
        await createPatientAvatarSchema.validate({ file }, { abortEarly: false });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        dispatch(setCreatePatientData({ ...createPatientData, avatar: file }));
      } catch (err: any) {
        if (err.inner) {
          const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
          setErrors(validationErrors);
        }
      } finally {
        // Nothing
      }
    }
  };

  const handleAvatarClick = (avatar: any) => {
    setErrors({});
    setPreviewImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}${avatar?.file?.url}`);
    dispatch(setCreatePatientData({ ...createPatientData, avatar: { id: avatar?.id } }));
  };

  const handleRemoveAvatar = (e: any) => {
    e.preventDefault();
    setErrors({});
    setPreviewImage("");
    dispatch(setCreatePatientData({ ...createPatientData, avatar: "" }));
  };

  return (
    <DynamicHtmlTag type="div" className="bg-base-100 w-full px-4 sm:pb-0 sm:pt-2 lg:py-4 rounded-2xl min-h-full lg:border">
      <DynamicHtmlTag type="div" className="lg:space-y-6">
        <DynamicHtmlTag type="div" className="flex items-center justify-between lg:justify-center mb-4 lg:mb-0">
          <CustomLink className="w-fit md:hidden previous-btn" href="/">
            <CustomImage src={"/images/back-btn.svg"} alt="back-arrow" width={30} height={30} className="img-fluid text-start rounded-full w-6 h-6" />
          </CustomLink>
          <DynamicHtmlTag type="div" className="font-bold text-xs flex items-center gap-1 lg:gap-3">
            <HeadingTag type="h3" className="text-xs md:text-lg leading-normal">
              {" "}
              Création de compte
            </HeadingTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="text-end md:hidden">
            <CustomButton className="w-fit inline-block p-1 revert-light-gradient rounded-full" onClick={""}>
              <IoCloseSharp className="w-4 h-4" />
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {/* Card Start */}
        <DynamicHtmlTag type="div" className=" max-w-max shadow-lg rounded-xl p-2">
          <DynamicHtmlTag type="div" className="">
            <CustomInput type="file" id="file-change" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <CustomLabel htmlFor="file-change" className="">
              <DynamicHtmlTag type="div" className="flex flex-col items-center mb-4">
                <DynamicHtmlTag
                  type="div"
                  className="relative bg-[#43ABE16E] w-20 h-20 rounded-full mb-4 border border-gray-500 overflow-hidden flex items-center justify-center group">
                  {previewImage ? (
                    <>
                      <CustomImage src={previewImage} alt="preview" width={100} height={50} className="w-full h-full rounded-full object-cover" />
                      {/* New box with icon on hover start */}
                      <DynamicHtmlTag
                        type="div"
                        className="absolute inset-0 bg-black bg-opacity-80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <DynamicHtmlTag type="div" className="flex items-center gap-2 justify-center">
                          {/* <CustomButton type="button">
                            <FaEye className="w-4 h-4 max-w-max text-white" />
                          </CustomButton> */}
                          <CustomButton type="button" onClick={handleRemoveAvatar}>
                            <FaRegTrashAlt className="w-4 h-4 max-w-max text-white" />
                          </CustomButton>
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      {/* New box with icon on hover end */}
                    </>
                  ) : (
                    <FaCamera className="w-8 h-8 text-sky-700" />
                  )}
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <CustomLabel
                    className="block text-center w-full text-xs lg:text-sm bg-customBlue text-white font-bold py-1 px-6 rounded-lg cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    Importer
                  </CustomLabel>
                  <CustomInput type="file" ref={fileInputRef} id="fileInput" className="hidden" onChange={handleFileChange} />
                </DynamicHtmlTag>
                {errors.file && (
                  <DynamicHtmlTag type="div" className="text-red-500 font-bold text-xs text-center mt-2">
                    {errors.file}
                  </DynamicHtmlTag>
                )}
              </DynamicHtmlTag>
            </CustomLabel>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="p" className="text-2xs mb-3 font-semibold">
            Si vous ne souhaitez pas ajouter de photo à votre profil, vous pouvez choisir une icône parmi les deux propositions.
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex gap-2 overflow-auto justify-center">
            {avatars.map((avatar: any, index) => {
              return (
                <DynamicHtmlTag key={index} type="div" className="rounded-xl p-1 border border-gray-300 flex justify-center">
                  <DynamicHtmlTag type="div" className="w-12 h-12 border border-gray-300 rounded-full m-auto">
                    <CustomImage
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${avatar?.file?.url}`}
                      onClick={(e: React.MouseEvent<HTMLElement>) => handleAvatarClick(avatar)}
                      alt={avatar?.file?.name}
                      className="w-full h-full object-cover rounded-full"
                      width={20}
                      height={20}
                    />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              );
            })}
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {/* Card End */}
        <DynamicHtmlTag type="div">
          <CustomImage src="/images/login.svg" alt="sidebar" className="mx-auto sidebar-img" width={300} height={300} />
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
}
