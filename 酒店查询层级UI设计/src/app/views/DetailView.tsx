import React, { useState } from "react";
import { ChevronLeft, Share2, Heart, ShoppingCart, MoreHorizontal, MapPin, ChevronRight, Star, Wifi, Clock, Coffee, ShieldCheck } from "lucide-react";
import { Hotel, Room } from "../types";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";

export const DetailView = ({ hotel, onBack }: { hotel: Hotel; onBack: () => void }) => {
  const [activeImage, setActiveImage] = useState(0);

  // Sorting rooms by price low to high as requested
  const sortedRooms = [...hotel.rooms].sort((a, b) => a.price - b.price);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-transparent pointer-events-none">
        <button 
          onClick={onBack} 
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex gap-3 pointer-events-auto">
          {[Heart, Share2, ShoppingCart, MoreHorizontal].map((Icon, i) => (
            <button key={i} className="p-2 rounded-full bg-black/30 backdrop-blur-sm">
              <Icon className="w-5 h-5 text-white" />
            </button>
          ))}
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <div className="relative h-72">
        <div className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
             onScroll={(e) => {
               const index = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
               setActiveImage(index);
             }}>
          {hotel.images.map((img, i) => (
            <div key={i} className="min-w-full h-full snap-start">
              <ImageWithFallback src={img} alt={hotel.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {hotel.images.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === activeImage ? "w-4 bg-white" : "w-1.5 bg-white/50"}`} />
          ))}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {["封面", "精选", "位置", "点评", "相册"].map((label, i) => (
            <div key={i} className={`px-2 py-0.5 rounded-full text-[10px] ${i === 0 ? "bg-white text-gray-900" : "bg-black/20 text-white backdrop-blur-md"}`}>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Info Card */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 p-6 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight flex items-center gap-2 flex-wrap">
            {hotel.name}
            <div className="flex">
              {[...Array(hotel.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
            </div>
          </h1>
          <div className="inline-block mt-2 px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] rounded border border-orange-100 font-medium">
            2024年开业
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-5 gap-4 py-2">
          {[
            { icon: MapPin, label: "免费停车" },
            { icon: Wifi, label: "机器人服务" },
            { icon: Clock, label: "洗衣房" },
            { icon: Coffee, label: "自助入住" },
            { icon: ChevronRight, label: "设施政策" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <item.icon className={`w-5 h-5 ${i === 4 ? "text-gray-400" : "text-gray-600"}`} />
              </div>
              <span className="text-[10px] text-gray-500 text-center">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Rating & Location Summary */}
        <div className="flex gap-3">
          <div className="flex-1 bg-blue-50/50 rounded-xl p-3 border border-blue-100/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-600 font-bold">{hotel.rating}</span>
              <span className="text-blue-600 text-xs font-bold">超棒</span>
              <span className="text-gray-400 text-[10px]">{hotel.reviewCount}条</span>
              <ChevronRight className="w-3 h-3 text-gray-400 ml-auto" />
            </div>
            <div className="text-[10px] text-gray-600 line-clamp-2">
              “服务不错，房间很新，周边很方便”
            </div>
          </div>
          <div className="flex-1 bg-green-50/50 rounded-xl p-3 border border-green-100/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-800 text-xs font-bold truncate">{hotel.distance}</span>
              <ChevronRight className="w-3 h-3 text-gray-400 ml-auto" />
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-500">查看地图</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Bar */}
      <div className="mt-4 px-4">
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[10px] text-gray-400">入住</div>
              <div className="font-bold">2月6日</div>
            </div>
            <div className="h-4 w-[1px] bg-gray-200" />
            <div>
              <div className="text-[10px] text-gray-400">离店</div>
              <div className="font-bold">2月7日</div>
            </div>
            <div className="text-xs text-gray-500">共1晚</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[10px] text-gray-400">间数人数</div>
              <div className="font-bold">1间/2人</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Room Selection */}
      <div className="mt-4 px-4 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {["含早餐", "双床房", "大床房", "双份早餐", "单间"].map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-white text-gray-600 text-xs rounded-lg border border-gray-100 whitespace-nowrap">
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          {sortedRooms.map(room => (
            <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col border border-gray-50">
              <div className="flex p-4 gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback src={room.image} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-bold text-gray-900">{room.name}</h4>
                    <p className="text-[10px] text-gray-500 mt-1">{room.description}</p>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {room.tags.map(t => (
                      <span key={t} className="text-[9px] px-1 py-0.5 bg-blue-50 text-blue-500 rounded border border-blue-100">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-blue-600 text-[10px] font-bold">¥</span>
                    <span className="text-blue-600 text-2xl font-bold">{room.price}</span>
                    <span className="text-gray-400 text-[10px]">起</span>
                  </div>
                  <button className="mt-2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md active:scale-95 transition-transform">
                    预 订
                  </button>
                </div>
              </div>
              <div className="px-4 py-2 bg-gray-50/50 flex items-center justify-between border-t border-gray-50">
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  <span>免费取消 · 限时减免</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold">
                  <span>详情</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex items-center justify-between z-50">
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 bg-blue-100 rounded-full mb-1 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
            </div>
            <span className="text-[10px] text-gray-500">问酒店</span>
          </div>
          <div className="flex flex-col items-center">
            <Heart className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-[10px] text-gray-500">收藏</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-0.5">
              <span className="text-blue-600 text-[10px] font-bold">¥</span>
              <span className="text-blue-600 text-xl font-bold">{hotel.minPrice}</span>
              <span className="text-gray-400 text-[10px]">起</span>
            </div>
            <span className="text-[9px] text-gray-400">已省¥22</span>
          </div>
          <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform">
            查看房型
          </button>
        </div>
      </div>
    </div>
  );
};
