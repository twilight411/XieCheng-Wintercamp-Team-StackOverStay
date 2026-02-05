import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

import type {RootStackParamList} from '../navigation/types';
import type {RootTabParamList} from '../navigation/types';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const QUICK_TAGS = [
  {id: 'economy', label: '经济型'},
  {id: 'comfort', label: '舒适型'},
  {id: 'high', label: '高档'},
  {id: 'luxury', label: '豪华'},
];

function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNav>();

  const goToDetail = (hotelId: string) => {
    navigation.navigate('HotelDetail', {hotelId});
  };

  const goToList = (keyword = '') => {
    navigation.navigate('HotelList', {keyword, city: undefined, checkIn: undefined});
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Banner 占位：点击跳详情 */}
      <TouchableOpacity
        style={styles.banner}
        onPress={() => goToDetail('placeholder_hotel_1')}
        activeOpacity={0.9}>
        <Text style={styles.bannerText}>Banner</Text>
      </TouchableOpacity>

      {/* 搜索框占位：点击跳列表 */}
      <TouchableOpacity
        style={styles.searchWrap}
        onPress={() => goToList('')}
        activeOpacity={0.8}>
        <Text style={styles.searchPlaceholder}>搜索酒店、目的地</Text>
      </TouchableOpacity>

      {/* 入住日期占位 */}
      <TouchableOpacity style={styles.dateWrap} activeOpacity={0.8}>
        <Text style={styles.dateLabel}>入住日期</Text>
        <Text style={styles.dateValue}>选择日期</Text>
      </TouchableOpacity>

      {/* 星级 / 价格筛选占位 */}
      <View style={styles.filterRow}>
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>星级</Text>
          <Text style={styles.filterValue}>不限</Text>
        </View>
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>价格</Text>
          <Text style={styles.filterValue}>不限</Text>
        </View>
      </View>

      {/* 快捷标签 */}
      <View style={styles.tagsSection}>
        <Text style={styles.tagsTitle}>快捷标签</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsScroll}>
          {QUICK_TAGS.map(tag => (
            <TouchableOpacity
              key={tag.id}
              style={styles.tag}
              onPress={() => goToList(tag.label)}
              activeOpacity={0.8}>
              <Text style={styles.tagText}>{tag.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingBottom: 24,
  },
  banner: {
    height: 160,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  searchWrap: {
    height: 44,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  dateWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#333',
  },
  dateValue: {
    fontSize: 14,
    color: '#999',
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  filterBlock: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  filterLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  filterValue: {
    fontSize: 14,
    color: '#333',
  },
  tagsSection: {
    marginHorizontal: 16,
  },
  tagsTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  tagsScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 8,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    color: '#333',
  },
});

export default HomeScreen;
