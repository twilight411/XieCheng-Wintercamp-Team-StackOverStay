import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, Search, Filter, ChevronDown, Star, MapPin, Share2, MoreHorizontal, ChevronRight } from "lucide-react";
import { Hotel } from "../types";
import { HOTELS } from "../data";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";

export const ListView = ({ onBack, onSelectHotel }: { onBack: () => void; onSelectHotel: (hotel: Hotel) => void }) => {
  const [hotels, setHotels] = useState<Hotel[]>(HOTELS);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);

  // Simple infinite scroll simulation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [isLoading]);

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Duplicate current hotels with new IDs for demo
      setHotels(prev => [...prev, ...HOTELS.map(h => ({ ...h, id: `${h.id}-${prev.length}` }))]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 bg-gray-100 rounded-full py-2 px-4 flex items-center gap-2">
            <div className="text-[10px] leading-tight flex flex-col border-r border-gray-200 pr-2">
              <span className="font-bold">上海</span>
              <span className="text-gray-500">02-06/02-07</span>
            </div>
            <div className="flex-1 flex items-center gap-2 text-sm text-gray-400">
              <Search className="w-4 h-4" />
              <span>位置/品牌/酒店</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Share2 className="w-5 h-5 text-gray-600" />
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-50 overflow-x-auto no-scrollbar gap-6 whitespace-nowrap">
          {["欢迎度排序", "位置距离", "价格/星级", "筛选"].map((item, i) => (
            <div key={i} className="flex items-center gap-1 text-sm font-medium text-gray-700">
              {item}
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          ))}
        </div>

        {/* Quick Filter Tags */}
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          {["地铁站", "外滩核心区", "双床房", "4.7分以上", "新开业", "东方明珠"].map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-100 flex-shrink-0">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hotel List */}
      <div className="p-4 space-y-4">
        {hotels.map((hotel) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelectHotel(hotel)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row gap-4 active:scale-[0.98] transition-transform"
          >
            <div className="relative w-full md:w-32 h-48 md:h-auto overflow-hidden">
              <ImageWithFallback
                src={hotel.images[0]}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                广告
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 pr-4">{hotel.name}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 line-through">¥{hotel.minPrice + 50}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-blue-600 text-[10px] font-bold">¥</span>
                      <span className="text-blue-600 text-xl font-bold">{hotel.minPrice}</span>
                      <span className="text-gray-400 text-[10px]">起</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    {hotel.rating} {hotel.rating >= 4.5 ? "超棒" : "很好"}
                  </div>
                  <span className="text-xs text-gray-500">{hotel.reviewCount}点评</span>
                  <span className="text-xs text-gray-500">· {hotel.stars}星级</span>
                </div>

                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{hotel.distance}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {hotel.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] text-blue-500 px-1.5 py-0.5 bg-blue-50 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="text-[10px] text-orange-600 font-medium">
                  “服务不错，房间很新，周边很方便”
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <span>品牌首单</span>
                  <span className="text-orange-500">优惠22</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Loading Indicator */}
        <div ref={observerTarget} className="py-8 flex justify-center items-center gap-2 text-gray-400 text-sm">
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>正在加载更多...</span>
            </>
          ) : (
            <span>向上滑动加载更多</span>
          )}
        </div>
      </div>
    </div>
  );
};
