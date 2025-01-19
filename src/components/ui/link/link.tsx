import React, { CSSProperties, ReactNode } from "react";
import Link, { LinkProps } from "next/link";

interface CustomLinkProps extends LinkProps {
  className?: string;
  children: ReactNode;
  href: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  style?: CSSProperties;
  title?: string;
}

export const CustomLink = (props: CustomLinkProps) => {
  const { children, className, href, target, onClick, style, title } = props;
  return (
    <Link className={className ?? ""} href={href} target={target} onClick={onClick} title={title}>
      {children}
    </Link>
  );
};

export default CustomLink;
