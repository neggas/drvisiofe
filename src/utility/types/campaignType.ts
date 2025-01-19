export interface CampaignAvatar {
  id: number;
  name: string;
  extension: string;
  url: string;
  size: number;
  path: string | null;
  data: string | null;
  dataBytes: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CampaignAuthor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: CampaignAvatar | null;
}

export interface CampaignDataType {
  id: number;
  title: string;
  content: string | null;
  author: CampaignAuthor;
  start: string | null;
  end: string | null;
  published: boolean;
  publishedDate: string;
  nbUserSelected: number;
  file: CampaignAvatar | null;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignsState {
  data: CampaignDataType[];
}
