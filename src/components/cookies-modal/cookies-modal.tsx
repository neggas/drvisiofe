"use client";
import React, { useEffect } from "react";
import { DynamicHtmlTag, CustomButton } from "../ui";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, openModal } from "@/store/reducers/modalSlice";

const CookiesModalBox = () => {
  const dispatch = useDispatch();
  const modalType = useSelector((state: RootState) => state.modal.modalType);

  // Cookie modal handlers
  const rejectsCookies = () => dispatch(closeModal());
  const acceptCookies = () => dispatch(closeModal());
  const openCookiesModal = () => dispatch(openModal("cookieModal"));

  useEffect(() => {
    openCookiesModal(); // Call the wrapper function
  }, []);

  return (
    <>
      {/* Cookies Start */}
      <DynamicHtmlTag
        type="div"
        className={`w-11/12 lg:w-3/4 left-0 right-0 mx-auto rounded-lg shadow-md px-2 md:px-3 lg:px-4 py-2 lg:py-3 fixed bottom-3 bg-white ${modalType === "cookieModal" ? "block" : "hidden"}`}>
        <DynamicHtmlTag type="div" className="flex flex-col md:flex-row items-center gap-2">
          <DynamicHtmlTag type="div" className="w-11/12 md:w-9/12 font-semibold text-2xs md:text-xs 2xl:text-sm">
            <DynamicHtmlTag type="p">
              Ce site utilise des cookies pour améliorer votre expérience utilisateur et fournir des fonctionnalités supplémentaires.
            </DynamicHtmlTag>
            <DynamicHtmlTag type="p">
              En continuant à naviguer sur ce site, vous acceptez lutilisation de cookies conformément à notre politique de confidentialité et de
              cookies.
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="w-10/12 md:w-3/12 flex gap-4">
            <CustomButton
              onClick={rejectsCookies}
              type="button"
              className="card-btn w-6/12 py-1 rounded-full text-white font-semibold text-xs lg:text-sm 2xl:text-base">
              Refuser
            </CustomButton>
            <CustomButton
              onClick={acceptCookies}
              type="button"
              className="card-btn w-6/12 py-1 rounded-full text-white font-semibold text-xs lg:text-sm 2xl:text-base">
              Accepter
            </CustomButton>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
      {/* Cookies End */}
    </>
  );
};

export default CookiesModalBox;
