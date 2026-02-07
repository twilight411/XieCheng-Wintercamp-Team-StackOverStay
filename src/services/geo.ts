import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {DEFAULT_CITY} from '../constants';

export interface CityInfo {
  city: string;
}

/**
 * Android：请求定位权限（ACCESS_FINE_LOCATION）
 * iOS：在首次 getCurrentPosition 时会自动弹出系统权限框，需在 Info.plist 配置 NSLocationWhenInUseUsageDescription
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: '定位权限',
        message: '用于获取您当前城市，方便推荐附近酒店',
        buttonNeutral: '稍后',
        buttonNegative: '拒绝',
        buttonPositive: '允许',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

/**
 * 逆地理：经纬度 → 城市名（使用 OpenStreetMap Nominatim，无需 key）
 */
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, {
    headers: {
      'Accept-Language': 'zh-CN',
      'User-Agent': 'XieChengHotel/1.0',
    },
  });
  if (!res.ok) throw new Error('逆地理请求失败');
  const data = (await res.json()) as {
    address?: { city?: string; town?: string; county?: string; state?: string };
  };
  const addr = data?.address;
  const city = addr?.city ?? addr?.town ?? addr?.county ?? addr?.state;
  return city ? String(city).replace(/市|地区|自治州|县|区$/g, '').trim() || DEFAULT_CITY : DEFAULT_CITY;
}

/**
 * 获取当前城市：先申请定位权限 → 取经纬度 → 逆地理得到城市名
 */
export async function getCurrentCity(): Promise<CityInfo> {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return {city: DEFAULT_CITY};

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        try {
          const city = await reverseGeocode(latitude, longitude);
          resolve({city});
        } catch {
          resolve({city: DEFAULT_CITY});
        }
      },
      err => {
        reject(err);
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 60000},
    );
  });
}
