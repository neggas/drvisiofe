"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface CustomImageProps {
  className?: string;
  src: string;
  placeholderSrc?: any;
  alt: string;
  width?: number;
  height?: number;
  onClick?: any;
  style?: any;
}

export const CustomImage = (props: CustomImageProps) => {
  const { className, src, placeholderSrc, alt, width, height, onClick } = props;
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  // const handleError = () => {
  //   setHasError(true);
  //   setImageSrc(placeholderSrc); // Set the image source to the placeholder
  // };
  return (
    <Image
      className={className ?? ""}
      src={hasError ? placeholderSrc : imageSrc}
      alt={alt || "Image not available"}
      width={width}
      height={height}
      onClick={onClick}
      // onError={handleError}
    />
  );
};
export default CustomImage;
