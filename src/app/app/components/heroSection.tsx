"use client";
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 lg:px-20" style={{background:"var(--bg-primary)"}}>
      {/* Background accent/glow */}
      <div className="absolute inset-0 pointer-events-none blur-3xl" style={{background:"radial-gradient(600px at 50% 20%, rgba(124,58,237,0.2), transparent 60%)"}} />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center w-full max-w-7xl gap-16">
        {/* Left text */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight" style={{color:"var(--text-primary)"}}>
            A Cleaner Way to Use Academia
          </h1>
          <p className="max-w-xl text-lg lg:text-xl" style={{color:"var(--text-secondary)"}}>
            Fast, organized, and beautiful. Track classes, attendance, marks, and more — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6">
            <a
              href="/auth/login"
              className="px-6 py-3 rounded-xl font-semibold btn-accent hover:scale-105 transition-transform duration-300"
            >
              Get Started
            </a>
            <a
              href="/app/timetable"
              className="px-6 py-3 rounded-xl font-semibold btn"
            >
              View Demo
            </a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {[
              { title: "Timetable", desc: "Today's classes at a glance" },
              { title: "Attendance", desc: "Clear status with predictions" },
              { title: "Marks", desc: "Track performance over time" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="panel rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-300 hover-glow"
              >
                <div className="font-semibold text-lg" style={{color:"var(--text-primary)"}}>{feature.title}</div>
                <div className="text-sm mt-1" style={{color:"var(--muted)"}}>{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side mockup */}
        <div className="flex-1 relative">
          <div className="panel rounded-3xl p-6 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
            {/* Mockup preview */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b apply-border-sm pb-2">
                <h3 className="font-semibold" style={{color:"var(--text-primary)"}}>Dashboard</h3>
                <div className="w-3 h-3 rounded-full" style={{background:"var(--accent-secondary)", boxShadow:"0 0 1rem rgba(34,211,238,0.2)"}}></div>
              </div>

            <div className="flex justify-between p-3 rounded-xl apply-border-sm bg-white/10">
                <span className="text-sm" style={{color:"var(--text-secondary)"}}>Attendance</span>
                <span className="font-semibold" style={{color:"var(--success)"}}>85%</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl apply-border-sm bg-white/10">
                  <div className="text-xs" style={{color:"var(--muted)"}}>9:00 AM</div>
                  <div className="font-medium text-sm" style={{color:"var(--text-primary)"}}>Data Structures</div>
                </div>
                <div className="p-3 rounded-xl apply-border-sm bg-white/10">
                  <div className="text-xs" style={{color:"var(--muted)"}}>11:00 AM</div>
                  <div className="font-medium text-sm" style={{color:"var(--text-primary)"}}>Web Development</div>
                </div>
              </div>
            </div>

            {/* Glow behind mockup */}
            <div className="absolute -inset-4 rounded-3xl blur-2xl -z-10" style={{background:"rgba(124,58,237,0.2)"}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
