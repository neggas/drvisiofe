"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { CustomButton, CustomImage, CustomInput, CustomLabel, CustomModal, DynamicHtmlTag, HeadingTag } from "@/components";
import {
  fetchLatestCguApi,
  fetchLatestNoticeApi,
  validateCguApi,
  validateNoticeApi,
  CguProps,
  NoticeProps,
  ValidateCguPayload,
  ValidateNoticePayload,
  setLocalStorageData,
} from "@/utility";
import { selectLoginResponse } from "@/store/reducers/loginSlice";

interface TermConditionNoticeProps {
  isOpen: boolean;
  onClose: () => void;
}

const CguAndNoticeTerm: React.FC<TermConditionNoticeProps> = ({ isOpen, onClose }) => {
  const loggedInUser = useSelector(selectLoginResponse);
  const scrollableCguRef = useRef(null);
  const scrollableNoticeRef = useRef(null);

  const [isCguScrollToBottom, setIsCguScrollToBottom] = useState<boolean>(false);
  const [isNoticeScrollToBottom, setIsNoticeScrollToBottom] = useState<boolean>(false);
  const [isAcceptCgu, setIsAcceptCgu] = useState<boolean>(false);
  const [isAcceptNotice, setIsAcceptNotice] = useState<boolean>(false);
  const [isAcceptTermError, setIsAcceptTermError] = useState<boolean>(false);
  const [validateCguError, setValidateCguError] = useState<string | null>(null);
  const [validateNoticeError, setValidateNoticeError] = useState<string | null>(null);
  const [isValidateTermError, setIsValidateTermError] = useState<boolean>(false);

  const [cgu, setCgu] = useState<CguProps | null>(null);
  const [notice, setNotice] = useState<NoticeProps | null>(null);

  useEffect(() => {
    setIsCguScrollToBottom(false);
    setIsNoticeScrollToBottom(false);
    setIsAcceptCgu(false);
    setIsAcceptNotice(false);
    setIsAcceptTermError(false);
    setValidateCguError(null);
    setValidateNoticeError(null);
    setIsValidateTermError(false);
    setCgu(null);
    setNotice(null);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && loggedInUser?.data?.id && (!loggedInUser.data.cguOk || !loggedInUser.data.noticeOk)) {
      if (loggedInUser.data.cguOk) {
        setIsCguScrollToBottom(true);
        setIsValidateTermError(false);
      } else {
        fetchLatestCgu();
      }
      if (loggedInUser.data.noticeOk) {
        setIsNoticeScrollToBottom(true);
        setIsValidateTermError(false);
      } else {
        fetchLatestNotice();
      }
    }
  }, [loggedInUser, isOpen]);

  useEffect(() => {
    const cguElement: any = scrollableCguRef.current;
    if (cguElement) {
      if (cguElement?.scrollHeight - cguElement?.scrollTop === cguElement?.clientHeight) {
        setIsCguScrollToBottom(true); // Enable the button
      } else {
        setIsCguScrollToBottom(false); // Disable the button
      }
    }

    const noticeElement: any = scrollableNoticeRef.current;
    if (noticeElement) {
      if (noticeElement?.scrollHeight - noticeElement?.scrollTop === noticeElement?.clientHeight) {
        setIsNoticeScrollToBottom(true); // Enable the button
      } else {
        setIsNoticeScrollToBottom(false); // Disable the button
      }
    }
  }, [cgu, notice]);

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

  const renderHtmlContent = (content: string) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
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
  };

  const handleAcceptTerm = async () => {
    setValidateCguError(null);
    setValidateNoticeError(null);

    if (!isCguScrollToBottom || !isNoticeScrollToBottom) {
      setIsValidateTermError(true);
      return;
    }

    if (loggedInUser?.data?.id && !loggedInUser.data.cguOk && !isAcceptCgu) {
      setIsAcceptTermError(true);
    } else if (loggedInUser?.data?.id && !loggedInUser.data.noticeOk && !isAcceptNotice) {
      setIsAcceptTermError(true);
    } else {
      setIsAcceptTermError(false);
      // Validate Cgu
      if (cgu?.id) {
        try {
          const validateCguPayload: ValidateCguPayload = { email: "", typeUser: "PATIENT", cguId: null };
          validateCguPayload.email = loggedInUser?.data?.email ?? "";
          validateCguPayload.cguId = cgu?.id ?? null;
          await validateCguApi(validateCguPayload);
          setLocalStorageData("isTermsAccepted", true);
          onClose();
        } catch (err: any) {
          let errorMessage = err.response?.data?.message;
          if (err?.response?.data?.codeMessage === "CGU_ALREADY_ACCEPTED") {
            errorMessage = "Le patient a déjà accepté la cgu.";
          }
          setValidateCguError(errorMessage);
        }
      }

      // Validate Notice
      if (notice?.id) {
        try {
          const validateNoticePayload: ValidateNoticePayload = { email: "", typeUser: "PATIENT", noticeId: null };
          validateNoticePayload.email = loggedInUser?.data?.email ?? "";
          validateNoticePayload.noticeId = notice?.id ?? null;
          await validateNoticeApi(validateNoticePayload);
          setLocalStorageData("isTermsAccepted", true);
          onClose();
        } catch (err: any) {
          let errorMessage = err.response?.data?.message;
          if (err?.response?.data?.codeMessage === "NOTICE_ALREADY_ACCEPTED") {
            errorMessage = "Le patient a déjà accepté la notice.";
          }
          setValidateNoticeError(errorMessage);
        }
      }
    }
  };

  return (
    <CustomModal id="terms_modal" isOpen={isOpen} onClose={onClose} outsideClose={false} modalClassName="w-fit rounded-xl">
      <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
        <DynamicHtmlTag type="div" className="px-3 py-4 bg-white">
          <DynamicHtmlTag type="div" className="shadow-lg rounded-lg w-full p-5">
            <HeadingTag type="h4" className="text-2xs lg:text-sm font-bold text-center py-1">
              Les conditions générales d’utilisation et la notice d’information et de consentement de DrVisio ont évoluées, merci d’accepter et de
              valider celles-ci après les avoir lu.
            </HeadingTag>
            <DynamicHtmlTag type="div" className="flex justify-between mt-4 gap-4 lg:gap-8 flex-col lg:flex-row">
              {/* CGU Block Start Here */}
              {loggedInUser?.data?.id && !loggedInUser.data.cguOk && cgu && (
                <DynamicHtmlTag type="div" className={`w-full ${!notice} ? "lg:w-6/12" : ""`}>
                  <HeadingTag type="h4" className="text-[#4BA7DE] font-semibold text-xs lg:text-sm mb-2">
                    Conditions générales
                  </HeadingTag>
                  <DynamicHtmlTag type="div" className="border border-gray-300 rounded-xl p-3 pe-0">
                    <HeadingTag type="h4" className="text-black font-semibold text-2xs lg:text-xs uppercase border-b border-gray-300 pb-2 mb-2">
                      conditions générales d’utilisation drvisio
                    </HeadingTag>
                    <DynamicHtmlTag
                      ref={scrollableCguRef}
                      onScroll={handleCguScroll}
                      type="div"
                      className="overflow-y-scroll h-52 text-2xs lg:text-xs">
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
              )}
              {/* CGU Block End Here */}

              {/* Notice Block Start Here */}
              {loggedInUser?.data?.id && !loggedInUser.data.noticeOk && notice && (
                <DynamicHtmlTag type="div" className={`w-full ${!cgu} ? "lg:w-6/12" : ""`}>
                  <HeadingTag type="h4" className="text-[#4BA7DE] font-semibold text-2xs lg:text-sm mb-2">
                    Notice d’information et de consentement
                  </HeadingTag>
                  <DynamicHtmlTag type="div" className="border border-gray-300 rounded-xl p-3 pe-0">
                    <HeadingTag type="h4" className="text-black font-semibold text-2xs lg:text-xs uppercase border-b border-gray-300 pb-2 mb-2">
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
              )}
              {/* Notice Block End Here */}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className={`flex mt-2 p-0 lg:p-3 gap-3 flex-col lg:flex-row items-end justify-between`}>
              <DynamicHtmlTag type="div">
                {isValidateTermError && (
                  <CustomLabel className="text-red-500 text-2xs font-bold">
                    {`Pour accéder à votre espace Patient, vous devez valider les conditions générales d'utilisation et la notice d'information.`}
                  </CustomLabel>
                )}
                {isAcceptTermError && (
                  <CustomLabel className="text-red-500 text-2xs font-bold">Veuillez cocher les cases avant de valider.</CustomLabel>
                )}
                {validateCguError && <CustomLabel className="text-red-500 text-2xs font-bold">{validateCguError}</CustomLabel>}
                {validateNoticeError && <CustomLabel className="text-red-500 text-2xs font-bold">{validateNoticeError}</CustomLabel>}
                {loggedInUser?.data?.id && !loggedInUser.data.cguOk && cgu && (
                  <DynamicHtmlTag type="div" className={`${!isCguScrollToBottom ? "opacity-40" : ""} cstm-form-group flex items-center mb-2"`}>
                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
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
                    </DynamicHtmlTag>
                    <CustomLabel htmlFor="aide" className="ps-3 text-2xs lg:text-xs font-normal cstm-lable">
                      Jai lu et jaccepte les conditions générales dutilisation et les conditions générales de vente de DrVisio.
                    </CustomLabel>
                  </DynamicHtmlTag>
                )}

                {loggedInUser?.data?.id && !loggedInUser.data.noticeOk && notice && (
                  <DynamicHtmlTag type="div" className={`${!isNoticeScrollToBottom ? "opacity-40" : ""} cstm-form-group flex items-center mb-2"`}>
                    <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
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
                    </DynamicHtmlTag>
                    <CustomLabel htmlFor="aide" className="ps-3 text-2xs lg:text-xs font-normal cstm-lable">
                      Jai lu, jai compris et jaccepte le traitement de mes données de santé pour le service DrVisio précisé dans la notice
                      dinformation et de consentement.
                    </CustomLabel>
                  </DynamicHtmlTag>
                )}
              </DynamicHtmlTag>
              <CustomButton
                type="button"
                className={`w-4/12 lg:w-1/12 py-2 rounded-lg card-btn text-xs font-semibold text-white`}
                onClick={handleAcceptTerm}
                // disabled={isCguScrollToBottom || isNoticeScrollToBottom}
              >
                Valider
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </CustomModal>
  );
};
export default CguAndNoticeTerm;
