import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function HomeScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>首页（酒店查询页）</Text>
      <Text style={styles.subtitle}>后续在这里实现 Banner / 搜索 / 日历 / 筛选 / 标签</Text>
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
  },
});

export default HomeScreen;

