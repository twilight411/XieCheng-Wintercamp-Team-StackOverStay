import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface FilterSortProps {
  onApply: (sort: string) => void;
  currentSort?: string;
}

const SORT_OPTIONS = [
  {label: '欢迎度排序 (默认)', value: 'default'},
  {label: '低价优先', value: 'price_asc'},
  {label: '高价优先', value: 'price_desc'},
  {label: '好评优先', value: 'score_desc'},
  {label: '距离优先', value: 'distance_asc'},
];

export const FilterSort: React.FC<FilterSortProps> = ({
  onApply,
  currentSort = 'default',
}) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        {SORT_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.value}
            style={styles.item}
            onPress={() => onApply(option.value)}>
            <Text
              style={[
                styles.itemText,
                currentSort === option.value && styles.selectedText,
              ]}>
              {option.label}
            </Text>
            {currentSort === option.value && (
              <Text style={styles.checkIcon}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    maxHeight: 400,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: '#0066CC',
    fontWeight: '500',
  },
  checkIcon: {
    color: '#0066CC',
    fontSize: 16,
  },
});
