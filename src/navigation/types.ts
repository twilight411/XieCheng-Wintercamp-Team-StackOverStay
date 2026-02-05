import type {NavigatorScreenParams} from '@react-navigation/native';

/** 列表页可从首页带过去的搜索条件 */
export type HotelListParams = {
  keyword?: string;
  city?: string;
  checkIn?: string;
  checkOut?: string;
};

export type RootTabParamList = {
  Home: undefined;
  HotelList: HotelListParams | undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList>;
  HotelDetail: {
    hotelId: string;
  };
};

