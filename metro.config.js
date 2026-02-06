const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // 排除 android/.gradle 等构建目录，避免 Metro 监视时因目录不存在报 ENOENT
    blockList: [
      /android\/\.gradle\/.*/,
      /android\/app\/build\/.*/,
      /android\/app\/\.cxx\/.*/,
    ],
    // 强制 axios 使用浏览器版本，避免解析 Node.js 的 crypto 等内置模块
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'axios') {
        return {
          type: 'sourceFile',
          filePath: path.resolve(
            __dirname,
            'node_modules/axios/dist/browser/axios.cjs',
          ),
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
