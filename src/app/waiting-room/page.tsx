"use client";
import { CustomButton, CustomImage, CustomLink, DynamicHtmlTag, HeadingTag, SideBar } from "@/components";
import React from "react";
import { getLocalStorageData } from "@/utility";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { useSelector } from "react-redux";

const WaitingRoom = () => {
  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", false);
  const loggedInUser = useSelector(selectLoginResponse);
  return (
    <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row gap-x-5 gap-y-0 lg:gap-y-0 sm:pb-0 lg:py-5 sm:px-0 lg:px-5 h-full">
      <DynamicHtmlTag type="div" className="w-[100%] lg:w-[30%] xl:w-[20%] sidebar-main">
        <SideBar
          selectedSpecialty={""}
          setSeleectedSpecialty={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
          localDate={""}
          setLocalDate={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
          setFirstName={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
          setLastName={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
          firstName={""}
          lastName={""}
          setFilter={function (value: boolean): void {
            throw new Error("Function not implemented.");
          }}
        />
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="w-[100%] lg:w-[70%] xl:w-[80%] bg-white rounded-2xl md:shadow-lg px-4 md:p-6 relative h-full">
        <CustomLink href="/" className="previous-btn rounded-full hidden lg:block w-fit p-0.5 xl:p-1 lg:absolute top-4 left-6">
          <CustomImage src={"/images/back-btn.svg"} alt="back-arrow" width={30} height={30} className="img-fluid text-start rounded-full w-6 h-6" />
        </CustomLink>
        <DynamicHtmlTag
          type="div"
          className={`${loggedInUser && isTeleconsultationBooked ? "waiting-room-main-login" : "waiting-room-main"} w-full px-2 py-1 h-full overflow-auto`}>
          <HeadingTag type="h1" className="xl:w-3/4 2xl:w-7/12 font-bold text-xs lg:text-xl xl:text-2xl mt-3 lg:mt-6 2xl:mt-12">
            Vous souhaitez patienter en salle d{"’"}attente qu{"’"}un médecin vienne vous proposer une téléconsultation?
          </HeadingTag>
          <DynamicHtmlTag type="div" className="flex gap-3 h-[85%] lg:h-4/5">
            <DynamicHtmlTag type="div" className="w-full lg:w-2/3 xl:w-1/2 flex lg:block flex-col justify-between">
              <DynamicHtmlTag
                type="p"
                className="bg-sky-400/30 py-2 px-4 rounded-full lg:w-9/12 mt-4 mb-4 lg:mb-0 lg:mt-5 text-2xs lg:text-sm xl:text-base text-customBlue font-semibold text-center">
                Le temps d’attente est estimé à 28 min
              </DynamicHtmlTag>
              <CustomImage
                src="/images/waiting-room.svg"
                alt="waiting-room"
                width={450}
                height={450}
                className="w-3/4 md:w-1/3 mx-auto lg:w-full lg:hidden"
              />
              {/* Necessary Commented code */}
              {/* <DynamicHtmlTag type="div" className="flex gap-4 mt-5 lg:mt-10 lg:w-7/12">
                <CustomButton
                  as="button"
                  className="btn btn-secondary uppercase rounded-full w-full">
                  Accepter
                </CustomButton>
                <CustomButton
                  as="button"
                  className="btn btn-secondary uppercase rounded-full w-full">
                  Refuser
                </CustomButton>
              </DynamicHtmlTag> */}
              <DynamicHtmlTag type="div" className="flex gap-4 mt-5 lg:mt-10 lg:mb-0 lg:w-7/12">
                <CustomButton as="button" className="card-btn text-2xs lg:text-xs xl:text-base text-white py-1 lg:px-8 uppercase rounded-full w-full">
                  Accepter
                </CustomButton>
                <CustomButton as="button" className="card-btn text-2xs lg:text-xs xl:text-base text-white py-1 lg:px-8 uppercase rounded-full w-full">
                  Refuser
                </CustomButton>
              </DynamicHtmlTag>
              {/* This section is available via condition */}
              {/* <DynamicHtmlTag type="div" className="mt-10">
                <DynamicHtmlTag type="div" className="w-10/12 flex md:gap-x-3 justify-center items-start">
                  <CustomImage src="/images/danger-icon.svg" width={35} height={35} alt="danger" className="mt-2" />
                  <HeadingTag type="h4" className="text-sm font-bold">
                    Vous avez déjà un rendez-vous de prévu, le 05.08.2024 à 10h00, souhaitez vous annuler votre rendez-vous ?
                  </HeadingTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex gap-4 mt-5 w-7/12">
                  <CustomButton as="button" className="card-btn text-white py-1 px-8 font-semibold rounded-2xl inline-block w-full">
                    Oui
                  </CustomButton>
                  <CustomButton as="button" className="card-btn text-white py-1 px-8 font-semibold rounded-2xl inline-block w-full">
                    Non
                  </CustomButton>
                </DynamicHtmlTag>
              </DynamicHtmlTag> */}
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="w-1/2 lg:flex justify-end absolute bottom-8 right-8 hidden">
              <CustomImage src="/images/waiting-room.svg" alt="waiting-room" width={450} height={450} className="lg:w-full" />
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default WaitingRoom;
