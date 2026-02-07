/**
 * 设计规范：Modern Travel & Clean Aesthetic
 * 品牌主色 #3B82F6，辅助色红/橙，背景 #F8F9FA
 */
export const Theme = {
  /** 品牌主色 - 科技蓝，核心动作与激活态 */
  brandPrimary: '#3B82F6',
  /** 辅助色 - 价格、评分、促销 */
  accentRed: '#EF4444',
  accentOrange: '#F97316',
  /** 页面背景 - 微弱灰提升层次 */
  bgPage: '#F8F9FA',
  /** 卡片/输入背景 */
  bgCard: '#FFFFFF',
  /** 分割线、占位 */
  borderLight: '#F1F3F5',
  border: '#E5E7EB',
  /** 标题、正文 */
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  /** 圆角 */
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  /** 阴影（elevation 用于 Android） */
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
