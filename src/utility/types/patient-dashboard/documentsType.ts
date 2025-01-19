import { ComponentType } from "react";
export interface DocumentViewTabs {
  id: number;
  label: string;
  imgSrc: string;
  component: ComponentType;
}
