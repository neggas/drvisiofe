"use client";

import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa6";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { CustomButton, CustomForm, CustomImage, CustomInput, CustomLabel, CustomLink, DynamicHtmlTag, LoginOtpForm } from "@/components";
import { loginSchema, LoginRequest, LoginError, loginApi, setLocalStorageData, getLocalStorageData, clearLocalStorageData } from "@/utility";
import Link from "next/link";

interface LoginFormProps {
  referer: string | null;
  loginFrom?: string | null;
  isOpenLoginModal?: boolean;
  setLoginToken: (value: boolean) => void;
  closeLoginModal: (value: boolean) => void;
  isPractitioner: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ referer, setLoginToken, closeLoginModal, loginFrom, isOpenLoginModal, isPractitioner }) => {
  const router = useRouter();
  const pathname = usePathname(); // Capture current route

  const [loginCredentials, setLoginCredentials] = useState<LoginRequest>({ email: "", password: "", typeUser: "PATIENT" });
  const [errors, setErrors] = useState<LoginError>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [login, setLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginBlockError, setLoginBlockError] = useState<boolean>(false);
  const [resetPasswordError, setResetPasswordError] = useState<boolean>(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<boolean>(false);
  const openLoginAfterResetPassword = getLocalStorageData("openLoginAfterResetPassword", null);

  useEffect(() => {
    // On Hide Login Modal
    if (!isOpenLoginModal) {
      setLoginToken(false);
      setLoginBlockError(false);
      setResetPasswordError(false);
      setResetPasswordSuccess(false);
      setLoginError(null);
      setLoginCredentials({ email: "", password: "", typeUser: "PATIENT" });
      setErrors({});
    }
  }, [isOpenLoginModal]);

  useEffect(() => {
    if (openLoginAfterResetPassword) {
      setResetPasswordSuccess(true);
      clearLocalStorageData("openLoginAfterResetPassword");
    }
  }, [openLoginAfterResetPassword]);

  // Handle Submit Login
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setLoginError(null);
    setIsLoading(true);
    setLoginBlockError(false);
    setResetPasswordError(false);
    setResetPasswordSuccess(false);

    try {
      await loginSchema.validate(loginCredentials, { abortEarly: false });
      const response = await loginApi(loginCredentials);

      setLoginToken(true);
      const loginToken = response.data;
      delete loginToken.securityCode;
      setLocalStorageData("loginToken", loginToken);
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
      if (err?.response?.data?.codeMessage === "BAD_CREDENTIALS") {
        errorMessage = "Email ou mot de passe invalide.";
      } else if (err?.response?.data?.codeMessage === "USER_BLOCKED") {
        setLoginBlockError(true);
      } else if (err?.response?.data?.codeMessage === "USER_MUST_CHANGE_PASSWORD") {
        setResetPasswordError(true);
        errorMessage = "Vous devez absolument changer le mot de passe.";
      }
      setLoginError(errorMessage);

      // User must change password
      if (err?.response?.data?.codeMessage === "USER_MUST_CHANGE_PASSWORD") {
        const resetPasswordToken: any = {};
        resetPasswordToken.email = loginCredentials.email;
        resetPasswordToken.loginToken = err?.response?.data?.token;
        resetPasswordToken.typeUser = "PATIENT";
        resetPasswordToken.currentLanguage = "FR";
        setLocalStorageData("resetPasswordToken", resetPasswordToken);
        setLoginCredentials({ email: "", password: "", typeUser: "PATIENT" });
      }

      // User is blocked
      if (err?.response?.data?.codeMessage === "USER_BLOCKED") {
        const loginUnblockToken: any = {};
        loginUnblockToken.email = loginCredentials.email;
        loginUnblockToken.loginToken = err?.response?.data?.token;
        loginUnblockToken.typeUser = "PATIENT";
        loginUnblockToken.currentLanguage = "FR";
        setLocalStorageData("loginUnblockToken", loginUnblockToken);
        setLoginCredentials({ email: "", password: "", typeUser: "PATIENT" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginCredentials(prevState => ({ ...prevState, [name]: value }));
    setErrors(prevState => ({ ...prevState, [name]: "" }));
  };

  // Handle password show/hide
  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const handleCreatePatient = () => {
    closeLoginModal(false);
    router.push("/create-patient");
  };

  const handleForgotPassword = () => {
    setLocalStorageData("loginFrom", loginFrom);
    closeLoginModal(false);
  };

  const handleLoginUnBlock = () => {
    setLocalStorageData("loginFrom", loginFrom);
    closeLoginModal(false);
  };

  const handleResetPassword = () => {
    setLocalStorageData("loginFrom", loginFrom);
    closeLoginModal(false);
  };

  return (
    <>
      {loginBlockError && (
        <DynamicHtmlTag type="div" className="items-center sm:w-[80%] md:w-[45%] lg:w-[45%] mb-3 m-auto bg-red-200 px-3 py-2 rounded-md">
          <DynamicHtmlTag type="div" className="text-red-500 text-[13px] flex gap-4">
            <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
            <DynamicHtmlTag type="div">
              Votre compte a été bloqué.{" "}
              <Link onClick={handleLoginUnBlock} title="Cliquez pour débloquer" className="text-sky-500 font-semibold" href="/login/unblock">
                Cliquez ici pour le débloquer
              </Link>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}
      {resetPasswordError && (
        <DynamicHtmlTag type="div" className="items-center sm:w-[80%] md:w-[45%] lg:w-[45%] mb-3 m-auto bg-red-200 px-3 py-2 rounded-md">
          <DynamicHtmlTag type="div" className="text-red-500 text-[13px] flex gap-4">
            <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
            <DynamicHtmlTag type="div">
              Vous devez absolument changer le mot de passe.{" "}
              <Link onClick={handleResetPassword} title="Cliquez pour réinitialiser" className="text-sky-500 font-semibold" href="/reset-password">
                Cliquez ici pour le réinitialiser
              </Link>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}
      {resetPasswordSuccess && (
        <DynamicHtmlTag
          type="div"
          className="items-center sm:w-[80%] md:w-[50%] lg:w-[50%] mb-3 m-auto bg-opacity-25 bg-green-200 px-3 py-2 rounded-md">
          <DynamicHtmlTag type="div" className="text-green-600 text-[13px] flex gap-4">
            <CustomImage src={"/images/success.svg"} alt="banner" width={20} height={17} className="img-fluid" />
            Le mot de passe a été modifié. Vous pouvez vous connecter maintenant.
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}
      <DynamicHtmlTag type="div" className="sm:w-full lg:w-3/4">
        <CustomForm onSubmit={handleLogin}>
          <DynamicHtmlTag type="div" className="form-group mb-4 2xl:mb-7">
            <DynamicHtmlTag type="div" className="flex justify-between">
              <CustomLabel className="cstm-label block text-xs 2xl:text-sm font-bold mb-1 2xl:mb-2">Adresse email</CustomLabel>
              {(errors.email || errors.password) && (
                <DynamicHtmlTag type="div" className="text-red-500 text-xs">
                  {errors.email}
                </DynamicHtmlTag>
              )}
              {loginError && !loginBlockError && !resetPasswordError && (
                <DynamicHtmlTag type="div" className="text-red-500 text-xs">
                  {loginError}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="relative mb-1">
              <CustomInput
                type="text"
                name="email"
                placeholder="Adresse email"
                className={`text-xs lg:text-[12px] md:font-bold p-3 2xl:p-4 rounded-lg w-full border outline-none ${errors.email || errors.password || (loginError && !loginBlockError && !resetPasswordError) ? "border-red-500 placeholder:text-red-500 text-red-500" : "text-black border-[#e7e6e6]"}`}
                value={loginCredentials.email}
                onChange={handleFieldChange}
              />
              {(errors.email || errors.password || (loginError && !loginBlockError && !resetPasswordError)) && (
                <DynamicHtmlTag type="div" className="absolute inset-y-0 right-3 flex items-center">
                  <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="form-group mb-4 2xl:mb-5">
            <DynamicHtmlTag type="div" className="flex justify-between">
              <CustomLabel className="cstm-label block text-xs 2xl:text-sm font-bold mb-1 2xl:mb-2">Mot de passe</CustomLabel>
              {(errors.password || errors.email) && (
                <DynamicHtmlTag type="div" className="text-red-500 text-xs">
                  {errors.password}
                </DynamicHtmlTag>
              )}
              {loginError && !loginBlockError && !resetPasswordError && (
                <DynamicHtmlTag type="div" className="text-red-500 text-xs">
                  {loginError}
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="relative mb-1">
              <CustomInput
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mot de passe"
                className={`text-xs lg:text-[12px] md:font-bold p-3 2xl:p-4 rounded-lg w-full border outline-none ${errors.email || errors.password || (loginError && !loginBlockError && !resetPasswordError) ? "border-red-500 placeholder:text-red-500 text-red-500" : "text-black border-[#e7e6e6]"}`}
                value={loginCredentials.password}
                onChange={handleFieldChange}
                validate={false}
              />
              <CustomButton onClick={togglePasswordVisibility} className={"absolute inset-y-0 right-3 flex items-center cursor-pointer"}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </CustomButton>
              {(errors.email || errors.password || (loginError && !loginBlockError && !resetPasswordError)) && (
                <DynamicHtmlTag type="div" className="absolute inset-y-0 right-10 flex items-center">
                  <CustomImage src={"/images/alert.svg"} alt="banner" width={20} height={17} className="img-fluid" />
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="sm:block lg:flex justify-between items-center">
            <CustomLink href="/forgot-password" onClick={handleForgotPassword} className="text-xs 2xl:text-sm underline sm:block text-base-400">
              Mot de passe oublié
            </CustomLink>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="sm:block lg:flex justify-end items-center">
            <DynamicHtmlTag type="div" className="sm:text-right">
              <CustomButton
                type="submit"
                disabled={isLoading}
                className="login-button cstm-btn card-btn lg:block text-xs 2xl:text-sm mt-5 lg:mt-0 2xl:mt-2">
                {isLoading ? "Connexion en cours..." : "Connexion"}
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomForm>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="flex sm:flex-row sm:items-end lg:flex-row lg:items-end justify-between sm:mt-5 lg:mt-0">
        <CustomButton
          onClick={handleCreatePatient}
          className="login-button cstm-btn block card-btn text-white py-1 2xl:py-2 rounded-full text-xs 2xl:text-sm">
          Créer un compte
        </CustomButton>
        {isPractitioner ? (
          <CustomImage
            src="/images/practitioner-banner.svg"
            alt="banner"
            width={236}
            height={200}
            className="img-fluid lg:mb-0 sm:w-2/5 lg:w-1/3 2xl:w-2/4 max-w-52 2xl:max-w-60"
          />
        ) : (
          <CustomImage
            src={"/images/login.svg"}
            alt="banner"
            width={236}
            height={200}
            className="img-fluid lg:mb-0 w-5/12 lg:w-1/3 xl:w-1/4 2xl:w-1/3"
          />
        )}
      </DynamicHtmlTag>
    </>
  );
};

export default LoginForm;
