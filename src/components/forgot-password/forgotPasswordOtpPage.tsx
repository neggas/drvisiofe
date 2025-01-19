"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { WithoutAuth, HeadingTag, CustomButton, CustomImage, CustomForm, CustomInput, DynamicHtmlTag } from "@/components";
import {
  forgotPasswordOtpSchema,
  VerifyOTPError,
  verifyForgotCodeApi,
  getLocalStorageData,
  setLocalStorageData,
  clearLocalStorageData,
} from "@/utility";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
let currentOTPIndex: number = 0;

const ForgotPasswordOtpPage: React.FC = () => {
  const router = useRouter();
  const loggedInUser = useSelector(selectLoginResponse);

  const [forgotPasswordToken, setForgotPasswordToken] = useState<string | null>(getLocalStorageData("forgotPasswordToken", null));
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const [errors, setErrors] = useState<VerifyOTPError>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [forgotPasswordOtpError, setForgotPasswordOtpError] = useState<string | null>(null);
  const [forgotPasswordOtpSuccess, setForgotPasswordOtpSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loggedInUser?.data?.id && !forgotPasswordToken) {
      router.push("/forgot-password");
    }
  }, [forgotPasswordToken]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;
    let newOTP = [...otp];

    // Handle single character input
    newOTP[index] = value ? value.slice(-1) : "";
    setOtp(newOTP);

    // Move to the next input field if the current one is filled, otherwise stay
    if (value && index < 7) {
      setActiveOTPIndex(index + 1);
    } else if (!value && index > 0) {
      setActiveOTPIndex(index - 1);
    }

    setErrors(prevErrors => ({ ...prevErrors, otp: "" }));
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text").slice(0, 4); // Only consider the first 4 characters
    let newOTP = pasteData.split("").slice(0, 4); // Split pasted value into an array and limit to 4 characters

    // Ensure newOTP has length 4 by filling with empty strings if necessary
    while (newOTP.length < 4) {
      newOTP.push("");
    }

    setOtp(newOTP);
    // Set focus to the next empty index or the last one
    const nextIndex = newOTP.findIndex(char => char === "");
    setActiveOTPIndex(nextIndex !== -1 ? nextIndex : 3);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    currentOTPIndex = index;
    if (event.key === "Backspace") {
      event.preventDefault();

      if (otp[index]) {
        setOtp(prevOtp => {
          const newOtp = [...prevOtp];
          newOtp[index] = "";
          return newOtp;
        });
      } else if (index > 0) {
        // If no value, move to the previous field
        setActiveOTPIndex(index - 1);
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      setActiveOTPIndex(index - 1);
    } else if (event.key === "ArrowRight" && index < otp.length - 1) {
      setActiveOTPIndex(index + 1);
    }
  };

  const handleVerifyOTP = async (e: any) => {
    e.preventDefault();
    setForgotPasswordOtpError(null);
    setForgotPasswordOtpSuccess(null);
    setErrors({});
    setIsLoading(true);

    const otpValue = otp.join(""); // Combine OTP array into a single string

    try {
      // Validate the OTP using the Yup schema
      await forgotPasswordOtpSchema.validate({ otp: otpValue }, { abortEarly: false });
      const loginOtpRequest = getLocalStorageData("forgotPasswordToken", null);
      loginOtpRequest.securityCode = otpValue;
      const response = await verifyForgotCodeApi(loginOtpRequest);
      if (response.message) {
        // setForgotPasswordOtpSuccess(response.message);
      }

      setForgotPasswordOtpError("");
      setErrors({});
      setOtp(["", "", "", ""]);
      clearLocalStorageData("forgotPasswordToken");

      const resetPasswordToken = response.data;
      resetPasswordToken.loginToken = resetPasswordToken.token;
      resetPasswordToken.typeUser = "PATIENT";
      delete resetPasswordToken.securityCode;
      delete resetPasswordToken.token;
      setLocalStorageData("resetPasswordToken", resetPasswordToken);
      router.push("/reset-password");
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
      if (err?.response?.data?.codeMessage === "TOKEN_EXPIRED") {
        errorMessage = "Le jeton de mot de passe oublié a expiré.";
      }
      if (err?.response?.data?.httpStatus === "INTERNAL_SERVER_ERROR") {
        errorMessage = "Le code de sécurité est invalide.";
      }
      setForgotPasswordOtpError(errorMessage);

      // Reset token is expired
      if (err?.response?.data?.codeMessage === "TOKEN_EXPIRED") {
        setTimeout(() => {
          setOtp(["", "", "", ""]);
          clearLocalStorageData("loginToken");
          router.push("/");
        }, 3000);
      }

      // For wrong email navigation
      if (err?.response?.data?.httpStatus === "INTERNAL_SERVER_ERROR") {
        router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <DynamicHtmlTag type="div" className="sm:py-0 md:py-4 sm:px-0 md:px-5 h-full">
      <DynamicHtmlTag type="div" className="w-[100%] rounded-lg md:shadow-lg sm:px-2 lg:px-4 sm:py-2 lg:py-3 h-full">
        <DynamicHtmlTag type="div" className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-0 justify-between items-center mb-0 lg:mb-8">
          <HeadingTag type="h1" className="font-bold lg:text-base w-full">
            Mot de passe oublié
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
          className="login-screen-main grid sm:grid-cols-1 gap-2 md:gap-6 lg:gap-2 w-full md:h-[92%] xl:h-[92%] mt-2 lg:mt-4 pb-0 md:pb-5 pe-2 md:px-0 md:pe-2 2xl:pe-5 relative h-full">
          <DynamicHtmlTag type="div" className="sm:w-full lg:w-2/4">
            <CustomForm onSubmit={handleVerifyOTP}>
              <HeadingTag type="h2" className="font-bold text-sm lg:text-center w-full mb-4">
                Entrez le code d’activation reçu par mail pour réinitialiser votre mot de passe
              </HeadingTag>
              <DynamicHtmlTag type="div" className="flex gap-6 justify-center">
                {otp.map((_, index) => {
                  return (
                    <React.Fragment key={index}>
                      <CustomInput
                        ref={activeOTPIndex === index ? inputRef : null}
                        type="password"
                        name="otp"
                        className={`lg:text-[20px] font-bold p-3 text-black rounded-md lg:rounded-xl w-10 h-10 lg:w-14 lg:h-14 text-center border ${forgotPasswordOtpError || errors.otp ? "bg-red-50 border-red-50" : ""} focus-visible:border-gray-300 focus-visible:outline-none`}
                        onChange={e => handleOnChange(e, index)}
                        onKeyDown={e => handleOnKeyDown(e, index)}
                        onPaste={handlePaste}
                        value={otp[index]}
                        maxLength={1}
                      />

                      {index < otp.length - 1}
                    </React.Fragment>
                  );
                })}
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="min-h-5 mt-2">
                {errors.otp && (
                  <DynamicHtmlTag type="div" className="text-red-500 text-xs text-center mt-1 font-semibold">
                    {errors.otp}
                  </DynamicHtmlTag>
                )}
                {forgotPasswordOtpError && (
                  <DynamicHtmlTag type="div" className="text-red-500 text-xs text-center mt-1 font-semibold">
                    {forgotPasswordOtpError}
                  </DynamicHtmlTag>
                )}
                {forgotPasswordOtpSuccess && (
                  <DynamicHtmlTag type="div" className="text-red-500 text-xs text-center mt-1 font-semibold">
                    {forgotPasswordOtpSuccess}
                  </DynamicHtmlTag>
                )}
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="sm:block lg:flex justify-end items-center mt-8">
                <DynamicHtmlTag type="div" className="sm:text-right">
                  <CustomButton type="submit" disabled={isLoading} className="login-button cstm-btn card-btn lg:block text-xs lg:mt-0 sm:mt-5">
                    {" "}
                    {isLoading ? "Confirmation..." : "Confirmer"}
                  </CustomButton>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </CustomForm>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex sm:flex-row sm:items-end justify-end lg:mt-0">
            <CustomImage
              src={"/images/login.svg"}
              alt="login"
              width={236}
              height={200}
              className="img-fluid lg:mb-0 w-5/12 lg:w-1/4 xl:w-1/5 2xl:w-1/4"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default WithoutAuth(ForgotPasswordOtpPage);
