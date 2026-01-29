# 双人协同开发分工文档（防冲突）

> 两人均使用 Cursor 协同开发时，按本分工划分开发内容与文件归属，减少同时修改同一文件导致的冲突，并便于为各自 AI 划定工作范围。

---

## 一、分工总览

| 角色 | 负责模块 | 负责页面/能力 | 主要涉及目录与文件 |
|------|----------|----------------|--------------------|
| **同学 A** | 架构 + 首页 + 搜索条件 | 导航、API/类型、首页全量、Banner/日历/筛选/标签、搜索 Store、全局错误拦截 | `App.tsx`、`src/navigation/`、`src/services/`、`src/types/`、`src/constants/`、`src/stores/`、`src/screens/HomeScreen.tsx`、`src/components/` 下首页相关组件 |
| **同学 B** | 列表页 + 详情页 | 酒店列表全量、酒店详情全量、列表/详情相关组件、长列表优化、列表与详情的 loading/空态/错误 UI | `src/screens/HotelListScreen.tsx`、`src/screens/HotelDetailScreen.tsx`、`src/components/` 下列表与详情相关组件 |

- **同学 A**：优先做「基础架构 + 首页」；不主动改列表页、详情页的业务逻辑与 UI。
- **同学 B**：在 A 搭好导航与 API 后，专注「列表页 + 详情页」；不主动改首页、导航结构、API 封装与类型定义。

---

## 二、文件归属（谁改谁、谁只读）

### 2.1 同学 A 负责（A 的 Cursor 主要改这些）

| 路径 | 说明 |
|------|------|
| `App.tsx` | 入口与导航容器，仅 A 修改 |
| `src/navigation/*` | 路由配置、Stack/Tab、param 类型，仅 A 修改 |
| `src/services/api.ts` | Axios 实例、拦截器、全局错误处理，仅 A 修改 |
| `src/services/hotel.ts` | 酒店列表/详情/Banner 等接口封装，仅 A 修改 |
| `src/services/geo.ts` | 定位、逆地理等（若有），仅 A 修改 |
| `src/types/*` | 所有接口/业务类型定义，仅 A 修改 |
| `src/constants/index.ts` | API_BASE_URL、PAGE_SIZE、默认城市等，仅 A 修改 |
| `src/constants/tags.ts` | 快捷标签配置（若有），仅 A 修改 |
| `src/stores/searchStore.ts` 或 `src/context/SearchContext.tsx` | 搜索条件（城市、日期、关键字、星级、价格等），**由 A 创建与维护**；B 只按约定字段读写，不改结构/不重命名 |
| `src/screens/HomeScreen.tsx` | 首页全量逻辑与 UI，仅 A 修改 |
| `src/components/BannerCarousel.tsx` | 首页 Banner 轮播，仅 A 修改 |
| `src/components/DatePickerModal.tsx` | 日历弹层，仅 A 修改；B 在列表页**只引用、不修改** |
| `docs/api.md` | 接口文档（若有），仅 A 修改 |

### 2.2 同学 B 负责（B 的 Cursor 主要改这些）

| 路径 | 说明 |
|------|------|
| `src/screens/HotelListScreen.tsx` | 列表页全量逻辑与 UI，仅 B 修改 |
| `src/screens/HotelDetailScreen.tsx` | 详情页全量逻辑与 UI，仅 B 修改 |
| `src/components/HotelListItem.tsx` | 列表项组件，仅 B 修改 |
| `src/components/FilterBar.tsx` | 列表页详细筛选区，仅 B 修改 |
| `src/components/ImageCarousel.tsx` | 详情页大图轮播，仅 B 修改 |
| `src/components/CityPicker.tsx` | 城市选择弹层，仅 B 修改 |
| `src/components/Loading.tsx`、`src/components/EmptyState.tsx` | 若为列表/详情专用，由 B 创建与修改；若为全局通用，与 A 协商归属 |

### 2.3 共享/交叉时的规则

| 文件/目录 | 归属 | 规则 |
|-----------|------|------|
| `src/stores/searchStore.ts` | A 创建并维护 | B 可读可写（列表页要写筛选条件），但**不**改 store 的字段名、结构、导出方式；新增字段需与 A 约定 |
| `src/navigation/*` | A | B 若需新路由或新 params（如 `HotelList` 的 `keyword`），向 A 提需求，由 A 改导航与类型 |
| `src/services/hotel.ts`、`src/types/*` | A | B **只读不改**；若接口需增删字段，由 A 改，改完 B 再对接 |
| `package.json` | 谁加依赖谁改 | 加新依赖前在群里说一声，避免两人同时改；建议 A 负责导航/请求/日历等，B 负责列表/详情相关库 |
| `README.md` | 可分块 | A 写「项目介绍、架构、运行方式、目录说明」；B 写「列表/详情功能说明」；合并时注意不覆盖对方段落 |
| `.eslintrc.js`、`.prettierrc.js` | 协商 | 建议一人统一改，或一起定规则后只由一人提交 |

---

## 三、按周的任务拆分（对应实现计划）

### 第 1 周（1/29 - 2/4）：基础架构与三页骨架

**执行顺序建议**：先 A 后 B，减少 B 等待。

| 任务 | 负责人 | 说明 |
|------|--------|------|
| 1.1 安装并配置 React Navigation，创建首页/列表/详情占位页 | **A** | A 创建三个 Screen 占位 + 导航；B 不参与 |
| 1.2 目录规范与 constants/types 占位 | **A** | A 建好 `src` 及子目录、常量与类型占位 |
| 1.3 封装 API 层（Axios + hotel 接口） | **A** | A 建 `api.ts`、`hotel.ts`，B 只读 |
| 1.4 接口类型定义与 API 文档 | **A** | A 建 `types` 与 `docs/api.md`，B 只读 |
| 1.5 首页骨架（Banner/搜索/日期/筛选/标签占位 + 跳转） | **A** | A 实现 HomeScreen 骨架；详情占位已有则由 A 保留，B 在 1.7 中替换内容 |
| 1.6 列表页骨架（筛选头 + 空列表占位） | **B** | B 在 A 创建的 HotelListScreen 占位上实现列表骨架 |
| 1.7 详情页骨架（大图/信息/房型占位） | **B** | B 在 A 创建的 HotelDetailScreen 占位上实现详情骨架 |

**冲突预防**：A 做完 1.1～1.5 再提交；B 在 A 提交后再拉取，接着做 1.6、1.7，只改 `HotelListScreen.tsx`、`HotelDetailScreen.tsx`。

---

### 第 2 周（2/5 - 2/11）：核心页面与数据流

| 任务 | 负责人 | 说明 |
|------|--------|------|
| 2.1 首页 Banner 接接口 + 点击跳转详情 | **A** | |
| 2.2 定位与当前城市展示 | **A** | A 建 searchStore/context、geo 服务（如需） |
| 2.3 关键字搜索跳转列表并传参 | **A** | A 改 HomeScreen 传 params；B 在列表页读 params（见 2.7/2.9） |
| 2.4 日历选择入住日期 | **A** | A 建 DatePickerModal、更新 store |
| 2.5 星级与价格筛选并带入列表 | **A** | A 改 HomeScreen + store；B 列表请求时用 store/params |
| 2.6 快捷标签带条件进列表 | **A** | A 改 HomeScreen + constants/tags |
| 2.7 列表页城市/日期筛选头与弹层 | **B** | B 可复用 A 的 DatePickerModal，只引用不修改 |
| 2.8 列表页详细筛选区域 | **B** | |
| 2.9 列表页分页与上滑加载更多 | **B** | B 调用 A 封装的 getHotelList，不改 hotel.ts |
| 2.10 详情页大图左右滑动 | **B** | |
| 2.11 详情页名称/设施/地址 | **B** | |
| 2.12 详情页房型价格列表（按价格从低到高） | **B** | |

**冲突预防**：A 不改 `HotelListScreen`/`HotelDetailScreen`；B 不改 `HomeScreen`、`services`、`types`、`stores` 结构；B 需要新 params 时让 A 加导航类型与传参。

---

### 第 3 周（2/12 - 2/18）：联调与体验

| 任务 | 负责人 | 说明 |
|------|--------|------|
| 3.1 与后端/PC 联调，统一接口字段 | **A** | A 改 constants、services、types、docs/api.md；B 按新类型改列表/详情展示即可 |
| 3.2 价格与房态实时（不缓存价格） | **B** | B 改列表/详情请求策略与 UI |
| 3.3 筛选与搜索闭环 | **A + B** | A 保证首页与 store 一致；B 保证列表读 store/params 并刷新；**先同步再改**，避免同时改 store |
| 3.4 日历入住/离店与列表刷新 | **A** 日历与 store；**B** 列表监听并刷新 | A 不改列表，B 不改 DatePickerModal |
| 3.5 长列表优化 | **B** | |
| 3.6 列表与详情 loading、空态、错误重试 | **B** | |
| 3.7 统一错误与无网提示 | **A** 拦截器/Toast；**B** 列表/详情页内重试按钮 | A 改 api.ts；B 改两页 UI |

**冲突预防**：3.3、3.4 涉及两人时，先约定「store 字段与事件」再由 A 改 store/首页，B 改列表；同一天尽量不同时提交同一文件。

---

### 第 4 周（2/19 - 2/26）：收尾与答辩

| 任务 | 负责人 | 说明 |
|------|--------|------|
| 4.1 全流程自测、修 Bug | **A + B** | 各自负责的页面各自修；涉及对方文件时先沟通或提 Issue |
| 4.2 代码整理、ESLint/Prettier | **A** 首页与公共组件；**B** 列表与详情组件 | 只改自己负责的 components 与 screens |
| 4.3 README | **A** 架构与运行说明；**B** 功能说明（列表/详情） | 可分两段合并，或 A 统稿 |
| 4.4 Git 提交习惯 | **A + B** | 按 [Commit 规范](./COMMIT_CONVENTION.md) 与实现计划中的提交信息 |
| 4.5 提交物、4.6 答辩准备 | **A + B** | 一起准备 |

---

## 四、给 Cursor / AI 的约定（如何减少冲突）

### 4.1 同学 A 的 Cursor 使用建议

- **你主要改动的范围**：`App.tsx`、`src/navigation/`、`src/services/`、`src/types/`、`src/constants/`、`src/stores/`、`src/screens/HomeScreen.tsx`、以及首页相关组件（如 `BannerCarousel`、`DatePickerModal`）。
- **不要主动改**：`HotelListScreen.tsx`、`HotelDetailScreen.tsx` 以及列表/详情专用组件（如 `HotelListItem`、`FilterBar`、`ImageCarousel`、`CityPicker`）。若需调整列表或详情行为，请提示人类“由 B 在列表/详情页修改”。
- **共享文件**：`searchStore` 由你维护；若 B 需要新字段，由人类沟通后你再加。`package.json` 你负责加导航、请求、日历、定位等依赖；加前可与 B 确认是否已有人加。

### 4.2 同学 B 的 Cursor 使用建议

- **你主要改动的范围**：`src/screens/HotelListScreen.tsx`、`src/screens/HotelDetailScreen.tsx`、以及 `HotelListItem`、`FilterBar`、`ImageCarousel`、`CityPicker`、列表/详情的 Loading/EmptyState 等。
- **不要主动改**：`HomeScreen.tsx`、`App.tsx`、`src/navigation/`、`src/services/`、`src/types/`、`src/constants/`、`BannerCarousel`、`DatePickerModal`。若需新接口或新 params，请提示人类“由 A 在 API/导航中增加”。
- **只读不改**：`src/services/hotel.ts`、`src/types/*`。接口或类型有问题时，提示人类让 A 修改。
- **searchStore**：可以读写约定好的字段（如城市、日期、关键字、星级、价格），但不要重命名、删除字段或改 store 的文件结构。

### 4.3 通用习惯

- **拉取后再开发**：每天或每个任务前 `git pull`，减少冲突。
- **小步提交**：完成一个小任务就提交，用实现计划里对应的 commit 信息。
- **冲突时**：优先保留该文件负责人的改动，另一人配合调整自己部分；若拿不准，先沟通再改。

---

## 五、快速对照：我该改哪些文件？

| 若你是… | 你可以改 | 你只读 / 只引用 |
|----------|-----------|------------------|
| **同学 A** | `App.tsx`、`src/navigation/*`、`src/services/*`、`src/types/*`、`src/constants/*`、`src/stores/*`、`HomeScreen.tsx`、`BannerCarousel`、`DatePickerModal`、`docs/api.md` | `HotelListScreen`、`HotelDetailScreen`、`HotelListItem`、`FilterBar`、`ImageCarousel`、`CityPicker`（不主动改） |
| **同学 B** | `HotelListScreen.tsx`、`HotelDetailScreen.tsx`、`HotelListItem`、`FilterBar`、`ImageCarousel`、`CityPicker`、列表/详情用 Loading/EmptyState | `HomeScreen`、`navigation`、`services`、`types`、`BannerCarousel`、`DatePickerModal`；`hotel.ts` 与 `types` 只读 |

按本分工执行，并让各自 Cursor 限定在上述范围内改动，即可最大程度避免双人同时改同一文件造成的冲突。
