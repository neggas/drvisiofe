import React, { ReactNode, forwardRef } from "react";

interface DynamicHtmlTagsProps {
  type: string;
  children?: ReactNode;
  className?: string;
  id?: string;
  onClick?: any;
  onScroll?: React.UIEventHandler<HTMLElement>;
  tabIndex?: any;
  role?: string;
  style?: any;
  onChange?: any;
  onDoubleClick?: any;
  onMouseLeave?: any;
  onMouseMove?: any;
  onMouseEnter?: any;
  onMouseOver?: any;
  title?: string;
  value?: any;
  htmlFor?: string;
  max?: any;
}

const DynamicHtmlTag = forwardRef<any, DynamicHtmlTagsProps>((props, ref) => {
  const {
    type,
    id,
    children,
    className,
    onClick,
    tabIndex,
    role,
    style,
    onScroll,
    onChange,
    onMouseLeave,
    onMouseMove,
    onMouseEnter,
    onMouseOver,
    title,
    value,
    htmlFor,
    max,
    onDoubleClick,
  } = props;
  const DynamicHtmlTag: any = type ? type : "p";
  return (
    <DynamicHtmlTag
      ref={ref}
      className={className ?? ""}
      id={id ?? ""}
      onClick={onClick}
      tabIndex={tabIndex}
      onScroll={onScroll}
      role={role}
      style={style}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseOver={onMouseOver}
      title={title}
      value={value}
      htmlFor={htmlFor}
      max={max}
      onChange={onChange}
      onDoubleClick={onDoubleClick}>
      {children}
    </DynamicHtmlTag>
  );
});

DynamicHtmlTag.displayName = "DynamicHtmlTag";

export default DynamicHtmlTag;
