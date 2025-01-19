export interface AdvertisingAvatar {
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

export interface AdvertisingAuthor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: AdvertisingAvatar | null;
}

export interface AdvertisingDataType {
  id: number;
  type: string;
  title: string;
  content: string | null;
  author: AdvertisingAuthor;
  start: string | null;
  end: string | null;
  published: boolean;
  publishedDate: string;
  nbUserSelected: number;
  file: AdvertisingAvatar | null;
  advertisingTypeFile: string;
  createdAt: string;
  updatedAt: string;
  userRole: string;
}

export interface AdvertisingsState {
  data: AdvertisingDataType[];
}
