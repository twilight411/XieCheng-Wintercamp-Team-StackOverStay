import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';

interface FilterLocationProps {
  initialSelection?: {type: string; value: string} | null;
  onApply: (location: {type: string; value: string} | null) => void;
}

// Mock data
const TABS = ['商业区', '机场车站', '地铁线路', '行政区', '景点'];
const LOCATIONS: Record<string, string[]> = {
  '商业区': ['人民广场/南京路', '外滩', '静安寺/南京西路', '陆家嘴', '徐家汇', '迪士尼度假区', '虹桥枢纽'],
  '机场车站': ['虹桥机场', '浦东机场', '虹桥火车站', '上海火车站', '上海南站'],
  '地铁线路': ['1号线', '2号线', '3号线', '4号线', '10号线', '17号线'],
  '行政区': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '浦东新区'],
  '景点': ['东方明珠', '外滩', '迪士尼乐园', '豫园', '新天地', '田子坊'],
};

export const FilterLocation: React.FC<FilterLocationProps> = ({
  initialSelection,
  onApply,
}) => {
  const [activeTab, setActiveTab] = useState(initialSelection?.type || '商业区');
  const [selectedItem, setSelectedItem] = useState<string | null>(
    initialSelection?.value || null,
  );

  const handleSelect = (item: string) => {
    // 如果点击已选中的，则取消选中
    if (selectedItem === item) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handleReset = () => {
    setSelectedItem(null);
    setActiveTab('商业区');
  };

  const handleApply = () => {
    if (selectedItem) {
      onApply({type: activeTab, value: selectedItem});
    } else {
      onApply(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 左侧 Tab */}
        <View style={styles.leftPanel}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 右侧列表 */}
        <View style={styles.rightPanel}>
          <ScrollView>
            {(LOCATIONS[activeTab] || []).map(item => (
              <TouchableOpacity
                key={item}
                style={styles.locationItem}
                onPress={() => handleSelect(item)}>
                <Text
                  style={[
                    styles.locationText,
                    selectedItem === item && styles.selectedLocationText,
                  ]}>
                  {item}
                </Text>
                {selectedItem === item && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

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
    height: 400,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: 100,
    backgroundColor: '#f5f7fa',
  },
  tabItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f5f7fa',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#0066CC',
    fontWeight: '600',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#fff',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
  },
  selectedLocationText: {
    color: '#0066CC',
    fontWeight: '500',
  },
  checkIcon: {
    color: '#0066CC',
    fontSize: 16,
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
