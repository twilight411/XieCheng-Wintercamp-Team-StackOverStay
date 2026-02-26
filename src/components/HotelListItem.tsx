import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ScrollView,
} from 'react-native';
import type {HotelListItem as HotelListItemType} from '../types/hotel';
import {getImageUrl} from '../constants';

interface Props {
  item: HotelListItemType;
  onPress?: (id: string) => void;
  style?: ViewStyle;
}

export const HotelListItem: React.FC<Props> = ({item, onPress, style}) => {
  // 简单的星级渲染 helper
  const renderStars = (level: number) => {
    return (
      <View style={styles.starContainer}>
        <Text style={styles.starText}>{level}星级</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={() => onPress?.(item.id)}>
      {/* 左侧图片 */}
      <View style={styles.imageContainer}>
        <Image
          source={{uri: getImageUrl(item.images?.[0]) || 'https://via.placeholder.com/100'}}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* 右侧信息 */}
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.row}>
          {renderStars(item.starLevel)}
          <Text style={styles.score}>
            {item.score != null
              ? `${item.score}分`
              : item.starLevel != null
              ? `${item.starLevel}分`
              : '--'}
          </Text>
        </View>

        <Text style={styles.address} numberOfLines={1}>
          {item.address || '暂无地址信息'}
        </Text>

        <View style={styles.bottomRow}>
          <ScrollView
            style={styles.tagsScroll}
            contentContainerStyle={styles.tagsRow}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {Array.isArray(item.facilities) && item.facilities.length > 0
              ? item.facilities.map((fac, index) => (
                  <View key={`${fac}-${index}`} style={styles.tag}>
                    <Text style={styles.tagText} numberOfLines={1}>{fac}</Text>
                  </View>
                ))
              : null}
          </ScrollView>

          <View style={styles.priceContainer}>
            <Text style={styles.currency}>¥</Text>
            <Text style={styles.price}>{item.minPrice || '--'}</Text>
            <Text style={styles.priceSuffix}>起</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  imageContainer: {
    width: 100,
    height: 120,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starContainer: {

  },
  starText: {
    fontSize: 12,
    color: '#666',
  },
  score: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0066CC',
  },
  address: {
    fontSize: 12,
    color: '#999',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tagsScroll: {
    flex: 1,
    maxWidth: '65%',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
    paddingRight: 8,
  },
  tag: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
  },
  tagText: {
    fontSize: 10,
    color: '#666',
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
    color: '#FF4400',
    fontWeight: '600',
  },
  priceSuffix: {
    fontSize: 12,
    color: '#999',
    marginLeft: 2,
  },
});
