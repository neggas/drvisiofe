import { CampaignDataType, AdvertisingDataType } from "@/utility";

export interface Column<T> {
  header: any;
  accessor?: keyof T;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  expandedRows?: number[];
  onToggleRow?: (index: number) => void;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  renderExpandedRow?: (item: T) => React.ReactNode;
}
export type UnionCustomTableProps = CustomTableProps<any> | CustomTableProps<CampaignDataType>;
