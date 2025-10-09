"use client";
import { useUserInfo } from "@/hooks/query";
import React from "react";
import { UserInfo } from "srm-academia-api";
import { GlobalLoader } from "../components/loader";
import { LogOut } from "lucide-react";

const Page = () => {
  const { data, isPending } = useUserInfo();
  if (isPending)
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <GlobalLoader className="h-10 w-10 text-yellow-400" />
      </div>
    );

  if (!data)
    return (
      <div className="flex h-screen w-full justify-center items-center text-white">
        No data found
      </div>
    );

  return <Data data={data} />;
};

export default Page;

const Data = ({ data }: { data: UserInfo }) => {
  return (
    <div className="w-full h-full mt-20 flex flex-col justify-center items-center bg-[var(--bg-primary)] px-4 ">
      {/* Profile Card */}
      <div className="w-full max-w-sm flex flex-col items-center gap-6 bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-yellow-400/20">
        {/* Name & Department */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl text-center font-extrabold text-white">
            {data.name}
          </h1>
          <span className="text-white/70 text-center">{data.department}</span>
        </div>
 
        {/* Profile Details */}
        <div className="w-full flex flex-col gap-3">
          <ProfileRow label="Reg. Number" value={data.regNumber} />
          <ProfileRow label="Mobile" value={data.mobile} />
          <ProfileRow label="Semester" value={data.semester} />
          <ProfileRow label="Section" value={data.section} />
        </div>

        {/* Logout Button */}
        <div className="w-full mt-4 rounded-full overflow-hidden ">
          <a
            href="/auth/logout"
            className="w-full px-4 py-3 flex justify-between items-center font-medium bg-red-600/70 hover:bg-red-600/90 transition-colors text-white rounded-full"
          >
            <span>Log Out</span>
            <LogOut className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

const ProfileRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between items-center w-full px-3 py-2 bg-white/10 rounded-xl border border-yellow-400/10">
    <span className="text-white text-sm">{label}</span>
    <span className="text-yellow-300 font-medium">{value}</span>
  </div>
);
