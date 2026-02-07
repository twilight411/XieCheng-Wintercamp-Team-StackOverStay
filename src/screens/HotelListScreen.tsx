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
const getMockData = (city: string): HotelListItemType[] => {
  if (city === '北京') {
    return [
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
    ];
  }
  
  if (city === '上海') {
    return [
      {
        id: 'sh-1',
        name: '上海和平饭店',
        nameEn: 'Fairmont Peace Hotel',
        address: '黄浦区南京东路20号',
        starLevel: 5,
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        minPrice: 1888,
        facilities: ['游泳池', '健身房', '餐厅'],
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
      },
      {
        id: 'sh-3',
        name: '全季酒店(上海南京东路步行街店)',
        address: '黄浦区九江路',
        starLevel: 3,
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
        minPrice: 459,
        facilities: ['免费WiFi', '洗衣房'],
      },
    ];
  }

  return []; // 其他城市暂无数据
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
  // 初始化时根据默认城市获取数据
  const [hotelList, setHotelList] = React.useState(() => getMockData(initialCity || '上海'));

  // 模拟重新请求数据
  const refreshData = useCallback(() => {
    setLoading(true);
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
      // 根据当前城市获取 Mock 数据
      let newData = getMockData(city);

      // --- 前端模拟筛选逻辑 (Mock) ---
      
      // 1. 星级筛选
      if (params.starLevel && params.starLevel.length > 0) {
        // params.starLevel 是数字数组 [3, 5]
        newData = newData.filter(item => params.starLevel.includes(item.starLevel));
      }

      // 2. 价格筛选
      if (params.priceMin !== undefined) {
        newData = newData.filter(item => item.minPrice >= params.priceMin);
      }
      if (params.priceMax !== undefined) {
        newData = newData.filter(item => item.minPrice <= params.priceMax);
      }

      // 3. 设施筛选 (Mock)
      if (params.facilities && params.facilities.length > 0) {
        // 简单模拟：酒店设施需包含所有选中的设施
        newData = newData.filter(item => {
           if (!item.facilities) return false;
           // 检查 params.facilities 中的每一项是否都在 item.facilities 中
           return params.facilities.every((fac: string) => item.facilities?.includes(fac));
        });
      }

      // 4. 排序逻辑
      if (params.sort) {
        if (params.sort === 'price_asc') {
          newData.sort((a, b) => a.minPrice - b.minPrice);
        } else if (params.sort === 'price_desc') {
          newData.sort((a, b) => b.minPrice - a.minPrice);
        } else if (params.sort === 'score_desc') {
          // 假设 item.score 存在，若不存在则忽略或用 mock 值
          newData.sort((a, b) => (b.score || 4.5) - (a.score || 4.5));
        }
      }

      setHotelList(newData);
      setLoading(false);
    }, 500);
  }, [city, checkIn, checkOut, keyword, filterLocation, filterPriceStar, filterSort, filterMore]);

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
});

export default HotelListScreen;
