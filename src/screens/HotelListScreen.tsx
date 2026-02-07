import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../navigation/types';
import type {HotelListItem as HotelListItemType} from '../types/hotel';
import {HotelListItem} from '../components/HotelListItem';
import {FilterBar} from '../components/FilterBar';
import {CityPicker} from '../components/CityPicker';
import {RangeDatePickerModal} from '../components/RangeDatePickerModal';
import {DropdownMenu} from '../components/filter/DropdownMenu';
import {FilterLocation} from '../components/filter/FilterLocation';
import {FilterPriceStar} from '../components/filter/FilterPriceStar';
import {FilterSort} from '../components/filter/FilterSort';
import {FilterMore} from '../components/filter/FilterMore';

// 路由参数类型（HotelList 为 Stack 屏，由首页点击查询后跳转）
type HotelListRouteProp = RouteProp<RootStackParamList, 'HotelList'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock 数据生成器
const ALL_MOCK_DATA: Record<string, HotelListItemType[]> = {
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
  ]
};

// 模拟后端请求函数
const mockFetchHotels = (city: string, page: number, pageSize: number, params: any): {list: HotelListItemType[], hasMore: boolean} => {
  let allData = ALL_MOCK_DATA[city] || [];
  
  // 1. 星级筛选
  if (params.starLevel && params.starLevel.length > 0) {
    allData = allData.filter(item => params.starLevel.includes(item.starLevel));
  }

  // 2. 价格筛选
  if (params.priceMin !== undefined) {
    allData = allData.filter(item => (item.minPrice || 0) >= params.priceMin);
  }
  if (params.priceMax !== undefined) {
    allData = allData.filter(item => (item.minPrice || 0) <= params.priceMax);
  }

  // 3. 设施筛选
  if (params.facilities && params.facilities.length > 0) {
    allData = allData.filter(item => {
        if (!item.facilities) return false;
        return params.facilities.every((fac: string) => item.facilities?.includes(fac));
    });
  }

  // 4. 位置筛选
  if (params.locationValue) {
    allData = allData.filter(item => 
      item.address?.includes(params.locationValue) || 
      item.name.includes(params.locationValue)
    );
  }

  // 5. 排序
  if (params.sort) {
    // 复制一份数组再排序，避免修改原数组
    allData = [...allData];
    if (params.sort === 'price_asc') {
      allData.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    } else if (params.sort === 'price_desc') {
      allData.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
    } else if (params.sort === 'score_desc') {
      allData.sort((a, b) => (b.score || 4.5) - (a.score || 4.5));
    }
  }

  // 6. 分页切片
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = allData.slice(start, end);
  const hasMore = end < allData.length;

  return { list, hasMore };
};

function HotelListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<HotelListRouteProp>();

  // 从参数获取初始值
  const { city: initialCity, keyword, checkIn: initialCheckIn, checkOut: initialCheckOut } = route.params || {};
  
  // 状态管理
  const [city, setCity] = React.useState(initialCity || '上海');
  const [checkIn, setCheckIn] = React.useState(initialCheckIn || '2025-02-06');
  const [checkOut, setCheckOut] = React.useState(initialCheckOut || '2025-02-07');
  
  const [cityModalVisible, setCityModalVisible] = React.useState(false);
  const [dateModalVisible, setDateModalVisible] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  
  // 筛选状态
  const [filterLocation, setFilterLocation] = React.useState<{type: string; value: string} | null>(null);
  const [filterPriceStar, setFilterPriceStar] = React.useState<{stars: string[]; price: string | null} | null>(null);
  const [filterSort, setFilterSort] = React.useState('default');
  const [filterMore, setFilterMore] = React.useState<Record<string, string[]> | null>(null);

  // 分页状态
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);

  // 计算筛选数量
  const filterCounts = React.useMemo(() => {
    let location = 0;
    if (filterLocation) location = 1;

    let priceStar = 0;
    if (filterPriceStar) {
      priceStar += (filterPriceStar.stars?.length || 0);
      if (filterPriceStar.price) priceStar += 1;
    }

    let more = 0;
    if (filterMore) {
      Object.values(filterMore).forEach(arr => more += arr.length);
    }

    return {location, priceStar, more};
  }, [filterLocation, filterPriceStar, filterMore]);

  const [loading, setLoading] = React.useState(false);
  // 初始化时根据默认城市获取数据 (仅获取第一页)
  const [hotelList, setHotelList] = React.useState(() => {
    const { list } = mockFetchHotels(initialCity || '上海', 1, 10, {});
    return list;
  });

  // 模拟重新请求数据
  const refreshData = useCallback(() => {
    setLoading(true);
    setPage(1);
    setHasMore(true);
    setHotelList([]); 
    
    // 构造标准请求参数
    const params: any = {
      city,
      checkIn,
      checkOut,
      keyword,
    };

    // 1. 处理价格/星级
    if (filterPriceStar) {
      // 星级转换: ['2', '3'] -> [2, 3]
      if (filterPriceStar.stars?.length) {
        params.starLevel = filterPriceStar.stars.map(Number);
      }
      // 价格转换: '0-300' -> min=0, max=300
      if (filterPriceStar.price) {
        const [min, max] = filterPriceStar.price.split('-').map(Number);
        params.priceMin = min;
        if (max < 9999) { // 假设 9999 是 "1000以上" 的标记值，或者直接传 undefined
           params.priceMax = max;
        }
      }
    }

    // 2. 处理设施 (More)
    if (filterMore) {
       // 这里根据后端协议，可能需要合并所有选中的设施 tag
       // 假设后端接受 facilities: string[]
       const facilities: string[] = [];
       Object.values(filterMore).forEach(arr => facilities.push(...arr));
       if (facilities.length) {
         params.facilities = facilities;
       }
    }

    // 3. 处理位置 (Location) - 假设后端接受 locationType, locationValue
    if (filterLocation) {
      params.locationType = filterLocation.type;
      params.locationValue = filterLocation.value;
    }

    // 4. 处理排序
    if (filterSort && filterSort !== 'default') {
      params.sort = filterSort;
    }

    // 模拟带着参数请求
    console.log('Requesting with params:', params);

    setTimeout(() => {
      // 使用新的 mockFetchHotels 替代原来的逻辑
      // 强制请求第一页
      const { list, hasMore: more } = mockFetchHotels(city, 1, 10, params);
      
      setHotelList(list);
      setLoading(false);
      setHasMore(more);
    }, 500);
  }, [city, checkIn, checkOut, keyword, filterLocation, filterPriceStar, filterSort, filterMore]);

  // 加载更多
  const loadMoreData = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;

    setLoadingMore(true);
    
    // 模拟网络请求下一页
    setTimeout(() => {
      const nextPage = page + 1;
      
      // 构造请求参数 (与 refreshData 保持一致，最好提取出来)
      const params: any = {
        city,
        checkIn,
        checkOut,
        keyword,
      };

      if (filterPriceStar) {
        if (filterPriceStar.stars?.length) params.starLevel = filterPriceStar.stars.map(Number);
        if (filterPriceStar.price) {
          const [min, max] = filterPriceStar.price.split('-').map(Number);
          params.priceMin = min;
          if (max < 9999) params.priceMax = max;
        }
      }

      if (filterMore) {
         const facilities: string[] = [];
         Object.values(filterMore).forEach(arr => facilities.push(...arr));
         if (facilities.length) params.facilities = facilities;
      }

      if (filterLocation) {
        params.locationType = filterLocation.type;
        params.locationValue = filterLocation.value;
      }

      if (filterSort && filterSort !== 'default') {
        params.sort = filterSort;
      }

      // 获取下一页数据
      const { list, hasMore: more } = mockFetchHotels(city, nextPage, 10, params);

      setHotelList(prev => [...prev, ...list]);
      setPage(nextPage);
      setLoadingMore(false);
      setHasMore(more);
    }, 1000);
  }, [loading, loadingMore, hasMore, page, city, filterPriceStar, filterMore, filterLocation, filterSort, keyword, checkIn, checkOut]);

  // 监听筛选条件变化，自动触发刷新
  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleCitySelect = (newCity: string) => {
    setCity(newCity);
  };

  const handleDateSelect = (start: string, end: string) => {
    setCheckIn(start);
    setCheckOut(end);
  };

  const handleItemPress = useCallback((hotelId: string) => {
    navigation.navigate('HotelDetail', {
      hotelId,
      checkIn,
      checkOut,
    });
  }, [navigation, checkIn, checkOut]);

  const renderItem = useCallback(({item}: {item: HotelListItemType}) => (
    <HotelListItem item={item} onPress={handleItemPress} />
  ), [handleItemPress]);

  const handleFilterTabPress = (tab: string) => {
    setActiveFilter(prev => (prev === tab ? null : tab));
  };

  const closeFilter = () => setActiveFilter(null);

  const renderHeader = () => (
    <View style={{zIndex: 10, backgroundColor: '#fff'}}>
      {/* 顶部搜索条 */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.citySelector}
          activeOpacity={0.8}
          onPress={() => setCityModalVisible(true)}>
          <Text style={styles.cityText}>{city}</Text>
          <Text style={styles.arrowIcon}>▼</Text>
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <TouchableOpacity
            style={styles.dateSection}
            onPress={() => setDateModalVisible(true)}>
            <Text style={styles.dateText}>住 {checkIn.slice(5)}</Text>
            <Text style={styles.dateText}>离 {checkOut.slice(5)}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.keywordSection}
            activeOpacity={1}
            onPress={() => Alert.alert('搜索关键字', '跳转搜索页')}>
            <Text style={[styles.keywordText, !keyword && styles.placeholder]}>
              {keyword || '关键字/位置/品牌'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 筛选栏 */}
      <FilterBar 
        activeTab={activeFilter} 
        onTabPress={handleFilterTabPress} 
        counts={filterCounts}
      />
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore && !hasMore && hotelList.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>- 已经到底了 -</Text>
        </View>
      );
    }
    if (loadingMore) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      );
    }
    return <View style={{height: 20}} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 列表主体 */}
      <FlatList
        data={hotelList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]} // 让头部吸顶（需配合背景色）
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refreshData}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂无酒店数据</Text>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>加载中...</Text>
            </View>
          )
        }
      />

      <DropdownMenu
        visible={!!activeFilter}
        onClose={closeFilter}
        top={96}
      >
        {activeFilter === 'location' && (
          <FilterLocation
            initialSelection={filterLocation}
            onApply={val => {
              setFilterLocation(val);
              closeFilter();
            }}
          />
        )}
        {activeFilter === 'priceStar' && (
          <FilterPriceStar
            initialSelection={filterPriceStar}
            onApply={val => {
              setFilterPriceStar(val);
              closeFilter();
            }}
            onReset={() => {}}
          />
        )}
        {activeFilter === 'sort' && (
          <FilterSort
            currentSort={filterSort}
            onApply={val => {
              setFilterSort(val);
              closeFilter();
            }}
          />
        )}
        {activeFilter === 'more' && (
          <FilterMore
            initialSelection={filterMore}
            onApply={val => {
              setFilterMore(val);
              closeFilter();
            }}
            onReset={() => {}}
          />
        )}
      </DropdownMenu>

      <CityPicker
        visible={cityModalVisible}
        currentCity={city}
        onClose={() => setCityModalVisible(false)}
        onSelect={handleCitySelect}
      />

      <RangeDatePickerModal
        visible={dateModalVisible}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        onClose={() => setDateModalVisible(false)}
        onSelect={handleDateSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 20,
  },
  // 顶部搜索条样式
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  arrowIcon: {
    fontSize: 10,
    color: '#333',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    height: 36,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#0066CC',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  keywordSection: {
    flex: 1,
  },
  keywordText: {
    fontSize: 13,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
});

export default HotelListScreen;
