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
      <div className="w-full h-[15%]  py-5">
        <div className="relative max-w-100 mx-auto h-full flex items-center justify-center text-4xl text-white/80 lg:text-5xl">
          {data[month].month}
          <div
            onClick={() => {
              if (month > 0) {
                setMonth(month - 1);
              }
            }}
            className="absolute top-1/2  -translate-y-1/2 left-10   bg-white/5  p-1 apply-border-sm rounded-lg cursor-pointer shadow-2xl"
          >
            <Minus className="w-5 h-5" />
          </div>
          <div
            onClick={() => {
              if (month < data.length - 1) {
                setMonth(month + 1);
              }
            }}
            className="absolute top-1/2 -translate-y-1/2 right-10  bg-white/5  p-1 apply-border-sm rounded-lg cursor-pointer shadow-2xl"
          >
            <Plus className="w-5 h-5" />
          </div>
        </div>
      </div>
<div className=" flex h-[calc(100vh-100px)]">

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
    <div className=" items-center justify-center py-4 h-full w-full grid px-3 sm:px-2 md:px-4 lg:px-6 xl:px-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 overflow-y-auto scrollbar-none flex h-[calc(100vh-100px)] gap-4">
      {data[month].days.map((item, i) => {
        const holiday = item.dayOrder === "-";
        const isCurrent =
          item.date === currentDate && formattedMonth === data[month].month;
        return (
          <div
            key={i}
            ref={isCurrent ? currentRef : undefined}
            className={`w-full h-full flex flex-col shadow-xl p-3 sm:p-4 gap-4 lg:minh-50 min-h-40 panel ${
              holiday ? "att-red  border panel-red-bg  " : " text-[color:var(--text-secondary)]"
            } ${
              isCurrent ? " md:scale-[1.07] lg:scale-[1.07] xl:scale-[1.07]   glow-yellow text-[color:var(--text-primary)] hover-glow-yellow" : "hover:scale-[1.07]"
            }`}
          >
            
            <div className="flex justify-between items-center w-full min-h-14 px-1 sm:px-2  ">
              <div className="flex flex-col items-center gap-0.5 text-xl text-white/60 ">
                <span className="font-semibold ">{item.date}</span>
                <h1 className=" ">{item.day}</h1>
              </div>
             
              <span className={`text-3xl ${holiday ? "text-[color:var(--error)]" : "text-green-400/60"}`}>
                {item.dayOrder}
              </span>
            </div>
            {item.event.length !== 0 && (
              <div className="text-sm flex justify-start items-end-safe  h-full  no-scrollbar overflow-y-scroll">
                {item.event}
              </div>
            )}
            
          </div>
        );
      })}
    </div>
  );
};
