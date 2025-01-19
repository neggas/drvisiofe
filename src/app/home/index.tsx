"use client";
import { DynamicHtmlTag } from "@/components";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import scss from "./style.module.scss";
import "react-custom-cursors/dist/index.css";
import { Cursor } from "react-custom-cursors";
import Image from "next/image";
import { getLocalStorageData } from "@/utility";
import { useSelector } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";

export default function HomePage() {
  const router = useRouter();
  const [actived, setActivedMenu] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [path, setPath] = useState<"quiz" | "search" | "teleconsult-doctor">();
  const loggedInUser = useSelector(selectLoginResponse);
  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", true);
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
  return (
    <DynamicHtmlTag type="div" className={loggedInUser && isTeleconsultationBooked ? "main-home logged-home" : "main-home"}>
      {showCursor && actived === 0 && <Cursor size="sm" animation="none" key={"key"} hasCursor={false} />}
      <DynamicHtmlTag
        type="div"
        onMouseLeave={() => handleMouseLeave()}
        onMouseEnter={() => handleMouseEnter()}
        className={`${scss.homeCarousel} home-carousel`}>
        <DynamicHtmlTag
          type="div"
          onClick={() => {
            setRedirect(!redirect);
            setPath("search");
          }}
          onMouseMove={handleMouseMove}
          onMouseOver={(e: any) => {
            handleMouseMove(e);
            setActivedMenu(3);
          }}
          onMouseLeave={() => {
            setActivedMenu(0);
          }}
          className={`${scss.carouselItem} carousel-item lg:mt-8`}>
          <h1 className="py-2 carousel-headline tracking-wide">Le saviez-vous?</h1>
          <Image src={"/images/backgrounds/pharmacie.png"} alt="pharmacie" className="card-box-img hidden lg:block" width={100} height={100} />
          <Image src={"/images/backgrounds/pharmacie-mob.png"} alt="pharmacie-mob" className="card-box-img lg:hidden" width={100} height={100} />
          {actived === 3 && (
            <DynamicHtmlTag
              type="div"
              id={scss.cursorText}
              className={scss.myCustomCursor}
              onClick={() => {
                router.push("/articles");
              }}
              style={{
                position: "absolute",
                left: position.x - 40,
                top: position.y - 50,
                transition: "left 0.1s ease, top 0.1s ease, opacity 0.1s ease",
                caretColor: "red",
              }}>
              <span
                style={{
                  transition: "left 0.1s ease, top 0.1s ease, opacity 0.1s ease",
                  letterSpacing: "2px",
                }}>
                Le saviez-vous?
              </span>
            </DynamicHtmlTag>
          )}
        </DynamicHtmlTag>
        <DynamicHtmlTag
          type="div"
          onClick={() => {
            router.push("/teleconsult-doctor");
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={(e: any) => {
            handleMouseMove(e);
            setActivedMenu(2);
          }}
          onMouseLeave={() => {
            setActivedMenu(0);
          }}
          className={`${scss.carouselItem} carousel-item carousel-item-main`}>
          <h1 className="py-2 carousel-headline tracking-wide"> Téléconsulter un médecin</h1>
          <Image src={"/images/backgrounds/consultation.png"} alt="test" className="card-box-img" width={100} height={100} />
          {actived === 2 && (
            <DynamicHtmlTag
              type="div"
              id={scss.cursorText}
              className={scss.myCustomCursor}
              style={{
                position: "absolute",
                left: position.x - 40,
                top: position.y - 50,
                transition: "left 0.1s ease, top 0.1s ease, opacity 0.1s ease",
                // cursor: "url(../../../assets/images/cursors/cursor_white.svg), auto",
              }}>
              <span
                style={{
                  transition: "left 0.1s ease, top 0.1s ease, opacity 0.1s ease",
                  letterSpacing: "2px",
                }}>
                Choisir un médécin
              </span>
            </DynamicHtmlTag>
          )}
        </DynamicHtmlTag>
        <DynamicHtmlTag
          type="div"
          onClick={() => {
            router.push("/quizz");
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={(e: any) => {
            handleMouseMove(e);
            setActivedMenu(1);
          }}
          onMouseLeave={() => {
            setActivedMenu(0);
          }}
          className={`${scss.carouselItem} carousel-item lg:mt-8`}>
          <h1 className="py-2 carousel-headline tracking-wide">Quizz médical</h1>
          <Image src={"/images/backgrounds/quiz.jpg"} alt="test" className="card-box-img" width={100} height={100} />
          {actived === 1 && (
            <DynamicHtmlTag
              type="div"
              id={scss.cursorText}
              className={scss.myCustomCursor}
              style={{
                position: "absolute",
                left: position.x - 40,
                top: position.y - 50,
                transition: "left 0.1s ease, top 0.1s ease, opacity 0.1s ease",
                // cursor: "url(../../assets/images/cursors/cursor_white.svg), auto",
              }}>
              <span
                style={{
                  transition: "left 0.1s ease, top 0.1s ease, opacity 0.1s ease",
                  letterSpacing: "2px",
                }}>
                Choisir un Quiz
              </span>
            </DynamicHtmlTag>
          )}
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
}
