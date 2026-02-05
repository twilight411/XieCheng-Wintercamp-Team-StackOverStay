/**
 * 酒店相关接口与 API 类型定义
 * 与后端/PC 端约定一致，联调时可按实际字段微调
 */

/** 房型（详情页房型价格列表项） */
export interface RoomType {
  id: string;
  name: string;
  nameEn?: string;
  bedType?: string;
  price: number;
  currency?: string;
  area?: string;
  breakfast?: string;
  [key: string]: unknown;
}

/** 酒店列表单项 */
export interface HotelListItem {
  id: string;
  name: string;
  nameEn?: string;
  address?: string;
  starLevel: number;
  images: string[];
  minPrice?: number;
  [key: string]: unknown;
}

/** 酒店详情（含房型列表） */
export interface HotelDetail {
  id: string;
  name: string;
  nameEn?: string;
  address: string;
  starLevel: number;
  facilities: string[];
  images: string[];
  roomTypes: RoomType[];
  [key: string]: unknown;
}

/** 首页 Banner 项（点击可跳转详情） */
export interface BannerItem {
  id: string;
  imageUrl: string;
  hotelId: string;
  title?: string;
  [key: string]: unknown;
}

/** 酒店列表查询参数 */
export interface ListParams {
  city?: string;
  keyword?: string;
  checkIn?: string;
  checkOut?: string;
  starLevel?: number | number[];
  priceMin?: number;
  priceMax?: number;
  page?: number;
  pageSize?: number;
  [key: string]: unknown;
}

/** 通用分页列表返回结构 */
export interface ListResult<T> {
  list: T[];
  page: number;
  pageSize: number;
  total: number;
}
