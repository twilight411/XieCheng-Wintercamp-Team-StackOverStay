/**
 * 全局常量配置
 *
 * 真机联调（必改）：
 * - 模拟器：可继续用 http://10.0.2.2:3000/api（Android）或 localhost（iOS）
 * - 真机：必须改成电脑的局域网 IP，例如 http://192.168.1.100:3000/api
 *   1. 电脑和手机连同一 WiFi
 *   2. 电脑上查 IP：cmd 里 ipconfig，看「IPv4 地址」
 *   3. 把下面改成 http://你的IP:3000/api
 * - 后端需监听 0.0.0.0，不能只监听 127.0.0.1
 */
export const API_BASE_URL = 'http://192.168.43.132:3000/api';

/** 后端服务根地址（不含 /api），用于把后端返回的 localhost/相对路径图片转成真机可访问的 URL */
export const SERVER_BASE = API_BASE_URL.replace(/\/api\/?$/, '');

/**
 * 将后端返回的图片地址转为当前设备可访问的 URL（真机时后端常返回 localhost，手机无法访问）
 * 支持：相对路径 /uploads/xx、完整 localhost URL http://localhost:3000/uploads/xx
 */
export function getImageUrl(url: string | undefined): string {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  // 已是可访问的完整 URL（非 localhost）直接返回
  if (trimmed.startsWith('http') && !/localhost|127\.0\.0\.1/.test(trimmed)) {
    return trimmed;
  }
  // 完整 URL 但 host 是 localhost：只取路径部分，拼上 SERVER_BASE
  if (trimmed.startsWith('http')) {
    try {
      const pathname = new URL(trimmed).pathname;
      return `${SERVER_BASE}${pathname}`;
    } catch {
      // URL 解析失败则当相对路径处理
    }
  }
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${SERVER_BASE}${path}`;
}

/**
 * 列表相关默认配置
 */
export const PAGE_SIZE = 10;

/**
 * 默认城市（用于首页与列表初始筛选）
 */
export const DEFAULT_CITY = '上海';
