"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { WithoutAuth, HeadingTag, CustomButton, CustomImage, CustomForm, CustomInput, DynamicHtmlTag } from "@/components";
import {
  loginUnblockOtpSchema,
  VerifyOTPError,
  verifyLoginUnblockCodeApi,
  getLocalStorageData,
  setLocalStorageData,
  clearLocalStorageData,
} from "@/utility";
import { IoCloseSharp } from "react-icons/io5";
let currentOTPIndex: number = 0;

const LoginUnblockForm: React.FC = () => {
  const router = useRouter();
  const loggedInUser = useSelector(selectLoginResponse);

  const [loginUnblockToken, setLoginUnblockToken] = useState<string | null>(getLocalStorageData("loginUnblockToken", null));
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const [errors, setErrors] = useState<VerifyOTPError>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loginUnblockError, setLoginUnblockError] = useState<string | null>(null);
  const [loginUnblockSuccess, setLoginUnblockSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loggedInUser?.data?.id && !loginUnblockToken) {
      router.push("/");
    }
  }, [loginUnblockToken]);

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
    setLoginUnblockSuccess(null);
    setLoginUnblockError(null);
    setErrors({});
    setIsLoading(true);

    const otpValue = otp.join(""); // Combine OTP array into a single string

    try {
      // Validate the OTP using the Yup schema
      await loginUnblockOtpSchema.validate({ otp: otpValue }, { abortEarly: false });
      const loginUnblockToken = getLocalStorageData("loginUnblockToken", null);
      loginUnblockToken.securityCode = otpValue;
      const response = await verifyLoginUnblockCodeApi(loginUnblockToken);
      if (response.message) {
        // setLoginUnblockSuccess("Votre compte a été débloqué.");
      }

      setOtp(["", "", "", ""]);
      clearLocalStorageData("loginUnblockToken");
      const resetPasswordToken = { email: "", loginToken: "", typeUser: "PATIENT", currentLanguage: "FR" };
      resetPasswordToken.email = response.data.email;
      resetPasswordToken.loginToken = response.data.token;
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
        errorMessage = "Le jeton de déblocage de connexion a expiré.";
      }
      setLoginUnblockError(errorMessage);

      // Reset token is expired
      if (err?.response?.data?.codeMessage === "TOKEN_EXPIRED") {
        setTimeout(() => {
          setOtp(["", "", "", ""]);
          clearLocalStorageData("loginUnblockToken");
          router.push("/");
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row gap-x-5 gap-y-0 lg:gap-y-0 sm:pb-0 md:py-5 sm:px-0 md:px-5 h-full">
      <DynamicHtmlTag type="div" className="w-[100%] lg:w-[100%] rounded-lg md:shadow-lg p-5 sm:px-4 sm:py-2 gap-4 lg:gap-3">
        <DynamicHtmlTag type="div" className="flex justify-between items-center">
          <HeadingTag type="h1" className="sm:hidden lg:block font-bold text-sm lg:text-base w-full">
            Compte bloqué
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
        <DynamicHtmlTag type="div" className="sm:text-left lg:text-center lg:w-[50%] mt-5">
          <HeadingTag type="h1" className="font-bold text-sm lg:text-tex-center base w-full">
            {"Votre compte a été bloqué, veuillez saisir"}
          </HeadingTag>
          <HeadingTag type="h2" className="font-bold text-sm lg:text-tex-center base w-full">
            {"le code d’activation reçu par mail (valable 10 min)"}
          </HeadingTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag
          type="div"
          className="grid sm:grid-cols-1 gap-6 lg:gap-2 w-full login-screen-main mt-5 lg:mt-4 sm:pe-2 md:px-0 md:pe-2 2xl:pe-5">
          {loginUnblockError && (
            <DynamicHtmlTag type="div" className="items-center sm:w-[80%] md:w-[40%] lg:w-[30%] mb-3 m-auto bg-red-200 px-3 py-2 rounded-md">
              <DynamicHtmlTag type="div" className="text-red-500 text-xs flex gap-4">
                <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                {loginUnblockError}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          )}
          {loginUnblockSuccess && (
            <DynamicHtmlTag
              type="div"
              className="items-center sm:w-[80%] md:w-[40%] lg:w-[30%] mb-3 m-auto bg-opacity-25 bg-green-200 px-3 py-2 rounded-md">
              <DynamicHtmlTag type="div" className="text-green-600 text-xs flex gap-4">
                <CustomImage src={"/images/success.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                {loginUnblockSuccess}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          )}
          <DynamicHtmlTag type="div" className="lg:w-[50%]">
            <CustomForm onSubmit={handleVerifyOTP}>
              <DynamicHtmlTag type="div" className="flex gap-6 justify-center">
                {otp.map((_, index) => {
                  return (
                    <React.Fragment key={index}>
                      <CustomInput
                        ref={activeOTPIndex === index ? inputRef : null}
                        type="password"
                        name="otp"
                        className={`lg:text-[20px] font-bold p-3 text-black rounded-md lg:rounded-xl w-10 h-10 lg:w-14 lg:h-14 text-center border ${loginUnblockError || errors.otp ? "bg-red-50 border-red-50" : ""} focus-visible:border-gray-300 focus-visible:outline-none`}
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
              {errors.otp && (
                <DynamicHtmlTag type="div" className="text-red-500 text-sm text-center mt-1">
                  {errors.otp}
                </DynamicHtmlTag>
              )}
              {/* {invalidOtpError && (
                <DynamicHtmlTag type="div" className="min-h-4 mt-2 text-center">
                  <DynamicHtmlTag type="p" className="text-xs text-red-500 font-semibold">
                    {invalidOtpError}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              )} */}
              <DynamicHtmlTag type="div" className="sm:block mt-5 text-right m-auto">
                <DynamicHtmlTag type="div" className="sm:text-right">
                  <CustomButton
                    type="submit"
                    disabled={isLoading}
                    className="login-button cstm-btn card-btn lg:block text-xs lg:mt-0 sm:mt-5 lg:ml-auto">
                    {" "}
                    {isLoading ? "Confirmation..." : "Confirmer"}
                  </CustomButton>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </CustomForm>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="pb-10">
            <CustomImage
              src={"/images/login.svg"}
              alt="banner"
              width={236}
              height={200}
              className="sm:ml-auto lg:ml-auto img-fluid lg:mb-0 sm:w-2/3 md:max-w-[236px]"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default WithoutAuth(LoginUnblockForm);
