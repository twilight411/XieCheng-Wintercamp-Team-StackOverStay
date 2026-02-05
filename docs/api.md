# 易宿酒店预订平台 — 移动端接口约定

> 与 Node 后端/PC 管理端联调时以本文档为准；字段有变更由同学 A 同步更新 `src/types` 与本文档。

**Base URL**：由 `src/constants/index.ts` 中的 `API_BASE_URL` 配置（开发阶段可为 Mock 或本地后端地址）。

**公共约定**：

- 请求体：`Content-Type: application/json`
- 响应体：JSON
- 日期格式：`YYYY-MM-DD`（如 `2025-02-01`）

---

## 1. 酒店列表（分页、筛选、搜索）

**请求**

| 方法 | 路径   | 说明     |
|------|--------|----------|
| GET  | /hotels | 分页列表，query 传参 |

**Query 参数**

| 参数       | 类型   | 必填 | 说明           |
|------------|--------|------|----------------|
| city       | string | 否   | 城市名或城市码 |
| keyword    | string | 否   | 关键字搜索     |
| checkIn    | string | 否   | 入住日期 YYYY-MM-DD |
| checkOut   | string | 否   | 离店日期 YYYY-MM-DD |
| starLevel  | number / string | 否 | 星级（可多选时由后端约定） |
| priceMin   | number | 否   | 最低价         |
| priceMax   | number | 否   | 最高价         |
| page       | number | 否   | 页码，从 1 开始，默认 1 |
| pageSize   | number | 否   | 每页条数，默认 10 |

**响应示例**

```json
{
  "list": [
    {
      "id": "hotel_001",
      "name": "某某酒店",
      "nameEn": "Example Hotel",
      "address": "某某市某某路 1 号",
      "starLevel": 4,
      "images": ["https://..."],
      "minPrice": 299
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 100
}
```

**类型**：`ListResult<HotelListItem>`，见 `src/types/hotel.ts`。

---

## 2. 酒店详情

**请求**

| 方法 | 路径        | 说明     |
|------|-------------|----------|
| GET  | /hotels/:id | 酒店详情，含房型与价格 |

**路径参数**

| 参数 | 类型   | 说明   |
|------|--------|--------|
| id   | string | 酒店 ID |

**响应示例**

```json
{
  "id": "hotel_001",
  "name": "某某酒店",
  "nameEn": "Example Hotel",
  "address": "某某市某某路 1 号",
  "starLevel": 4,
  "facilities": ["WiFi", "停车场", "早餐"],
  "images": ["https://...", "https://..."],
  "roomTypes": [
    {
      "id": "room_001",
      "name": "高级大床房",
      "bedType": "大床",
      "price": 299,
      "area": "28㎡",
      "breakfast": "含早"
    }
  ]
}
```

**类型**：`HotelDetail`，见 `src/types/hotel.ts`。房型价格由服务端实时计算，前端按价格从低到高展示即可。

---

## 3. 首页 Banner

**请求**

| 方法 | 路径     | 说明         |
|------|----------|--------------|
| GET  | /banners | 首页轮播列表 |

**响应示例**

```json
[
  {
    "id": "banner_001",
    "imageUrl": "https://...",
    "hotelId": "hotel_001",
    "title": "推荐酒店"
  }
]
```
**类型**：`BannerItem[]`。点击 Banner 时用 `hotelId` 跳转酒店详情页。

---

## 4. 类型与实现位置

| 类型名          | 说明           | 定义位置           |
|-----------------|----------------|--------------------|
| HotelListItem   | 列表项         | src/types/hotel.ts |
| HotelDetail     | 详情           | src/types/hotel.ts |
| RoomType        | 房型           | src/types/hotel.ts |
| BannerItem      | Banner 项      | src/types/hotel.ts |
| ListParams      | 列表查询参数   | src/types/hotel.ts |
| ListResult\<T\> | 分页列表结果   | src/types/hotel.ts |

接口封装：`src/services/api.ts`（Axios 实例）、`src/services/hotel.ts`（getHotelList / getHotelDetail / getBanners）。
