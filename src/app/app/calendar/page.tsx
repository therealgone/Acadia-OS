"use client";
import { useCalendar } from "@/hooks/query";
import React, { useState, useRef, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Month } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";
import { formattedMonth, getIndex } from "@/utils/currentMonth";

const Page = () => {
  const { data, isPending } = useCalendar();

  if (isPending) return <GlobalLoader className="h-10 w-10 text-yellow-400" />;
  if (!data || data.length === 0)
    return (
      <div className="flex h-full w-full justify-center items-center">
        No data found
      </div>
    );

  return <DayChange data={data} />;
};

export default Page;

const DayChange = ({ data }: { data: Month[] }) => {
  const [month, setMonth] = useState<number>(getIndex({ data }));

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[var(--bg-primary)]">
      {/* Month Header */}
      <div className="w-full py-6 flex items-center justify-center relative">
        <button
          onClick={() => month > 0 && setMonth(month - 1)}
          className="absolute left-6 bg-white/5 backdrop-blur-sm rounded-full p-2 hover:bg-white/10 transition-all"
        >
          <Minus className="w-4 h-4 text-white/80" />
        </button>

        <h1 className="text-3xl lg:text-5xl font-semibold text-white/90 tracking-wide">
          {data[month].month}
        </h1>

        <button
          onClick={() => month < data.length - 1 && setMonth(month + 1)}
          className="absolute right-6 bg-white/5 backdrop-blur-sm rounded-full p-2 hover:bg-white/10 transition-all"
        >
          <Plus className="w-4 h-4 text-white/80" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 scrollbar-none">
        <Data data={data} month={month} formattedMonth={formattedMonth} />
      </div>
    </div>
  );
};

const Data = ({
  data,
  month,
  formattedMonth,
}: {
  data: Month[];
  month: number;
  formattedMonth: string;
}) => {
  const today = new Date();
  const currentDate = today.getDate().toString();
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [month]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-[120px]">
      {data[month].days.map((item, i) => {
        const holiday = item.dayOrder === "-";
        const isCurrent =
          item.date === currentDate && formattedMonth === data[month].month;

        return (
          <div
            key={i}
            ref={isCurrent ? currentRef : undefined}
            className={`relative flex flex-col items-center justify-between 
              rounded-2xl p-4 transition-all duration-300 
              backdrop-blur-sm border border-white/5
              ${
                holiday
                  ? "panel-red-bg"
                  : "bg-white/5 text-white/80 hover:bg-white/10"
              }
              ${
                isCurrent
                  ? "ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(255,230,0,0.3)] scale-[1.05] text-yellow-200"
                  : ""
              }`}
          >
            {/* Date + Day */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold">{item.date}</span>
              <span className="text-sm opacity-80">{item.day}</span>
            </div>

            {/* Day Order */}
            <div className="absolute top-3 right-3">
              <span
                className={`text-lg ${
                  holiday ? "text-red-400/80" : "text-green-400"
                }`}
              >
                {item.dayOrder}
              </span>
            </div>

            {/* Events */}
            {item.event.length > 0 && (
              <div className="w-full mt-2 flex flex-wrap justify-center gap-1">
                <span className="text-xs text-white     truncate max-w-[90%] text-center">
                  {item.event}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
