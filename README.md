这是一个基于 [**React Native**](https://reactnative.dev) 的新项目，使用 [`@react-native-community/cli`](https://github.com/react-native-community/cli) 初始化。

# 后端与真机联调

- **后端**：在后端项目目录执行 `docker-compose up`，启动时会自动迁移并填充数据。
- **API 地址**：在 `src/constants/index.ts` 中配置 `API_BASE_URL`。
- **真机调试（解决 Network Error / 图片不显示）**：
  1. 电脑和手机连**同一 WiFi**。
  2. 查电脑局域网 IP：Windows 在 cmd 运行 `ipconfig`，看「IPv4 地址」（如 `192.168.1.100`）。
  3. 把 `API_BASE_URL` 改成 `http://你的IP:3000/api`（端口与后端一致）。
  4. 后端需监听 `0.0.0.0`，不能只监听 `127.0.0.1`。
  5. 若后端返回的图片地址是 localhost 或相对路径，前端会用同一 host 自动转成真机可访问的 URL，无需改后端。

# 快速开始

> **提示**：请确保你已完成 [React Native 环境配置](https://reactnative.dev/docs/environment-setup)（至少到"创建新应用"步骤）再继续。

## 第 1 步：启动 Metro 服务器

首先，你需要启动 **Metro** —— React Native 内置的 JavaScript 打包工具。

在 React Native 项目根目录运行以下命令：

```bash
# 使用 npm
npm start

# 或使用 Yarn
yarn start
```

## 第 2 步：启动你的应用

保持 Metro Bundler 在独立的终端中运行。打开一个 **新终端**，在项目根目录运行以下命令启动 Android 或 iOS 应用：

### 启动 Android

```bash
# 使用 npm
npm run android

# 或使用 Yarn
yarn android
```

### 启动 iOS

```bash
# 使用 npm
npm run ios

# 或使用 Yarn
yarn ios
```

如果一切配置正确，你应该会很快在 Android 模拟器或 iOS 模拟器上看到应用运行。前提是你已正确配置好模拟器/模拟程序。

你也可以从 Android Studio 或 Xcode 中直接运行应用。

## 第 3 步：修改你的应用

成功运行后，现在让我们修改它：

1. 在你喜欢的文本编辑器中打开 `App.tsx` 并编辑某些行。
2. **Android**：按两次 <kbd>R</kbd> 键或从**开发者菜单** (<kbd>Ctrl</kbd> + <kbd>M</kbd> 在 Windows/Linux，或 <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> 在 macOS) 选择 **"Reload"** 查看你的改动。

   **iOS**：在 iOS 模拟器中按 <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> 刷新应用并查看改动。

## 恭喜！:tada:

你已成功运行并修改了你的 React Native 应用！:partying_face:

### 下一步？

- 如果你想将 React Native 代码集成到现有项目中，请查看 [集成指南](https://reactnative.dev/docs/integration-with-existing-apps)。
- 如果你想进一步了解 React Native，请阅读 [React Native 简介](https://reactnative.dev/docs/getting-started)。

# 常见问题排查

如果遇到问题，请参考 [排查指南](https://reactnative.dev/docs/troubleshooting)。

# 了解更多

想深入了解 React Native，请参考以下资源：

- [React Native 官网](https://reactnative.dev) - 了解更多关于 React Native 的信息。
- [快速开始](https://reactnative.dev/docs/environment-setup) - **概览** React Native 及其环境配置。
- [学习基础](https://reactnative.dev/docs/getting-started) - 对 React Native **基础**的**导览**。
- [官方博客](https://reactnative.dev/blog) - 阅读最新的 React Native **博客**文章。
- [`@facebook/react-native`](https://github.com/facebook/react-native) - React Native 的开源 GitHub **仓库**。
