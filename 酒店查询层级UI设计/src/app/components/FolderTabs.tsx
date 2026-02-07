import React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Tab = ({ label, active, onClick }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex-1 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer",
        active ? "text-blue-600" : "text-gray-600"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 z-0",
          active ? "bg-white" : "bg-gray-100"
        )}
        style={{
          borderRadius: active ? "16px 16px 0 0" : "0",
          clipPath: active 
            ? "polygon(0 100%, 10% 0, 90% 0, 100% 100%)" 
            : "none"
        }}
      />
      <span className="relative z-10">{label}</span>
      {active && (
        <motion.div
          layoutId="activeTabUnderline"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full z-20"
        />
      )}
    </button>
  );
};

// A better "Folder Tab" look using SVG or complex CSS
const SplashIcon = () => (
  <svg
    width="28"
    height="14"
    viewBox="0 0 28 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute -right-3 -bottom-1 pointer-events-none z-0"
  >
    <path
      d="M2 12C6 12 10 10 14 7C18 4 22 0 26 2C28 3 28 6 25 9C22 12 16 14 2 12Z"
      fill="url(#splash_gradient)"
      fillOpacity="0.6"
    />
    <defs>
      <linearGradient id="splash_gradient" x1="2" y1="12" x2="26" y2="2" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#93C5FD" />
      </linearGradient>
    </defs>
  </svg>
);

const FolderTab = ({ 
  items, 
  activeIdx, 
  groupActive, 
  onSelect 
}: { 
  items: { label: string; id: number }[]; 
  activeIdx: number; 
  groupActive: boolean; 
  onSelect: (id: number) => void 
}) => {
  return (
    <div 
      className={cn(
        "relative flex-1 h-14 flex items-center justify-around transition-all duration-300",
        groupActive ? "z-20" : "z-10"
      )}
    >
      {/* Folder Background */}
      <div 
        className={cn(
          "absolute inset-0 transition-all duration-300",
          groupActive ? "bg-white" : "bg-gray-100/80"
        )}
        style={{
          borderRadius: "16px 16px 0 0",
          clipPath: "polygon(0% 100%, 12% 0%, 88% 0%, 100% 100%)",
          boxShadow: groupActive ? "0 -4px 12px rgba(0,0,0,0.05)" : "none"
        }}
      />
      
      {items.map((item) => {
        const isActive = activeIdx === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "relative z-10 font-bold text-lg transition-colors duration-300 px-2 h-full flex items-center justify-center",
              isActive ? "text-blue-600" : "text-gray-800"
            )}
          >
            <span className="relative">
              {item.label}
              {isActive && <SplashIcon />}
            </span>
          </button>
        );
      })}
      
      {groupActive && (
        <div className="absolute -bottom-[2px] left-0 right-0 h-[4px] bg-white z-30" />
      )}
    </div>
  );
};

export const FolderTabs = ({ 
  activeTab, 
  onChange 
}: { 
  activeTab: number; 
  onChange: (index: number) => void 
}) => {
  const groups = [
    { items: [{ label: "国内", id: 0 }, { label: "海外", id: 1 }], groupId: 0 },
    { items: [{ label: "民宿", id: 2 }, { label: "钟点房", id: 3 }], groupId: 1 }
  ];

  const activeGroupId = activeTab < 2 ? 0 : 1;

  return (
    <div className="flex w-full items-end bg-gray-100/30 rounded-t-2xl px-1 pt-1 overflow-hidden">
      {groups.map((group, i) => (
        <FolderTab
          key={i}
          items={group.items}
          activeIdx={activeTab}
          groupActive={activeGroupId === group.groupId}
          onSelect={onChange}
        />
      ))}
    </div>
  );
};
