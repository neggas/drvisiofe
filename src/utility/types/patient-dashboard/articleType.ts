export interface ArticleListType {
  id: number;
  title: string;
  content: string;
  start: string;
  end: string;
  file: {
    id: number;
    name: string;
    extension: string;
    size: number;
    path: string | null;
    url: string;
    data: string | null;
    dataBytes: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  };
  totalCount: number;
  totalPage: number;
}
