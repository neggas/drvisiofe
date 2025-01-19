"use client";
import { CustomButton, CustomImage, DynamicHtmlTag, HeadingTag } from "@/components";
import { API_URL, fetchWhatsNewQuiz, newQuizzSpecialitySchema, QuizNewSpecialityTypes } from "@/utility";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LatestQuizzTab = () => {
  const router = useRouter();
  const [newQuizz, setNewQuizz] = useState<QuizNewSpecialityTypes[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ selectedSpeciality?: string }>({});

  const getLatestQuizzes = async () => {
    try {
      const quizzesData = await fetchWhatsNewQuiz();
      setNewQuizz(quizzesData);
    } catch (error) {}
  };

  const handleQuizClick = (quizId: string | number) => {
    setSelectedQuizId(String(quizId));
    setErrors({});
  };

  const handleDiscoverClick = async () => {
    try {
      await newQuizzSpecialitySchema.validate({ selectedSpeciality: selectedQuizId ? parseInt(selectedQuizId) : null }, { abortEarly: false });
      setErrors({});

      // Navigate to QuizCourse component, passing the selectedQuizId as a query parameter
      router.push(`/quizz/quizz-course?selectedQuizId=${selectedQuizId}`);
    } catch (err: any) {
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => ({ ...acc, [path]: message }), {});
        setErrors(validationErrors);
      }
    }
  };

  useEffect(() => {
    getLatestQuizzes();
  }, []);

  return (
    <DynamicHtmlTag type="div" className="w-full h-full">
      <DynamicHtmlTag
        type="div"
        className="lg:shadow-lg rounded-lg pt-2 2xl:pt-3 pb-2 2xl:pb-3 px-2 md:px-3 h-[85%] 2xl:h-[90%] overflow-auto max-h-52 md:max-h-56 2xl:max-h-[292px]">
        <HeadingTag type="h3" className="text-xs 2xl:text-sm font-semibold uppercase">
          derniers quizz ajoutés
        </HeadingTag>

        <DynamicHtmlTag type="div" className="courses-row grid grid-cols-2 gap-2 2xl:gap-3 mt-2 2xl:mt-3">
          {newQuizz.slice(0, 4).map(quiz => (
            <DynamicHtmlTag type="div" key={quiz.id} className="w-full">
              <CustomButton
                as="button"
                onClick={() => handleQuizClick(quiz.id)}
                className="w-full font-medium rounded-lg py-1.5 md:py-3 xl:py-4 2xl:py-5 px-2 text-white h-full leading-[100%]"
                style={{
                  backgroundColor: selectedQuizId
                    ? selectedQuizId === String(quiz.id)
                      ? quiz.color || "#000000"
                      : "#808080"
                    : quiz.color || "#000000",
                }}>
                {" "}
                <CustomImage
                  src={`${API_URL}${quiz.file?.url || "/images/default-icon.svg"}`}
                  alt={quiz.name || "Default Name"}
                  width={70}
                  height={50}
                  className="mx-auto w-6 md:w-7 2xl:w-14 h-6 md:h-7 2xl:h-11 mb-1"
                />
                <DynamicHtmlTag type="span" className="text-2xs xl:text-xs 2xl:text-sm uppercase line-clamp-1">
                  {quiz.name || "Default Name"}
                </DynamicHtmlTag>
              </CustomButton>
            </DynamicHtmlTag>
          ))}
        </DynamicHtmlTag>
      </DynamicHtmlTag>

      <CustomButton
        type="button"
        className={`card-btn text-white py-1 2xl:py-2 w-8/12 xl:w-3/12 2xl:w-4/12 font-semibold rounded-xl mx-auto hidden lg:block text-2xs md:text-xs 2xl:text-sm mt-3 2xl:mt-4 ${
          !selectedQuizId ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={handleDiscoverClick}
        disabled={!selectedQuizId}
        title={!selectedQuizId ? "Sélectionnez un quiz pour continuer." : ""}>
        Découvrir
      </CustomButton>
    </DynamicHtmlTag>
  );
};

export default LatestQuizzTab;
