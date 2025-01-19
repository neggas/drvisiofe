"use client";
import { CustomImage, DynamicHtmlTag, CustomSlickCarousel, HeadingTag, CustomLink, CustomLabel } from "@/components";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import scss from "../home/style.module.scss";
import { Cursor } from "react-custom-cursors";
import { IoIosArrowBack } from "react-icons/io";
import { allArticleList, API_URL, GlobalArticleListType } from "@/utility";

const Articles = () => {
  const router = useRouter();
  const [actived, setActivedMenu] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [path, setPath] = useState<"quiz" | "search" | "teleconsult-doctor">();
  const [articles, setArticles] = useState<GlobalArticleListType[]>([]);

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setShowCursor(true);
  };

  const handleMouseLeave = () => {
    setShowCursor(false);
  };

  const handleMouseEnter = () => {
    setShowCursor(true);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await allArticleList();
        const fetchedArticles = response.data.results;
        setArticles(fetchedArticles);
      } catch (err) {}
    };

    fetchArticles();
  }, []);

  const carouselSettings = {
    slidesToShow: Math.min(articles.length, 10),
    slidesToScroll: 1,
    centerMode: true,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1499,
        settings: {
          slidesToShow: Math.min(articles.length, 8),
        },
      },
      {
        breakpoint: 1368,
        settings: {
          slidesToShow: Math.min(articles.length, 6),
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(articles.length, 2),
          arrows: true,
          dots: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: Math.min(articles.length, 1),
          arrows: true,
          dots: false,
        },
      },
    ],
  };

  return (
    <DynamicHtmlTag type="div" className="gradient-main identity-main pt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 h-full">
      <DynamicHtmlTag type="div" className="h-full bg-white article-main-screen relative">
        <DynamicHtmlTag type="div" className="flex items-center justify-between px-3 py-2">
          <CustomLink href="/" className="grey-btn rounded-full block w-fit p-0.5">
            <IoIosArrowBack />
          </CustomLink>
          <CustomLink href="#" className="lg:hidden bg-customBlue text-2xs text-white font-semibold px-3 py-1 rounded-full">
            Quitter la salle d{"'"}attente
          </CustomLink>
        </DynamicHtmlTag>
        <HeadingTag type="h2" className="text-center xl:text-lg font-bold pt-5 lg:pt-0 pb-5 w-10/12 mx-auto lg:absolute lg:top-2 lg:left-[9%]">
          Découvrez quelques articles en attendant votre médecin
        </HeadingTag>

        {showCursor && actived === 0 && (
          <Cursor
            size="sm"
            animation="none"
            hoveringAnimation="magnify"
            key="key"
            shape="round"
            hasCursor={true}
            color="transparent"
            dotColor="transparent"
          />
        )}
        <DynamicHtmlTag type="div" onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} className={`h-[70%] lg:h-[82%] xl:h-[85%]`}>
          <CustomSlickCarousel className={`w-full md:w-10/12 xl:w-11/12 m-auto h-full cstmSlider lg:pt-20`} settings={carouselSettings}>
            {articles.map((article, index) => (
              <React.Fragment key={index}>
                <DynamicHtmlTag
                  type="div"
                  onClick={() => {
                    setRedirect(!redirect);
                    setPath("search");
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseOver={(e: any) => {
                    handleMouseMove(e);
                    setActivedMenu(index);
                  }}
                  onMouseLeave={() => {
                    setActivedMenu(0);
                  }}
                  className={`${articles.length < 10 ? "big-size" : ""} inner-slide rounded-lg block cursor-pointer overflow-hidden relative group`}>
                  {" "}
                  <CustomImage
                    src={`${API_URL}${article.file.url}`}
                    alt={article.title}
                    width={300}
                    height={300}
                    className="w-full h-60 lg:h-52 xl:h-60 object-cover"
                  />
                  <CustomLink
                    href={`/articles/${article.id}`}
                    className="block [&&]:absolute z-50 w-full top-1/3 lg:top-0 text-white article-label capitalize font-bold text-sm group-hover:text-xl text-center left-0 px-2 group-hover:lg:top-[unset] group-hover:lg:bottom-0">
                    {article.title}
                  </CustomLink>
                  <CustomLink
                    href={`/articles/${article.id}`}
                    className="block lg:hidden absolute z-50 bg-black bottom-3 left-1/4 w-2/4 text-white rounded-full text-2xs text-center leading-6">
                    Voir l{"'"}article
                  </CustomLink>
                  {actived === index && (
                    <DynamicHtmlTag
                      type="div"
                      id={`${scss.cursorArticleText}`}
                      className={`${scss.myCustomCursor}`}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        router.push(`/articles/${article.id}`);
                      }}
                      style={{
                        position: "absolute",
                        left: position.x - 50,
                        top: position.y - 50,
                        transition: "left 0.1s ease, top 0.1s ease, opacity 0.1s ease",
                        caretColor: "black",
                      }}>
                      <span
                        style={{
                          transition: "left 0.1s ease, top 0.1s ease, opacity 0.1s ease",
                          letterSpacing: "2px",
                        }}>
                        VOIR
                      </span>
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
              </React.Fragment>
            ))}
          </CustomSlickCarousel>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default Articles;
