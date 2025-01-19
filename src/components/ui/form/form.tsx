import React, { ReactNode, FormEventHandler } from "react";

export interface CustomFormProps {
  children: ReactNode;
  className?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  method?: string;
  action?: string;
  encType?: string;
  id?: string;
  autoComplete?: string;
  noValidate?: boolean;
  target?: string;
}

const CustomForm: React.FC<CustomFormProps> = props => {
  const { children, className, onSubmit, method, action, encType, id, autoComplete, noValidate, target } = props;

  return (
    <form
      className={className}
      onSubmit={onSubmit}
      method={method}
      action={action}
      encType={encType}
      id={id}
      autoComplete={autoComplete}
      noValidate={noValidate}
      target={target}>
      {children}
    </form>
  );
};

export default CustomForm;
