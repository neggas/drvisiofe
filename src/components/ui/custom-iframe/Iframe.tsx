"use client";
import { useState, useEffect } from "react";

interface CustomIFrameProps {
  className?: string;
  src: string;
  placeholderSrc?: string; // Optional placeholder for iframe errors
  title?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const CustomIFrame = (props: CustomIFrameProps) => {
  const { className, src, placeholderSrc, title, width, height, style, onClick } = props;
  const [iframeSrc, setIFrameSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIFrameSrc(src);
    setHasError(false); // Reset error state when src changes
  }, [src]);

  const handleLoadError = () => {
    setHasError(true);
    if (placeholderSrc) {
      setIFrameSrc(placeholderSrc); // Fallback to placeholder if provided
    }
  };

  return (
    <iframe
      className={className ?? ""}
      src={hasError ? placeholderSrc : iframeSrc}
      title={title || "IFrame Content"}
      width={width || "100%"}
      height={height || "400px"}
      style={style}
      onClick={onClick}
      onError={handleLoadError}></iframe>
  );
};

export default CustomIFrame;
