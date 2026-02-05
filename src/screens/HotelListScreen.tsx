import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function HotelListScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>酒店列表页</Text>
      <Text style={styles.subtitle}>后续在这里实现城市/日期筛选、详细筛选和酒店列表</Text>
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

export default HotelListScreen;

