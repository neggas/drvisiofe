"use client";
import { CustomImage, CustomLink, DynamicHtmlTag, HeadingTag } from "@/components";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";

const PaymentSuccessful = () => {
  const [timer, setTimer] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (timer === 0) {
      router.push("/patient-dashboard");
    } else {
      const countdown = setInterval(() => {
        setTimer((prev: any) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer, router]);

  return (
    <>
      <DynamicHtmlTag type="div" className={`lg:px-5 h-full situation-screen-main  "situation-section" : ""}`}>
        <HeadingTag type="h2" className="font-bold text-base lg:text-lg mb-3 sticky top-0 z-10 bg-white">
          Confirmation et paiement
        </HeadingTag>
        {/* after payment message Box Start */}
        <DynamicHtmlTag type="div" className="flex flex-col justify-center items-center h-[90%]">
          <DynamicHtmlTag type="div">
            <CustomImage
              src="/images/success-msg-bg.svg"
              alt="succes-paymnent-notification"
              width={400}
              height={190}
              className="m-auto mt-6 lg:mt-10 max-w-[75%] middle:max-w-full"
            />
            <DynamicHtmlTag type="div">
              <HeadingTag type="h2" className="text-xs md:text-xl font-bold text-center">
                Votre rendez-vous est confirmé !
              </HeadingTag>
              <HeadingTag type="h3" className="text-xs md:text-xl font-bold text-center">
                Vous allez recevoir un email de confirmation.
              </HeadingTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div">
            <DynamicHtmlTag type="p" className="text-2xs md:text-xl text-center mt-2 lg:mt-10">
              Vous allez être redirigé vers votre tableau de bord in {timer} secondes
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="flex justify-center mt-2">
              <GoDotFill className="w-3" />
              <GoDotFill className="w-3" />
              <GoDotFill className="w-3" />
            </DynamicHtmlTag>
            {/* Add the manual redirect button */}
            <DynamicHtmlTag type="div" className="flex items-center gap-2 md:gap-3 xl:gap-5 lg:justify-center">
              {" "}
              <CustomLink
                href="/patient-dashboard"
                className="card-btn text-white uppercase rounded-full py-2 md:px-4 lg:px-3 text-2xs font-semibold hidden md:block">
                Tableau de board
              </CustomLink>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {/* after payment message Box End */}
      </DynamicHtmlTag>
    </>
  );
};

export default PaymentSuccessful;
