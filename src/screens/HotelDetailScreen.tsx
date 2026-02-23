import React, {useEffect, useState, useMemo} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {RootStackParamList} from '../navigation/types';
import {ImageCarousel} from '../components/ImageCarousel';
import type {HotelDetail, RoomType} from '../types/hotel';
import {getImageUrl} from '../constants';
import {getHotelDetail} from '../services/hotel';

import {
  CaretRight,
  CaretLeft,
  MapPin,
  ShareNetwork,
  Heart,
  WifiHigh,
  SwimmingPool,
  Barbell,
  Car,
  ForkKnife,
  ProjectorScreenChart,
  Sparkle,
  Martini,
  Check,
  Airplane,
  User,
  Suitcase,
  Lock,
  Alarm,
} from 'phosphor-react-native';

type HotelDetailRouteProp = RouteProp<RootStackParamList, 'HotelDetail'>;

const getFacilityIcon = (name: string, size = 14, color = '#666') => {
  const props = {size, color, weight: 'fill' as const};
  switch (name) {
    case '免费WiFi':
      return <WifiHigh {...props} />;
    case '游泳池':
      return <SwimmingPool {...props} />;
    case '健身房':
      return <Barbell {...props} />;
    case '停车场':
      return <Car {...props} />;
    case '餐厅':
      return <ForkKnife {...props} />;
    case '会议室':
      return <ProjectorScreenChart {...props} />;
    case 'SPA':
      return <Sparkle {...props} />;
    case '酒吧':
      return <Martini {...props} />;
    case '接送机':
      return <Airplane {...props} />;
    case '管家服务':
      return <User {...props} />;
    case '行李寄存':
      return <Suitcase {...props} />;
    case '前台保险柜':
      return <Lock {...props} />;
    case '叫醒服务':
      return <Alarm {...props} />;
    default:
      return <Check {...props} />;
  }
};

function HotelDetailScreen(): React.JSX.Element {
  const route = useRoute<HotelDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {hotelId, checkIn, checkOut} = route.params;

  const [detail, setDetail] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 初始化加载数据
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getHotelDetail(hotelId);
        setDetail(data);
      } catch (error) {
        console.error('Failed to fetch hotel detail:', error);
        Alert.alert('错误', '加载酒店详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [hotelId]);

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
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    if (today.getTime() === target.getTime()) {
      return '今天';
    }
    return days[date.getDay()];
  };

  const duration = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = e.getTime() - s.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  }, [startDate, endDate]);

  const renderRoomItem = (room: RoomType) => (
    <View key={room.id} style={styles.roomCard}>
      <View style={styles.roomContent}>
        <Image
          source={{uri: getImageUrl((room as any).image || detail?.images?.[0])}}
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

  if (loading || !detail) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>正在加载酒店详情...</Text>
        
        {/* 允许用户在加载失败或卡住时返回 */}
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
          {detail.nameEn ? (
            <Text style={styles.enName}>{detail.nameEn}</Text>
          ) : null}

          <View style={styles.scoreRow}>
            <View style={styles.scoreTag}>
              <Text style={styles.scoreText}>{detail.score}分</Text>
            </View>
            <Text style={styles.commentText}>{detail.comment}</Text>
            <TouchableOpacity
              style={styles.detailLink}
              onPress={() => Alert.alert('点评', '查看所有点评')}>
              <Text style={styles.detailLinkText}>
                {detail.commentCount ? `${detail.commentCount}条点评` : '暂无点评'}
              </Text>
              <CaretRight size={12} color="#0066CC" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.addressRow}
            onPress={() => Alert.alert('地图', '跳转地图页')}>
            <MapPin size={16} color="#333" weight="fill" />
            <Text style={styles.address} numberOfLines={1}>
              {detail.address}
            </Text>
            <Text style={styles.mapLink}>地图</Text>
            <CaretRight size={12} color="#666" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* 设施概览 */}
          <View style={styles.facilityRow}>
            <View style={styles.facilityList}>
              {detail.facilities.map((fac, index) => (
                <View key={index} style={styles.facilityItem}>
                  {getFacilityIcon(fac, 16, '#666')}
                  <Text style={styles.facilityText}>{fac}</Text>
                </View>
              ))}
            </View>
          </View>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
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
  facilityItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
    marginBottom: 8,
    gap: 4,
  },
  facilityText: {
    fontSize: 10,
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
