"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  WithoutAuth,
  HeadingTag,
  CustomButton,
  CustomForm,
  CustomImage,
  CustomInput,
  CustomLabel,
  DynamicHtmlTag,
  CustomList,
  CustomListItems,
} from "@/components";
import { ForgotPasswordSchema, ForgotPasswordPayload, LoginError, forgotPasswordApi, setLocalStorageData } from "@/utility";
import { IoCloseSharp } from "react-icons/io5";

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();

  const [forgotPasswordPayload, setForgotPasswordPayload] = useState<ForgotPasswordPayload>({
    email: "",
    typeUser: "PATIENT",
    currentLanguage: "FR",
  });
  const [errors, setErrors] = useState<LoginError>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null);

  // Handle Submit Login
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    setForgotPasswordSuccess(null);
    setForgotPasswordError(null);

    try {
      await ForgotPasswordSchema.validate(forgotPasswordPayload, { abortEarly: false });
      const response = await forgotPasswordApi(forgotPasswordPayload);
      if (response.message) {
        // setForgotPasswordSuccess(response.message);
      }
      if (response?.data === null) {
        const forgotPasswordToken: any = {};
        forgotPasswordToken.loginToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        forgotPasswordToken.email = forgotPasswordPayload.email;
        forgotPasswordToken.typeUser = "PATIENT";
        setLocalStorageData("forgotPasswordToken", forgotPasswordToken);
        setForgotPasswordPayload(prevState => ({ ...prevState, ["email"]: "" }));
        setErrors(prevState => ({ ...prevState, ["email"]: "" }));
        router.push("/forgot-password-otp-verification");
      }
      const forgotPasswordToken = response.data;
      forgotPasswordToken.loginToken = forgotPasswordToken.token;
      forgotPasswordToken.typeUser = "PATIENT";
      delete forgotPasswordToken.securityCode;
      delete forgotPasswordToken.token;
      setLocalStorageData("forgotPasswordToken", forgotPasswordToken);
      setForgotPasswordPayload(prevState => ({ ...prevState, ["email"]: "" }));
      setErrors(prevState => ({ ...prevState, ["email"]: "" }));
      router.push("/forgot-password-otp-verification");
    } catch (err: any) {
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setErrors(validationErrors);
      }

      if (err.response?.data?.errorMessages) {
        const validationErrors = err.response.data.errorMessages.reduce((acc: any, { field, message }: any) => ({ ...acc, [field]: message }), {});
        setErrors(validationErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForgotPasswordPayload(prevState => ({ ...prevState, [name]: value }));
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
          className="login-screen-main grid sm:grid-cols-1 gap-2 md:gap-6 lg:gap-2 w-full md:h-[92%] xl:h-[92%] mt-2 lg:mt-4 pb-0 md:pb-5 sm:pe-2 md:px-0 md:pe-2 2xl:pe-5">
          <DynamicHtmlTag type="div">
            <DynamicHtmlTag type="div" className="inner-list-style">
              <CustomList listType="ol" className="list-inside list-style-number text-xs lg:text-sm font-semibold space-y-2">
                <CustomListItems>{"Entrez l'adresse e-mail associé à votre compte ci-dessous."}</CustomListItems>
                <CustomListItems>
                  Vous allez recevoir un email avec votre code. Ce code vous permettra de modifier votre mot de passe.
                </CustomListItems>
                <CustomListItems>Après la validation de votre nouveau mot de passe, vous pourrez vous connecter à votre compte.</CustomListItems>
              </CustomList>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="mt-6">
              {forgotPasswordError && (
                <DynamicHtmlTag type="div" className="items-center sm:w-[80%] md:w-[45%] lg:w-[45%] mb-3 m-auto bg-red-200 px-3 py-2 rounded-md">
                  <DynamicHtmlTag type="div" className="text-red-500 text-[13px] flex gap-4">
                    <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                    {forgotPasswordError}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              )}
              {forgotPasswordSuccess && (
                <DynamicHtmlTag
                  type="div"
                  className="items-center sm:w-[80%] md:w-[45%] lg:w-[45%] mb-3 m-auto bg-opacity-25 bg-green-200 px-3 py-2 rounded-md">
                  <DynamicHtmlTag type="div" className="text-green-600 text-[13px] flex gap-4">
                    <CustomImage src={"/images/success.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                    {forgotPasswordSuccess}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              )}
              <DynamicHtmlTag type="div" className="sm:w-full lg:w-8/12">
                <CustomForm onSubmit={handleLogin}>
                  <DynamicHtmlTag type="div" className="form-group mb-0 lg:mb-3">
                    <DynamicHtmlTag type="div" className="flex justify-between">
                      <CustomLabel className="cstm-label block text-xs 2xl:text-sm font-bold mb-1 2xl:mb-2">Adresse email</CustomLabel>
                      {errors.email && (
                        <DynamicHtmlTag type="div" className="text-red-500 text-xs">
                          {errors.email}
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="relative mb-1">
                      <CustomInput
                        type="text"
                        name="email"
                        placeholder="Adresse email"
                        className={`text-xs lg:text-[12px] md:font-bold p-3 2xl:p-4 rounded-lg w-full border outline-none ${errors.email || forgotPasswordError ? "border-red-500 placeholder:text-red-500 text-red-500" : "text-black border-[#e7e6e6]"}`}
                        value={forgotPasswordPayload.email}
                        onChange={handleFieldChange}
                      />
                      {errors.email && (
                        <DynamicHtmlTag type="div" className="absolute inset-y-0 right-3 flex items-center">
                          <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                        </DynamicHtmlTag>
                      )}
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="sm:block lg:flex justify-end items-center">
                    <DynamicHtmlTag type="div" className="sm:text-right">
                      <CustomButton type="submit" disabled={isLoading} className="login-button cstm-btn card-btn lg:block text-xs lg:mt-0 sm:mt-5">
                        {"Réinitialiser"}
                      </CustomButton>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </CustomForm>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex sm:flex-row sm:items-end justify-end lg:mt-0">
            <CustomImage
              src={"/images/login.svg"}
              alt="login-forget"
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

export default WithoutAuth(ForgotPasswordPage);
