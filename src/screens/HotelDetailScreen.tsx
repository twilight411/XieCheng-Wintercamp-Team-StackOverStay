import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {RootStackParamList} from '../navigation/types';
import {ImageCarousel} from '../components/ImageCarousel';
import type {HotelDetail, RoomType} from '../types/hotel';

import {
  CaretRight,
  CaretLeft,
  MapPin,
  ShareNetwork,
  Heart,
  CalendarBlank,
} from 'phosphor-react-native';

type HotelDetailRouteProp = RouteProp<RootStackParamList, 'HotelDetail'>;

// Mock 数据
const MOCK_DETAIL: HotelDetail = {
  id: '1',
  name: '上海和平饭店',
  nameEn: 'Fairmont Peace Hotel',
  address: '上海市黄浦区南京东路20号',
  starLevel: 5,
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

function HotelDetailScreen(): React.JSX.Element {
  const route = useRoute<HotelDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {hotelId, checkIn, checkOut} = route.params;

  // 日期处理
  const startDate = checkIn || '2025-02-06';
  const endDate = checkOut || '2025-02-07';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month < 10 ? '0' : ''}${month}月${day < 10 ? '0' : ''}${day}日`;
  };

  const getWeekDay = (dateStr: string) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(dateStr);
    target.setHours(0,0,0,0);
    
    if (today.getTime() === target.getTime()) {
        return '今天';
    }
    return days[date.getDay()];
  };

  const duration = React.useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = e.getTime() - s.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  }, [startDate, endDate]);

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
      <View style={styles.roomContent}>
        <Image 
          source={{uri: (room as any).image || detail.images[0]}} 
          style={styles.roomImage} 
        />
        <View style={styles.roomInfo}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.roomDesc}>
            {room.area} | {room.bedType}
          </Text>
          <View style={styles.tagRow}>
            <Text style={styles.roomTag}>{room.breakfast}</Text>
            <Text style={styles.roomTag}>立即确认</Text>
          </View>
          <View style={styles.roomPriceRow}>
            <View style={styles.priceContainer}>
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
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* 顶部大图轮播 */}
        <View style={styles.headerImageContainer}>
          <ImageCarousel images={detail.images} />
          <View style={styles.headerTools}>
            <TouchableOpacity style={styles.toolButton}>
              <ShareNetwork color="#fff" size={20} weight="bold" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolButton}>
              <Heart color="#fff" size={20} weight="bold" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 基础信息区 */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{detail.name}</Text>
          <Text style={styles.enName}>{detail.nameEn}</Text>

          <View style={styles.scoreRow}>
            <View style={styles.scoreTag}>
              <Text style={styles.scoreText}>{detail.score || 4.8}分</Text>
            </View>
            <Text style={styles.commentText}>“{detail.comment || '位置绝佳，服务一流'}”</Text>
            <TouchableOpacity style={styles.detailLink} onPress={() => Alert.alert('点评', '查看所有点评')}>
              <Text style={styles.detailLinkText}>2388条点评</Text>
              <CaretRight size={12} color="#0066CC" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.addressRow}
            onPress={() => Alert.alert('地图', '跳转地图页')}>
            <MapPin size={16} color="#333" weight="fill" />
            <Text style={styles.address} numberOfLines={1}>{detail.address}</Text>
            <Text style={styles.mapLink}>地图</Text>
            <CaretRight size={12} color="#666" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* 设施概览 */}
          <TouchableOpacity 
            style={styles.facilityRow}
            onPress={() => Alert.alert('设施', '查看所有设施')}>
            <View style={styles.facilityList}>
              {detail.facilities.slice(0, 4).map((fac, index) => (
                <Text key={index} style={styles.facilityTagSimple}>
                  {fac}
                </Text>
              ))}
              <Text style={styles.facilityMore}>+{detail.facilities.length - 4}</Text>
            </View>
            <View style={styles.facilityLink}>
              <Text style={styles.facilityLinkText}>设施详情</Text>
              <CaretRight size={12} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 日期选择条 */}
        <View style={styles.dateBar}>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>入住</Text>
            <Text style={styles.dateValue}>{formatDate(startDate)}</Text>
            <Text style={styles.weekText}>{getWeekDay(startDate)}</Text>
          </View>
          <View style={styles.stayDuration}>
            <Text style={styles.durationText}>{duration}晚</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>离店</Text>
            <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
            <Text style={styles.weekText}>{getWeekDay(endDate)}</Text>
          </View>
          <View style={styles.guestInfo}>
            <Text style={styles.guestText}>1间, 2成人</Text>
            <CaretRight size={12} color="#666" />
          </View>
        </View>

        {/* 房型列表区 */}
        <View style={styles.roomSection}>
          {detail.roomTypes.map(renderRoomItem)}
        </View>
      </ScrollView>

      {/* 返回按钮 */}
      <TouchableOpacity
        style={[styles.backButton, {top: insets.top + 10}]}
        onPress={() => navigation.goBack()}>
        <View style={styles.backButtonBg}>
          <CaretLeft color="#fff" size={20} weight="bold" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 100,
  },
  backButtonBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: 40,
  },
  headerImageContainer: {
    position: 'relative',
  },
  headerTools: {
    position: 'absolute',
    top: 50, // 避开返回按钮区域
    right: 16,
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  toolButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  enName: {
    fontSize: 13,
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
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  scoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentText: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLinkText: {
    color: '#0066CC',
    fontSize: 12,
    marginRight: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginHorizontal: 8,
  },
  mapLink: {
    fontSize: 12,
    color: '#666',
    marginRight: 2,
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  facilityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  facilityLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilityLinkText: {
    fontSize: 12,
    color: '#666',
    marginRight: 2,
  },
  facilityTagSimple: {
    fontSize: 12,
    color: '#666',
  },
  facilityMore: {
    fontSize: 12,
    color: '#999',
  },
  dateBar: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInfo: {
    alignItems: 'flex-start',
  },
  dateLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  weekText: {
    fontSize: 11,
    color: '#333',
  },
  stayDuration: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  durationText: {
    fontSize: 10,
    color: '#333',
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
    fontWeight: '500',
  },
  roomSection: {
    paddingHorizontal: 10,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    padding: 12,
  },
  roomContent: {
    flexDirection: 'row',
  },
  roomImage: {
    width: 88,
    height: 88,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  roomInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  roomDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  roomTag: {
    fontSize: 10,
    color: '#0066CC',
    borderColor: '#0066CC',
    borderWidth: 0.5,
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  roomPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 12,
    color: '#FF4400',
    fontWeight: '600',
    marginRight: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF4400',
  },
  bookButton: {
    backgroundColor: '#FF4400',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  bookText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default HotelDetailScreen;
