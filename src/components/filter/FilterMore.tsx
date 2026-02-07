import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface FilterMoreProps {
  initialSelection?: Record<string, string[]> | null;
  onApply: (filters: Record<string, string[]> | null) => void;
  onReset: () => void;
}

const SECTIONS = [
  {
    title: '支付方式',
    key: 'payment',
    options: ['免费取消', '到店付', '在线付', '闪住', '信用住', '即时确认'],
  },
  {
    title: '床型',
    key: 'bed',
    options: ['大床', '双床', '单人床', '多张床'],
  },
  {
    title: '早餐',
    key: 'breakfast',
    options: ['含早餐', '单份早餐', '双份早餐'],
  },
  {
    title: '设施服务',
    key: 'facility',
    options: ['免费停车', '健身房', '游泳池', '洗衣房', '接送机', '会议室', '餐厅', '行李寄存'],
  },
];

export const FilterMore: React.FC<FilterMoreProps> = ({
  initialSelection,
  onApply,
  onReset,
}) => {
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>(
    initialSelection || {},
  );

  const toggleItem = (sectionKey: string, item: string) => {
    const currentSection = selectedItems[sectionKey] || [];
    const newSection = currentSection.includes(item)
      ? currentSection.filter(i => i !== item)
      : [...currentSection, item];

    setSelectedItems({
      ...selectedItems,
      [sectionKey]: newSection,
    });
  };

  const handleReset = () => {
    setSelectedItems({});
    onReset();
  };

  const handleApply = () => {
    const hasSelection = Object.values(selectedItems).some(
      arr => arr.length > 0,
    );
    onApply(hasSelection ? selectedItems : null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {SECTIONS.map(section => (
          <View key={section.key} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.grid}>
              {section.options.map(option => {
                const isSelected = selectedItems[section.key]?.includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.gridItem, isSelected && styles.selectedItem]}
                    onPress={() => toggleItem(section.key, option)}>
                    <Text
                      style={[styles.itemText, isSelected && styles.selectedText]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

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
    width: '23%', // 4列
    backgroundColor: '#f5f7fa',
    paddingVertical: 8,
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
    fontSize: 11,
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
