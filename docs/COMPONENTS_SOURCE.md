# 组件来源说明

说明项目中**自研组件**与**引入（第三方/系统）**的划分，便于维护和交接。

---

## 一、自研组件（项目内自己写的）

这些组件在 `src/components/` 或页面内手写，不依赖第三方 UI 库。

| 组件/模块 | 位置 | 说明 |
|-----------|------|------|
| **FolderTabs** | `src/components/FolderTabs.tsx` | 文件夹页签 UI：梯形斜边（SVG 路径 `0 100, 12 0, 88 0, 100 100`）、激活态蓝字 + 小水花图标，参考「酒店查询层级UI设计」里的 FolderTabs。 |
| **DatePickerModal** | `src/components/DatePickerModal.tsx` | 入住日期选择弹窗，内部使用 `react-native-calendars` 的 Calendar，外壳（Modal、标题、确定/取消）为自研。 |
| **FilterBar** | `src/components/FilterBar.tsx` | 列表页顶部筛选栏（星级、价格等），自研。 |
| **HotelListItem** | `src/components/HotelListItem.tsx` | 酒店列表单条卡片，自研。 |
| **ImageCarousel** | `src/components/ImageCarousel.tsx` | 详情页图片轮播，自研。 |
| **首页布局** | `src/screens/HomeScreen.tsx` | Banner 轮播、搜索白卡、促销区等布局与样式均为自研（仅用 RN 基础组件 + Theme）。 |
| **主题常量** | `src/constants/theme.ts` | 设计规范色值、圆角、阴影等，自研。 |

---

## 二、引入的库 / 系统能力

### 1. React Native 自带（核心 + 基础组件）

- **react-native**：`View`, `Text`, `ScrollView`, `Image`, `TouchableOpacity`, `Pressable`, `TextInput`, `Modal`, `StyleSheet`, `Dimensions`, `Alert` 等。
- 用法：直接 `import { ... } from 'react-native'`，无额外安装。

### 2. 导航

- **@react-navigation/native**：导航容器与基础能力。
- **@react-navigation/native-stack**：栈式页面（酒店列表、详情等）。
- **@react-navigation/bottom-tabs**：底部 Tab（首页、我的）。
- 用法：在 `src/navigation/RootNavigator.tsx` 中配置；各页通过 `useNavigation` / `useRoute` 使用。

### 3. UI / 图标 / 图形

- **react-native-svg**：SVG 图形。当前用于：FolderTabs 的梯形背景、小水花图标。
- **phosphor-react-native**：图标库（如首页/我的 Tab 的 House、User）。
- **react-native-calendars**：日历。当前仅在 `DatePickerModal` 里用其 `<Calendar>` 做日期选择，弹窗结构和业务逻辑为自研。

### 4. 状态与请求

- **zustand**：全局状态（如 `src/stores/searchStore.ts` 的搜索条件）。
- **axios**：HTTP 请求（在 `src/services/api.ts` 等封装使用）。

### 5. 其它

- **react-native-safe-area-context**：安全区（若顶部/底部有留白需求时可使用）。
- **react-native-screens**：导航底层优化，通常由 React Navigation 依赖带入。

---

## 三、Folder Tab 斜边说明（与 UI 设计对齐）

设计稿（`酒店查询层级UI设计/src/app/components/FolderTabs.tsx`）里用的是 **CSS clip-path**：

```css
clipPath: "polygon(0% 100%, 12% 0%, 88% 0%, 100% 100%)"
```

表示每个页签是一块**梯形**：下底 0%–100%，上底 12%–88%，左右两条边是**斜的**，中间分隔线视觉上是斜边而不是竖线。

React Native 没有 `clip-path`，所以在 RN 版 FolderTabs 里用 **react-native-svg** 画了同样形状的梯形背景（路径 `M 0 100 L 12 0 L 88 0 L 100 100 Z`，用 `viewBox="0 0 100 100"` + `preserveAspectRatio="none"` 铺满），实现与设计稿一致的斜边文件夹效果。

---

## 四、总结表

| 类型 | 内容 |
|------|------|
| **自研** | FolderTabs、DatePickerModal 外壳、FilterBar、HotelListItem、ImageCarousel、首页布局、theme.ts |
| **引入** | react-native、react-navigation、react-native-svg、phosphor-react-native、react-native-calendars、zustand、axios 等 |

如新增组件或新接库，建议在本文档中同步更新「自研」与「引入」两部分的说明。
