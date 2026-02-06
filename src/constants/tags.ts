/**
 * 快捷标签配置
 * 用于首页快捷筛选，点击后带入列表页
 */
export interface QuickTagItem {
  id: string;
  label: string;
  /** 搜索关键字，默认与 label 一致 */
  keyword?: string;
  /** 可选：星级（2=经济型 3=舒适型 4=高档 5=豪华） */
  starLevel?: number;
  /** 可选：价格区间下限 */
  priceMin?: number;
  /** 可选：价格区间上限 */
  priceMax?: number;
}

export const QUICK_TAGS: QuickTagItem[] = [
  {id: 'economy', label: '经济型', keyword: '经济型', starLevel: 2, priceMax: 300},
  {id: 'comfort', label: '舒适型', keyword: '舒适型', starLevel: 3, priceMin: 300, priceMax: 600},
  {id: 'high', label: '高档', keyword: '高档', starLevel: 4, priceMin: 600, priceMax: 1000},
  {id: 'luxury', label: '豪华', keyword: '豪华', starLevel: 5, priceMin: 1000},
];
