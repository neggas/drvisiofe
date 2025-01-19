"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { CustomButton, CustomImage, CustomForm, CustomInput, DynamicHtmlTag, HeadingTag } from "@/components";
import { loginOtpSchema, VerifyOTPError, verifyLoginCodeApi, resendLoginCodeApi, getLocalStorageData, clearLocalStorageData } from "@/utility";
import { setLoginResponse } from "@/store/reducers/loginSlice";
let currentOTPIndex: number = 0;

interface LoginOtpFormProps {
  referer: string | null;
  setLoginToken: (value: boolean) => void;
  closeLoginModal: (value: boolean) => void;
  isPractitioner: boolean;
}

const LoginOtpForm: React.FC<LoginOtpFormProps> = ({ referer, setLoginToken, closeLoginModal, isPractitioner }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const [errors, setErrors] = useState<VerifyOTPError>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loginOtpError, setLoginOtpError] = useState<string | null>(null);
  const [loginOtpSuccess, setLoginOtpSuccess] = useState<string | null>(null);

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
    setErrors({});
    setIsLoading(true);
    setLoginOtpError(null);
    setLoginOtpSuccess(null);

    const otpValue = otp.join(""); // Combine OTP array into a single string

    try {
      // Validate the OTP using the Yup schema
      await loginOtpSchema.validate({ otp: otpValue }, { abortEarly: false });
      const loginOtpRequest = getLocalStorageData("loginToken", null);
      loginOtpRequest.securityCode = otpValue;
      const response = await verifyLoginCodeApi(loginOtpRequest);
      if (response.message) {
        setLoginOtpSuccess(response.message);
      }

      setOtp(["", "", "", ""]);
      closeLoginModal(false);
      dispatch(setLoginResponse(response));
      clearLocalStorageData("loginToken");
      setLoginOtpSuccess(null);
      setLoginToken(false);
      if (referer && !referer.includes(pathname)) {
        router.push(referer);
      } else {
        router.push("/");
      }
      router.replace(pathname);
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
        errorMessage = "Le jeton de connexion a expiré.";
      }
      setLoginOtpError(errorMessage);

      // Reset token is expired
      if (err?.response?.data?.codeMessage === "TOKEN_EXPIRED") {
        setTimeout(() => {
          setOtp(["", "", "", ""]);
          setLoginToken(false);
          closeLoginModal(false);
          clearLocalStorageData("loginToken");
          router.push("/");
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLoginOtp = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setOtp(["", "", "", ""]);

    try {
      // Validate the OTP using the Yup schema
      const resendLoginOtpRequest = getLocalStorageData("loginToken", null);
      delete resendLoginOtpRequest.password;
      const response = await resendLoginCodeApi(resendLoginOtpRequest);

      if (response.message) {
        setLoginOtpSuccess(response.message);
      }
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
        errorMessage = "Le jeton de connexion a expiré.";
      }
      setLoginOtpError(errorMessage);

      // Reset token is expired
      if (err?.response?.data?.codeMessage === "TOKEN_EXPIRED") {
        setTimeout(() => {
          setOtp(["", "", "", ""]);
          setLoginToken(false);
          closeLoginModal(false);
          clearLocalStorageData("loginToken");
          router.push("/");
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DynamicHtmlTag type="div" className="sm:w-full lg:w-2/4 lg:mt-10">
        <HeadingTag type="h3" className="text-sm lg:text-xl font-bold text-center">
          Saisissez le code à 4 chiffres reçu par mail.
        </HeadingTag>
        <CustomForm onSubmit={handleVerifyOTP}>
          <DynamicHtmlTag type="div" className="my-3 lg:my-8">
            <DynamicHtmlTag type="div" className="flex gap-6 justify-center">
              {otp.map((_, index) => {
                return (
                  <React.Fragment key={index}>
                    <CustomInput
                      ref={activeOTPIndex === index ? inputRef : null}
                      type="password"
                      name="otp"
                      className={`lg:text-[20px] font-bold p-3 text-black rounded-md lg:rounded-xl w-10 h-10 lg:w-14 lg:h-14 text-center border ${loginOtpError || errors.otp ? "bg-red-50 border-red-50" : ""} focus-visible:border-gray-300 focus-visible:outline-none`}
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
              {(errors.otp || errors?.loginToken) && (
                <DynamicHtmlTag type="div" className="text-red-500 text-2xs lg:text-sm text-center font-semibold">
                  {errors.otp ?? errors.loginToken}
                </DynamicHtmlTag>
              )}
              {loginOtpError && (
                <DynamicHtmlTag type="div" className="text-red-500 text-2xs lg:text-sm text-center font-semibold">
                  {loginOtpError}
                </DynamicHtmlTag>
              )}
              {loginOtpSuccess && (
                <DynamicHtmlTag type="div" className="text-red-500 text-2xs lg:text-sm text-center font-semibold">
                  {loginOtpSuccess}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="sm:block lg:flex justify-between items-center mt-4 lg:mt-0">
            <DynamicHtmlTag type="div" className="ps-6">
              <DynamicHtmlTag type="p" className="font-semibold mt-4 lg:mt-0 sm:text-[10px] lg:text-[13px]">
                Merci de vérifier le code reçu par mail
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className=" sm:text-[10px] lg:text-[13px]">
                ou cliquer ici pour{" "}
                <CustomButton onClick={handleResendLoginOtp} className="underline text-[custom:blue] font-bold">
                  recevoir un nouveau code
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="sm:text-right">
              <CustomButton type="submit" disabled={isLoading} className="login-button cstm-btn card-btn lg:block text-xs lg:mt-0 sm:mt-5">
                {isLoading ? "Confirmation..." : "Confirmer"}
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomForm>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex sm:flex-row sm:items-end lg:flex-row lg:items-end justify-end sm:mt-5 lg:mt-0">
        {isPractitioner ? (
          <CustomImage
            src="/images/practitioner-banner.svg"
            alt="banner"
            width={236}
            height={200}
            className="img-fluid lg:mb-0 sm:w-1/3 md:max-w-[236px]"
          />
        ) : (
          <CustomImage src={"/images/login.svg"} alt="banner" width={236} height={200} className="img-fluid lg:mb-0 sm:w-1/3 md:max-w-[236px]" />
        )}
      </DynamicHtmlTag>
    </>
  );
};

export default LoginOtpForm;
