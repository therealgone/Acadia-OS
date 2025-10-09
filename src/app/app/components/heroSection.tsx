"use client";

import React from "react";
import { FiZap, FiLock, FiBarChart2, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const features = [
  { title: "Real-time Data", desc: "Live attendance & marks", icon: <FiBarChart2 size={24} />, color: "text-[color:var(--accent-secondary)] bg-[color:var(--accent-secondary)]/10" },
  { title: "Lightning Fast", desc: "Instant access to info", icon: <FiZap size={24} />, color: "text-[color:var(--info)] bg-[color:var(--info)]/10" },
  { title: "Secure & Private", desc: "Your data is protected", icon: <FiLock size={24} />, color: "text-[color:var(--success)] bg-[color:var(--success)]/10" },
  { title: "Predictive Insights", desc: "Smart attendance & grade projections", icon: <FiTrendingUp size={24} />, color: "text-[color:var(--warning)] bg-[color:var(--warning)]/10" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-[15rem] -left-[15rem] w-[60rem] h-[60rem] rounded-full blur-[140px] opacity-20" style={{ background: "radial-gradient(circle, var(--accent-secondary), transparent 60%)" }} />
        <div className="absolute -bottom-[15rem] -right-[15rem] w-[55rem] h-[55rem] rounded-full blur-[140px] opacity-15" style={{ background: "radial-gradient(circle, var(--accent-primary), transparent 60%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl w-full px-6 lg:px-20 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
          <motion.h1 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.8 }} 
  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white]"
>
  Acadia OS <br /> Academic Companion
</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl max-w-xl text-white/80]"
          >
            Access, predict, and succeed in your SRM academic journey with real-time insights, smart projections, and a sleek interface.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1, delay: 0.4 }} 
            className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center lg:justify-start"
          >
            <a href="/auth/login" className="px-8 py-3 rounded-full panel-red-bg hover:scale-[1.05] transition-all duration-300 text-center">
              Login →
            </a>
            
          </motion.div>

          {/* Features */}
          <motion.div id="features" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10 w-full">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl panel border border-white/10 hover:bg-white/10 hover-glow transition-all duration-300"
              >
                <div className={`p-3 rounded-full flex items-center justify-center flex-shrink-0 ${f.color}`}>
                  {f.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-base text-[color:var(--text-primary)]">{f.title}</div>
                  <div className="text-sm text-[color:var(--text-secondary)]">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1, delay: 0.5 }} 
          className="flex-1 relative w-full max-w-lg"
        >
          <div className="p-6 rounded-3xl panel border border-white/10 shadow-2xl backdrop-blur-lg">
            {/* Panel Header */}
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-[color:var(--text-primary)]">Student Dashboard</h3>
              <div className="flex items-center gap-2 text-sm font-medium text-[color:var(--success)]">
                <div className="w-2 h-2 rounded-full animate-pulse bg-[color:var(--success)]"></div>
                Live
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[{ label: "Predicted Attendance", value: 82, color: "att-yellow" }, { label: "Actual Attendance", value: 85, color: "att-green" }].map((att, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex justify-between items-center text-xs mb-1 text-[color:var(--text-secondary)]">
                    <span className="truncate">{att.label}</span>
                    <FiCheckCircle size={16} />
                  </div>
                  <div className={`font-extrabold text-3xl ${att.color}`}>{att.value}%</div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-2 rounded-full ${att.color}`} style={{ width: `${att.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini Schedule */}
            <h4 className="text-lg font-semibold mb-3 border-t border-white/10 pt-3 text-[color:var(--text-primary)]">Today&apos;s Schedule</h4>
            <div className="space-y-2">
              {[{ time: "9:00 AM", course: "Data Structures", type: "Lecture", color: "text-[color:var(--info)]" }, { time: "11:00 AM", course: "Web Dev Lab", type: "Practical", color: "text-[color:var(--accent-secondary)]" }].map((t, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                  <div className="text-sm flex-1 min-w-0">
                    <div className="font-medium truncate text-[color:var(--text-primary)]">{t.course}</div>
                    <div className="text-xs text-[color:var(--text-secondary)]">{t.time}</div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full border ${t.color} border-current/30 ml-2`}>{t.type}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
