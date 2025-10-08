"use client";
import React from "react";
import { FiZap, FiLock, FiBarChart2, FiTrendingUp, FiCheckCircle } from "react-icons/fi";

const features = [
  { title: "Real-time Data", desc: "Live attendance & marks", icon: <FiBarChart2 size={24} />, color: "text-[color:var(--accent-secondary)] bg-[color:var(--accent-secondary)]/10" },
  { title: "Lightning Fast", desc: "Instant access to info", icon: <FiZap size={24} />, color: "text-[color:var(--info)] bg-[color:var(--info)]/10" },
  { title: "Secure & Private", desc: "Your data is protected with encryption", icon: <FiLock size={24} />, color: "text-[color:var(--success)] bg-[color:var(--success)]/10" },
  { title: "Predictive Insights", desc: "Smart attendance and grade projections", icon: <FiTrendingUp size={24} />, color: "text-[color:var(--warning)] bg-[color:var(--warning)]/10" },
];

const ProgressBar = ({ value, color }: { value: number; color: string }) => (
  <div className="w-full h-2 sm:h-2 rounded-full bg-white/10 overflow-hidden">
    <div
      className={`h-2 sm:h-2 rounded-full ${color} transition-[width] duration-300 ease-out`}
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 py-20 lg:py-0 lg:px-20 pt-16 lg:pt-24" style={{ background: "var(--bg-primary)" }}>
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-[10rem] -left-[10rem] w-[50rem] h-[50rem] rounded-full blur-[100px] opacity-15" style={{ background: "radial-gradient(circle, var(--accent-secondary), transparent 60%)" }} />
        <div className="absolute -bottom-[10rem] -right-[10rem] w-[45rem] h-[45rem] rounded-full blur-[100px] opacity-10" style={{ background: "radial-gradient(circle, var(--accent-primary), transparent 60%)" }} />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center w-full max-w-7xl gap-12 lg:gap-20">
        {/* Left text */}
        <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8 w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight" style={{ color: "var(--text-primary)" }}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--accent-secondary)] to-[color:var(--accent-primary)]">Academic</span> Companion
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl" style={{ color: "var(--text-primary)" }}>
            Access, Predict, and Succeed in Your SRM Academic Journey.
          </p>
          <p className="max-w-xl text-base sm:text-lg lg:text-xl mx-auto lg:mx-0" style={{ color: "var(--text-secondary)" }}>
            Get instant access to your <strong>real-time attendance</strong>, marks, timetable, and smart <strong>predictive insights</strong>. A fast, reliable, and beautiful way to manage your university life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <a href="/auth/login" className="px-6 sm:px-8 py-3 rounded-full font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.03] focus:ring-4 btn-accent hover-glow text-center">
              Login →
            </a>
            <a href="#features" className="px-6 sm:px-8 py-3 rounded-full font-semibold border border-white/20 text-[color:var(--text-primary)] hover:bg-white/10 transition-colors text-center">
              Explore Features
            </a>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl panel border border-white/10 transition-all duration-300 hover:bg-white/10 hover-glow">
                <div className={`p-3 rounded-full ${feature.color} flex items-center justify-center flex-shrink-0`}>{feature.icon}</div>
                <div className="min-w-0">
                  <div className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>{feature.title}</div>
                  <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Dashboard */}
        <div className="flex-1 lg:max-w-md w-full relative pt-8 lg:pt-0 overflow-x-auto">
          <div className="p-6 rounded-2xl panel border border-white/10 shadow-2xl min-w-[320px]">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h3 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>Student Dashboard</h3>
              <div className="text-sm font-medium flex items-center space-x-2" style={{ color: "var(--success)" }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--success)" }}></div>
                <span>Live</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: "Predicted Attendance", value: 82, color: "att-yellow", icon: <FiTrendingUp size={16} /> },
                { label: "Actual Attendance", value: 85, color: "att-green", icon: <FiCheckCircle size={16} /> },
              ].map((att, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                    <span className="hidden sm:inline">{att.label}</span>
                    <span className="sm:hidden">Pred</span>
                    {att.icon}
                  </div>
                  <div className={`font-extrabold text-3xl ${att.color}`}>{att.value}<span className="text-lg font-medium">%</span></div>
                  <ProgressBar value={att.value} color={att.color} />
                </div>
              ))}
            </div>

            {/* Schedule */}
            <h4 className="font-semibold text-lg mb-3 border-t border-white/10 pt-4" style={{ color: "var(--text-primary)" }}>Today&apos;s Schedule</h4>
            <div className="space-y-3">
              {[
                { time: "9:00 AM", course: "Data Structures & Algorithms", type: "Lecture", color: "text-[color:var(--info)]" },
                { time: "11:00 AM", course: "Web Development (Lab)", type: "Practical", color: "text-[color:var(--accent-secondary)]" },
              ].map((t, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <div className="text-sm min-w-0 flex-1">
                    <div className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{t.course}</div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{t.time}</div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full border ${t.color} border-current/30 flex-shrink-0 ml-2`}>
                    {t.type}
                  </div>
                </div>
              ))}
            </div>

            {/* Marks Trend */}
            <h4 className="font-semibold text-lg mt-6 mb-3 border-t border-white/10 pt-4" style={{ color: "var(--text-primary)" }}>Marks Trend</h4>
            <div className="flex gap-3 mt-4 h-20 items-end w-full">
              {[70, 75, 82, 85, 90, 88].map((val, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-lg transition-all duration-300 ease-out"
                  style={{ height: `${val}%`, background: `linear-gradient(to top, var(--accent-primary), var(--accent-secondary))` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
