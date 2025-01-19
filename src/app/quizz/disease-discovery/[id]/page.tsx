"use client";
import { CustomButton, CustomImage, CustomLink, DynamicHtmlTag, HeadingTag } from "@/components";
import {
  API_URL,
  downloadCoursePdfApi,
  fetchCourseDetailsApi,
  getLocalStorageData,
  launchQuizApi,
  launchQuizAssocieApi,
  setLocalStorageData,
} from "@/utility";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { setQuizzPlayId } from "@/store/reducers/quizSlice";
import { useDispatch } from "react-redux";

const SingleCourse = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [courseData, setCourseData] = useState<any>(null);

  const { id: courseId } = useParams();

  const guestUserData = getLocalStorageData("guest_user_data", {});

  const fetchCourseData = async (id: any) => {
    const payload = {
      firstName: guestUserData.firstName || "Ludo",
      lastName: guestUserData.lastName || "Brule",
      ipAddress: guestUserData.ipAddress || "",
      macAddress: guestUserData.macAddress || "",
      idCourse: id,
    };

    try {
      const data = await fetchCourseDetailsApi(payload);

      setCourseData(data.data);
    } catch (error) {}
  };

  const handleLaunchQuizAssocie = async () => {
    const payload = {
      quizzTypeId: 10125,
      firstName: guestUserData.firstName || "Ludo",
      lastName: guestUserData.lastName || "Brule",
      ipAddress: guestUserData.ipAddress || "",
      macAddress: guestUserData.macAddress || "",
      specialityId: courseData.speciality.id || 10000,
    };

    try {
      const response = await launchQuizAssocieApi(payload);

      const launchResponse = await launchQuizApi(payload);
      const quizzPlayId = launchResponse.data?.id;

      if (quizzPlayId) {
        dispatch(setQuizzPlayId(quizzPlayId));
        setLocalStorageData("fromQuizAssocie", true);
      }
      router.push("/quizz/quizz-course/quizz-question");
    } catch (error) {}
  };

  const handleDownloadPdf = async () => {
    const payload = {
      firstName: guestUserData.firstName || "Ludo",
      lastName: guestUserData.lastName || "Brule",
      ipAddress: guestUserData.ipAddress || "",
      macAddress: guestUserData.macAddress || "",
      idCourse: courseId,
    };

    try {
      const blob = await downloadCoursePdfApi(payload);

      // URL for the Blob object
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));

      // temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${courseData.courseName}.pdf`); // Set file name

      // add link to the document and trigger a click
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {}
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseData(courseId);
    }
  }, [courseId]);

  if (!courseData) return <p>Loading...</p>;

  return (
    <DynamicHtmlTag type="div" className="h-full">
      <DynamicHtmlTag type="div" className="hidden lg:flex items-center gap-4 ps-12 pb-2">
        <CustomImage src="/images/maladies-icon.svg" alt="maladies-icon" width={20} height={20} />
        <HeadingTag type="h2" className="text-black font-semibold text-sm uppercase">
          DÉCOUVERTE DES MALADIES
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="gradient-main pt-4 rounded-xl bg-gradient-to-l from-indigo-500 to-sky-500 h-full">
        <DynamicHtmlTag
          type="div"
          className="bg-white flex flex-col justify-between px-2 lg:px-6 rounded-b-xl quiz-inner-dashboard h-auto min-h-full single-discovery">
          <DynamicHtmlTag type="div" className="flex justify-between py-3">
            <DynamicHtmlTag type="div" className="flex items-center gap-3">
              <CustomLink
                href={`/quizz/disease-discovery?specialityId=${courseData.speciality.id}`}
                className="custom-grey-btn w-5 lg:w-6 2xl:w-8 h-5 lg:h-6 2xl:h-8 flex items-center justify-center [&&]:shadow-none rounded-full">
                <CustomImage src="/images/back-icon.svg" alt="back-icon" width={8} height={8} className="w-1.5 lg:w-2 2xl:w-3 h-1.5 lg:h-2 2xl:h-3" />
              </CustomLink>
              <DynamicHtmlTag type="span" className="text-2xs md:text-xs 2xl:text-sm font-semibold">
                Retour aux cours
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <CustomButton
              type="button"
              className="card-btn text-white rounded-full py-1 px-3 text-2xs md:text-xs 2xl:text-sm"
              onClick={handleDownloadPdf}>
              Télécharger la fiche
            </CustomButton>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="shadow-lg rounded-lg overflow-hidden h-full lg:h-[78%] 2xl:h-[73%] courses-row">
            <DynamicHtmlTag type="div" className="flex flex-row h-full">
              <DynamicHtmlTag
                type="div"
                className="w-1/12 max-w-6 flex items-end justify-center pb-3 rounded-tl-lg rounded-bl-lg"
                style={{
                  backgroundColor: courseData.speciality.color,
                }}>
                <HeadingTag
                  type="h4"
                  className="rotate-270 w-5 lg:w-3 uppercase text-white text-xs tracking-widest font-semibold indent-1 text-nowrap">
                  {courseData.speciality.name}
                </HeadingTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="w-full ps-4 pe-1 relative z-50">
                <DynamicHtmlTag
                  type="div"
                  className="absolute inset-0 h-full w-full -z-10 hidden lg:block"
                  style={{
                    backgroundColor: courseData.speciality.color || "#0F2133",
                    maskImage: `url(/images/single-course-black-bg.svg)`,
                    WebkitMaskImage: `url(/images/single-course-black-bg.svg)`,
                    maskSize: "auto",
                    WebkitMaskSize: "auto",
                    maskPosition: "right",
                    WebkitMaskPosition: "right",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                  }}
                />

                <HeadingTag
                  type="h2"
                  className="text-2xs 2xl:text-xs font-semibold pt-3 ps-2 border-l-2 mb-2 lg:mb-0"
                  style={{ borderLeftColor: courseData.speciality.color }}>
                  {courseData.courseName}
                </HeadingTag>
                <DynamicHtmlTag type="div" className="h-[91%] lg:h-full pe-1 z-50 pb-5 lg:pb-0 overflow-y-auto">
                  {/* Upper Data content in single page */}
                  <DynamicHtmlTag
                    type="div"
                    className={`w-full flex flex-col lg:flex-row justify-between py-3 lg:py-5 items-center lg:overflow-hidden ${
                      courseData.courseDetailsList?.length > 0 ? "lg:h-2/3" : "lg:h-[90%]"
                    }`}>
                    <DynamicHtmlTag
                      type="p"
                      className={`text-3xs 2xl:text-2xs w-full lg:w-9/12 font-semibold lg:overflow-y-scroll mt-0 lg:mt-5 ${
                        courseData.courseDetailsList?.length > 0 ? "lg:h-60 2xl:h-[19rem]" : "h-full"
                      }`}>
                      {typeof courseData.courseContent === "string" ? parse(courseData.courseContent) : "[Invalid content]"}
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="w-9/12 lg:w-3/12 mt-5 lg:mt-0">
                      <CustomImage
                        src={`${API_URL}${courseData.file?.url}`}
                        alt="desease-img"
                        width={200}
                        height={80}
                        className="border rounded-md w-44 lg:w-52 2xl:w-64 h-44 lg:h-52 2xl:h-64 object-cover m-auto lg:float-end bg-white"
                        style={{ borderColor: courseData.speciality.color }}
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  {/* Bottom Data in single page */}
                  <DynamicHtmlTag
                    type="div"
                    className={`flex text-xs w-full lg:w-11/12 flex-wrap gap-y-4 py-3 lg:py-2 lg:pb-4 h-1/3 ${
                      courseData.courseDetailsList?.length > 0 ? "" : "hidden"
                    }`}>
                    {courseData.courseDetailsList.slice(0, 4).map((item: any, index: number) => (
                      <DynamicHtmlTag
                        key={index}
                        type="div"
                        className="w-6/12 lg:w-3/12 flex items-center text-3xs 2xl:text-2xs gap-1 lg:gap-5 pe-3 font-semibold">
                        <DynamicHtmlTag type="p" className="h-20 overflow-y-auto pb-2.5">
                          {item.courseContent}
                        </DynamicHtmlTag>
                        {index < courseData.courseDetailsList.length - 1 && index < 3 && (
                          <svg
                            width="80"
                            height="80"
                            viewBox="0 0 28 56"
                            fill={courseData.speciality.color || "#000"}
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0V14.5L13 28.5L0 41.5V56L28 28L0 0Z" fill="url(#paint0_linear_849_16052)" />
                            <defs>
                              <linearGradient id="paint0_linear_849_16052" x1="-5" y1="28.5" x2="28" y2="28.5" gradientUnits="userSpaceOnUse">
                                <stop stop-color={courseData.speciality.color || "#000"} />
                                <stop offset="1" stop-color={courseData.speciality.color || "#000"} />
                              </linearGradient>
                            </defs>
                          </svg>
                        )}
                      </DynamicHtmlTag>
                    ))}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex justify-between py-3 px-0">
            <CustomButton type="button" className={`card-btn ms-auto text-white rounded-full py-1 px-3 text-xs`} onClick={handleLaunchQuizAssocie}>
              Quizz associé
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default SingleCourse;
