import React, { ReactNode } from "react";

interface HeadingTagsProps {
  type: string;
  className?: string;
  children: ReactNode;
  id?: string;
  style?: any;
}

export const HeadingTag = (props: HeadingTagsProps) => {
  const { children, id, type, className } = props;
  const HeadingTag: any = type ? type : "h3";
  return (
    <HeadingTag className={className ?? ""} id={id ?? ""}>
      {children}
    </HeadingTag>
  );
};
export default HeadingTag;
