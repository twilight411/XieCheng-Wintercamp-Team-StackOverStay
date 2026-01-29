# 项目介绍：XieCheng Wintercamp (StackOverStay)

## 一、项目简介
这是一个基于 React Native 的移动应用模板（项目名：`com.xiecheng.wintercamp`），使用 TypeScript/JavaScript 开发，包含 Android 与 iOS 两个平台的原生工程。适合用于教学、原型和进一步集成第三方原生模块。

## 二、主要目录（精简）
- 根目录
  - `package.json`：依赖与常用脚本（`npm start` / `npm run android` / `npm run ios`）。
  - `App.tsx`：应用顶层入口（React 组件）。
  - `index.js`：React Native 注册入口。
- Android: `android/`
  - `android/app/src/main/java/.../MainActivity.kt`、`MainApplication.kt`：原生启动/配置类。
  - `android/app/build.gradle`：模块构建配置。
- iOS: `ios/`
  - `Podfile`、`XieCheng.xcodeproj`、`AppDelegate.*`：iOS 构建与启动文件。
- 测试: `__tests__/App.test.tsx`（Jest 单元测试）。

## 三、技术栈
- 框架：React Native v0.76
- 语言：React + TypeScript（项目包含 `typescript` 配置）
- 打包：Metro bundler（开发时运行 `npm start`）
- 构建：Android 使用 Gradle，iOS 使用 Xcode + CocoaPods
- 工具：Babel、ESLint、Prettier、Jest

## 四、运行（开发）步骤
1. 安装依赖（若尚未安装）：
```bash
npm install
```
2. 启动 Metro Bundler（在独立终端）：
```bash
npm start
```
3. 启动 Android（需已开启模拟器或连接设备）：
```bash
npm run android
```
- 如果使用真机或设备需执行（设备上）：
```bash
adb reverse tcp:8081 tcp:8081
```
4. 启动 iOS（macOS 且已配置）：
```bash
npm run ios
```

## 五、常见问题与解决方法
- Metro 占用端口 8081：
  - Windows 下可结束占用进程或释放端口，例如使用 PowerShell：
  ```powershell
Get-NetTCPConnection -LocalPort 8081 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```
- 无可用 Android 模拟器：
  - 在 Android Studio AVD Manager 新建/启动模拟器，或用物理设备连接并打开开发者模式。
- 依赖或构建失败：
  - 删除 `node_modules`、重装 `npm install`，对 Android 可尝试 `cd android && gradlew clean`。

## 六、架构与扩展建议
- 当前为单体前端应用（JS 层），若需要中央状态管理建议引入 `redux` 或 `zustand`。
- 若需网络层建议在 `src/services` 下按领域组织 API 客户端与类型定义。
- 原生模块：在 `android/` 与 `ios/` 分别添加桥接实现，保持 JS 接口稳定。

## 七、下一步建议（可选）
- 补充 `docs/开发指南.md`，包含设备调试、签名、发布流程。
- 添加 CI（例如 GitHub Actions）自动化构建与测试。

---
文件由协作助手生成，如需我把文档内容改为英文、加入更多运行截图或 CI 模板，告诉我即可。