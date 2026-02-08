import apiClient from './api';
import type {
  HotelListItem,
  HotelDetail,
  BannerItem,
  ListParams,
  ListResult,
  RoomType,
} from '../types';

// ============================================================================
// Mock Data Source (Moved from HotelListScreen to be the Single Source of Truth)
// ============================================================================

const ALL_MOCK_HOTELS: Record<string, HotelListItem[]> = {
  '北京': [
    {
      id: 'bj-1',
      name: '北京饭店',
      nameEn: 'Beijing Hotel',
      address: '东城区东长安街33号',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      minPrice: 2888,
    },
    {
      id: 'bj-2',
      name: '北京王府半岛酒店',
      nameEn: 'The Peninsula Beijing',
      address: '东城区王府井金鱼胡同8号',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
      minPrice: 3888,
    },
    {
      id: 'bj-3',
      name: '北京王府井文华东方酒店',
      nameEn: 'Mandarin Oriental Wangfujing',
      address: '东城区王府井大街269号',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      minPrice: 4888,
    },
    {
      id: 'bj-4',
      name: '北京瑰丽酒店',
      nameEn: 'Rosewood Beijing',
      address: '朝阳区呼家楼京广中心',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
      minPrice: 3500,
    },
    {
      id: 'bj-5',
      name: '北京诺金酒店',
      nameEn: 'NUO Hotel Beijing',
      address: '朝阳区将台路甲2号',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
      minPrice: 1800,
    },
    {
      id: 'bj-6',
      name: '北京丽晶酒店',
      nameEn: 'Regent Beijing',
      address: '东城区金宝街99号',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      minPrice: 1500,
    },
    {
      id: 'bj-7',
      name: '北京四季酒店',
      nameEn: 'Four Seasons Hotel Beijing',
      address: '朝阳区亮马桥路48号',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
      minPrice: 2600,
    },
    {
      id: 'bj-8',
      name: '北京东方君悦大酒店',
      nameEn: 'Grand Hyatt Beijing',
      address: '东城区东长安街1号东方广场',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
      minPrice: 1600,
    },
  ],
  '上海': [
    {
      id: 'sh-1',
      name: '上海和平饭店',
      nameEn: 'Fairmont Peace Hotel',
      address: '黄浦区南京东路20号(近外滩)',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      minPrice: 1888,
      facilities: ['游泳池', '健身房', '餐厅'],
      score: 4.8,
    },
    {
      id: 'sh-2',
      name: '上海宝格丽酒店',
      nameEn: 'Bulgari Hotel Shanghai',
      address: '静安区河南北路33号',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
      minPrice: 4888,
      facilities: ['游泳池', 'SPA', '酒吧'],
      score: 4.9,
    },
    {
      id: 'sh-3',
      name: '全季酒店(上海南京东路步行街店)',
      address: '黄浦区九江路(人民广场/南京路)',
      starLevel: 3,
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
      minPrice: 459,
      facilities: ['免费WiFi', '洗衣房'],
      score: 4.6,
    },
    {
      id: 'sh-4',
      name: '上海浦东丽思卡尔顿酒店',
      nameEn: 'The Ritz-Carlton Shanghai, Pudong',
      address: '浦东新区陆家嘴世纪大道8号',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      minPrice: 2688,
      facilities: ['游泳池', '健身房', '行政酒廊'],
      score: 4.9,
    },
    {
      id: 'sh-5',
      name: '玩具总动员酒店',
      nameEn: 'Toy Story Hotel',
      address: '浦东新区申迪西路360号(迪士尼度假区)',
      starLevel: 4,
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
      minPrice: 1350,
      facilities: ['免费班车', '儿童乐园'],
      score: 4.7,
    },
    {
      id: 'sh-6',
      name: '上海外滩W酒店',
      nameEn: 'W Shanghai - The Bund',
      address: '虹口区旅顺路66号(北外滩)',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      minPrice: 2500,
      facilities: ['游泳池', '健身房', 'SPA', '酒吧'],
      score: 4.8,
    },
    {
      id: 'sh-7',
      name: '上海璞丽酒店',
      nameEn: 'The Puli Hotel and Spa',
      address: '静安区常德路1号(近静安寺)',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
      minPrice: 3000,
      facilities: ['游泳池', 'SPA', '餐厅'],
      score: 4.9,
    },
    {
      id: 'sh-8',
      name: '上海建业里嘉佩乐酒店',
      nameEn: 'Capella Shanghai',
      address: '徐汇区建国西路480号',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
      minPrice: 4500,
      facilities: ['SPA', '餐厅', '健身房'],
      score: 4.9,
    },
    {
      id: 'sh-9',
      name: '上海外滩华尔道夫酒店',
      nameEn: 'Waldorf Astoria Shanghai on the Bund',
      address: '黄浦区中山东一路2号(外滩)',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      minPrice: 3200,
      facilities: ['游泳池', '健身房', '餐厅', '会议室'],
      score: 4.8,
    },
    {
      id: 'sh-10',
      name: '上海佘山世茂洲际酒店',
      nameEn: 'InterContinental Shanghai Wonderland',
      address: '松江区辰花路5888号',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
      minPrice: 2800,
      facilities: ['游泳池', '攀岩', '水下餐厅'],
      score: 4.7,
    },
    {
      id: 'sh-11',
      name: '上海中心J酒店',
      nameEn: 'J Hotel Shanghai Tower',
      address: '浦东新区东泰路126号上海中心大厦',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
      minPrice: 5888,
      facilities: ['游泳池', '管家服务', '云端餐厅'],
      score: 4.9,
    },
    {
      id: 'sh-12',
      name: '汉庭酒店(上海人民广场店)',
      address: '黄浦区西藏中路(人民广场)',
      starLevel: 2,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      minPrice: 350,
      facilities: ['免费WiFi', '行李寄存'],
      score: 4.5,
    },
    {
      id: 'sh-13',
      name: '亚朵酒店(上海南京路步行街店)',
      address: '黄浦区云南中路(南京路)',
      starLevel: 3,
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
      minPrice: 650,
      facilities: ['书吧', '洗衣房', '健身房'],
      score: 4.7,
    },
    {
      id: 'sh-14',
      name: '桔子水晶酒店(上海虹桥枢纽店)',
      address: '闵行区申长路(虹桥枢纽)',
      starLevel: 4,
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
      minPrice: 550,
      facilities: ['免费班车', '健身房', '早餐'],
      score: 4.6,
    },
    {
      id: 'sh-15',
      name: '上海迪士尼乐园酒店',
      nameEn: 'Shanghai Disneyland Hotel',
      address: '浦东新区申迪西路1009号(迪士尼度假区)',
      starLevel: 5,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      minPrice: 3500,
      facilities: ['免费班车', '儿童乐园', '主题客房'],
      score: 4.8,
    },
  ],
};

// 详情页模板数据（用于补充列表页缺失的详情信息）
const DETAIL_TEMPLATES: Record<string, Partial<HotelDetail>> = {
  // 豪华/奢华型模板
  'luxury': {
    facilities: ['免费WiFi', '游泳池', '健身房', 'SPA', '酒吧', '餐厅', '接送机', '管家服务', '会议室'],
    roomTypes: [
      { id: 'r1', name: '豪华大床房', bedType: '大床2米', price: 2888, area: '55㎡', breakfast: '含双早' },
      { id: 'r2', name: '行政套房', bedType: '特大床', price: 4888, area: '80㎡', breakfast: '行政礼遇' },
    ],
    comment: '“极致奢华，服务无微不至，景观无敌”',
    commentCount: 1256,
  },
  // 高档型模板
  'upscale': {
    facilities: ['免费WiFi', '健身房', '餐厅', '会议室', '停车场'],
    roomTypes: [
      { id: 'r1', name: '高级大床房', bedType: '大床1.8米', price: 1288, area: '40㎡', breakfast: '含早' },
      { id: 'r2', name: '豪华双床房', bedType: '双床1.2米', price: 1488, area: '45㎡', breakfast: '含早' },
    ],
    comment: '“性价比高，位置便利，房间干净整洁”',
    commentCount: 892,
  },
  // 经济/舒适型模板
  'budget': {
    facilities: ['免费WiFi', '行李寄存', '前台保险柜', '叫醒服务'],
    roomTypes: [
      { id: 'r1', name: '标准大床房', bedType: '大床1.5米', price: 458, area: '20㎡', breakfast: '无早' },
      { id: 'r2', name: '舒适双床房', bedType: '双床1.1米', price: 528, area: '25㎡', breakfast: '简餐' },
    ],
    comment: '“交通方便，价格实惠，适合商务出差”',
    commentCount: 3541,
  },
};

// ============================================================================
// Service Methods
// ============================================================================

/**
 * 获取酒店列表（分页、筛选、搜索）
 * 现在使用内存 Mock 数据模拟后端逻辑
 */
export const getHotelList = (
  params: ListParams,
): Promise<ListResult<HotelListItem>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const city = params.city || '上海';
      let allData = ALL_MOCK_HOTELS[city] || [];

      // 1. 关键字搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        allData = allData.filter(item => 
          item.name.toLowerCase().includes(keyword) || 
          (item.nameEn && item.nameEn.toLowerCase().includes(keyword)) ||
          (item.address && item.address.includes(keyword))
        );
      }

      // 2. 星级筛选
      if (params.starLevel) {
        const stars = Array.isArray(params.starLevel) ? params.starLevel : [params.starLevel];
        if (stars.length > 0) {
          allData = allData.filter(item => stars.includes(item.starLevel));
        }
      }

      // 3. 价格筛选
      if (params.priceMin !== undefined) {
        allData = allData.filter(item => (item.minPrice || 0) >= (params.priceMin as number));
      }
      if (params.priceMax !== undefined) {
        allData = allData.filter(item => (item.minPrice || 0) <= (params.priceMax as number));
      }

      // 3.5 设施筛选
      const facilities = params.facilities as string[];
      if (facilities && facilities.length > 0) {
        allData = allData.filter(item => {
            if (!item.facilities) return false;
            return facilities.every((fac: string) => item.facilities?.includes(fac));
        });
      }

      // 3.6 位置筛选
      const locationValue = params.locationValue as string;
      if (locationValue) {
        allData = allData.filter(item => 
          item.address?.includes(locationValue) || 
          item.name.includes(locationValue)
        );
      }

      // 3.7 排序
      if (params.sort) {
        allData = [...allData]; // Shallow copy for sorting
        if (params.sort === 'price_asc') {
          allData.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
        } else if (params.sort === 'price_desc') {
          allData.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
        } else if (params.sort === 'score_desc') {
          allData.sort((a, b) => (b.score || 4.5) - (a.score || 4.5));
        }
      }

      // 4. 分页逻辑
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageData = allData.slice(start, end);

      resolve({
        list: pageData,
        page,
        pageSize,
        total: allData.length,
      });
    }, 500); // 模拟网络延迟
  });
};

/**
 * 获取酒店详情（含房型与价格）
 * 自动匹配列表数据，确保信息一致性
 */
export const getHotelDetail = async (hotelId: string): Promise<HotelDetail> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. 在所有 Mock 数据中查找对应 ID 的酒店
      let foundHotel: HotelListItem | undefined;
      for (const city in ALL_MOCK_HOTELS) {
        const hotel = ALL_MOCK_HOTELS[city].find(h => h.id === hotelId);
        if (hotel) {
          foundHotel = hotel;
          break;
        }
      }

      // 2. 如果没找到，返回默认数据（防止报错）
      if (!foundHotel) {
        foundHotel = ALL_MOCK_HOTELS['上海'][0];
      }

      // 3. 根据星级选择详情模板
      let template = DETAIL_TEMPLATES['upscale'];
      if (foundHotel.starLevel >= 5) {
        template = DETAIL_TEMPLATES['luxury'];
      } else if (foundHotel.starLevel <= 3) {
        template = DETAIL_TEMPLATES['budget'];
      }

      // 4. 合并数据：列表基础信息 + 模板详情信息
      const fullDetail: HotelDetail = {
        id: hotelId,
        name: foundHotel.name,
        nameEn: foundHotel.nameEn,
        address: foundHotel.address || '地址未知',
        starLevel: foundHotel.starLevel,
        score: foundHotel.score || 4.5,
        images: foundHotel.images,
        // 优先使用列表页已有的设施信息，如果没有则使用模板
        facilities: foundHotel.facilities || template.facilities || [],
        comment: template.comment,
        commentCount: template.commentCount,
        roomTypes: (template.roomTypes || []).map(r => ({
          ...r,
          image: foundHotel?.images[0] // 房型图暂时复用首图
        })),
      };

      resolve(fullDetail);
    }, 500);
  });
};

/**
 * 获取首页 Banner 列表
 */
export const getBanners = (): Promise<BannerItem[]> => {
  return apiClient.get('/banners');
};
