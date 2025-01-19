"use client";
import { CustomButton, CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";
import { API_URL, fetchWhatsNewCourse, NewCourseTypes, newQuizzCourseSchema } from "@/utility";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LatestDiscoveryTab = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<NewCourseTypes["results"]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ selectedCourses?: string }>({});

  const handleCourseClick = (courseId: number) => {
    setSelectedCourses([courseId.toString()]);
    setErrors({});
  };

  const handleDiscoverClick = async () => {
    try {
      setErrors({});
      await newQuizzCourseSchema.validate({ selectedCourses: selectedCourses[0] }, { abortEarly: false });

      router.push(`/quizz/disease-discovery/${selectedCourses[0]}`);
    } catch (err: any) {
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => {
          return { ...acc, [path]: message };
        }, {});
        setErrors(validationErrors);
      }
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const fetchedCourses = await fetchWhatsNewCourse();
      setCourses(fetchedCourses);
    };
    fetchCourses();
  }, []);

  return (
    <DynamicHtmlTag type="div" className="w-full h-full">
      <DynamicHtmlTag
        type="div"
        className="lg:shadow-lg rounded-lg pt-2 2xl:pt-3 pb-2 2xl:pb-3 px-2 md:px-3 h-[85%] 2xl:h-[90%] overflow-auto max-h-52 md:max-h-56 2xl:max-h-[292px]">
        <HeadingTag type="h3" className="text-xs 2xl:text-sm font-semibold uppercase">
          dernières découverte des maladies ajoutées
        </HeadingTag>
        <DynamicHtmlTag type="div" className="courses-row grid grid-cols-2 gap-2 2xl:gap-3 mt-2 2xl:mt-3">
          {courses.slice(0, 4).map(course => (
            <DynamicHtmlTag type="div" key={course.id} className="w-full">
              <CustomButton
                as="button"
                className="w-full text-2xs 2xl:text-sm font-medium rounded-lg py-5 md:py-7 2xl:py-11 px-2 text-white h-full md:leading-[100%] relative leading-normal"
                style={{
                  backgroundColor: selectedCourses.length === 0 || selectedCourses.includes(course.id.toString()) ? course.speciality.color : "gray",
                }}
                onClick={() => handleCourseClick(course.id)}>
                <DynamicHtmlTag type="div" className="flex w-full justify-end gap-0.5 2xl:gap-1 absolute top-1 right-1">
                  <DynamicHtmlTag type="span" className="text-3xs 2xl:text-2xs uppercase font-medium line-clamp-1 w-[122px] md:w-full text-right">
                    {course?.speciality?.name}
                  </DynamicHtmlTag>
                  <CustomImage
                    src={`${API_URL}/${course?.speciality?.file?.url}`}
                    alt="course-name"
                    width={40}
                    height={40}
                    className="w-3 2xl:w-5 h-3 2xl:h-5"
                  />
                </DynamicHtmlTag>
                <DynamicHtmlTag type="p" className="pt-1 text-2xs xl:text-xs 2xl:text-sm uppercase line-clamp-1">
                  {course.courseName}
                </DynamicHtmlTag>
              </CustomButton>
            </DynamicHtmlTag>
          ))}
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      {errors.selectedCourses && (
        <DynamicHtmlTag type="div" className="text-red-500 text-xs text-center mt-2">
          {errors.selectedCourses}
        </DynamicHtmlTag>
      )}

      <CustomButton
        type="button"
        className={`card-btn text-white py-1 2xl:py-2 w-8/12 xl:w-3/12 2xl:w-4/12 font-semibold rounded-xl mx-auto hidden lg:block text-2xs md:text-xs 2xl:text-sm mt-3 2xl:mt-4 ${
          selectedCourses.length === 0 ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={handleDiscoverClick}
        disabled={selectedCourses.length === 0}
        title={selectedCourses.length === 0 ? "Sélectionnez un cours pour continuer." : ""}>
        Découvrir
      </CustomButton>
    </DynamicHtmlTag>
  );
};

export default LatestDiscoveryTab;
