"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { DynamicHtmlTag, CustomLink, CustomImage, SideBar, DoctorCard, CustomLoader, VisioLogo } from "@/components";
import { PractitionerType, searchPractitionerApi, getCurrentDateTime, NUMBER_OF_PRACTITIONERS_TO_FETCH, getLocalStorageData } from "@/utility";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { resetConsultationBooking } from "@/store/reducers/consultationBookingSlice";

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { ref, inView } = useInView();
  // const practitioners = useSelector(selectPractitionerData);

  useEffect(() => {
    dispatch(resetConsultationBooking());
  }, [dispatch]);

  let selectedDate = searchParams.get("localDate");
  selectedDate = selectedDate ?? getCurrentDateTime();
  let selectedSpecialty = searchParams.get("specialty");
  selectedSpecialty = selectedSpecialty ?? "médecine générale";

  const [localDate, setLocalDate] = useState(selectedDate);
  const [specialty, setSpecialty] = useState(selectedSpecialty);
  const [firstName, setFirstName] = useState(searchParams.get("firstName") ?? "");
  const [lastName, setLastName] = useState(searchParams.get("lastName") ?? "");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [practitioners, setPractitioners] = useState<PractitionerType[]>([]);
  const [practitionerError, setPractitionerError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [pageLoader, setPageLoader] = useState<boolean>(true);
  const [filter, setFilter] = useState<boolean>(false);
  const loggedInUser = useSelector(selectLoginResponse);
  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch Practitioners on page change
  useEffect(() => {
    fetchPractitioners();
  }, [page]);

  // Fetch Practitioners on infinite scroll
  useEffect(() => {
    if (inView && page < totalPages - 1) {
      setPage(page => page + 1);
    }
  }, [inView]);

  // Fetch Practitioners on specialty change
  useEffect(() => {
    setPage(0);
    if (page == 0) {
      fetchPractitioners();
    }

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

    router.push(pathname + "?" + createQueryString(params));
  }, [specialty, localDate, firstName]);

  // Fetch Practitioners list
  const fetchPractitioners = async () => {
    try {
      let dateTime = localDate ? localDate.split(" ") : getCurrentDateTime().split(" ");
      let date = dateTime[0];
      let minHour = dateTime[1];
      const data = await searchPractitionerApi(date, specialty, page, NUMBER_OF_PRACTITIONERS_TO_FETCH, minHour, firstName, lastName);
      if (page > 0) {
        // dispatch(setPractitionerData([...practitioners, ...data.data.results]));
        setPractitioners([...practitioners, ...data.data.results]);
      } else {
        // dispatch(setPractitionerData(data.data.results));
        setPractitioners(data.data.results);
      }
      setTotalPages(data.data.totalPage);
      setTotalCount(data.data.totalCount);
      setPractitionerError("");
    } catch (error: any) {
      // handle error
      setPractitionerError(error?.response?.data?.message);
      // dispatch(setPractitionerData([]));
      setPractitioners([]);
    } finally {
      setPageLoader(false);
    }
  };

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

  return (
    <DynamicHtmlTag
      type="div"
      className="doctor-box-main flex flex-col lg:flex-row gap-x-5 gap-y-0 lg:gap-y-0 sm:pb-0 md:py-5 sm:px-0 md:px-5 h-full">
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
      <DynamicHtmlTag
        type="div"
        className="w-[100%] lg:w-[70%] xl:w-[80%] bg-white rounded-lg lg:shadow-lg p-5 sm:px-2 sm:ps-4 sm:py-2 lg:flex gap-4 lg:gap-3 relative">
        <CustomLink className="w-fit sm:hidden lg:inline-block previous-btn" href="/teleconsult-doctor">
          <CustomImage src={"/images/back-btn.svg"} alt="back-arrow" width={30} height={30} className="img-fluid text-start shadow-xl rounded-full" />
        </CustomLink>
        <DynamicHtmlTag
          type="div"
          className={`${loggedInUser && isTeleconsultationBooked ? "doctor-list-main-login" : "doctor-list-main"} w-full px-2 py-1`}>
          <DynamicHtmlTag
            type="div"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-3 w-full md:px-0 md:pe-2 relative pb-2 h-fit">
            {isClient &&
              practitioners.map((practitioner, index: number) => {
                return <DoctorCard key={practitioner.id} practitioner={practitioner} localDate={localDate} />;
              })}
            {practitioners.length > 0 && page < totalPages - 1 ? (
              <DynamicHtmlTag type="div" ref={ref} className="infinite-loader">
                <CustomLoader />
              </DynamicHtmlTag>
            ) : (
              ""
            )}
          </DynamicHtmlTag>
          {pageLoader && (
            <DynamicHtmlTag type="div" className="absolute left-0 right-0 top-0 bottom-0">
              <CustomLoader showImage />
            </DynamicHtmlTag>
          )}
          {practitionerError && (
            <DynamicHtmlTag
              type="span"
              className="max-w-max text-center text-xs lg:text-base py-1 md:absolute top-1/2 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 empty-image-main">
              <CustomImage src={VisioLogo} alt="logo" className="loader-logo mx-auto mb-2" width={500} height={200} />
              {practitionerError}
            </DynamicHtmlTag>
          )}
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
}
