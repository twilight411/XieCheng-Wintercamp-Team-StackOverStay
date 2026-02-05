import type {NavigatorScreenParams} from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  HotelList: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList>;
  HotelDetail: {
    hotelId: string;
  };
};

