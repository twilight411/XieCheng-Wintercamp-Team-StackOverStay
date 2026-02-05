import apiClient from './api';
import type {
  HotelListItem,
  HotelDetail,
  BannerItem,
  ListParams,
  ListResult,
} from '../types';

/**
 * 获取酒店列表（分页、筛选、搜索）
 */
export const getHotelList = (
  params: ListParams,
): Promise<ListResult<HotelListItem>> => {
  return apiClient.get('/hotels', { params });
};

/**
 * 获取酒店详情（含房型与价格）
 */
export const getHotelDetail = (hotelId: string): Promise<HotelDetail> => {
  return apiClient.get(`/hotels/${hotelId}`);
};

/**
 * 获取首页 Banner 列表
 */
export const getBanners = (): Promise<BannerItem[]> => {
  return apiClient.get('/banners');
};
