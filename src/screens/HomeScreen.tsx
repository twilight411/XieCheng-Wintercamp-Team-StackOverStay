import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
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
import DatePickerModal from '../components/DatePickerModal';
import {CityPicker} from '../components/CityPicker';
import {FolderTabs} from '../components/FolderTabs';
import {QUICK_TAGS, type QuickTagItem} from '../constants/tags';
import {getImageUrl} from '../constants';
import {Theme} from '../constants/theme';
import {MapPin} from 'phosphor-react-native';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const STAR_LEVEL_OPTIONS = [
  {label: '不限', value: undefined as number | undefined},
  {label: '经济型(2星)', value: 2},
  {label: '舒适型(3星)', value: 3},
  {label: '高档(4星)', value: 4},
  {label: '豪华(5星)', value: 5},
];

const PRICE_RANGE_OPTIONS = [
  {label: '不限', priceMin: undefined as number | undefined, priceMax: undefined as number | undefined},
  {label: '0-300元', priceMin: 0, priceMax: 300},
  {label: '300-600元', priceMin: 300, priceMax: 600},
  {label: '600-1000元', priceMin: 600, priceMax: 1000},
  {label: '1000元以上', priceMin: 1000, priceMax: undefined},
];

const BANNER_PLACEHOLDER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1080&q=80';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

function formatDateDisplay(dateStr: string | undefined): string {
  if (!dateStr) return '选择日期';
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNav>();

  const city = useSearchStore((s: SearchState) => s.city);
  const setCity = useSearchStore((s: SearchState) => s.setCity);
  const keyword = useSearchStore((s: SearchState) => s.keyword ?? '');
  const setKeyword = useSearchStore((s: SearchState) => s.setKeyword);
  const checkIn = useSearchStore((s: SearchState) => s.checkIn);
  const setCheckIn = useSearchStore((s: SearchState) => s.setCheckIn);
  const checkOut = useSearchStore((s: SearchState) => s.checkOut);
  const setCheckOut = useSearchStore((s: SearchState) => s.setCheckOut);
  const starLevel = useSearchStore((s: SearchState) => s.starLevel);
  const setStarLevel = useSearchStore((s: SearchState) => s.setStarLevel);
  const priceMin = useSearchStore((s: SearchState) => s.priceMin);
  const priceMax = useSearchStore((s: SearchState) => s.priceMax);
  const setPriceRange = useSearchStore((s: SearchState) => s.setPriceRange);

  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [bannerLoading, setBannerLoading] = useState<boolean>(false);
  const [dateModalVisible, setDateModalVisible] = useState<boolean>(false);
  const [cityPickerVisible, setCityPickerVisible] = useState<boolean>(false);
  const [activeFolderTab, setActiveFolderTab] = useState(0);
  const [locating, setLocating] = useState(false);
  const [locationSuccessBanner, setLocationSuccessBanner] = useState<string | null>(null);
  const hasTriedLocation = React.useRef(false);

  const todayStr = new Date().toISOString().slice(0, 10);

  const showLocationSuccess = (cityName: string) => {
    setCity(cityName);
    setLocationSuccessBanner('已定位到 ' + cityName);
    setTimeout(() => setLocationSuccessBanner(null), 3000);
  };

  // 启动时尝试定位一次，更新当前城市（权限允许且定位成功时）
  useEffect(() => {
    if (hasTriedLocation.current) return;
    hasTriedLocation.current = true;
    getCurrentCity()
      .then(info => showLocationSuccess(info.city))
      .catch(() => {});
  }, [setCity]);

  const handleLocate = () => {
    setLocating(true);
    const hardTimeoutMs = 15000;
    const timeoutPromise = new Promise<{city: string}>((_, reject) =>
      setTimeout(() => reject(new Error('定位超时')), hardTimeoutMs),
    );
    Promise.race([getCurrentCity(), timeoutPromise])
      .then((info) => {
        showLocationSuccess(info.city);
      })
      .catch((err: any) => {
        const msg = err?.message || '';
        const isTimeout = msg.includes('超时');
        const isReverseGeo = msg.includes('逆地理');
        let detail = '请检查是否已开启定位权限；模拟器请用真机或设置模拟位置。';
        if (isTimeout || isReverseGeo) {
          detail = '可能是网络不稳定、GPS 信号弱或逆地理服务暂时不可用。若权限已开，可点「重试」再试，或直接点击上方城市手动选择。';
        }
        Alert.alert('定位失败', detail, [
          {text: '知道了'},
          {text: '重试', onPress: () => handleLocate()},
        ]);
      })
      .finally(() => {
        setLocating(false);
      });
  };

  useEffect(() => {
    setBannerLoading(true);
    getBanners()
      .then(data => setBanners(data))
      .catch(() => {})
      .finally(() => setBannerLoading(false));
  }, []);

  const goToDetail = (hotelId: string) => {
    navigation.navigate('HotelDetail', {hotelId});
  };

  const goToList = (opts?: {keyword?: string; starLevel?: number | number[]; priceMin?: number; priceMax?: number}) => {
    const finalKeyword = opts?.keyword ?? keyword ?? '';
    navigation.navigate('HotelList', {
      keyword: finalKeyword || undefined,
      city,
      checkIn,
      starLevel: opts?.starLevel ?? starLevel,
      priceMin: opts?.priceMin ?? priceMin,
      priceMax: opts?.priceMax ?? priceMax,
    });
  };

  const showStarLevelPicker = () => {
    Alert.alert(
      '选择星级',
      undefined,
      STAR_LEVEL_OPTIONS.map(opt => ({
        text: opt.label,
        onPress: () => setStarLevel(opt.value),
      })),
    );
  };

  const showPriceRangePicker = () => {
    Alert.alert(
      '选择价格',
      undefined,
      PRICE_RANGE_OPTIONS.map(opt => ({
        text: opt.label,
        onPress: () => setPriceRange(opt.priceMin, opt.priceMax),
      })),
    );
  };

  const formatStarLevel = (v?: number | number[]) => {
    if (v === undefined || v === null) return '不限';
    if (Array.isArray(v)) return v.join(',') + '星';
    return `${v}星`;
  };

  const formatPriceRange = () => {
    if (priceMin == null && priceMax == null) return '不限';
    if (priceMin != null && priceMax == null) return `${priceMin}元以上`;
    if (priceMin == null && priceMax != null) return `${priceMax}元以下`;
    return `${priceMin}-${priceMax}元`;
  };

  const handleQuickTagPress = (tag: QuickTagItem) => {
    const kw = tag.keyword ?? tag.label;
    setKeyword(kw);
    if (tag.starLevel != null) setStarLevel(tag.starLevel);
    if (tag.priceMin != null || tag.priceMax != null) setPriceRange(tag.priceMin, tag.priceMax);
    goToList({
      keyword: kw,
      starLevel: tag.starLevel ?? starLevel,
      priceMin: tag.priceMin ?? priceMin,
      priceMax: tag.priceMax ?? priceMax,
    });
  };

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* 沉浸式 Banner：大图 + 顶部毛玻璃感按钮区 */}
        <View style={styles.bannerWrap}>
          {bannerLoading ? (
            <View style={[styles.bannerImage, styles.bannerPlaceholder]}>
              <Text style={styles.bannerPlaceholderText}>加载推荐中...</Text>
            </View>
          ) : banners.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.bannerScroll}>
              {banners.map(item => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.95}
                  onPress={() => goToDetail(item.hotelId)}
                  style={styles.bannerSlide}>
                  <Image
                    source={{ uri: getImageUrl(item.imageUrl) || BANNER_PLACEHOLDER }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                  {item.title ? (
                    <View style={styles.bannerTitleWrap}>
                      <Text style={styles.bannerTitle} numberOfLines={1}>{item.title}</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.bannerImage, styles.bannerPlaceholder]}>
              <Text style={styles.bannerPlaceholderText}>推荐酒店</Text>
            </View>
          )}
        </View>

        {/* 主搜索区：白卡 + Folder Tab + 表单 */}
        <View style={styles.card}>
          <FolderTabs activeTab={activeFolderTab} onChange={setActiveFolderTab} />

          <View style={styles.cardBody}>
            {/* 定位成功提示条：定位成功后显示几秒，并已更新上方城市 */}
            {locationSuccessBanner ? (
              <View style={styles.locationBanner}>
                <MapPin size={16} color="#fff" weight="fill" />
                <Text style={styles.locationBannerText}>{locationSuccessBanner}</Text>
              </View>
            ) : null}

            {/* 城市 + 搜索 */}
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.cityTouchable}
                onPress={() => setCityPickerVisible(true)}
                activeOpacity={0.8}>
                <Text style={styles.cityText}>{city}</Text>
                <Text style={styles.cityArrow}>▼</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <View style={styles.searchInline}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="位置/民宿名/编号"
                  placeholderTextColor={Theme.textMuted}
                  value={keyword}
                  onChangeText={setKeyword}
                  returnKeyType="search"
                  onSubmitEditing={() => goToList()}
                />
              </View>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={handleLocate}
                disabled={locating}
                activeOpacity={0.7}>
                <MapPin
                  size={26}
                  color={locating ? Theme.textMuted : Theme.brandPrimary}
                  weight="regular"
                />
                <Text
                  style={[
                    styles.locationButtonLabel,
                    locating && styles.locationButtonLabelDisabled,
                  ]}>
                  {locating ? '定位中…' : '我的附近'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 入住 / 离店 */}
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.8}
              onPress={() => setDateModalVisible(true)}>
              <View style={styles.dateBlock}>
                <Text style={styles.rowHint}>入住</Text>
                <Text style={styles.rowValue}>{formatDateDisplay(checkIn)}</Text>
              </View>
              <View style={styles.dateBlock}>
                <Text style={styles.rowHint}>离店</Text>
                <Text style={styles.rowValue}>{formatDateDisplay(checkOut)}</Text>
              </View>
              <Text style={styles.nightsText}>
                共{nights}晚
              </Text>
            </TouchableOpacity>

            {/* 星级 / 价格 筛选 */}
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.flex1}
                activeOpacity={0.8}
                onPress={showStarLevelPicker}>
                <Text style={styles.rowHint}>星级</Text>
                <Text style={styles.rowValue}>{formatStarLevel(starLevel)}</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.flex1}
                activeOpacity={0.8}
                onPress={showPriceRangePicker}>
                <Text style={styles.rowHint}>价格</Text>
                <Text style={styles.rowValue} numberOfLines={1}>{formatPriceRange()}</Text>
              </TouchableOpacity>
            </View>

            {/* 快捷标签 */}
            <View style={styles.tagsWrap}>
              {QUICK_TAGS.map(tag => (
                <TouchableOpacity
                  key={tag.id}
                  style={styles.tag}
                  onPress={() => handleQuickTagPress(tag)}
                  activeOpacity={0.8}>
                  <Text style={styles.tagText}>{tag.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 查询按钮：品牌主色 + 按压缩放 */}
            <Pressable
              onPress={() => goToList()}
              style={({pressed}) => [
                styles.queryButton,
                pressed && styles.queryButtonPressed,
              ]}>
              <Text style={styles.queryButtonText}>查 询</Text>
            </Pressable>
          </View>
        </View>

        {/* 促销卡片区 */}
        <View style={styles.promoSection}>
          <View style={styles.promoCard}>
            <View style={styles.promoCardLeft}>
              <View style={styles.promoCardTitleRow}>
                <Text style={styles.promoCardTitleRed}>首住好礼</Text>
                <View style={styles.promoBadge}>
                  <Text style={styles.promoBadgeText}>查看详情</Text>
                </View>
              </View>
              <Text style={styles.promoCardDesc}>最高立减¥85，标有首住特惠房型可用</Text>
            </View>
            <View style={styles.promoCardCta}>
              <Text style={styles.promoCardCtaText}>立即领取</Text>
            </View>
          </View>
          <View style={styles.promoGrid}>
            {[
              { title: '口碑榜', desc: '城市精选', color: Theme.accentOrange },
              { title: '特价套餐', desc: '随时退', color: Theme.accentRed },
              { title: '超值低价', desc: '7折起', color: Theme.brandPrimary },
            ].map((item, i) => (
              <View key={i} style={styles.promoGridItem}>
                <Text style={[styles.promoGridTitle, { color: item.color }]}>{item.title}</Text>
                <Text style={styles.promoGridDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <DatePickerModal
        visible={dateModalVisible}
        initialDate={checkIn ?? todayStr}
        onConfirm={date => {
          setCheckIn(date);
          if (!checkOut || checkOut <= date) {
            const next = new Date(date);
            next.setDate(next.getDate() + 1);
            setCheckOut(next.toISOString().slice(0, 10));
          }
          setDateModalVisible(false);
        }}
        onClose={() => setDateModalVisible(false)}
      />
      <CityPicker
        visible={cityPickerVisible}
        currentCity={city}
        onClose={() => setCityPickerVisible(false)}
        onSelect={c => {
          setCity(c);
          setCityPickerVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.bgPage,
  },
  content: {
    paddingBottom: 24,
  },
  bannerWrap: {
    height: 260,
    position: 'relative',
  },
  bannerScroll: {
    flex: 1,
  },
  bannerSlide: {
    width: SCREEN_WIDTH,
    height: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.brandPrimary,
  },
  bannerPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerPlaceholderText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  bannerTitleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bannerTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    marginHorizontal: 16,
    marginTop: -48,
    backgroundColor: Theme.bgCard,
    borderRadius: Theme.radiusXl,
    overflow: 'hidden',
    ...Theme.shadowLg,
  },
  cardBody: {
    padding: 24,
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.brandPrimary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  locationBannerText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  rowHint: {
    fontSize: 12,
    color: Theme.textMuted,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  dateBlock: {
    flex: 1,
  },
  nightsText: {
    fontSize: 14,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  flex1: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Theme.border,
    marginHorizontal: 12,
  },
  searchInline: {
    flex: 1,
    minWidth: 0,
  },
  locationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    minWidth: 56,
  },
  locationButtonLabel: {
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 4,
  },
  locationButtonLabelDisabled: {
    opacity: 0.8,
  },
  searchInput: {
    fontSize: 14,
    color: Theme.textPrimary,
    padding: 0,
  },
  cityTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  cityArrow: {
    fontSize: 10,
    color: Theme.textMuted,
    marginLeft: 4,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 16,
    borderBottomWidth: 0,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Theme.bgPage,
    borderRadius: Theme.radiusMd,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  tagText: {
    fontSize: 12,
    color: Theme.textSecondary,
  },
  queryButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: Theme.brandPrimary,
    borderRadius: Theme.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadowMd,
  },
  queryButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  queryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  promoSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.bgCard,
    borderRadius: Theme.radiusMd,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 114, 182, 0.2)',
    ...Theme.shadowSm,
  },
  promoCardLeft: {
    flex: 1,
  },
  promoCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  promoCardTitleRed: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.accentRed,
  },
  promoBadge: {
    backgroundColor: 'rgba(244, 114, 182, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promoBadgeText: {
    fontSize: 10,
    color: '#DB2777',
  },
  promoCardDesc: {
    fontSize: 12,
    color: Theme.textMuted,
  },
  promoCardCta: {
    backgroundColor: Theme.accentRed,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Theme.radiusMd,
  },
  promoCardCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  promoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  promoGridItem: {
    flex: 1,
    backgroundColor: Theme.bgCard,
    borderRadius: Theme.radiusMd,
    padding: 12,
    alignItems: 'center',
    ...Theme.shadowSm,
  },
  promoGridTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  promoGridDesc: {
    fontSize: 10,
    color: Theme.textMuted,
  },
});

export default HomeScreen;
