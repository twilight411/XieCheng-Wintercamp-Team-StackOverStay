import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';

import type {RootStackParamList} from '../navigation/types';
import {ImageCarousel} from '../components/ImageCarousel';
import type {HotelDetail, RoomType} from '../types/hotel';

type HotelDetailRouteProp = RouteProp<RootStackParamList, 'HotelDetail'>;

// Mock 数据
const MOCK_DETAIL: HotelDetail = {
  id: '1',
  name: '上海和平饭店',
  nameEn: 'Fairmont Peace Hotel',
  address: '上海市黄浦区南京东路20号',
  starLevel: 5,
  facilities: ['免费WiFi', '游泳池', '健身房', '停车场', '餐厅', '会议室'],
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
    },
    {
      id: 'r2',
      name: '费尔蒙双床房',
      bedType: '双床1.2米',
      price: 2088,
      area: '45㎡',
      breakfast: '含双早',
    },
    {
      id: 'r3',
      name: '九国套房',
      bedType: '特大床',
      price: 5888,
      area: '178㎡',
      breakfast: '行政礼遇',
    },
  ],
};

function HotelDetailScreen(): React.JSX.Element {
  const route = useRoute<HotelDetailRouteProp>();
  const {hotelId} = route.params;

  // 模拟根据 hotelId 获取数据（实际应调用 API）
  // 根据 hotelId 从列表页 Mock 数据中查找对应酒店（简单模拟），找不到则回退到 MOCK_DETAIL
  // 注意：实际项目中应调用 getHotelDetail(hotelId) 接口
  const mockFromList = [
    {
      id: '1',
      name: '上海和平饭店',
      nameEn: 'Fairmont Peace Hotel',
      address: '黄浦区南京东路20号',
      starLevel: 5,
      price: 1888,
      score: 4.8,
      comment: '“位置绝佳，服务一流”',
      roomTypes: [
        { id: 'r1', name: '费尔蒙大床房', bedType: '大床2米', price: 1888, area: '45㎡', breakfast: '含双早' },
        { id: 'r2', name: '费尔蒙双床房', bedType: '双床1.2米', price: 2088, area: '45㎡', breakfast: '含双早' },
        { id: 'r3', name: '九国套房', bedType: '特大床', price: 5888, area: '178㎡', breakfast: '行政礼遇' },
      ],
    },
    {
      id: '2',
      name: '上海宝格丽酒店',
      nameEn: 'Bulgari Hotel Shanghai',
      address: '静安区河南北路33号',
      starLevel: 5,
      price: 4888,
      score: 4.9,
      comment: '“奢华体验，外滩景观”',
      roomTypes: [
        { id: 'r1', name: '高级城市景观房', bedType: '大床2米', price: 4888, area: '60㎡', breakfast: '含双早' },
        { id: 'r2', name: '精选外滩景观房', bedType: '特大床', price: 6888, area: '60㎡', breakfast: '含双早' },
        { id: 'r3', name: '宝格丽套房', bedType: '特大床', price: 12888, area: '100㎡', breakfast: '行政礼遇' },
      ],
    },
    {
      id: '3',
      name: '全季酒店(上海南京东路步行街店)',
      nameEn: 'Ji Hotel (Shanghai Nanjing East Road)',
      address: '黄浦区九江路',
      starLevel: 3,
      price: 459,
      score: 4.6,
      comment: '“性价比高，出行方便”',
      roomTypes: [
        { id: 'r1', name: '标准大床房', bedType: '大床1.8米', price: 459, area: '20㎡', breakfast: '无早' },
        { id: 'r2', name: '高级大床房', bedType: '大床1.8米', price: 529, area: '25㎡', breakfast: '含双早' },
      ],
    },
    {
      id: '4',
      name: '亚朵酒店(外滩店)',
      nameEn: 'Atour Hotel (The Bund)',
      address: '黄浦区延安东路',
      starLevel: 4,
      price: 689,
      score: 4.7,
      comment: '“人文气息，服务贴心”',
      roomTypes: [
        { id: 'r1', name: '行政大床房', bedType: '大床1.8米', price: 689, area: '30㎡', breakfast: '含双早' },
        { id: 'r2', name: '几木双床房', bedType: '双床1.2米', price: 759, area: '35㎡', breakfast: '含双早' },
      ],
    },
  ].find(h => h.id === hotelId);

  const detail = {
    ...MOCK_DETAIL,
    ...mockFromList, // 覆盖基础信息
    name: mockFromList ? mockFromList.name : MOCK_DETAIL.name,
    // 如果 mockFromList 里有 score/comment，就用 mockFromList 的，否则用 MOCK_DETAIL 的默认值
    score: mockFromList?.score || 4.8,
    comment: mockFromList?.comment || '“位置绝佳，服务一流”',
  };

  const renderRoomItem = (room: RoomType) => (
    <View key={room.id} style={styles.roomCard}>
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={styles.roomDesc}>
          {room.area} | {room.bedType} | {room.breakfast}
        </Text>
      </View>
      <View style={styles.roomPriceBlock}>
        <View style={styles.priceRow}>
          <Text style={styles.currency}>¥</Text>
          <Text style={styles.price}>{room.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => Alert.alert('预订', `预订 ${room.name}`)}>
          <Text style={styles.bookText}>预订</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* 顶部大图轮播 */}
        <ImageCarousel images={detail.images} />

        {/* 基础信息区 */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{detail.name}</Text>
          <Text style={styles.enName}>{detail.nameEn}</Text>

          <View style={styles.scoreRow}>
            <View style={styles.scoreTag}>
              <Text style={styles.scoreText}>{detail.score || 4.8}分</Text>
            </View>
            <Text style={styles.commentText}>{detail.comment || '“位置绝佳，服务一流”'}</Text>
          </View>

          <Text style={styles.address}>{detail.address}</Text>

          {/* 设施标签 */}
          <View style={styles.facilityRow}>
            {detail.facilities.map((fac, index) => (
              <Text key={index} style={styles.facilityTag}>
                {fac}
              </Text>
            ))}
          </View>
        </View>

        {/* 房型列表区 */}
        <View style={styles.roomSection}>
          <Text style={styles.sectionTitle}>房型预订</Text>
          {detail.roomTypes.map(renderRoomItem)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingBottom: 40,
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  enName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTag: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  scoreText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  commentText: {
    color: '#0066CC',
    fontSize: 14,
  },
  address: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  facilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityTag: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f7fa',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 2,
  },
  roomSection: {
    backgroundColor: '#fff',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  roomCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  roomInfo: {
    flex: 1,
    paddingRight: 12,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  roomDesc: {
    fontSize: 13,
    color: '#999',
  },
  roomPriceBlock: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currency: {
    fontSize: 12,
    color: '#FF4400',
    marginRight: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF4400',
  },
  bookButton: {
    backgroundColor: '#FF4400',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  bookText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HotelDetailScreen;
