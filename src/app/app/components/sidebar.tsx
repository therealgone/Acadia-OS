import Icon from "@/../public/favicon.svg";
import { useScreen } from "@/hooks/zustand";
import { SidebarToggle } from "@/utils/sidebarToggle";
import { BookCopy, BookOpenText, Calendar1, CalendarClock, CircleUserRound, Hourglass, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
// import { CiShare1 } from "react-icons/ci";

type MenuType = {
  name: string;
  url: string;
  icon: React.JSX.Element;
}[];
const Sidebar = () => {
  return (
    <div className="relative h-full w-full flex flex-col rounded-2xl panel shadow ">
      <Header />
      <Menu />
      {/* <Status /> */}
      {/* <Footer /> / */}
      {/* <div className="absolute inset-0 bg-blue-500/30 blur-3xl -z-50"></div> */}
      
      {/*<Footer />*/}
    </div>
  );
};

export default Sidebar;

const Header = () => {
  return (
    <div
      className={`flex px-4 w-full min-h-14 items-center  border-b border-white/10 gap-4 ${
        useScreen().isMobile ? "justify-between" : "justify-between"
      }`}
    >
      <div className="flex gap-4 items-center justify-center">
        <Image src={Icon} width={25} height={25} alt="icon" />
        <h1 className="text-lg tracking-wide">Acadia OS</h1>
      </div>
      <div className="flex items-center gap-2">
        {!useScreen().isMobile && (
          <Link href="/app/profile" className="apply-border-sm rounded-full px-2 py-1 text-white/80 hover-glow-blue">Profile</Link>
        )}
        {useScreen().isMobile && (
          <div className="bg-white/5 rounded p-1 backdrop-blur-xs apply-border-sm hover:scale-95">
            <X onClick={SidebarToggle} className="w-5 h-5 cursor-pointer " />
          </div>
        )}
      </div>
    </div>
  );
};

const Menu = () => {
  const path = usePathname();
  const item: MenuType = [
    {
      name: "timetable",
      url: "/app/timetable",
      icon: <Hourglass className="w-5 h-5" />,
    },
    {
      name: "attendance",
      url: "/app/attendance",
      icon: <CalendarClock className="w-5 h-5" />,
    },
    {
      name: "marks",
      url: "/app/marks",
      icon: <BookOpenText className="w-5 h-5 " />,
    },
    {
      name: "course",
      url: "/app/course",
      icon: <BookCopy className="w-5 h-5" />,
    },
    {
      name: "calendar",
      url: "/app/calendar",
      icon: <Calendar1 className="w-5 h-5" />,
    },
    {
      name: "profile",
      url: "/app/profile",
      icon: <CircleUserRound className="w-5 h-5" />,
    },
    // configuration removed
  ];

  return (
    <div className="px-4 py-4 flex-1 flex-col overflow-y-auto space-y-2 ">
      {item.map((i) => {
        return (
          <Link
            key={i.name}
            href={i.url}
            onClick={SidebarToggle}
            prefetch={false}
            className={`flex items-center gap-3 px-4 py-2 capitalize rounded-full transition ${
              i.url === path
                ? "apply-border-sm bg-white/10 text-blue-300 shadow hover-glow-blue"
                : "text-white/60 hover:bg-white/5 apply-hover-scale"
            } `}
          >
            <span className="shrink-0">{i.icon}</span>
            <h1 className="tracking-wide">{i.name}</h1>
          </Link>
        );
      })}
    </div>
  );
};


