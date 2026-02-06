import React, {useState} from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface Props {
  images: string[];
}

export const ImageCarousel: React.FC<Props> = ({images}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>暂无图片</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {images.map((img, index) => (
          <Image
            key={index}
            source={{uri: img}}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* 页码指示器 */}
      <View style={styles.pagination}>
        <Text style={styles.paginationText}>
          {activeIndex + 1} / {images.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 250,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  image: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paginationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
