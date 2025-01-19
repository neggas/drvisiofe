"use client";
import { CustomImage, CustomSlickCarousel, DynamicHtmlTag, HeadingTag } from "@/components";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { allArticleList, formatDate, getCurrentDate, getLocalStorageData, GlobalArticleListType, parseDate } from "@/utility";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { useSelector } from "react-redux";
import { welcomeArticleList } from "@/utility/apis/patient-dashboard";

const Welcome = () => {
  const [articlelist, setarticleList] = useState<GlobalArticleListType[]>([]);
  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", false);

  useEffect(() => {
    articleList();
  }, []);

  const articleList = async () => {
    try {
      const data = await welcomeArticleList();
      setarticleList(data.data.results);
    } catch (error) {}
  };
  const loggedInUser = useSelector(selectLoginResponse);

  return (
    <>
      <DynamicHtmlTag type="div" className="items-center gap-x-2 ps-3 pb-2 hidden lg:flex">
        <CustomImage src="/images/home-icon.svg" alt="home-icon" width={18} height={15} />
        <HeadingTag type="h2" className="text-black font-semibold [&&]:text-sm uppercase">
          ACCEUIL
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag
        type="div"
        className={`gradient-main identity-main pt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 ${loggedInUser && isTeleconsultationBooked ? "small-height" : ""}`}>
        <DynamicHtmlTag type="div" className="px-3 md:px-11 xl:px-10 rounded-b-xl h-full document-main pb-0 overflow-auto">
          <HeadingTag
            type="h1"
            className="text-black pt-5 lg:pt-7 xl:pt-9 2xl:pt-10 text-center lg:text-left text-xs lg:text-xl xl:text-2xl 2xl:text-3xl font-bold w-10/12 mx-auto h-[15%]">
            Les Actualités médicales de DrVisio
          </HeadingTag>
          {articlelist.length > 1 ? (
            <CustomSlickCarousel className="main-slider xl:pb-5 mt-0 lg:mt-1 xl:mt-0 h-[85%] lg:h-[82%]">
              {articlelist.slice(0, 5).map((item, index) => {
                const startDateString: string | null = item.start;
                const endDateString: string | null = item.end;
                const startDate: Date | null = startDateString ? parseDate(startDateString) : null;
                const endDate: Date | null = endDateString ? parseDate(endDateString) : null;

                return (
                  <DynamicHtmlTag key={index} type="div" className="slick-box">
                    <DynamicHtmlTag
                      type="div"
                      className="grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-5 xl:gap-16 2xl:gap-20 items-center md:mt-6 lg:mt-1 2xl:mt-3 lg:mx-8">
                      <DynamicHtmlTag type="div">
                        <HeadingTag type="h2" className="text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-4xl font-bold text-blue pb-0 md:pb-0.5">
                          {item.title}
                        </HeadingTag>
                        <DynamicHtmlTag type="p" className="text-sky-600 text-xs md:text-sm xl:text-base 2xl:text-2xl font-bold pb-3 lg:pb-5">
                          {startDate && endDate
                            ? `Du ${formatDate(startDate)} au ${formatDate(endDate)}`
                            : startDate
                              ? `À partir du ${formatDate(startDate)}`
                              : endDate
                                ? `Jusqu'au ${formatDate(endDate)}`
                                : `${getCurrentDate()}`}
                        </DynamicHtmlTag>
                        <DynamicHtmlTag
                          type="div"
                          className={`banner-text text-2xs md:text-2xs xl:text-xs 2xl:text-sm text-blue h-full ${loggedInUser?.data?.id ? "max-h-16" : "max-h-16"} lg:max-h-48 xl:max-h-72 2xl:max-h-80 overflow-y-scroll`}>
                          {item.content ||
                            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like) It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"}
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="banner-img-main">
                        <CustomImage
                          src={item?.file?.url ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.file.url}` : "/images/quiz-profile.svg"}
                          alt="document-banner"
                          width={400}
                          height={400}
                          className="banner-img w-full 2xl:w-3/4 mx-auto 2xl:me-[6%] md:min-h[35vh] lg:min-h-[45vh] 2xl:min-h-[50vh]"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                );
              })}
            </CustomSlickCarousel>
          ) : articlelist.length === 1 ? (
            <DynamicHtmlTag type="div" className="slick-box">
              <DynamicHtmlTag
                type="div"
                className="grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-5 xl:gap-16 2xl:gap-20 items-center md:mt-6 lg:mt-1 2xl:mt-3">
                <DynamicHtmlTag type="div">
                  <HeadingTag type="h2" className="text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-4xl font-bold text-blue pb-0 md:pb-0.5">
                    {articlelist[0].title}
                  </HeadingTag>
                  {(articlelist[0].start || articlelist[0].end) && (
                    <DynamicHtmlTag type="p" className="text-sky-600 text-sm md:text-sm xl:text-base 2xl:text-2xl font-bold pb-3 lg:pb-5">
                      {articlelist[0].start && articlelist[0].end
                        ? `Du ${formatDate(parseDate(articlelist[0].start))} au ${formatDate(parseDate(articlelist[0].end))}`
                        : articlelist[0].start
                          ? `À partir du ${formatDate(parseDate(articlelist[0].start))}`
                          : `Jusqu'au ${formatDate(parseDate(articlelist[0].end))}`}
                    </DynamicHtmlTag>
                  )}
                  {articlelist[0].content && (
                    <DynamicHtmlTag
                      type="div"
                      className="text-2xs md:text-2xs xl:text-xs 2xl:text-sm text-blue h-full max-h-32 md:max-h-40 xl:max-h-60 2xl:max-h-80 overflow-y-scroll">
                      {articlelist[0].content}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div">
                  <CustomImage
                    src={articlelist[0].file?.url ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${articlelist[0].file.url}` : "/images/quiz-profile.svg"}
                    alt="document-banner"
                    width={400}
                    height={400}
                    className="banner-img w-2/5 md:w-1/2 lg:w-3/5 2xl:w-3/4 mx-auto lg:me-[6%] md:min-h[35vh] xl:min-h-[45vh] 2xl:min-h-[53vh]"
                  />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          ) : (
            <DynamicHtmlTag type="div" className="text-center py-10">
              <p className="text-black font-semibold">Aucun article disponible pour le moment.</p>
            </DynamicHtmlTag>
          )}
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </>
  );
};

export default Welcome;
