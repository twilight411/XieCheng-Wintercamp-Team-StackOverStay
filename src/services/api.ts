import axios from 'axios';

import { API_BASE_URL } from '../constants';

/**
 * 统一 Axios 实例
 *
 * - baseURL：从全局常量读取，后续在联调阶段指向真实后端
 * - timeout：避免请求长时间无响应
 * - 拦截器：统一处理请求头与响应数据/错误
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器：可统一添加 token、公共 header 等
apiClient.interceptors.request.use(
  config => {
    // 统一 JSON 请求头
    if (!config.headers) {
      config.headers = {};
    }
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    // TODO: 后续如有鉴权，可在此注入 Authorization
    return config;
  },
  error => {
    // 请求还未发出就出错的情况，直接向上抛
    return Promise.reject(error);
  },
);

// 响应拦截器：统一返回 data 字段，并对错误做一次封装
apiClient.interceptors.response.use(
  response => {
    // 约定上层只关心业务数据
    return response.data;
  },
  error => {
    // 这里可以根据 error.response?.status 做更细致的错误处理
    // TODO: 第 3 周可在此接入全局 Toast/Alert，无网提示等
    return Promise.reject(error);
  },
);

export default apiClient;

