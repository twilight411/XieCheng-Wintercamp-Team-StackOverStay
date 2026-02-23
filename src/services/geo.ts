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

const REVERSE_GEO_TIMEOUT_MS = 10000;

function trimPlaceName(s: string): string {
  return s.replace(/市|地区|自治州|县|縣|区$/g, '').trim();
}

/**
 * 逆地理（优先）：BigDataCloud 免费接口，国内返回 locality（如汝城县）/city（如郴州市），无需 key
 */
async function reverseGeocodeBigDataCloud(lat: number, lon: number): Promise<string> {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REVERSE_GEO_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('逆地理请求失败');
    const data = (await res.json()) as {
      locality?: string;
      city?: string;
      principalSubdivision?: string;
    };
    const raw = data.locality ?? data.city ?? data.principalSubdivision;
    const name = raw ? trimPlaceName(String(raw)) : '';
    return name || '';
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

/**
 * 逆地理（备用）：OpenStreetMap Nominatim
 */
async function reverseGeocodeNominatim(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REVERSE_GEO_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'zh-CN',
        'User-Agent': 'XieChengHotel/1.0',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('逆地理请求失败');
    const data = (await res.json()) as { address?: Record<string, string> };
    const addr = data?.address;
    if (!addr) return '';
    const raw =
      addr.village ??
      addr.suburb ??
      addr.town ??
      addr.city ??
      addr.municipality ??
      addr.county ??
      addr.state;
    const name = raw ? trimPlaceName(String(raw)) : '';
    return name || '';
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const name = await reverseGeocodeBigDataCloud(lat, lon);
    if (name) return name;
  } catch {
    // 忽略，尝试备用
  }
  try {
    const name = await reverseGeocodeNominatim(lat, lon);
    if (name) return name;
  } catch {
    // 忽略
  }
  throw new Error('逆地理解析失败');
}

const GEOLOCATION_TIMEOUT_MS = 12000;

/**
 * 获取当前城市：先申请定位权限 → 取经纬度 → 逆地理得到城市名
 * 整体超时，避免 getCurrentPosition 不回调时界面一直“定位中”
 */
export async function getCurrentCity(): Promise<CityInfo> {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return {city: DEFAULT_CITY};

  const options = {enableHighAccuracy: true, timeout: 12000, maximumAge: 30000};

  const tryGetPosition = (): Promise<CityInfo> =>
    new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('定位超时')), GEOLOCATION_TIMEOUT_MS);
      const clear = () => clearTimeout(timeoutId);

      Geolocation.getCurrentPosition(
        async position => {
          clear();
          const {latitude, longitude} = position.coords;
          try {
            const city = await reverseGeocode(latitude, longitude);
            resolve({city});
          } catch {
            reject(new Error('逆地理解析失败，请手动选择城市'));
          }
        },
        err => {
          clear();
          reject(err);
        },
        options,
      );
    });

  try {
    return await tryGetPosition();
  } catch (firstErr) {
    try {
      return await tryGetPosition();
    } catch {
      throw firstErr;
    }
  }
}
