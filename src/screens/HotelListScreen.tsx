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
  Modal,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import { getHotelList, getHotelDetail } from '../services/hotel';
import type {RootStackParamList} from '../navigation/types';
import type {HotelListItem as HotelListItemType, ListParams} from '../types';
import {useSearchStore} from '../stores/searchStore';
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

function HotelListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<HotelListRouteProp>();

  // 从参数或全局 store 获取初始值（与首页筛选条件同步）
  const {
    city: paramCity,
    keyword: paramKeyword,
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    starLevel: paramStarLevel,
    priceMin: paramPriceMin,
    priceMax: paramPriceMax,
  } = route.params || {};
  const storeCity = useSearchStore(s => s.city);
  const setStoreCity = useSearchStore(s => s.setCity);

  const [city, setCityState] = React.useState(paramCity ?? storeCity ?? '上海');
  const [keyword, setKeyword] = React.useState(paramKeyword ?? '');
  const [checkIn, setCheckIn] = React.useState(initialCheckIn || '2025-02-06');
  const [checkOut, setCheckOut] = React.useState(initialCheckOut || '2025-02-07');
  const [keywordModalVisible, setKeywordModalVisible] = React.useState(false);
  const [keywordInput, setKeywordInput] = React.useState('');

  // 从首页/定位更新了城市时，列表页无 params 时同步展示
  React.useEffect(() => {
    if (paramCity == null) setCityState(storeCity);
  }, [storeCity, paramCity]);
  // 从首页带过来的 keyword 同步到列表页
  React.useEffect(() => {
    if (paramKeyword !== undefined) setKeyword(paramKeyword);
  }, [paramKeyword]);

  const setCity = (c: string) => {
    setCityState(c);
    setStoreCity(c);
  };
  
  const [cityModalVisible, setCityModalVisible] = React.useState(false);
  const [dateModalVisible, setDateModalVisible] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  
  // 筛选状态
  const [filterLocation, setFilterLocation] = React.useState<{type: string; value: string} | null>(null);
  const initialStarsFromParams: string[] = React.useMemo(() => {
    if (paramStarLevel == null) return [];
    const arr = Array.isArray(paramStarLevel) ? paramStarLevel : [paramStarLevel];
    return arr.map(v => String(v));
  }, [paramStarLevel]);
  const initialPriceFromParams: string | null = React.useMemo(() => {
    if (paramPriceMin == null && paramPriceMax == null) return null;
    if (paramPriceMin === 0 && paramPriceMax === 300) return '0-300';
    if (paramPriceMin === 300 && paramPriceMax === 600) return '300-600';
    if (paramPriceMin === 600 && paramPriceMax === 1000) return '600-1000';
    if (paramPriceMin === 1000 && (paramPriceMax == null || paramPriceMax === undefined)) {
      return '1000-9999';
    }
    return null;
  }, [paramPriceMin, paramPriceMax]);
  const [filterPriceStar, setFilterPriceStar] = React.useState<{stars: string[]; price: string | null} | null>(
    initialStarsFromParams.length || initialPriceFromParams
      ? {stars: initialStarsFromParams, price: initialPriceFromParams}
      : null,
  );
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
  const [hotelList, setHotelList] = React.useState<HotelListItemType[]>([]);

  const applyLocalFilters = useCallback(
    (list: HotelListItemType[]): HotelListItemType[] => {
      let data = [...list];

      if (filterPriceStar?.stars?.length) {
        const starNums = filterPriceStar.stars.map(Number);
        data = data.filter(item => {
          const level = item.starLevel;
          const approx =
            level >= 4.5 ? 5 :
            level >= 3.5 ? 4 :
            level >= 2.5 ? 3 :
            level >= 1.5 ? 2 : 1;
          return starNums.includes(approx);
        });
      }

      if (filterPriceStar?.price) {
        const parts = filterPriceStar.price.split('-').map(Number);
        const min = parts[0];
        const max = parts[1];
        data = data.filter(item => {
          const price = item.minPrice ?? 0;
          if (!Number.isNaN(min) && price < min) return false;
          if (!Number.isNaN(max) && price > max) return false;
          return true;
        });
      }

      if (filterLocation?.value) {
        const loc = filterLocation.value;
        data = data.filter(item => {
          const addr = item.address || '';
          return addr.includes(loc) || item.name.includes(loc);
        });
      }

      if (filterSort && filterSort !== 'default') {
        const sorted = [...data];
        if (filterSort === 'price_asc') {
          sorted.sort((a, b) => (a.minPrice ?? 0) - (b.minPrice ?? 0));
        } else if (filterSort === 'price_desc') {
          sorted.sort((a, b) => (b.minPrice ?? 0) - (a.minPrice ?? 0));
        } else if (filterSort === 'score_desc') {
          sorted.sort(
            (a, b) =>
              (b.score ?? b.starLevel ?? 0) - (a.score ?? a.starLevel ?? 0),
          );
        }
        data = sorted;
      }

      return data;
    },
    [filterPriceStar, filterLocation, filterSort],
  );

  // 构造请求参数
  const buildParams = useCallback(() => {
    const params: ListParams = {
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
        if (max < 9999) { // 假设 9999 是 "1000以上" 的标记值
           params.priceMax = max;
        }
      }
    }

    // 2. 处理设施 (More)
    if (filterMore) {
       // 这里根据后端协议，可能需要合并所有选中的设施 tag
       const facilities: string[] = [];
       Object.values(filterMore).forEach(arr => facilities.push(...arr));
       if (facilities.length) {
         params.facilities = facilities;
       }
    }

    // 3. 处理位置 (Location)
    if (filterLocation) {
      params.locationType = filterLocation.type;
      params.locationValue = filterLocation.value;
    }

    // 4. 处理排序
    if (filterSort && filterSort !== 'default') {
      params.sort = filterSort;
    }
    return params;
  }, [city, checkIn, checkOut, keyword, filterLocation, filterPriceStar, filterSort, filterMore]);

  // 刷新数据
  const refreshData = useCallback(async () => {
    setLoading(true);
    setPage(1);
    setHasMore(true);
    // setHotelList([]); // 可选：清空列表会展示 loading，但也可能导致闪烁

    const params = buildParams();
    params.page = 1;
    params.pageSize = 10;

    console.log('Requesting with params:', params);

    try {
      const result = await getHotelList(params);
      let baseList = result.list;

      if (filterMore) {
        const selected: string[] = [];
        Object.values(filterMore).forEach(arr => selected.push(...arr));
        if (selected.length) {
          const details = await Promise.all(
            baseList.map(item =>
              getHotelDetail(item.id).catch(() => null),
            ),
          );
          const allowedIds = new Set<string>();
          details.forEach((detail, index) => {
            if (!detail || !detail.facilities || detail.facilities.length === 0) {
              return;
            }
            const ok = selected.every(tag => detail.facilities!.includes(tag));
            if (ok) {
              allowedIds.add(baseList[index].id);
            }
          });
          baseList = baseList.filter(item => allowedIds.has(item.id));
        }
      }

      const filtered = applyLocalFilters(baseList);
      setHotelList(filtered);
      setHasMore(result.total > filtered.length); 
    } catch (error: any) {
      console.error('Fetch error:', error);
      const isNetworkError =
        error?.message === 'Network Error' || error?.code === 'ERR_NETWORK';
      Alert.alert(
        '加载失败',
        isNetworkError
          ? '无法连接服务器（Network Error）。请确认：\n1. 后端已启动（如在后端目录执行 docker-compose up）\n2. 本机地址正确（模拟器用 10.0.2.2:端口，真机用电脑局域网 IP:端口）'
          : '请检查网络或稍后重试。',
        [{text: '知道了'}],
      );
    } finally {
      setLoading(false);
    }
  }, [buildParams, applyLocalFilters, filterMore]);

  // 加载更多
  const loadMoreData = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    
    const params = buildParams();
    params.page = nextPage;
    params.pageSize = 10;

    try {
      const result = await getHotelList(params);
      let baseList = result.list;

      if (filterMore) {
        const selected: string[] = [];
        Object.values(filterMore).forEach(arr => selected.push(...arr));
        if (selected.length) {
          const details = await Promise.all(
            baseList.map(item =>
              getHotelDetail(item.id).catch(() => null),
            ),
          );
          const allowedIds = new Set<string>();
          details.forEach((detail, index) => {
            if (!detail || !detail.facilities || detail.facilities.length === 0) {
              return;
            }
            const ok = selected.every(tag => detail.facilities!.includes(tag));
            if (ok) {
              allowedIds.add(baseList[index].id);
            }
          });
          baseList = baseList.filter(item => allowedIds.has(item.id));
        }
      }

      const filtered = applyLocalFilters(baseList);
      setHotelList(prev => [...prev, ...filtered]);
      setPage(nextPage);
      const currentCount = hotelList.length + filtered.length;
      setHasMore(result.total > currentCount);
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, page, buildParams, hotelList.length, applyLocalFilters, filterMore]);

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
            activeOpacity={0.8}
            onPress={() => {
              setKeywordInput(keyword);
              setKeywordModalVisible(true);
            }}>
            <Text style={[styles.keywordText, !keyword && styles.placeholder]} numberOfLines={1}>
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
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>未找到符合条件的酒店</Text>
            </View>
          ) : (
             <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>正在加载...</Text>
            </View>
          )
        }
      />

      {/* 筛选下拉菜单 (Overlay) */}
      <DropdownMenu
        visible={!!activeFilter}
        onClose={closeFilter}
        top={96} // 头部高度 (36+16 + 44)
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

      {/* 关键词搜索弹层：输入后请求带 keyword，由后端筛选 */}
      <Modal
        visible={keywordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setKeywordModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.keywordModalBackdrop}
          onPress={() => setKeywordModalVisible(false)}>
          <View style={styles.keywordModalBox} onStartShouldSetResponder={() => true}>
            <Text style={styles.keywordModalTitle}>关键字 / 位置 / 品牌</Text>
            <TextInput
              style={styles.keywordModalInput}
              placeholder="如：经济型、汉庭、人民广场"
              placeholderTextColor="#999"
              value={keywordInput}
              onChangeText={setKeywordInput}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={() => {
                setKeyword(keywordInput.trim());
                setKeywordModalVisible(false);
              }}
            />
            <View style={styles.keywordModalButtons}>
              <TouchableOpacity
                style={[styles.keywordModalBtn, styles.keywordModalBtnCancel]}
                onPress={() => setKeywordModalVisible(false)}>
                <Text style={styles.keywordModalBtnCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.keywordModalBtn, styles.keywordModalBtnConfirm]}
                onPress={() => {
                  setKeyword(keywordInput.trim());
                  setKeywordModalVisible(false);
                }}>
                <Text style={styles.keywordModalBtnConfirmText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  keywordModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  keywordModalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  keywordModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  keywordModalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    marginBottom: 16,
  },
  keywordModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  keywordModalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  keywordModalBtnCancel: {
    backgroundColor: '#f0f0f0',
  },
  keywordModalBtnCancelText: {
    fontSize: 15,
    color: '#666',
  },
  keywordModalBtnConfirm: {
    backgroundColor: '#0086F6',
  },
  keywordModalBtnConfirmText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
});

export default HotelListScreen;
