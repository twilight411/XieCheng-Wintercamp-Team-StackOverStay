import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';

import type {RootStackParamList} from '../navigation/types';

type HotelDetailRouteProp = RouteProp<RootStackParamList, 'HotelDetail'>;

function HotelDetailScreen(): React.JSX.Element {
  const route = useRoute<HotelDetailRouteProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>酒店详情页</Text>
      <Text style={styles.subtitle}>
        占位页面，后续在这里实现大图轮播、基础信息和房型价格列表。
      </Text>
      <Text style={styles.info}>hotelId: {route.params.hotelId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: '#333',
  },
});

export default HotelDetailScreen;

