"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomFullScreenLoader, DynamicHtmlTag, Footer, Header } from "@/components";
import { usePathname, useRouter } from "next/navigation";
import { Provider } from "react-redux";
import "../styles/style.scss";
import "../../i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import { PersistGate } from "redux-persist/integration/react";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { useSelector } from "react-redux";
import store, { getPersistor } from "@/store/store";
import { getLocalStorageData } from "@/utility";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={getPersistor()}>
            <DynamicHtmlTagWrapper>
              <CustomFullScreenLoader />
              {children}
            </DynamicHtmlTagWrapper>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}

function DynamicHtmlTagWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); // To handle redirection
  const currentSplitURL = pathname.split("/");
  const loggedInUser = useSelector(selectLoginResponse);
  const isHomepage = pathname === "/";
  const isPatientDashboard = currentSplitURL[1] === "patient-dashboard";
  const isPractitionerDashboard = currentSplitURL[1] === "practitioner-dashboard";
  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", true);

  // Redirect to homepage if the user is not logged in and trying to access any page other than the homepage
  // useEffect(() => {
  //   if (!loggedInUser?.data?.id && pathname !== "/") {
  //     router.push("/"); // Redirect to the homepage
  //   }
  // }, [loggedInUser, pathname, router]);

  // Determine the class dynamically
  const bodyClassName = !isHomepage
    ? isPatientDashboard
      ? "dashboard-root patient-body-dashboard"
      : currentSplitURL[1] === "quizz"
        ? `home-quizz ${loggedInUser && isTeleconsultationBooked ? "quiz-after-login-main" : ""}`
        : isPractitionerDashboard
          ? "practitioner-home"
          : "root-home"
    : "root-home";

  return (
    <DynamicHtmlTag type="div" className={bodyClassName}>
      {currentSplitURL[1] !== "practitioner-dashboard" && <Header />}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      <main className={!isHomepage ? (isPractitionerDashboard ? "practitioner-dashboard" : "main-screen") : "main-screen"}>
        <DynamicHtmlTag type="div" className={!isHomepage ? "main-shadow" : ""}>
          <DynamicHtmlTag
            type="div"
            className={
              !isHomepage
                ? currentSplitURL[1] === "quizz" || currentSplitURL[1] === "patient-dashboard" || currentSplitURL[1] === "articles"
                  ? "h-full lg:h-auto"
                  : currentSplitURL[1] === "practitioner-dashboard"
                    ? "h-[96dvh]"
                    : "gradient-main pt-4 rounded-xl bg-gradient-to-l from-sky-500 to-indigo-500 h-full"
                : ""
            }>
            <DynamicHtmlTag
              type="div"
              className={
                !isHomepage
                  ? currentSplitURL[1] === "quizz" ||
                    currentSplitURL[1] === "patient-dashboard" ||
                    currentSplitURL[1] === "articles" ||
                    currentSplitURL[1] === "practitioner-dashboard"
                    ? "dashboard-main-bg-screen rounded-b-xl h-full"
                    : "main-bg-screen article bg-white rounded-b-xl h-full"
                  : ""
              }>
              <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </main>
      {currentSplitURL[1] !== "practitioner-dashboard" && <Footer />}
    </DynamicHtmlTag>
  );
}
