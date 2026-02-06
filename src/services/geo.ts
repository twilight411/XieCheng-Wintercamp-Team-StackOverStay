import {DEFAULT_CITY} from '../constants';

export interface CityInfo {
  city: string;
}

/**
 * 获取当前城市（占位实现）
 *
 * TODO: 后续接入真实定位能力：
 * - 使用 react-native 提供的 Geolocation 或三方定位库获取经纬度
 * - 调用后端/第三方逆地理接口换算出城市名/code
 */
export async function getCurrentCity(): Promise<CityInfo> {
  // 目前直接返回默认城市，保证功能可用
  return {city: DEFAULT_CITY};
}

