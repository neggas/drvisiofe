"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WithoutAuth, CustomImage, CustomButton, DynamicHtmlTag, HeadingTag, SideBar, LoginForm, LoginOtpForm } from "@/components";
import { getCurrentDateTime } from "@/utility";

interface LoginPageProps {
  referer: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ referer }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  let selectedDate = searchParams.get("localDate");
  selectedDate = selectedDate ?? getCurrentDateTime();
  let selectedSpecialty = searchParams.get("specialty");
  selectedSpecialty = selectedSpecialty ?? "médecine générale";

  const [localDate, setLocalDate] = useState(selectedDate);
  const [specialty, setSpecialty] = useState(selectedSpecialty);
  const [firstName, setFirstName] = useState(searchParams.get("firstName") ?? "");
  const [lastName, setLastName] = useState(searchParams.get("lastName") ?? "");
  const [filter, setFilter] = useState<boolean>(false);
  const [loginToken, setLoginToken] = useState<boolean>(false);
  const [closeLoginModalOpen, setCloseLoginModalOpen] = useState<boolean>(false);

  // Fetch Practitioners on specialty, name and data change
  useEffect(() => {
    const params = [
      { name: "specialty", value: specialty },
      { name: "localDate", value: localDate },
    ];

    if (firstName) {
      params.push({ name: "firstName", value: firstName });
    }

    if (lastName) {
      params.push({ name: "lastName", value: lastName });
    }

    if (filter) {
      router.push("/search?" + createQueryString(params));
    }
  }, [filter, specialty, localDate, firstName]);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (params: { name: string; value: string }[]) => {
      const urlsParams = new URLSearchParams(searchParams.toString());
      urlsParams.delete("firstName");
      urlsParams.delete("lastName");
      params.map((param: any) => {
        urlsParams.set(param.name, param.value);
      });
      return urlsParams.toString();
    },
    [searchParams]
  );

  const handleBackClick = (e: any, page: string): void => {
    if (page == "search") {
      router.push("search");
    } else {
      setLoginToken(false);
    }
  };

  const closeLoginModal = () => {
    // Do nothing
  };

  return (
    <>
      {!loginToken ? (
        <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row gap-x-5 gap-y-0 lg:gap-y-0 sm:pb-0 md:py-5 sm:px-0 md:px-5 h-full">
          <DynamicHtmlTag type="div" className="w-[100%] lg:w-[30%] xl:w-[20%] sidebar-main">
            <SideBar
              selectedSpecialty={specialty}
              setSeleectedSpecialty={setSpecialty}
              localDate={localDate}
              setLocalDate={setLocalDate}
              firstName={firstName}
              lastName={lastName}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setFilter={setFilter}
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="w-[100%] lg:w-[80%] h-[76%] md:h-full rounded-lg md:shadow-lg p-5 sm:px-4 sm:py-2 gap-4 lg:gap-3">
            <DynamicHtmlTag type="div" className="flex justify-between items-center">
              <CustomButton onClick={(e: any) => handleBackClick(e, "search")} className="w-fit sm:hidden lg:block previous-btn">
                <CustomImage src={"/images/back-btn.svg"} alt="back-arrow" width={30} height={30} className="img-fluid text-start rounded-full" />
              </CustomButton>
              <HeadingTag type="h1" className="font-bold text-xs lg:text-base text-center w-full">
                Merci de vous connecter ou de créer un compte
              </HeadingTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className="login-screen-main login-page-main grid sm:grid-cols-1 gap-2 md:gap-6 lg:gap-2 w-full md:h-[92%] xl:h-[92%] mt-2 lg:mt-4 sm:pe-2 md:px-0 md:pe-2 2xl:pe-5">
              <LoginForm
                referer={referer}
                setLoginToken={setLoginToken}
                closeLoginModal={closeLoginModal}
                loginFrom="search"
                isPractitioner={false}
              />
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      ) : (
        <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row gap-x-5 gap-y-0 lg:gap-y-0 sm:pb-0 md:py-5 sm:px-0 md:px-5 h-full">
          <DynamicHtmlTag type="div" className="w-[100%] lg:w-[30%] xl:w-[20%] sidebar-main">
            <SideBar
              selectedSpecialty={specialty}
              setSeleectedSpecialty={setSpecialty}
              localDate={localDate}
              setLocalDate={setLocalDate}
              firstName={firstName}
              lastName={lastName}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setFilter={setFilter}
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="w-[100%] lg:w-[70%] xl:w-[80%] rounded-lg md:shadow-lg p-5 sm:px-4 sm:py-2 gap-4 lg:gap-3 lg:block">
            <DynamicHtmlTag type="div" className="flex justify-between items-center">
              <CustomButton onClick={(e: any) => handleBackClick(e, "login")} className="w-fit sm:hidden lg:block previous-btn">
                <CustomImage src={"/images/back-btn.svg"} alt="back-arrow" width={30} height={30} className="img-fluid text-start rounded-full" />
              </CustomButton>
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className="grid sm:grid-cols-1 gap-6 lg:gap-2 w-full login-screen-main mt-5 lg:mt-4 sm:pe-2 md:px-0 md:pe-2 2xl:pe-5">
              <LoginOtpForm referer={referer} setLoginToken={setLoginToken} closeLoginModal={setCloseLoginModalOpen} isPractitioner={false} />
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      )}
    </>
  );
};

export default WithoutAuth(LoginPage);
