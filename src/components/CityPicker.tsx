import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';

interface CityPickerProps {
  visible: boolean;
  currentCity: string;
  onClose: () => void;
  onSelect: (city: string) => void;
}

const CITIES = [
  '上海',
  '北京',
  '广州',
  '深圳',
  '杭州',
  '成都',
  '武汉',
  '南京',
  '三亚',
  '西安',
  '重庆',
  '长沙',
  '苏州',
  '天津',
  '青岛',
];

export function CityPicker({
  visible,
  currentCity,
  onClose,
  onSelect,
}: CityPickerProps): React.JSX.Element {
  const renderItem = ({item}: {item: string}) => {
    const isSelected = item === currentCity;
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => {
          onSelect(item);
          onClose();
        }}>
        <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
          {item}
        </Text>
        {isSelected && <Text style={styles.checkIcon}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>选择城市</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={CITIES}
          renderItem={renderItem}
          keyExtractor={item => item}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    color: '#999',
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  selectedItem: {
    backgroundColor: '#f6faff',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItemText: {
    color: '#0086F6',
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 16,
    color: '#0086F6',
  },
});
