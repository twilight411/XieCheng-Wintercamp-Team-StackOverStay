import React, { useState } from "react";
import { Search, MapPin, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { FolderTabs } from "../components/FolderTabs";
import { Calendar } from "../components/Calendar";
import { format } from "date-fns";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";

const QUICK_TAGS = ["双床房", "南京路步行街", "迪士尼", "人民广场", "免费停车场"];

export const HomeView = ({ onSearch }: { onSearch: (data: any) => void }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDates] = useState({ start: new Date(), end: new Date(Date.now() + 86400000) });
  const [city, setCity] = useState("上海");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Banner */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1742844552048-410dfdf7b3c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3RlbCUyMGV4dGVyaW9yJTIwaW50ZXJpb3IlMjBsb2JieSUyMHJvb218ZW58MXx8fHwxNzcwMzkzMjMwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
          <div className="bg-black/20 backdrop-blur-md rounded-full px-3 py-1 text-white text-xs border border-white/20">
            资质说明
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <span className="text-white text-xs">...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Area */}
      <div className="px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <FolderTabs 
            activeTab={activeTab} 
            onChange={setActiveTab} 
          />
          
          <div className="p-6 space-y-6">
            {/* Location & Search */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xl font-bold text-gray-800">{city}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
              <div className="h-6 w-[1px] bg-gray-200" />
              <div className="flex-[2] flex items-center gap-2 text-gray-400">
                <Search className="w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="位置/品牌/酒店" 
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>

            {/* Dates */}
            <div 
              className="flex items-center gap-4 border-b border-gray-100 pb-4 cursor-pointer"
              onClick={() => setShowCalendar(true)}
            >
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">入住</div>
                <div className="text-lg font-bold">{format(dates.start, "M月d日")}</div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">离店</div>
                <div className="text-lg font-bold">{format(dates.end, "M月d日")}</div>
              </div>
              <div className="text-sm font-medium text-gray-500">
                共{Math.ceil((dates.end.getTime() - dates.start.getTime()) / (1000 * 60 * 60 * 24))}晚
              </div>
            </div>

            {/* Guests & Price */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">1间房 1成人 0儿童</div>
              </div>
              <div className="h-6 w-[1px] bg-gray-200" />
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="价格/星级" 
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-100">
                  {tag}
                </span>
              ))}
            </div>

            {/* Search Button */}
            <button 
              onClick={() => onSearch({ city, dates })}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
            >
              查 询
            </button>
          </div>
        </div>

        {/* Promo Cards */}
        <div className="mt-6 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center border border-pink-50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-pink-500 font-bold">首住好礼</span>
                <div className="bg-pink-100 text-pink-600 text-[10px] px-1.5 py-0.5 rounded">查看详情</div>
              </div>
              <div className="text-xs text-gray-500">最高立减¥85，标有首住特惠房型可用</div>
            </div>
            <div className="bg-pink-500 text-white text-xs px-3 py-2 rounded-lg font-bold">立即领取</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { title: "口碑榜", desc: "城市精选", color: "text-orange-600" },
              { title: "特价套餐", desc: "随时退", color: "text-red-600" },
              { title: "超值低价", desc: "7折起", color: "text-blue-600" }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm text-center">
                <div className={`font-bold text-sm mb-1 ${item.color}`}>{item.title}</div>
                <div className="text-[10px] text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Calendar 
        isOpen={showCalendar} 
        onClose={() => setShowCalendar(false)} 
        onSelect={(start, end) => setDates({ start, end })}
        initialStart={dates.start}
        initialEnd={dates.end}
      />

      {/* Bottom Nav Mock */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-3 px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center text-blue-500">
          <div className="w-6 h-6 bg-blue-500 rounded-full mb-1 flex items-center justify-center">
            <Search className="w-3 h-3 text-white" />
          </div>
          <span className="text-[10px] font-bold">推荐</span>
        </div>
        {["购物车", "权益", "点评", "订单"].map(item => (
          <div key={item} className="flex flex-col items-center text-gray-400">
            <div className="w-6 h-6 mb-1 bg-gray-100 rounded-lg" />
            <span className="text-[10px]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
