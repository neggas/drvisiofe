"use client";
import React, { useEffect } from "react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { CookiesModalBox, CustomButton, CustomImage, CustomLink, DynamicHtmlTag, ProposModal } from "@/components";
import { useTranslation } from "react-i18next";
import { RootState } from "@/store";
import { closeModal, openModal } from "@/store/reducers/modalSlice";

export default function Footer(): ReactNode {
  const { t } = useTranslation();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalType = useSelector((state: RootState) => state.modal.modalType);

  // Check if the current pathname is the homepage
  const isHomepage = pathname === "/";

  // MessageModal handlers
  const openMessageModal = () => dispatch(openModal("messageModal"));
  const closeMessageModal = () => dispatch(closeModal());

  return (
    <DynamicHtmlTag type="div" className="footer-app">
      {isHomepage ? (
        <DynamicHtmlTag type="div" className="footer-boat-main">
          <DynamicHtmlTag type="div" className="logo-chat">
            <CustomImage src={"/images/logos/chatboot.png"} alt="test" width={144} height={144} className="fixed bottom-0 drop-shadow-md" />
          </DynamicHtmlTag>
          <CustomButton onClick={openMessageModal} className="hidden sm:block btn btn-secondary uppercase justify-self-start text-2xs" type="button">
            {t("footer_welcome")}
          </CustomButton>
        </DynamicHtmlTag>
      ) : (
        <>
          <CustomLink href="/" className="hidden sm:block btn btn-secondary uppercase justify-self-start text-2xs">
            {t("footer_about")}
          </CustomLink>
          <CustomButton onClick={openMessageModal} className="hidden sm:block btn btn-secondary uppercase justify-self-start text-2xs" type="button">
            {t("footer_welcome")}
          </CustomButton>
        </>
      )}

      <ProposModal isOpen={modalType === "messageModal"} onClose={closeMessageModal} />
    </DynamicHtmlTag>
  );
}
