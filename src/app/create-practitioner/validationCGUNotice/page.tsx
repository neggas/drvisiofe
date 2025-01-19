"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DynamicHtmlTag, CustomButton, CustomImage, HeadingTag, CustomInput, CustomLabel } from "@/components";
import { useRouter } from "next/navigation";
import {
  fetchLatestCguApi,
  fetchLatestNoticeApi,
  CguProps,
  NoticeProps,
  registerPatientApi,
  setLocalStorageData,
  clearLocalStorageData,
} from "@/utility";
import { selectCreatePatientData, setCreatePatientData } from "@/store/reducers/createPatientsSlice";

export default function ValidationInstructions() {
  const router = useRouter();
  const dispatch = useDispatch();
  const createPatientData = useSelector(selectCreatePatientData);
  const scrollableCguRef = useRef(null);
  const scrollableNoticeRef = useRef(null);

  const [cgu, setCgu] = useState<CguProps | null>(null);
  const [notice, setNotice] = useState<NoticeProps | null>(null);
  const [isCguScrollToBottom, setIsCguScrollToBottom] = useState<boolean>(false);
  const [isNoticeScrollToBottom, setIsNoticeScrollToBottom] = useState<boolean>(false);
  const [isAcceptCgu, setIsAcceptCgu] = useState<boolean>(false);
  const [isAcceptNotice, setIsAcceptNotice] = useState<boolean>(false);
  const [isAcceptNewLetter, setIsAcceptNewLetter] = useState<boolean>(false);
  const [isAcceptTermError, setIsAcceptTermError] = useState<boolean>(false);
  const [isValidateTermError, setIsValidateTermError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>("");
  const [errors, setErrors] = useState<any>({});

  // If identity step form is not filled
  // useEffect(() => {
  //   if (!createPatientData || (createPatientData && !createPatientData.createIdentity && !createPatientData.medicalData)) {
  //     router.push("/create-patient/identity");
  //   }
  // }, []);

  useEffect(() => {
    fetchLatestCgu();
    fetchLatestNotice();
  }, []);

  const fetchLatestCgu = async () => {
    try {
      const data = await fetchLatestCguApi();
      setCgu(data?.data);
    } catch (error) {
      setCgu(null);
    }
  };

  const fetchLatestNotice = async () => {
    try {
      const data = await fetchLatestNoticeApi();
      setNotice(data?.data);
    } catch (error) {
      setCgu(null);
    }
  };

  // Function to check if the user has scrolled to the bottom of CGU
  const handleCguScroll = () => {
    const element: any = scrollableCguRef.current;
    if (element?.scrollHeight - element?.scrollTop === element?.clientHeight) {
      setIsCguScrollToBottom(true);
    } else {
      // setIsCguScrollToBottom(false);
      // setIsAcceptCgu(false);
    }
    setIsValidateTermError(false);
    setIsAcceptTermError(false);
  };

  // Function to check if the user has scrolled to the bottom of Notice
  const handleNoticeScroll = () => {
    const element: any = scrollableNoticeRef.current;
    if (element?.scrollHeight - element?.scrollTop === element?.clientHeight) {
      setIsNoticeScrollToBottom(true);
    } else {
      // setIsNoticeScrollToBottom(false);
      // setIsAcceptNotice(false);
    }
    setIsValidateTermError(false);
    setIsAcceptTermError(false);
  };

  const renderHtmlContent = (content: string) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  const handleAcceptTerm = async () => {
    if (!isCguScrollToBottom || !isNoticeScrollToBottom) {
      setIsValidateTermError(true);
      return;
    }

    if (!isAcceptCgu) {
      setIsAcceptTermError(true);
    } else if (!isAcceptNotice) {
      setIsAcceptTermError(true);
    } else {
      setIsAcceptTermError(false);
      setErrors({});
      setRegisterError("");

      let formData = new FormData();

      // Identity Data
      const createIdentity = createPatientData?.createIdentity;
      Object.keys(createIdentity).forEach(key => {
        if (key === "country" && createIdentity[key]) {
          formData.append(key, createIdentity[key].label.toString());
        } else if (key === "city" && createIdentity[key]) {
          formData.append(key, createIdentity[key].value.toString());
        } else if (key === "postalCode" && createIdentity[key]) {
          formData.append(key, createIdentity[key].value.toString());
        } else if (key === "spokenLanguages" && createIdentity[key]) {
          const languages = createIdentity[key].map((language: any) => language.value);
          formData.append(key, languages);
        } else if (createIdentity[key] && createIdentity[key] != null) {
          formData.append(key, createIdentity[key]);
        }
      });

      // Profile Avatar
      if (createPatientData?.avatar) {
        if (createPatientData.avatar?.id) {
          formData.append("avatarFileId", createPatientData.avatar.id); // Selected Avatar
        } else {
          formData.append("avatar", createPatientData.avatar); // Uploaded file
        }
      }

      // Medical Data
      const createMedicalData = createPatientData?.createMedicalData;
      if (createMedicalData) {
        Object.keys(createMedicalData).forEach(key => {
          if (key !== "personalPractitioner") {
            if (key === "countryContactPerson" && createMedicalData[key]) {
              formData.append(key, createMedicalData[key].label.toString());
            } else if (key === "cityContactPerson" && createMedicalData[key]) {
              formData.append(key, createMedicalData[key].value.toString());
            } else if (key === "postalCodeContactPerson" && createMedicalData[key]) {
              formData.append(key, createMedicalData[key].value.toString());
            } else if (key === "phoneContactPerson" && !createMedicalData[key]) {
              formData.append(key, "NOT_DEFINED");
            } else if (createMedicalData[key] && createMedicalData[key] != null) {
              formData.append(key, createMedicalData[key]);
            }
          }
          if (key === "personalPractitioner") {
            if (createMedicalData[key]?.value) {
              formData.append("personalPractionerId", createMedicalData[key]?.value.toString());
              formData.append("alreadyHasPractioner", "true");
            } else {
              formData.append("alreadyHasPractioner", "false");
            }
          }
        });

        if (createMedicalData["socialSecurityNumber"]) {
          formData.append("hasSocialSecurityNumber", "true");
        } else {
          formData.append("hasSocialSecurityNumber", "false");
        }
      } else {
        formData.append("phoneContactPerson", "NOT_DEFINED");
        formData.append("alreadyHasPractioner", "false");
      }

      formData.append("acceptedCgu", cgu?.version ?? "");
      formData.append("acceptedNotice", notice?.version ?? "");
      formData.append("acceptNewsLetter", isAcceptNewLetter ? "true" : "false");

      setIsLoading(true);
      clearLocalStorageData("emailExistError");

      try {
        await registerPatientApi(formData);
        dispatch(setCreatePatientData(null));
        router.push("/login");
      } catch (err: any) {
        // Yup validation errors
        if (err.inner) {
          const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
          setErrors(validationErrors);
        }

        // API validation errors
        if (err.response?.data?.errorMessages) {
          const validationErrors = err.response.data.errorMessages.reduce((acc: any, { field, message }: any) => ({ ...acc, [field]: message }), {});
          setErrors(validationErrors);
        }

        // API other errors
        let errorMessage = err.response?.data?.message;
        // if (err?.response?.data?.codeMessage === "USER_ALREADY_EXIST") {
        //   errorMessage = "L'e-mail a déjà été pris.";
        //   setLocalStorageData("emailExistError", errorMessage);
        //   router.push("/create-patient/identity");
        // }
        setRegisterError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <DynamicHtmlTag type="div" className="md:px-5 situation-screen-main h-full">
      <DynamicHtmlTag type="div" className="w-full sm:bg-white">
        <DynamicHtmlTag type="div" className="flex w-full flex-col md:flex-row gap-x-10 justify-between">
          {/* Cgu Block Start Here */}
          <DynamicHtmlTag type="div" className="w-full xl:w-1/2">
            <HeadingTag type="h4" className="text-sm text-primary opacity-85 font-bold my-3">
              Conditions générales
            </HeadingTag>
            <DynamicHtmlTag type="div" className="rounded-lg border border-gray-200 p-3">
              <HeadingTag type="h2" className="text-2xs xl:text-sm font-bold border-b-2 pb-2 me-3">
                CONDITIONS GÉNÉRALES D’UTILISATION DRVISIO
              </HeadingTag>
              <DynamicHtmlTag ref={scrollableCguRef} onScroll={handleCguScroll} type="div" className="overflow-y-scroll h-52 text-2xs lg:text-xs">
                <DynamicHtmlTag type="p" className="mb-1">
                  {cgu?.cguDataByLanguage.map(cguData => {
                    if (cguData.language == "FR") {
                      return renderHtmlContent(cguData.content);
                    }
                  })}
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          {/* Cgu Block End Here */}

          {/* Notice Block Start Here */}
          <DynamicHtmlTag type="div" className="w-full xl:w-1/2">
            <HeadingTag type="h4" className="text-xs lg:text-sm text-primary opacity-85 font-bold my-3 px-2">
              Notice d’information et de consentement
            </HeadingTag>
            <DynamicHtmlTag type="div" className="rounded-lg border border-gray-200 p-3">
              <HeadingTag type="h2" className="text-xs xl:text-sm 2xl:text-lg font-bold border-b-2 pb-2 me-4">
                NOTICE D’INFORMATION ET DE CONSENTEMENT
              </HeadingTag>
              <DynamicHtmlTag
                ref={scrollableNoticeRef}
                onScroll={handleNoticeScroll}
                type="div"
                className="overflow-y-scroll h-52 text-2xs lg:text-xs">
                <DynamicHtmlTag type="p" className="mb-1">
                  {notice?.noticeDataByLanguage.map(noticeData => {
                    if (noticeData.language == "FR") {
                      return renderHtmlContent(noticeData.content);
                    }
                  })}
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          {/* Notice Block End Here */}
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      {isValidateTermError && (
        <CustomLabel className="text-red-500 text-2xs font-semibold">
          {`Pour accéder à votre espace Patient, vous devez valider les conditions générales d'utilisation et la notice d'information.`}
        </CustomLabel>
      )}
      {isAcceptTermError && <CustomLabel className="text-red-500 text-2xs font-semibold">Veuillez cocher les cases avant de valider.</CustomLabel>}
      <DynamicHtmlTag type="div" className="flex flex-col md:flex-row lg:mt-3">
        <DynamicHtmlTag type="div" className="w-full md:w-9/12">
          <DynamicHtmlTag
            type="div"
            className={`${!isCguScrollToBottom ? "opacity-40" : ""} custom-checkbox notice [&&]:flex items-center gap-2 mb-2"`}>
            <CustomInput
              className=""
              type="checkbox"
              checked={isAcceptCgu}
              onChange={e => setIsAcceptCgu(e.target.checked)}
              id="acceptTerm"
              disabled={!isCguScrollToBottom}
            />
            <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="acceptTerm">
              <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
            </CustomLabel>
            <DynamicHtmlTag type="span" className="text-xs opacity-40 font-medium">
              Jai lu et jaccepte les conditions générales dutilisation et les conditions générales de vente de DrVisio.
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag
            type="div"
            className={`${!isNoticeScrollToBottom ? "opacity-40" : ""} custom-checkbox notice [&&]:flex items-center gap-2 mb-2"`}>
            <CustomInput
              onChange={e => setIsAcceptNotice(e.target.checked)}
              className=""
              checked={isAcceptNotice}
              type="checkbox"
              id="healthData"
              disabled={!isNoticeScrollToBottom}
            />
            <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="healthData">
              <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
            </CustomLabel>
            <DynamicHtmlTag type="span" className="text-xs opacity-40 font-medium">
              Jai lu, jai compris et jaccepte le traitement de mes données de santé pour le service DrVisio précisé dans la notice dinformation et de
              consentement.
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className={`custom-checkbox notice [&&]:flex items-center gap-2 mb-2"`}>
            <CustomInput
              className=""
              type="checkbox"
              checked={isAcceptNewLetter}
              onChange={e => setIsAcceptNewLetter(e.target.checked)}
              id="newLetter"
              // disabled={!isCguScrollToBottom || !isNoticeScrollToBottom}
            />
            <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="newLetter">
              <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
            </CustomLabel>
            <DynamicHtmlTag type="span" className="text-xs opacity-40 font-medium">
              Jaccepte de recevoir la newsletter DrVisio.
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex w-full md:w-3/12 h-auto mt-2 xl:mt-0">
          <CustomButton
            className={`text-xs xl:text-sm 2xl:text-lg cstm-btn ms-auto [&&]:mt-auto flex py-2 px-1 justify-center w-5/6 sm:w-36 md:w-full xl:w-48 view-more-btn rounded-full text-white font-semibold`}
            onClick={handleAcceptTerm}
            disabled={isLoading}>
            Créer mon compte
          </CustomButton>
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      {registerError && (
        <DynamicHtmlTag type="div" className="text-red-500 font-semibold text-2xs mt-1">
          {registerError}
        </DynamicHtmlTag>
      )}

      {Object.keys(errors).length > 0 &&
        Object.entries(errors).map(([key, value]) => {
          return (
            <DynamicHtmlTag key={key} type="div" className="text-red-500 font-bold text-2xs mt-1">
              {errors[key]}
            </DynamicHtmlTag>
          );
        })}
    </DynamicHtmlTag>
  );
}
