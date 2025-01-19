"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CustomButton, CustomImage, CustomLink, DynamicHtmlTag, HeadingTag } from "@/components";
import { fetchAvatarsApi, createPatientAvatarSchema } from "@/utility";
import { selectCreatePatientData, setCreatePatientData } from "@/store/reducers/createPatientsSlice";
import { IoCloseSharp } from "react-icons/io5";

export default function PractitionerRegisterSidebar() {
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
    <DynamicHtmlTag type="div" className="bg-base-100 flex-col lg:flex-row h-auto rounded-2xl min-h-full">
      <DynamicHtmlTag type="div" className="bg-base-100 w-full px-4 sm:pb-0 sm:pt-2 lg:py-4 rounded-full h-full">
        <DynamicHtmlTag type="div" className="">
          <DynamicHtmlTag type="div" className="flex items-center justify-between lg:justify-center mb-4 lg:mb-0">
            <CustomLink className="w-fit md:hidden previous-btn" href="/">
              <CustomImage
                src={"/images/back-btn.svg"}
                alt="back-arrow"
                width={30}
                height={30}
                className="img-fluid text-start rounded-full w-6 h-6"
              />
            </CustomLink>
            <DynamicHtmlTag type="div" className="font-bold text-xs flex items-center gap-1 lg:gap-3">
              <HeadingTag type="h3" className="text-xs md:text-lg leading-normal">
                Création de compte
              </HeadingTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="text-end md:hidden">
              <CustomButton className="w-fit inline-block p-1 revert-light-gradient rounded-full" onClick={""}>
                <IoCloseSharp className="w-4 h-4" />
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="hidden lg:block">
            <DynamicHtmlTag type="div" className="text-sm mt-28  text-center">
              Veuillez renseigner vos informations pour la création de votre compte.
            </DynamicHtmlTag>
            {/* for Validation CGU et notice para */}
            <DynamicHtmlTag type="div" className="text-sm text-center hidden">
              Merci de lire et de valider nos conditions générales d’utilisation ainsi que la notice d’information de DrVisio
            </DynamicHtmlTag>
            {/* for email validation */}
            <DynamicHtmlTag type="div" className="text-sm text-center hidden">
              Validation de votre email.
            </DynamicHtmlTag>
            {/* for profile Professional */}
            <DynamicHtmlTag type="div" className="hidden">
              <DynamicHtmlTag type="div" className="text-sm text-center">
                Nos équipes devrons vérifier vos documents afin de pouvoir activer votre compte.
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="text-sm text-center">
                Une fois vos pièces validées, vous serez contacté par DrVisio pour planifier votre formation.
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="mt-28 text-center">
              <DynamicHtmlTag type="span" className="text-base-400 text-sm">
                Je suis un praticien
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="">
              <CustomImage src="/images/practitioner-banner.svg" alt="sidebar" className="mx-auto sidebar-img" width={300} height={300} />
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
}
