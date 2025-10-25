"use client";
import { useUserInfo } from "@/hooks/query";
import React from "react";
import { UserInfo } from "@/SRM-SCRAPPER";
import { GlobalLoader } from "../components/loader";

import { Github, Linkedin, MessageCircle, LogOut
} from "lucide-react";


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

  return <Data data={data as UserInfo} />;
};

export default Page;

const Data = ({ data }: { data: UserInfo }) => {
  return (
    <div className="w-full h-full mt-20 flex flex-col justify-center items-center bg-[var(--bg-primary)] px-4 ">
      {/* Profile Card */}
      <div className="w-full max-w-sm flex flex-col items-center gap-6 panel panel-space-bg p-6 ">
        {/* Name & Department */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl text-center font-extrabold text-white">
            {data.name}
          </h1>
          <span className="text-white/70 text-center">{data.department}</span>
        </div>
 
        {/* Profile Details */}
        <div className="w-full flex flex-col gap-3">
          <ProfileRow label="Reg. Number" value={data.regNumber} colour="" />
          <ProfileRow label="Mobile" value={data.mobile} colour="" />
          <ProfileRow label="Semester" value={data.semester} colour="" />
          <ProfileRow label="Section" value={data.section} colour="" />
        </div>

        {/* Logout Button */}
        <div className="w-full mt-4 rounded-full overflow-hidden ">
          <a
            href="/auth/logout"
            className="w-full px-4 py-3 flex justify-between items-center font-medium panel-red-bg hover:scale-[1.04] transition-colors text-white rounded-full"
          >
            <span>Log Out</span>
            <LogOut className="w-5 h-5" />
          </a>

          
        </div>
           <div className="flex flex-row gap-10 ">
                  <a 
                    href="https://github.com/therealgone" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300"
                  >
                    <Github size={20} className="text-[#E1E1E3]" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/jeevan-baabu-97a19125b/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300"
                  >
                    <Linkedin size={20} className="text-[#E1E1E3]" />
                  </a>
                  <a 
                    href="https://chat.whatsapp.com/BsIHwgrahSoHvVNVV9OHkA" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300"
                  >
                    <MessageCircle size={20} />
                   
                  </a>
                </div>
      </div>
     <div className="seo-hidden">SRM, SRM KTR, Acadia OS, AcadiaOS, acadiaos srm, Acadia, Acadia SRM, Acadia Asia SRM, SRM Acadia, Student Dashboard, Attendance, Timetable, Calendar, Exam Schedule, GPA Calculator, Marks Calculator, College Timetable, College Attendance Tracker, SRM Students, Academia, academia.srmist, academia.srmist.edu.in, Acadia Design, Acadia Dashboard, College Calendar, SRM Timetable, SRM Attendance, Acadia Portal, SRM Portal, Acadia OS Features, College Management, Student Tools, Academic Planner, Acadia OS SRM KTR, SRM University Tools, Student Performance Tracker, Semester GPA, SRM Academic Dashboard,exam schedule acadia,acadia design </div>
    </div>
  );
};

const ProfileRow = ({
  label,
  value,
  colour,
}: {
  label: string;
  value: string | number;
  colour:string;
}) => (
  <div className="items-center w-full   ">
    <div className={`  text-sm font-bold tracking-wide ${colour} px-2 py-0.5 rounded-full items-center flex justify-between`}>
     <div><span> {label} :</span></div>
     <div> <span className="">{value}</span></div>
    </div>
  
  </div>
);
