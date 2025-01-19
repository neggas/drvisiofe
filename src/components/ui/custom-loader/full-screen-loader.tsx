"use client";
import { CustomImage, DynamicHtmlTag, VisioLogo } from "@/components";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

interface CustomFullScreenLoaderProps {
  message?: string;
}

const CustomFullScreenLoader: React.FC<CustomFullScreenLoaderProps> = () => {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const loaderType = useSelector((state: RootState) => state.loader.loaderType);

  if (!isLoading) return null;

  let message = "Attendez, nous récupérons vos données ...";

  switch (loaderType) {
    case "checking-auth":
      message = "Vérification si l'utilisateur est connecté...";
      break;
    case "unauthorized":
      message = "Vous n'êtes pas autorisé à consulter cette page.";
      break;
    default:
      break;
  }

  return (
    <DynamicHtmlTag
      type="div"
      className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 backdrop-filter backdrop-blur-sm z-[99999999]">
      <CustomImage src={VisioLogo} alt="Logo" className="w-35 h-32 mb-4" width={250} height={200} />
      <DynamicHtmlTag type="p" className="text-white mb-4">
        {message}
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="loader border-t-4 border-b-4 border-white h-12 w-12 rounded-full animate-spin"></DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default CustomFullScreenLoader;
