import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {House, User} from 'phosphor-react-native';

import type {RootStackParamList, RootTabParamList} from './types';
import HomeScreen from '../screens/HomeScreen';
import MyScreen from '../screens/MyScreen';
import HotelListScreen from '../screens/HotelListScreen';
import HotelDetailScreen from '../screens/HotelDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function Tabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        lazy: true,
        tabBarIcon: ({focused, color, size}) => {
          const weight = focused ? 'fill' : 'regular';
          return route.name === 'Home' ? (
            <House size={size} color={color} weight={weight} />
          ) : (
            <User size={size} color={color} weight={weight} />
          );
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#999',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{title: '首页'}} />
      <Tab.Screen name="My" component={MyScreen} options={{title: '我的'}} />
    </Tab.Navigator>
  );
}

function RootNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HotelList"
          component={HotelListScreen}
          options={{title: '酒店列表'}}
        />
        <Stack.Screen
          name="HotelDetail"
          component={HotelDetailScreen}
          options={{title: '酒店详情'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;

