"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { showLoader, hideLoader } from "@/store/reducers/loaderSlice";
import { selectConsultationBooking } from "@/store/reducers/consultationBookingSlice";

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const loggedInUser = useSelector(selectLoginResponse);
  const consultationBooking = useSelector(selectConsultationBooking);
  const [authChecked, setAuthChecked] = useState(false);

  // List of protected route prefixes
  const protectedRoutes = ["/patient-dashboard", "/practitioner-dashboard", "/consultationprocess/"];

  // Check if the current pathname starts with any of the protected routes
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  // Steps in consultation booking process
  const stepPaths = ["beneficiary", "motifs", "situation", "dosier-medical", "informations", "payment"];

  useEffect(() => {
    dispatch(showLoader("checking-auth"));
    if (loggedInUser !== undefined) {
      setAuthChecked(true);
      dispatch(hideLoader());
    }
  }, [loggedInUser, dispatch]);

  useEffect(() => {
    if (authChecked && !loggedInUser && isProtected) {
      dispatch(showLoader("unauthorized"));
      const timer = setTimeout(() => {
        dispatch(hideLoader());
        router.push("/");
      }, 5000);
      return () => clearTimeout(timer);
    }

    // Check if the user is trying to access a consultation step they haven't completed yet
    if (authChecked && loggedInUser && isProtected) {
      const currentStepIndex = stepPaths.findIndex(step => pathname.includes(step)) + 1;

      // Check if the user has completed the necessary steps to access the current path
      if (consultationBooking.completedSteps < currentStepIndex) {
        const nextValidStep = `/consultationprocess/${stepPaths[consultationBooking.completedSteps]}`;
        router.push(nextValidStep); // Redirect to the first incomplete step
      }
    }
  }, [authChecked, loggedInUser, isProtected, pathname, consultationBooking.completedSteps, router, dispatch]);

  if (!authChecked || (isProtected && !loggedInUser)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
