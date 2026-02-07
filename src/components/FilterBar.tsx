import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface Props {
  // 后续可通过 props 传入当前选中状态
}

export const FilterBar: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      {/* 第一层：常用排序/筛选 */}
      <View style={styles.mainFilters}>
        <TouchableOpacity style={styles.filterItem} activeOpacity={0.7}>
          <Text style={[styles.filterText, styles.activeText]}>位置/距离</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterItem} activeOpacity={0.7}>
          <Text style={styles.filterText}>价格/等级</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterItem} activeOpacity={0.7}>
          <Text style={styles.filterText}>居数/床数</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterItem} activeOpacity={0.7}>
          <Text style={styles.filterText}>筛选/排序</Text>
        </TouchableOpacity>
      </View>

      {/* 第二层：快捷标签（可横向滚动） */}
      <View style={styles.quickFilters}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {['含早餐', '免费取消', '即时确认', '高评分', '地铁周边'].map((label, index) => (
            <TouchableOpacity key={index} style={styles.tagItem} activeOpacity={0.8}>
              <Text style={styles.tagText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainFilters: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  filterItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  filterText: {
    fontSize: 13,
    color: '#333',
  },
  activeText: {
    color: '#0066CC',
    fontWeight: '500',
  },
  quickFilters: {
    height: 44,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
  tagItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f7fa',
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
});
