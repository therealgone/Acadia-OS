"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Database, TrendingUp, Zap, Lock, Calendar, Clock, BookOpen,
  User, ArrowRight, CheckCircle, Wifi, BarChart3, Target,
  Shield, Sparkles, Github, Linkedin, MessageCircle, Grid3x3, Package,
} from "lucide-react";
import Icon from "@/../public/favicon.svg";
import Image from "next/image";

export const metadata = {
  title: "Acadia OS – SRM Dashboard",
  description: "SRM student dashboard for timetable, attendance, marks, and courses.",
  keywords: ["SRM", "Acadia OS", "Dashboard", "Timetable", "Attendance", "Marks"],
  openGraph: {
    title: "Acadia OS – SRM Dashboard",
    description: "Check your timetable, attendance, marks, and courses instantly.",
    url: "https://acadia-os.vercel.app",
    images: ["/web-app-manifest-512x512.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acadia OS – SRM Dashboard",
    description: "Check your timetable, attendance, marks, and courses instantly.",
    images: ["/web-app-manifest-512x512.png"],
  },
};



const features = [
  {
    title: "Real-time Sync",
    desc: "Live timetable, attendance, and marks data synced instantly",
    icon: <Database size={20} />,
    color: "text-[#22D3EE]",
    bgColor: "bg-[#22D3EE]/10"
  },
  {
    title: "Predictive Analytics",
    desc: "Smart attendance projections with actionable margins",
    icon: <TrendingUp size={20} />,
    color: "text-[#F59E0B]",
    bgColor: "bg-[#F59E0B]/10"
  },
  {
    title: "Offline Ready",
    desc: "Client-side caching with TanStack Query for seamless experience",
    icon: <Wifi size={20} />,
    color: "text-[#7C3AED]",
    bgColor: "bg-[#7C3AED]/10"
  },
  {
    title: "Secure Sessions",
    desc: "Cookie-based auth with middleware protection",
    icon: <Lock size={20} />,
    color: "text-[#10B981]",
    bgColor: "bg-[#10B981]/10"
  },
];

const stats = [
  { label: "Academic Modules", value: "6", icon: <Grid3x3 size={18} /> },
  { label: "Real-time Updates", value: "Live", icon: <Sparkles size={18} /> },
  { label: "Response Time", value: "<100ms", icon: <Zap size={18} /> },
];

const modules = [
  {
    name: "Timetable",
    icon: <Clock size={24} />,
    desc: "Day order navigation with current day highlighting and auto-scroll to active class",
    features: ["Current class highlight", "Time window checks", "Attendance integration"],
    color: "#7C3AED"
  },
  {
    name: "Attendance",
    icon: <CheckCircle size={24} />,
    desc: "Theory/practical split with predictive modal for date range simulation",
    features: ["Color-coded status", "Skip margin calculator", "Projection math"],
    color: "#22D3EE"
  },
  {
    name: "Marks",
    icon: <BarChart3 size={24} />,
    desc: "Per-course marks with exam breakdowns and comprehensive totals",
    features: ["Exam breakdowns", "Course metadata", "Grade tracking"],
    color: "#10B981"
  },
  {
    name: "Courses",
    icon: <BookOpen size={24} />,
    desc: "Compact cards with code, type, faculty, slot, room, and credits",
    features: ["Faculty info", "Slot timings", "Credit hours"],
    color: "#F59E0B"
  },
  {
    name: "Calendar",
    icon: <Calendar size={24} />,
    desc: "Month grid with current day highlight, holiday states, and events",
    features: ["Holiday tracking", "Event reminders", "Day highlights"],
    color: "#EF4444"
  },
  {
    name: "Profile",
    icon: <User size={24} />,
    desc: "Student details with secure logout and account management",
    features: ["Personal info", "Session control", "Quick access"],
    color: "#8B5CF6"
  },
];

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);


  return (
    <div className="relative w-full bg-[#1c1c21] overflow-x-hidden">
      {/* Animated Background */}
      <div className="seo-hidden">SRM, SRM KTR, Acadia OS, AcadiaOS, acadiaos srm, Acadia, Acadia SRM, Acadia Asia SRM, SRM Acadia, Student Dashboard, Attendance, Timetable, Calendar, Exam Schedule, GPA Calculator, Marks Calculator, College Timetable, College Attendance Tracker, SRM Students, Academia, academia.srmist, academia.srmist.edu.in, Acadia Design, Acadia Dashboard, College Calendar, SRM Timetable, SRM Attendance, Acadia Portal, SRM Portal, Acadia OS Features, College Management, Student Tools, Academic Planner, Acadia OS SRM KTR, SRM University Tools, Student Performance Tracker, Semester GPA, SRM Academic Dashboard,exam schedule acadia,acadia design </div>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
          style={{
            background: "radial-gradient(circle, #7C3AED, transparent 70%)",
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
        />
        <div
          className="absolute -top-[20rem] -right-[20rem] w-[50rem] h-[50rem] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, #22D3EE, transparent 60%)" }}
        />
        <div
          className="absolute top-[40rem] -left-[15rem] w-[45rem] h-[45rem] rounded-full blur-[130px] opacity-10"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent 60%)" }}
        />
      </div>

      {/* Grid Overlay */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 w-full px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="  flex items-center justify-center">
              <Image
                loading="lazy"
                src={Icon}
                width={35}
                height={35}
                alt="Acadia OS Logo"
              />
            </div>
            <span className="text-2xl font-bold text-white">Acadia OS</span>
          </div>
          <div className="flex items-center gap-4">
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
              className=" p-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300"
            >
              <MessageCircle size={18} />
              
            </a>
            <a
              href="https://chat.whatsapp.com/BsIHwgrahSoHvVNVV9OHkA"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-[#10B981]/30 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] transition-all duration-300"
            >
              <MessageCircle size={18} />
              <span className="text-sm font-medium">Join WhatsApp Group</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-16 py-5 ">
          {/* Top Badge */}


          {/* Main Headline */}
          <div className="text-center max-w-5xl mx-auto mb-10 ">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] "
            >
              <span className="text-white">Academic Intelligence</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)"
                }}
              >
                Meets Design
              </span>
            </motion.h1>
            <a href="https://www.npmjs.com/package/srm-academia-api"
            className="flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg lg:text-xl "
            >
              <div className="tag-blue tag text-2xl font-bold  flex justify-center gap-2 items-center py-10 mt-3 mb-3 ">
             
               <Package size={18} className="animate-pulse " />
              
               <span> Build using srm-academia-api</span>
             
            </div>
             
            </motion.div>
            </a>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg lg:text-xl text-[#A5A6AA] max-w-3xl mx-auto leading-normal"
            >
              Real-time timetables, predictive attendance analytics, and offline-ready performance.
              Your complete academic companion with secure sessions and responsive design.
            </motion.p>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
            >
              <a
                href="/auth/login"
                className="group px-8 py-4 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold text-base sm:text-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
              >
                Get Started
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <a
                href="#features"
                className="px-8 py-4 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.04)] backdrop-blur-xl text-[#E1E1E3] font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-[rgba(255,255,255,0.08)] hover:shadow-[0_0_0_4px_rgba(255,255,255,0.1)]"
              >
                Explore Features
              </a>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-20"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-6 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl hover:bg-[rgba(255,255,255,0.06)] transition-all duration-300"
              >
                <div className="text-[#22D3EE]">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-[#A5A6AA]">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                className="group relative p-6 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl hover:bg-[rgba(255,255,255,0.06)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
                  <span className={feature.color}>{feature.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#E1E1E3] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#A5A6AA] leading-relaxed">{feature.desc}</p>
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(600px at 50% 50%, ${feature.color.replace('text-', '')}15, transparent 70%)`
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Module Showcase Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Six Powerful Modules
            </h2>
            <p className="text-base sm:text-lg text-[#A5A6AA] max-w-2xl mx-auto">
              Everything you need to stay on top of your academic journey, from real-time schedules to predictive insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl hover:bg-[rgba(255,255,255,0.06)] transition-all duration-300 hover:scale-[1.02]"
              >
                <div
                  className="inline-flex p-3 rounded-xl mb-4"
                  style={{ backgroundColor: `${module.color}15` }}
                >
                  <span style={{ color: module.color }}>{module.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-[#E1E1E3] mb-2">{module.name}</h3>
                <p className="text-sm text-[#A5A6AA] leading-relaxed mb-4">{module.desc}</p>
                <ul className="space-y-2">
                  {module.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-[#A5A6AA]">
                      <CheckCircle size={14} style={{ color: module.color }} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Built for Performance
            </h2>
            <p className="text-base sm:text-lg text-[#A5A6AA] max-w-2xl mx-auto">
              Modern architecture with offline-first approach and secure authentication
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl"
            >
              <div className="inline-flex p-3 rounded-xl bg-[#7C3AED]/10 mb-4">
                <Shield size={28} className="text-[#7C3AED]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#E1E1E3] mb-3">Secure Authentication</h3>
              <p className="text-[#A5A6AA] leading-relaxed mb-4">
                Cookie-based sessions with middleware protection ensure your data stays private and secure.
                Every request is validated and protected.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-[#A5A6AA]">
                  <CheckCircle size={16} className="text-[#10B981]" />
                  Session management
                </li>
                <li className="flex items-center gap-2 text-sm text-[#A5A6AA]">
                  <CheckCircle size={16} className="text-[#10B981]" />
                  Middleware protection
                </li>
                <li className="flex items-center gap-2 text-sm text-[#A5A6AA]">
                  <CheckCircle size={16} className="text-[#10B981]" />
                  Secure logout flow
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl"
            >
              <div className="inline-flex p-3 rounded-xl bg-[#22D3EE]/10 mb-4">
                <Target size={28} className="text-[#22D3EE]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#E1E1E3] mb-3">Predictive Intelligence</h3>
              <p className="text-[#A5A6AA] leading-relaxed mb-4">
                Advanced algorithms calculate attendance projections, skip margins, and help you make informed decisions about your academic schedule.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-[#A5A6AA]">
                  <CheckCircle size={16} className="text-[#F59E0B]" />
                  Attendance forecasting
                </li>
                <li className="flex items-center gap-2 text-sm text-[#A5A6AA]">
                  <CheckCircle size={16} className="text-[#F59E0B]" />
                  Skip margin calculator
                </li>
                <li className="flex items-center gap-2 text-sm text-[#A5A6AA]">
                  <CheckCircle size={16} className="text-[#F59E0B]" />
                  Grade projections
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Academic Experience?
          </h3>
          <p className="text-base sm:text-lg text-[#A5A6AA] mb-8 max-w-2xl mx-auto">
            Join students who are already using Acadia OS to stay ahead. Access your dashboard now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/auth/login"
              className="group px-8 py-4 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold text-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            >
              Launch Dashboard
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </a>
            <a
              href="https://chat.whatsapp.com/BsIHwgrahSoHvVNVV9OHkA"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] font-semibold text-lg transition-all duration-300 flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Report Issues
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(255,255,255,0.1)] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">

              <div className="  flex items-center justify-center">
                <Image
                  loading="lazy"
                  src={Icon}
                  width={35}
                  height={35}
                  alt="Acadia OS Logo"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Acadia OS</div>
                <div className="text-sm text-[#A5A6AA]">Academic Companion for SRM</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#10B981]/30 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] transition-all duration-300"
              >
                <MessageCircle size={18} />
                <span className="text-sm font-medium">Support</span>
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[rgba(255,255,255,0.1)] text-center text-sm text-[#A5A6AA]">
            <p>Built with care for SRM students • Responsive • Offline-Ready • Secure</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeroSection;