import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Theme } from '../constants/theme';

/** 文件夹页签：灰条一整条 + 仅激活组叠一层白色梯形；左半块左缘垂直+左上圆角，右半块右缘垂直+右上圆角 */
const TAB_BAR_RADIUS = 12;
type TabItem = { label: string; id: number };
const TAB_GROUPS: TabItem[][] = [
  [{ label: '国内', id: 0 }, { label: '海外', id: 1 }],
  [{ label: '民宿', id: 2 }, { label: '钟点房', id: 3 }],
];

function SplashIcon() {
  return (
    <Svg
      width={20}
      height={10}
      viewBox="0 0 28 14"
      style={styles.splashIcon}>
      <Defs>
        <LinearGradient
          id="splash_gradient"
          x1="2"
          y1="12"
          x2="26"
          y2="2"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={Theme.brandPrimary} />
          <Stop offset={1} stopColor="#93C5FD" />
        </LinearGradient>
      </Defs>
      <Path
        d="M2 12C6 12 10 10 14 7C18 4 22 0 26 2C28 3 28 6 25 9C22 12 16 14 2 12Z"
        fill="url(#splash_gradient)"
        fillOpacity={0.6}
      />
    </Svg>
  );
}

/**
 * 仅绘制「激活组」的白色梯形，叠在灰条之上。
 * 左半块：左缘垂直贴容器 (0,0)-(0,100)，右缘左斜 \；View 设 borderTopLeftRadius 与灰条一致。
 * 右半块：右缘垂直，左缘右斜 /；View 设 borderTopRightRadius。
 */
function ActiveGroupWhiteTrapezoid({
  side,
  width,
  height,
}: {
  side: 'left' | 'right';
  width: number;
  height: number;
}) {
  if (width <= 0 || height <= 0) return null;
  // 左半块：右缘要显示为 \。RN SVG 渲染时 y 会翻转，所以这里画 (88,0)→(100,100) 显示后变成 \
  const pathLeft =
    'M 0 0 L 88 0 L 100 100 L 0 100 Z';
  // 右半块：左缘要显示为 /。y 翻转下需画 (12,0)→(0,100)，显示后变成 /
  const pathRight =
    'M 12 0 L 100 0 L 100 100 L 0 100 Z';
  return (
    <View
      style={[
        styles.whiteTrapezoidWrap,
        {
          width,
          height,
          [side]: 0,
          overflow: 'hidden',
          borderTopLeftRadius: side === 'left' ? TAB_BAR_RADIUS : 0,
          borderTopRightRadius: side === 'right' ? TAB_BAR_RADIUS : 0,
        },
      ]}
      pointerEvents="none">
      <Svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}>
        <Path
          d={side === 'left' ? pathLeft : pathRight}
          fill={Theme.bgCard}
        />
      </Svg>
    </View>
  );
}

interface FolderTabsProps {
  activeTab: number;
  onChange: (index: number) => void;
}

export function FolderTabs({ activeTab, onChange }: FolderTabsProps) {
  const activeGroupId = activeTab < 2 ? 0 : 1;
  const [layout, setLayout] = React.useState({ width: 0, height: 0 });
  const halfWidth = layout.width > 0 ? layout.width / 2 : 0;

  return (
    <View
      style={styles.wrapper}
      onLayout={e => {
        const { width, height } = e.nativeEvent.layout;
        setLayout({ width, height });
      }}>
      {/* 整条灰色底，贴满容器边，无缺口 */}
      <View style={styles.grayBar} />
      {/* 仅激活组叠一块白色梯形，无白三角 */}
      {layout.width > 0 && layout.height > 0 && (
        <ActiveGroupWhiteTrapezoid
          side={activeGroupId === 0 ? 'left' : 'right'}
          width={halfWidth}
          height={layout.height}
        />
      )}
      {TAB_GROUPS.map((items, groupIndex) => (
        <View key={groupIndex} style={styles.group}>
          <View style={styles.groupContent}>
            {items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={styles.tab}
                  onPress={() => onChange(item.id)}>
                  <View style={styles.tabInner}>
                    <Text
                      style={[
                        styles.tabLabel,
                        isActive && styles.tabLabelActive,
                      ]}>
                      {item.label}
                    </Text>
                    {isActive && <SplashIcon />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          {activeGroupId === groupIndex && <View style={styles.groupBottomMask} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 56,
    position: 'relative',
  },
  grayBar: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(243, 244, 246, 0.9)',
    borderTopLeftRadius: TAB_BAR_RADIUS,
    borderTopRightRadius: TAB_BAR_RADIUS,
  },
  whiteTrapezoidWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  group: {
    flex: 1,
    height: 56,
    position: 'relative',
    zIndex: 2,
  },
  groupContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
  },
  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    position: 'relative',
    alignSelf: 'center',
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.textPrimary,
  },
  tabLabelActive: {
    color: Theme.brandPrimary,
  },
  splashIcon: {
    position: 'absolute',
    right: -12,
    bottom: -4,
    pointerEvents: 'none',
  },
  groupBottomMask: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -2,
    height: 4,
    backgroundColor: Theme.bgCard,
    zIndex: 3,
  },
});
