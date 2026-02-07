import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface Props {
  activeTab: string | null;
  onTabPress: (tab: string) => void;
  counts?: {
    location?: number;
    priceStar?: number;
    more?: number;
    sort?: number;
  };
}

export const FilterBar: React.FC<Props> = ({activeTab, onTabPress, counts}) => {
  const tabs = [
    {key: 'location', label: '位置/距离'},
    {key: 'priceStar', label: '价格/等级'},
    {key: 'more', label: '筛选/更多'},
    {key: 'sort', label: '排序'},
  ];
  
  return (
    <View style={styles.container}>
      {/* 第一层：常用排序/筛选 */}
      <View style={styles.mainFilters}>
        <TouchableOpacity 
          style={styles.filterItem} 
          activeOpacity={0.7}
          onPress={() => onTabPress('location')}>
          <Text style={[styles.filterText, activeTab === 'location' && styles.activeText]}>位置/距离</Text>
          <Text style={[styles.arrowIcon, activeTab === 'location' && styles.activeText]}>▼</Text>
          {counts?.location ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{counts.location}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterItem} 
          activeOpacity={0.7}
          onPress={() => onTabPress('priceStar')}>
          <Text style={[styles.filterText, activeTab === 'priceStar' && styles.activeText]}>价格/等级</Text>
          <Text style={[styles.arrowIcon, activeTab === 'priceStar' && styles.activeText]}>▼</Text>
          {counts?.priceStar ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{counts.priceStar}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterItem} 
          activeOpacity={0.7}
          onPress={() => onTabPress('more')}>
          <Text style={[styles.filterText, activeTab === 'more' && styles.activeText]}>筛选/更多</Text>
          <Text style={[styles.arrowIcon, activeTab === 'more' && styles.activeText]}>▼</Text>
          {counts?.more ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{counts.more}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterItem} 
          activeOpacity={0.7}
          onPress={() => onTabPress('sort')}>
          <Text style={[styles.filterText, activeTab === 'sort' && styles.activeText]}>排序</Text>
          <Text style={[styles.arrowIcon, activeTab === 'sort' && styles.activeText]}>▼</Text>
        </TouchableOpacity>
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
  },
  filterItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative', // For badge positioning
  },
  filterText: {
    fontSize: 13,
    color: '#333',
    marginRight: 4,
  },
  arrowIcon: {
    fontSize: 10,
    color: '#666',
  },
  activeText: {
    color: '#0066CC',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 12,
    backgroundColor: '#0066CC',
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
