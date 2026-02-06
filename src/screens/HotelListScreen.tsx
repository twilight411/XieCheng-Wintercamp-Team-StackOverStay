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

// 路由参数类型（HotelList 为 Stack 屏，由首页点击查询后跳转）
type HotelListRouteProp = RouteProp<RootStackParamList, 'HotelList'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock 数据
const MOCK_DATA: HotelListItemType[] = [
  {
    id: '1',
    name: '上海和平饭店',
    nameEn: 'Fairmont Peace Hotel',
    address: '黄浦区南京东路20号',
    starLevel: 5,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    minPrice: 1888,
  },
  {
    id: '2',
    name: '上海宝格丽酒店',
    nameEn: 'Bulgari Hotel Shanghai',
    address: '静安区河南北路33号',
    starLevel: 5,
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    minPrice: 4888,
  },
  {
    id: '3',
    name: '全季酒店(上海南京东路步行街店)',
    address: '黄浦区九江路',
    starLevel: 3,
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
    minPrice: 459,
  },
  {
    id: '4',
    name: '亚朵酒店(外滩店)',
    address: '黄浦区延安东路',
    starLevel: 4,
    images: ['https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800'],
    minPrice: 689,
  },
];

function HotelListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<HotelListRouteProp>();

  // 从参数获取初始值（暂未实际使用，留作后续逻辑入口）
  const { city, keyword } = route.params || {};

  const handleItemPress = useCallback((hotelId: string) => {
    navigation.navigate('HotelDetail', {hotelId});
  }, [navigation]);

  const renderItem = useCallback(({item}: {item: HotelListItemType}) => (
    <HotelListItem item={item} onPress={handleItemPress} />
  ), [handleItemPress]);

  const renderHeader = () => (
    <View>
      {/* 顶部搜索条 */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.citySelector}
          activeOpacity={0.8}
          onPress={() => Alert.alert('切换城市', '后续接入城市选择页')}>
          <Text style={styles.cityText}>{city || '上海'}</Text>
          <Text style={styles.arrowIcon}>▼</Text>
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <TouchableOpacity
            style={styles.dateSection}
            onPress={() => Alert.alert('修改日期', '后续接入日历组件')}>
            <Text style={styles.dateText}>住 02-06</Text>
            <Text style={styles.dateText}>离 02-07</Text>
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
      <FilterBar />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 列表主体 */}
      <FlatList
        data={MOCK_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]} // 让头部吸顶（需配合背景色）
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
});

export default HotelListScreen;
