"use client";

import { ReactNode, useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomButton,
  DynamicHtmlTag,
  CustomModal,
  LoginForm,
  LoginOtpForm,
  CustomSelect,
  HeadingTag,
  VisioLogo,
  CustomImage,
  CustomLink,
  CustomListItems,
  CustomList,
  CguAndNoticeTerm,
  CustomInput,
  CustomLabel,
} from "@/components";
import {
  getLocalStorageData,
  setLocalStorageData,
  clearLocalStorageData,
  GLOBAL_LANGUAGE_OPTIONS,
  updatePatientNewsletterStatus,
  getPatientDeatils,
  getTeleconsultationNextPatientApi,
} from "@/utility";
import { MdClose } from "react-icons/md";
import { selectLoginResponse, logout } from "@/store/reducers/loginSlice";
import { IoCloseSharp } from "react-icons/io5";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { RootState } from "@/store";
import { closeModal, resetModal, openModal } from "@/store/reducers/modalSlice";
import { selectPatientDetailsData } from "@/store/reducers/patientDetailsSlice";

// Custom hook to encapsulate the logic for using MutationObserver
const useMutationObserver = (callback: MutationCallback, options?: MutationObserverInit) => {
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    observerRef.current = new MutationObserver(callback);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback]);

  const observe = (targetNode: Node) => {
    if (observerRef.current) {
      observerRef.current.observe(targetNode, options);
    }
  };

  return observe;
};

export default function Header(): ReactNode {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const openLoginAfterResetPassword = getLocalStorageData("openLoginAfterResetPassword", null);
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoginResponse);
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const modalType = useSelector((state: RootState) => state.modal.modalType);

  const [isClient, setIsClient] = useState<boolean>(false);
  const [loginToken, setLoginToken] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCguNoticeModalOpen, setIsCguNoticeModalOpen] = useState(false);
  const [isAcceptNewLetter, setIsAcceptNewLetter] = useState<boolean>(false);
  const [teleConsultation, setTeleconsultation] = useState();
  const fetchPatientData = useSelector(selectPatientDetailsData);

  // Profile Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const headerRef = useRef<HTMLDialogElement>(null);

  const isQuizzRoute = pathname.startsWith("/quizz");

  const logoSrc = isQuizzRoute ? "/images/logos/logoWhite.svg" : VisioLogo;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = (newLang: string) => {
    i18n
      .changeLanguage(newLang)
      .then(() => {})
      .catch(err => {});
  };

  const handleMutation: MutationCallback = mutationsList => {
    if (headerRef?.current && loggedInUser?.data?.id && (!loggedInUser.data.cguOk || !loggedInUser.data.noticeOk)) {
      const refElement = document.getElementById("terms_modal") as HTMLOListElement;
      if (!refElement) window.location.reload();
    }
  };
  const observe = useMutationObserver(handleMutation, { childList: true, attributes: true });

  const fetchTeleconsultationBookingTimer = useCallback(async () => {
    if (typeof loggedInUser?.data?.id === "number") {
      try {
        const data = await getTeleconsultationNextPatientApi(loggedInUser.data.id);
        setTeleconsultation(data?.data);

        if (data?.data) {
          setLocalStorageData("isTeleconsultationBooked", true);
        } else {
          setLocalStorageData("isTeleconsultationBooked", false);
        }
      } catch (error) {
        setLocalStorageData("isTeleconsultationBooked", false);
      }
    }
  }, [loggedInUser?.data?.id]);

  useEffect(() => {
    if (headerRef.current) {
      observe(headerRef.current);
    }
  }, [observe]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        if (detailsRef.current) {
          detailsRef.current.removeAttribute("open");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (loggedInUser?.data?.id && !getLocalStorageData("isTermsAccepted", false) && (!loggedInUser.data.cguOk || !loggedInUser.data.noticeOk)) {
      setIsCguNoticeModalOpen(true);
    }
    if (openLoginAfterResetPassword && openLoginAfterResetPassword == "modal") {
      setIsLoginModalOpen(true);
    }
  }, [loggedInUser, pathname, openLoginAfterResetPassword]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const data = await getPatientDeatils();
        const acceptNewsletter = data?.data?.patientData?.acceptNewsLetter ?? false;
        setIsAcceptNewLetter(acceptNewsletter);
        setLocalStorageData("acceptNewsletter", acceptNewsletter);
      } catch (error) {}
    };

    if (loggedInUser?.data?.id) {
      fetchPatientDetails();
    }
  }, [loggedInUser]);

  const openExitModal = () => {
    if (pathname !== "/login") {
      setIsLoginModalOpen(true);
    }
  };

  const closeLoginModal = () => {
    setLoginToken(false);
    setIsLoginModalOpen(false);
  };

  const openPractitionerModal = () => {
    if (pathname !== "/login") {
      setTimeout(() => dispatch(openModal("loginPractitionerModal")));
      dispatch(resetModal());
    }
  };

  const closePractitionerLoginModal = () => {
    setLoginToken(false);
    dispatch(closeModal());
  };

  const closeCguNoticeModal = () => setIsCguNoticeModalOpen(false);

  const handleLogout = () => {
    clearLocalStorageData("persist:root");
    clearLocalStorageData("access-token");
    clearLocalStorageData("refresh-token");
    setLocalStorageData("isLoggedIn", "false");
    clearLocalStorageData("isTermsAccepted");
    clearLocalStorageData("loginToken");
    clearLocalStorageData("forgotPasswordToken");
    clearLocalStorageData("resetPasswordToken");
    clearLocalStorageData("loginUnblockToken");
    clearLocalStorageData("openLoginAfterResetPassword");
    clearLocalStorageData("isTeleconsultationBooked");
    dispatch(logout()); // Dispatch logout action to clear Redux state
    router.push("/");
  };

  const handleSummaryClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDropdownOpen(prev => !prev);
    if (detailsRef.current) {
      if (isDropdownOpen) {
        detailsRef.current.removeAttribute("open");
      } else {
        detailsRef.current.setAttribute("open", "true");
      }
    }
  };

  const handleNewsletterCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsAcceptNewLetter(isChecked);
    setLocalStorageData("acceptNewsletter", isChecked);

    try {
      const formData = new FormData();
      formData.append("acceptNewsLetter", String(isChecked));
      await updatePatientNewsletterStatus(formData);
    } catch (error) {}
  };

  useEffect(() => {
    if (loggedInUser?.data?.id) {
      fetchTeleconsultationBookingTimer();
    }
  }, [fetchTeleconsultationBookingTimer, loggedInUser?.data?.id]);

  return (
    <DynamicHtmlTag type="div" ref={headerRef} className="w-full">
      <DynamicHtmlTag type="div" className={`TopHeader relative lg:mb-0 py-2 lg:py-3`}>
        <DynamicHtmlTag type="div" className="app-logo justify-self-start lg:w-2/12">
          <CustomLink href={"/"}>
            <CustomImage src={logoSrc} alt="logo" className="Logo w-24 md:w-28 xl:w-32 2xl:w-36" width={150} height={100} />
          </CustomLink>
        </DynamicHtmlTag>
        {teleConsultation ? (
          <DynamicHtmlTag
            type="div"
            className="header-timer bg-gradient-to-t from-indigo-600 to-indigo-700 py-0.5 px-2 rounded-xl lg:max-w-[40%] xl:max-w-[40%] 2xl:max-w-[40%] w-full relative lg:top-0 lg:mx-0 lg:right-0 lg:left-0 mt-1.5 lg:mt-0">
            <DynamicHtmlTag type="div" className="flex justify-between items-center">
              <DynamicHtmlTag type="div" className="w-3/5 lg:w-3/6">
                <HeadingTag type="h2" className="text-3xs 2xl:text-2xs text-white uppercase mb-1">
                  rendez-vous avec
                </HeadingTag>
                <DynamicHtmlTag type="div" className="flex items-center gap-1">
                  <CustomImage src="/images/doctor-img.svg" alt="doctor-img" width={35} height={35} className="w-7 lg:w-8 h-7 lg:h-8 rounded-full" />
                  <DynamicHtmlTag type="div">
                    <HeadingTag type="h3" className="text-3xs 2xl:text-2xs text-white font-medium">
                      Dr Franck Dupont
                    </HeadingTag>
                    <DynamicHtmlTag type="p" className="text-4xs lg:text-3xs text-white">
                      Médecin Généraliste
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="p" className="text-4xs lg:text-3xs text-white">
                      Bordeaux (33000)
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex lg:hidden gap-1 mt-2">
                  <HeadingTag type="h3" className="text-3xs lg:text-2xs text-white font-medium uppercase">
                    bénéficaire
                  </HeadingTag>
                  <DynamicHtmlTag type="p" className="text-3xs lg:text-2xs text-white">
                    Vous
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-2/6 custom-light-tooltip">
                <DynamicHtmlTag type="div" className="block">
                  <DynamicHtmlTag type="div" className="flex flex-col">
                    <HeadingTag type="h3" className="text-3xs 2xl:text-2xs text-white font-semibold uppercase">
                      bénéficaire
                    </HeadingTag>
                    <DynamicHtmlTag type="p" className="text-3xs text-white">
                      Adeline Arpin
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <CustomButton
                    data-tooltip-id="resume-call"
                    data-tooltip-place="bottom-start"
                    data-tooltip-html="Si vous allez en salle d’attente vous pourrez revenir sur votre tableau de bord à tout moment"
                    className="px-3 py-1 text-3xs border-0 bg-green-100 rounded-3xl text-white flex gap-2 items-center justify-center mt-1">
                    <CustomImage src="/images/video-icon.svg" alt="video-icon" width={12} height={7} />
                    <DynamicHtmlTag type="span">Rejoindre</DynamicHtmlTag>
                  </CustomButton>
                  <ReactTooltip id="resume-call" place="bottom" />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="p" className="text-3xs lg:text-2xs text-white hidden">
                  Le médecin vous recevra dès qu’il sera disponible.
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-2/5 lg:w-1/5">
                <DynamicHtmlTag type="div" className="flex items-center justify-center float-right">
                  <DynamicHtmlTag
                    type="div"
                    className="relative w-12 2xl:w-16 h-12 2xl:h-16 bg-[url(/images/light-border-count.svg)] bg-no-repeat bg-contain bg-center">
                    <DynamicHtmlTag
                      type="div"
                      className="absolute left-0 right-0 top-0 bottom-0 m-auto bg-[url(/images/half-border-count.svg)] bg-no-repeat bg-contain bg-center animate-spin"></DynamicHtmlTag>
                    <DynamicHtmlTag
                      type="div"
                      className="absolute inset-0 flex items-center justify-center flex-col text-white text-3xs lg:text-2xs font-bold">
                      <DynamicHtmlTag type="span">28</DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="text-[0.275rem] tracking-wider font-normal text-center leading-normal">
                        <DynamicHtmlTag type="p">MINUTES</DynamicHtmlTag>
                        <DynamicHtmlTag type="p">RESTANTES</DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        ) : (
          ""
        )}
        <DynamicHtmlTag type="div" className="flex items-center gap-2 md:gap-3 xl:gap-5 lg:justify-end">
          {isClient && loggedInUser?.data?.id ? (
            <>
              {pathname == "/teleconsult-doctor" ? (
                ""
              ) : (
                // /* Make an appointment button is hidden now on mobile it will show after login */
                <>
                  <CustomLink
                    href="/teleconsult-doctor"
                    className="card-btn text-white uppercase rounded-full py-2 md:px-4 lg:px-3 text-2xs font-semibold hidden md:block">
                    Prendre un rendez-vous
                  </CustomLink>
                  <CustomLink
                    href="/teleconsult-doctor"
                    className="md:hidden p-1 text-2xs btn btn-secondary uppercase justify-self-start rounded-lg"
                    title="Prendre un rendez-vous">
                    <CustomImage src="/images/teleconsult-icon.svg" alt="teleconsult-icon" width={20} height={27} className="opacity-50 mx-auto" />
                  </CustomLink>
                </>
              )}
              {pathname && !pathname.startsWith("/patient-dashboard") && (
                <CustomLink
                  className="md:hidden px-3 text-2xs btn btn-secondary uppercase justify-self-start sm:absolute1 lg:relative sm:top-[100%] lg:top-0 sm:right-[0%] sm:left-[0%] sm:mx-auto lg:mx-0 lg:right-0 lg:left-0"
                  href={`${loggedInUser?.data.patientStatus === "ACTIVATED" ? "/patient-dashboard" : ""}`}
                  title="Tableau de board">
                  <CustomImage src="/images/tdb-icon.svg" alt="tdb-icon" width={27} height={27} className="opacity-50" />
                </CustomLink>
              )}
              {/* Dashboard button is hidden now on mobile */}
              {pathname && !pathname.startsWith("/patient-dashboard") && (
                <CustomLink
                  className="hidden md:block lg:px-3 text-2xs btn btn-secondary uppercase justify-self-start absolute middle:relative top-[100%] middle:top-0 right-[0%] left-[0%] mx-auto middle:mx-0 middle:right-0 middle:left-0"
                  href={`${loggedInUser?.data.patientStatus === "ACTIVATED" ? "/patient-dashboard" : ""}`}>
                  Tableau de board
                </CustomLink>
              )}
              <CustomList className="z-[100] menu menu-horizontal p-0">
                <CustomListItems>
                  <DynamicHtmlTag type="details" ref={detailsRef} className="profile-dropdown relative">
                    <DynamicHtmlTag type="summary" onClick={handleSummaryClick} className="inline-block cursor-pointer">
                      <DynamicHtmlTag
                        type="p"
                        className="bg-black text-white uppercase rounded-full text-2xs w-10 md:w-11 lg:w-12 h-10 md:h-11 lg:h-12 flex items-center justify-center">
                        {/* <CustomImage
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${loggedInUser?.data?.avatar?.url}`}
                            placeholderSrc={"/images/dr-eric.webp"}
                            alt={loggedInUser?.data?.firstName}
                            width={30}
                            height={30}
                            className="w-16 h-16 sm:w-12 sm:h-12 rounded-full border-2"
                          /> */}
                        {loggedInUser?.data?.firstName.charAt(0)} {loggedInUser?.data?.lastName.charAt(0)}
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    {isDropdownOpen && (
                      <CustomList className="shadow-md rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 w-full min-w-64 lg:min-w-[15rem] xl:min-w-[17rem] absolute top-11 lg:top-12 -right-full md:right-0 transition-all ease-linear">
                        <DynamicHtmlTag type="div" ref={dropdownRef} className="bg-white p-4 mt-4 rounded-b-xl text-center relative z-20">
                          <CustomButton
                            onClick={() => setIsDropdownOpen(false)}
                            className="absolute top-2 right-4 w-fit inline-block custom-grey-btn p-0.5 rounded-full">
                            <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
                          </CustomButton>
                          <DynamicHtmlTag type="span" className="rounded-full border border-black p-1 lg:p-2 inline-block">
                            <CustomImage
                              src={
                                loggedInUser?.data?.avatar
                                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${loggedInUser.data.avatar.url}`
                                  : "https://via.placeholder.com/150"
                              }
                              alt="User Avatar"
                              width={80}
                              height={80}
                              className="rounded-full w-12 lg:w-20 h-12 lg:h-20"
                            />
                          </DynamicHtmlTag>
                          {/* <CustomImage src={avatarUrl} alt="User Avatar" width={80} height={80} className="w-20 rounded-full mx-auto my-5 border-2 p-1 border-blue" /> */}
                          <HeadingTag type="h4" className="text-base font-semibold text-blue">
                            {loggedInUser?.data?.firstName} {loggedInUser?.data?.lastName}
                          </HeadingTag>
                          <DynamicHtmlTag
                            type="div"
                            className={`custom-checkbox notice [&&]:flex justify-center items-start gap-0 my-2 mx-auto lg:max-w-[75%] xl:max-w-[65%]`}>
                            <CustomInput type="checkbox" checked={isAcceptNewLetter} onChange={handleNewsletterCheckboxChange} id="newLetter" />
                            <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="newLetter">
                              <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
                            </CustomLabel>
                            <DynamicHtmlTag type="span" className="text-2xs font-medium">
                              J{`'`}accepte de recevoir la newsletter DrVisio.
                            </DynamicHtmlTag>
                          </DynamicHtmlTag>
                          <CustomButton
                            type="button"
                            className="px-0 xl:px-auto btn btn-primary normal-case text-sm w-full py-2 rounded-2xl mt-1 mb-3 max-w-44"
                            onClick={handleLogout}>
                            Déconnexion
                          </CustomButton>
                        </DynamicHtmlTag>
                      </CustomList>
                    )}
                  </DynamicHtmlTag>
                </CustomListItems>
              </CustomList>
            </>
          ) : (
            <>
              <CustomButton
                className="md:block btn btn-secondary uppercase justify-self-start relative text-2xs py-1.5 md:py-2"
                type="button"
                onClick={openExitModal}>
                {t("login_navbar_text")}
              </CustomButton>
              {/* Practitioner button is hidden now on mobile */}
              <CustomButton
                className="hidden lg:block btn btn-secondary uppercase justify-self-start lg:px-3 sm:absolute lg:relative sm:top-[100%] lg:top-0 sm:right-[0%] lg:right-0 text-2xs"
                type="button"
                onClick={openPractitionerModal}>
                {t("practitioner_navbar_text")}
              </CustomButton>
            </>
          )}

          <DynamicHtmlTag type="div" className="md:block">
            <CustomSelect
              className="lang-btn btn btn-secondary uppercase justify-self-start cursor-pointer text-2xs px-1 md:px-4 py-1 md:py-1.5 [&&]:opacity-100 hover:opacity-100"
              placeholder={i18n.language === "fr" ? "FR" : "EN"}
              options={GLOBAL_LANGUAGE_OPTIONS}
              onChange={(selectedOption: any) => {
                if (selectedOption && selectedOption.value) {
                  handleLanguageChange(selectedOption.value);
                }
              }}
              value={i18n.language}
              isSearchable={false}
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      {teleConsultation ? (
        <DynamicHtmlTag
          type="div"
          className="header-timer-mob bg-gradient-to-t from-indigo-600 to-indigo-700 py-0.5 px-2 rounded-xl 2xl:max-w-xl w-full relative sm:mx-auto lg:mx-0 mb-2">
          <DynamicHtmlTag type="div" className="flex justify-between items-center">
            <DynamicHtmlTag type="div" className="w-3/5 lg:w-3/6">
              <HeadingTag type="h2" className="text-3xs lg:text-2xs text-white uppercase mb-1">
                rendez-vous avec
              </HeadingTag>
              <DynamicHtmlTag type="div" className="flex items-center gap-1">
                <CustomImage src="/images/doctor-img.svg" alt="doctor-img" width={35} height={35} className="w-7 lg:w-8 h-7 lg:h-8 rounded-full" />
                <DynamicHtmlTag type="div">
                  <HeadingTag type="h3" className="text-3xs lg:text-2xs text-white font-medium">
                    Dr Franck Dupont
                  </HeadingTag>
                  <DynamicHtmlTag type="p" className="text-4xs lg:text-3xs text-white">
                    Médecin Généraliste
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="text-4xs lg:text-3xs text-white">
                    Bordeaux (33000)
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex lg:hidden gap-1 mt-2">
                <HeadingTag type="h3" className="text-3xs lg:text-2xs text-white font-medium uppercase">
                  bénéficaire
                </HeadingTag>
                <DynamicHtmlTag type="p" className="text-3xs lg:text-2xs text-white">
                  Vous
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-2/6 custom-light-tooltip">
              <DynamicHtmlTag type="div" className="block">
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <HeadingTag type="h3" className="text-3xs lg:text-2xs text-white font-semibold uppercase">
                    bénéficaire
                  </HeadingTag>
                  <DynamicHtmlTag type="p" className="text-3xs text-white">
                    Adeline Arpin
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <CustomButton
                  data-tooltip-id="resume-call"
                  data-tooltip-place="bottom-start"
                  data-tooltip-html="Si vous allez en salle d’attente vous pourrez revenir sur votre tableau de bord à tout moment"
                  className="px-3 py-1 text-2xs border-0 bg-green-100 rounded-3xl text-white flex gap-2 items-center justify-center mt-2">
                  <CustomImage src="/images/video-icon.svg" alt="video-icon" width={12} height={7} />
                  <DynamicHtmlTag type="span">Rejoindre</DynamicHtmlTag>
                </CustomButton>
                <ReactTooltip id="resume-call" place="bottom" />
              </DynamicHtmlTag>
              <DynamicHtmlTag type="p" className="text-3xs lg:text-2xs text-white hidden">
                Le médecin vous recevra dès qu’il sera disponible.
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-2/5 lg:w-1/5">
              <DynamicHtmlTag type="div" className="flex items-center justify-center float-right">
                <DynamicHtmlTag
                  type="div"
                  className="relative w-14 lg:w-16 h-14 lg:h-16 bg-[url(/images/light-border-count.svg)] bg-no-repeat bg-contain bg-center">
                  <DynamicHtmlTag
                    type="div"
                    className="absolute left-0 right-0 top-0 bottom-0 m-auto bg-[url(/images/half-border-count.svg)] bg-no-repeat bg-contain bg-center animate-spin"></DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className="absolute inset-0 flex items-center justify-center flex-col text-white text-3xs lg:text-2xs font-bold">
                    <DynamicHtmlTag type="span">28</DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="text-4xs tracking-wider font-normal text-center leading-normal">
                      <DynamicHtmlTag type="p">MINUTES</DynamicHtmlTag>
                      <DynamicHtmlTag type="p">RESTANTES</DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      ) : (
        ""
      )}
      {/* Patient Login Modal Start */}
      <CustomModal isOpen={isLoginModalOpen} onClose={closeLoginModal} modalClassName="w-full md:w-full rounded-xl custom-modal-main">
        <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4 rounded-xl">
          <DynamicHtmlTag type="div" className="bg-white rounded-b-xl sm:py-0 md:py-5 2xl:py-10 sm:px-0 md:px-5 2xl:px-10">
            <DynamicHtmlTag type="div" className="rounded-b-xl md:rounded-lg shadow-lg bg-base-100 px-4 py-2 2xl:py-4 header-login-modal-main">
              <DynamicHtmlTag type="div" className="sm:flex-col-reverse md:flex-row lg:flex-row flex justify-between mb-8 2xl:mb-12">
                <HeadingTag type="h1" className="font-bold text-base 2xl:text-lg">
                  {t("login_navbar_text")}
                </HeadingTag>
                <DynamicHtmlTag type="div" className="flex items-center gap-4 w-full justify-between md:justify-end mb-8 md:mb-0">
                  <DynamicHtmlTag type="p" className="text-sm 2xl:text-base font-semibold text-base-400 sm:text-center w-full md:w-auto">
                    {t("patient_navbar_text")}
                  </DynamicHtmlTag>
                  <MdClose
                    onClick={closeLoginModal}
                    className="cursor-pointer text-blue border border-blue rounded-full w-6 h-6 p-1 flex-none hover:bg-primary hover:border-primary hover:text-white"
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              {!loginToken ? (
                <LoginForm
                  referer={null}
                  setLoginToken={setLoginToken}
                  closeLoginModal={setIsLoginModalOpen}
                  isOpenLoginModal={isLoginModalOpen}
                  loginFrom="login"
                  isPractitioner={false}
                />
              ) : (
                <LoginOtpForm referer={null} setLoginToken={setLoginToken} closeLoginModal={setIsLoginModalOpen} isPractitioner={false} />
              )}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </CustomModal>
      {/* Patient Login Modal End */}
      <CguAndNoticeTerm isOpen={isCguNoticeModalOpen} onClose={closeCguNoticeModal} />

      {/* Practitioner Login Modal */}
      {modalType === "loginPractitionerModal" && (
        <CustomModal
          id="login_practitioner"
          isOpen={isModalOpen && modalType === "loginPractitionerModal"}
          onClose={closePractitionerLoginModal}
          modalClassName="w-full md:max-w-full rounded-xl custom-modal-main">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4 rounded-xl">
            <DynamicHtmlTag type="div" className="bg-white rounded-b-xl sm:py-0 md:py-5 sm:px-0 md:px-5">
              <DynamicHtmlTag type="div" className="md:rounded-lg shadow-lg bg-base-100 px-4 py-2">
                <DynamicHtmlTag type="div" className="sm:flex-col-reverse md:flex-row lg:flex-row flex justify-between mb-8">
                  <HeadingTag type="h1" className="font-bold lg:text-base">
                    Connexion
                  </HeadingTag>
                  <DynamicHtmlTag type="div" className="flex items-center gap-4 w-full justify-between md:justify-end mb-8 md:mb-0">
                    <DynamicHtmlTag type="p" className="text-sm font-semibold text-base-400 sm:text-center w-full md:w-auto">
                      Je suis un praticien
                    </DynamicHtmlTag>
                    <MdClose
                      onClick={closePractitionerLoginModal}
                      className="cursor-pointer text-blue border border-blue rounded-full w-6 h-6 p-1 flex-none hover:bg-primary hover:border-primary hover:text-white"
                    />
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                {!loginToken ? (
                  <LoginForm
                    referer={null}
                    setLoginToken={setLoginToken}
                    closeLoginModal={setIsLoginModalOpen}
                    isOpenLoginModal={isLoginModalOpen}
                    loginFrom="login"
                    isPractitioner={true}
                  />
                ) : (
                  <LoginOtpForm referer={null} setLoginToken={setLoginToken} closeLoginModal={setIsLoginModalOpen} isPractitioner={true} />
                )}
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
      )}
      {/* Practitioner Login Modal End */}
    </DynamicHtmlTag>
  );
}
