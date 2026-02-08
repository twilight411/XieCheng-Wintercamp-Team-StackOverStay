import apiClient from './api';
import type {
  HotelListItem,
  HotelDetail,
  BannerItem,
  ListParams,
  ListResult,
} from '../types';

// Mock 数据 - 移至 Service 层
const MOCK_DETAIL: HotelDetail = {
  id: '1',
  name: '上海和平饭店',
  nameEn: 'Fairmont Peace Hotel',
  address: '上海市黄浦区南京东路20号',
  starLevel: 5,
  score: 4.8,
  comment: '“位置绝佳，服务一流”',
  facilities: ['免费WiFi', '游泳池', '健身房', '停车场', '餐厅', '会议室', 'SPA', '酒吧'],
  images: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800',
  ],
  roomTypes: [
    {
      id: 'r1',
      name: '费尔蒙大床房',
      bedType: '大床2米',
      price: 1888,
      area: '45㎡',
      breakfast: '含双早',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    },
    {
      id: 'r2',
      name: '费尔蒙双床房',
      bedType: '双床1.2米',
      price: 2088,
      area: '45㎡',
      breakfast: '含双早',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    },
    {
      id: 'r3',
      name: '九国套房',
      bedType: '特大床',
      price: 5888,
      area: '178㎡',
      breakfast: '行政礼遇',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    },
  ],
};

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
 * Mock 模式：模拟 500ms 延迟
 */
export const getHotelDetail = async (hotelId: string): Promise<HotelDetail> => {
  // 真实接口调用（暂时注释）
  // return apiClient.get(`/hotels/${hotelId}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      // 简单模拟：实际项目中可根据 hotelId 返回不同数据
      // 这里为了演示，我们只返回固定的 MOCK_DETAIL，但修改 ID 以匹配请求
      resolve({
        ...MOCK_DETAIL,
        id: hotelId,
      });
    }, 0);
  });
};

/**
 * 获取首页 Banner 列表
 */
export const getBanners = (): Promise<BannerItem[]> => {
  return apiClient.get('/banners');
};
