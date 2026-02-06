import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

import type {RootStackParamList} from '../navigation/types';
import type {RootTabParamList} from '../navigation/types';
import type {BannerItem} from '../types';
import {getBanners} from '../services/hotel';
import {useSearchStore, type SearchState} from '../stores/searchStore';
import {getCurrentCity} from '../services/geo';

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

  const city = useSearchStore((s: SearchState) => s.city);
  const setCity = useSearchStore((s: SearchState) => s.setCity);
  const keyword = useSearchStore((s: SearchState) => s.keyword ?? '');
  const setKeyword = useSearchStore((s: SearchState) => s.setKeyword);
  const checkIn = useSearchStore((s: SearchState) => s.checkIn);

  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [bannerLoading, setBannerLoading] = useState<boolean>(false);

  useEffect(() => {
    // 获取当前城市（占位实现，后续可接入真实定位）
    if (!city) {
      getCurrentCity()
        .then(info => {
          setCity(info.city);
        })
        .catch(() => {
          // 静默失败，保持默认城市
        });
    }
  }, [city, setCity]);

  useEffect(() => {
    setBannerLoading(true);
    getBanners()
      .then(data => {
        setBanners(data);
      })
      .catch(() => {
        // 出错时保留为空列表，占位展示
      })
      .finally(() => {
        setBannerLoading(false);
      });
  }, []);

  const goToDetail = (hotelId: string) => {
    navigation.navigate('HotelDetail', {hotelId});
  };

  const goToList = (kw?: string) => {
    const finalKeyword = kw ?? keyword ?? '';
    navigation.navigate('HotelList', {
      keyword: finalKeyword,
      city,
      checkIn,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* 当前城市 */}
      <View style={styles.cityBar}>
        <Text style={styles.cityLabel}>当前城市</Text>
        <Text style={styles.cityValue}>{city}</Text>
      </View>

      {/* Banner 区：接接口 + 点击跳详情 */}
      <View style={styles.bannerContainer}>
        {bannerLoading ? (
          <View style={styles.bannerPlaceholder}>
            <Text style={styles.bannerText}>加载推荐中...</Text>
          </View>
        ) : banners.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}>
            {banners.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.banner}
                onPress={() => goToDetail(item.hotelId)}
                activeOpacity={0.9}>
                <Text style={styles.bannerTitle}>
                  {item.title ?? '推荐酒店'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.bannerPlaceholder}>
            <Text style={styles.bannerText}>Banner 占位（暂无数据）</Text>
          </View>
        )}
      </View>

      {/* 搜索框：输入关键字，点击搜索或回车跳列表 */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索酒店、目的地"
          placeholderTextColor="#999"
          value={keyword}
          onChangeText={text => setKeyword(text)}
          returnKeyType="search"
          onSubmitEditing={() => goToList()}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => goToList()}
          activeOpacity={0.8}>
          <Text style={styles.searchButtonText}>搜索</Text>
        </TouchableOpacity>
      </View>

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
              onPress={() => {
                setKeyword(tag.label);
                goToList(tag.label);
              }}
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
  cityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cityLabel: {
    fontSize: 14,
    color: '#666',
  },
  cityValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  bannerContainer: {
    height: 160,
    marginBottom: 16,
  },
  banner: {
    height: '100%',
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  bannerPlaceholder: {
    height: '100%',
    backgroundColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
  },
  searchButtonText: {
    fontSize: 14,
    color: '#fff',
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
