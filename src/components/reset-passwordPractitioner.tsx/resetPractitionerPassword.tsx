"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { WithoutAuth, HeadingTag, CustomButton, CustomForm, CustomImage, CustomInput, CustomLabel, DynamicHtmlTag } from "@/components";
import {
  ResetPasswordSchema,
  ResetPasswordPayload,
  ResetPasswordError,
  resetPasswordApi,
  clearLocalStorageData,
  getLocalStorageData,
  setLocalStorageData,
} from "@/utility";
import { IoCloseSharp, IoEyeOff } from "react-icons/io5";
import { FaEye } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";

const ResetPractitionerPasswordPage: React.FC = () => {
  const router = useRouter();
  const loggedInUser = useSelector(selectLoginResponse);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [resetPasswordToken, setResetPasswordToken] = useState<string | null>(getLocalStorageData("resetPasswordToken", null));

  const [resetPasswordPayload, setResetPasswordPayload] = useState<ResetPasswordPayload>({
    password: "",
    confirmPassword: "",
    typeUser: "PATIENT",
    currentLanguage: "FR",
  });
  const [errors, setErrors] = useState<ResetPasswordError>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loggedInUser?.data?.id && !resetPasswordToken) {
      router.push("/forgot-password");
    }
  }, [resetPasswordToken]);

  // Handle Submit Login
  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    setResetPasswordSuccess(null);
    setResetPasswordError(null);

    try {
      await ResetPasswordSchema.validate(resetPasswordPayload, { abortEarly: false });

      const resetPasswordRequest = getLocalStorageData("resetPasswordToken", null);
      resetPasswordRequest.password = resetPasswordPayload.password;
      resetPasswordRequest.confirmPassword = resetPasswordPayload.confirmPassword;
      const response = await resetPasswordApi(resetPasswordRequest);
      if (response.message) {
        // setResetPasswordSuccess("Le mot de passe a été modifié.");
      }

      clearLocalStorageData("resetPasswordToken");
      setErrors({});
      setResetPasswordPayload(prevState => ({ ...prevState, ["password"]: "" }));
      setErrors(prevState => ({ ...prevState, ["password"]: "" }));
      setResetPasswordPayload(prevState => ({ ...prevState, ["confirmPassword"]: "" }));
      setErrors(prevState => ({ ...prevState, ["confirmPassword"]: "" }));
      setTimeout(() => {
        const loginFrom = getLocalStorageData("loginFrom", null);
        clearLocalStorageData("loginFrom");
        if (loginFrom && loginFrom == "search") {
          setLocalStorageData("openLoginAfterResetPassword", "page");
          router.push("/login");
        } else {
          setLocalStorageData("openLoginAfterResetPassword", "modal");
          router.push("/");
        }
      }, 3000);
    } catch (err: any) {
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setErrors(validationErrors);
      }

      if (err.response?.data?.errorMessages) {
        const validationErrors = err.response.data.errorMessages.reduce((acc: any, { field, message }: any) => ({ ...acc, [field]: message }), {});
        setErrors(validationErrors);
      }

      let errorMessage = err.response?.data?.message;
      if (err?.response?.data?.codeMessage === "TOKEN_EXPIRED") {
        errorMessage = "Le jeton de réinitialisation du mot de passe a expiré.";
      }
      setResetPasswordError(errorMessage);

      // Reset token is expired
      if (err?.response?.data?.codeMessage === "TOKEN_EXPIRED") {
        setTimeout(() => {
          clearLocalStorageData("resetPasswordToken");
          router.push("/login");
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetPasswordPayload(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevState => ({ ...prevState, [name]: "" }));
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <DynamicHtmlTag type="div" className="sm:py-0 md:py-4 sm:px-0 md:px-5 h-full">
      <DynamicHtmlTag type="div" className="w-[100%] rounded-lg md:shadow-lg sm:px-2 lg:px-4 sm:py-2 lg:py-3 h-full">
        <DynamicHtmlTag type="div" className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-0 justify-between items-center mb-0 lg:mb-8">
          <HeadingTag type="h1" className="font-bold lg:text-base w-full">
            Réinitialisation du mot de passe
          </HeadingTag>
          <DynamicHtmlTag type="div" className="flex items-center gap-4 w-full justify-between md:justify-end">
            <DynamicHtmlTag type="p" className="text-sm font-semibold text-base-400 sm:text-center w-full md:w-auto">
              Je suis un patient
            </DynamicHtmlTag>
            <CustomButton onClick={handleClose} className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" type="button">
              <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag
          type="div"
          className="grid sm:grid-cols-1 gap-6 lg:gap-2 w-full login-screen-main mt-5 pb-5 lg:mt-4 sm:pe-2 md:px-0 md:pe-2 2xl:pe-5">
          {resetPasswordError && (
            <DynamicHtmlTag type="div" className="items-center sm:w-[80%] md:w-[45%] lg:w-[45%] mb-3 m-auto bg-red-200 px-3 py-2 rounded-md">
              <DynamicHtmlTag type="div" className="text-red-500 text-[13px] flex gap-4">
                <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                {resetPasswordError}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          )}
          {resetPasswordSuccess && (
            <DynamicHtmlTag
              type="div"
              className="items-center sm:w-[80%] md:w-[45%] lg:w-[45%] mb-3 m-auto bg-opacity-25 bg-green-200 px-3 py-2 rounded-md">
              <DynamicHtmlTag type="div" className="text-green-600 text-[13px] flex gap-4">
                <CustomImage src={"/images/success.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                {resetPasswordSuccess}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          )}
          <DynamicHtmlTag type="div" className="sm:w-full lg:w-7/12">
            <CustomForm onSubmit={handleResetPassword}>
              <DynamicHtmlTag type="div" className="flex flex-col space-y-2">
                <DynamicHtmlTag type="div" className="form-group mb-2">
                  <CustomLabel htmlFor="password" className="text-xs text-blue ps-1 font-semibold pb-1">
                    Créer un nouveau mot de passe*
                  </CustomLabel>
                  <DynamicHtmlTag type="div" className="relative">
                    <CustomInput
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      className={`text-xs lg:text-[12px] md:font-bold p-3 text-black rounded-lg w-full border ${errors.password ? "border-red-500" : "border-[#e7e6e6]"}`}
                      placeholder="Mot de passe"
                      value={resetPasswordPayload.password}
                      onChange={handleFieldChange}
                    />
                    <DynamicHtmlTag
                      type="div"
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={() => {
                        setPasswordVisible(!passwordVisible);
                      }}>
                      {passwordVisible ? <IoEyeOff className="h-4 w-4 text-blue" /> : <FaEye className="h-4 w-4 text-blue" />}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.password && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-xs ps-1 font-semibold">
                      {errors.password}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="form-group">
                  <CustomLabel htmlFor="password" className="text-xs text-blue ps-1 font-semibold pt-2 pb-1">
                    Confirmer le mot de passe*
                  </CustomLabel>
                  <DynamicHtmlTag type="div" className="relative">
                    <CustomInput
                      type={confirmPasswordVisible ? "text" : "password"}
                      name="confirmPassword"
                      className={`text-xs lg:text-[12px] md:font-bold p-3 text-black rounded-lg w-full border ${errors.confirmPassword ? "border-red-500" : "border-[#e7e6e6]"}`}
                      placeholder="Mot de passe"
                      value={resetPasswordPayload.confirmPassword}
                      onChange={handleFieldChange}
                    />
                    <DynamicHtmlTag
                      type="div"
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={() => {
                        setConfirmPasswordVisible(!confirmPasswordVisible);
                      }}>
                      {confirmPasswordVisible ? <IoEyeOff className="h-4 w-4 text-blue" /> : <FaEye className="h-4 w-4 text-blue" />}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {errors.confirmPassword && (
                    <DynamicHtmlTag type="div" className="text-red-500 text-xs ps-1 font-semibold">
                      {errors.confirmPassword}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="sm:block lg:flex justify-end items-center mt-8">
                <DynamicHtmlTag type="div" className="sm:text-right">
                  <CustomButton type="submit" disabled={isLoading} className="login-button cstm-btn card-btn lg:block text-xs lg:mt-0 sm:mt-5">
                    {"Confirmer et se connecter"}
                  </CustomButton>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </CustomForm>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex sm:flex-row sm:items-end justify-end sm:mt-5 lg:mt-0">
            <CustomImage
              src={"/images/practitioner-banner.svg"}
              alt="practitioner-banner"
              width={236}
              height={200}
              className="img-fluid lg:mb-0 w-5/12 lg:w-1/3 md:max-w-[236px]"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default WithoutAuth(ResetPractitionerPasswordPage);
