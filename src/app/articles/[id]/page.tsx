"use client";
import { CustomImage, CustomLink, DynamicHtmlTag, HeadingTag } from "@/components";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { articleDetailsApi, API_URL, ArticleDetailType } from "@/utility";
import { IoIosArrowBack } from "react-icons/io";
import parse from "html-react-parser";

const SingleArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleDetailType["data"] | null>(null);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const response = await articleDetailsApi(Number(id));
        console.log(response.data);
        setArticle(response.data);
      } catch (error) {}
    };

    if (id) {
      fetchArticleDetails();
    }
  }, [id]);

  if (!article) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <DynamicHtmlTag type="div" className="items-center gap-x-2 ps-3 pb-2 hidden lg:flex h-[5%]">
        <CustomImage src="/images/home-icon.svg" alt="home-icon" width={18} height={15} className="xl:w-4" />
        <HeadingTag type="h2" className="text-black font-semibold [&&]:text-sm uppercase">
          Salle d{`'`}attente
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag
        type="div"
        className="gradient-main identity-main pt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 h-full lg:h-[93%] 2xl:h-[94%]">
        <DynamicHtmlTag
          type="div"
          className="px-3 md:px-11 xl:px-10 rounded-b-xl h-full single-article-main pb-0 overflow-auto flex items-center flex-col">
          <DynamicHtmlTag type="div" className="flex items-center justify-between px-2 pt-2 lg:px-0 lg:pt-4 w-full">
            <CustomLink href="/articles" className="grey-btn rounded-full block w-fit p-0.5 xl:p-1 2xl:p-2">
              <IoIosArrowBack />
            </CustomLink>
            <CustomLink href="#" className="lg:hidden bg-customBlue text-2xs text-white font-semibold px-3 py-1 rounded-full">
              Quitter la salle d{"'"}attente
            </CustomLink>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="main-slider lg:pb-5 mt-0 lg:mt-7 xl:mt-0 h-full w-full flex items-start md:items-center pt-5 md:pt-0">
            <DynamicHtmlTag type="div" className="w-full h-full flex flex-col md:flex-row justify-center lg:justify-between items-center">
              <DynamicHtmlTag type="div" className="w-full md:w-4/6 md:pe-5">
                <HeadingTag type="h2" className="text-xl md:text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-blue pb-0 md:pb-0.5">
                  {article.title}
                </HeadingTag>
                <DynamicHtmlTag type="p" className="text-sky-600 text-lg md:text-base lg:text-2xl 2xl:text-3xl font-bold pb-3 lg:pb-5">
                  {`Du ${article.start} au ${article.end}`}
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="article-content text-2xs font-semibold md:text-xs lg:text-xs 2xl:text-base text-blue">
                  {article.content && parse(article.content)}
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              {article.file && article.file.url && (
                <DynamicHtmlTag type="div" className="w-full md:w-2/6 md:ps-10 pt-2">
                  <CustomImage
                    src={`${API_URL}${article.file.url}`}
                    alt={article.title}
                    width={400}
                    height={400}
                    className="banner-img w-3/5 md:w-5/6 mx-auto mt-2 lg:mt-0 max-h-40 lg:max-h-max"
                  />
                </DynamicHtmlTag>
              )}
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </>
  );
};

export default SingleArticle;
