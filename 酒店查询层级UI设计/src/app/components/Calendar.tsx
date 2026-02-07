import React, { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isWithinInterval, isPast, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (start: Date, end: Date) => void;
  initialStart?: Date;
  initialEnd?: Date;
}

export const Calendar = ({ isOpen, onClose, onSelect, initialStart, initialEnd }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(initialStart || null);
  const [endDate, setEndDate] = useState<Date | null>(initialEnd || null);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-lg font-bold text-gray-800">
          {format(currentMonth, "yyyy年MM月")}
        </span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const onDateClick = (day: Date) => {
    if (isPast(day) && !isToday(day)) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (day < startDate) {
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDateView = startOfWeek(monthStart);
    const endDateView = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDateView;

    while (day <= endDateView) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        
        const isSelected = (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate));
        const isInRange = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });
        const isDisabled = isPast(day) && !isToday(day);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={`relative h-14 flex items-center justify-center cursor-pointer transition-all ${
              !isCurrentMonth ? "text-gray-200" : isDisabled ? "text-gray-300" : "text-gray-800"
            } ${isInRange ? "bg-blue-50" : ""}`}
            onClick={() => onDateClick(cloneDay)}
          >
            {isSelected && (
              <motion.div
                layoutId="selectedDay"
                className="absolute inset-2 bg-blue-500 rounded-lg z-0"
              />
            )}
            <span className={`relative z-10 text-sm font-medium ${isSelected ? "text-white" : ""}`}>
              {formattedDate}
            </span>
            {isSelected && (
              <span className="absolute bottom-1 text-[10px] text-white/80 z-10">
                {startDate && isSameDay(day, startDate) ? "入住" : "离店"}
              </span>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="px-2 pb-4">{rows}</div>;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[101] max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-xl font-bold">选择日期</h2>
              <button onClick={onClose} className="p-1 rounded-full bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {renderHeader()}
              {renderDays()}
              {renderCells()}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white">
              <button
                disabled={!startDate || !endDate}
                onClick={() => {
                  if (startDate && endDate) {
                    onSelect(startDate, endDate);
                    onClose();
                  }
                }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  startDate && endDate ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-400"
                }`}
              >
                确定 (共{startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0}晚)
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
