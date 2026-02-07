import type {NavigatorScreenParams} from '@react-navigation/native';

/** 列表页可从首页带过去的搜索条件 */
export type HotelListParams = {
  keyword?: string;
  city?: string;
  checkIn?: string;
  checkOut?: string;
  starLevel?: number | number[];
  priceMin?: number;
  priceMax?: number;
};

export type RootTabParamList = {
  Home: undefined;
  My: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList>;
  /** 酒店列表页：由首页点击「查询」按钮后跳转，不在 Tab 中 */
  HotelList: HotelListParams | undefined;
  HotelDetail: {
    hotelId: string;
    checkIn?: string;
    checkOut?: string;
  };
};

