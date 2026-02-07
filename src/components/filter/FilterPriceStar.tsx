import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
  
  interface FilterPriceStarProps {
    initialSelection?: {stars: string[]; price: string | null} | null;
    onApply: (filters: {stars: string[]; price: string | null} | null) => void;
    onReset: () => void;
  }
  
  const STAR_OPTIONS = [
    {label: '经济型(2星)', value: '2'},
    {label: '舒适型(3星)', value: '3'},
    {label: '高档(4星)', value: '4'},
    {label: '豪华(5星)', value: '5'},
  ];
  
  const PRICE_OPTIONS = [
    {label: '0-300元', value: '0-300'},
    {label: '300-600元', value: '300-600'},
    {label: '600-1000元', value: '600-1000'},
    {label: '1000元以上', value: '1000-9999'},
  ];
  
  export const FilterPriceStar: React.FC<FilterPriceStarProps> = ({
  initialSelection,
  onApply,
  onReset,
}) => {
  const [selectedStars, setSelectedStars] = useState<string[]>(
    initialSelection?.stars || [],
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(
    initialSelection?.price || null,
  );

  const toggleStar = (value: string) => {
    if (selectedStars.includes(value)) {
      setSelectedStars(selectedStars.filter(s => s !== value));
    } else {
      setSelectedStars([...selectedStars, value]);
    }
  };

  const handleReset = () => {
    setSelectedStars([]);
    setSelectedPrice(null);
    onReset();
  };

  const handleApply = () => {
    // 只有当有选择时才传递对象，否则传递 null 或空对象取决于业务逻辑
    // 这里保持传递对象，方便上层判断
    const hasSelection = selectedStars.length > 0 || selectedPrice !== null;
    onApply(hasSelection ? {
      stars: selectedStars,
      price: selectedPrice,
    } : null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 价格区间 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>价格区间</Text>
          <View style={styles.grid}>
            {PRICE_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.gridItem,
                  selectedPrice === option.value && styles.selectedItem,
                ]}
                onPress={() => setSelectedPrice(option.value)}>
                <Text
                  style={[
                    styles.itemText,
                    selectedPrice === option.value && styles.selectedText,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 星级 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>星级（可多选）</Text>
          <View style={styles.grid}>
            {STAR_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.gridItem,
                  selectedStars.includes(option.value) && styles.selectedItem,
                ]}
                onPress={() => toggleStar(option.value)}>
                <Text
                  style={[
                    styles.itemText,
                    selectedStars.includes(option.value) && styles.selectedText,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>重置</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyText}>确认</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 500,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '31%', // 3列
    backgroundColor: '#f5f7fa',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: '#e6f3ff',
    borderWidth: 1,
    borderColor: '#0066CC',
  },
  itemText: {
    fontSize: 12,
    color: '#333',
  },
  selectedText: {
    color: '#0066CC',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  resetText: {
    fontSize: 16,
    color: '#666',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#0066CC',
  },
  applyText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
