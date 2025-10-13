"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Github, Linkedin, MessageCircle, Shield, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/../public/favicon.svg";
import { useAuth } from "@/hooks/zustand"; // Assuming your Zustand auth
import { validateUser, validatePassword } from "@/server/action";
import Cookies from "js-cookie";

export const LoginComponent = () => {
  const [eyeOpen, setEyeOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const { error, setError, loading, setLoading, setEmail, email } = useAuth();
  const isEmailStep = email?.digest.length === 0;
  const currentStep = isEmailStep ? 1 : 2;

  useEffect(() => {
    window.localStorage.clear();
  }, []);

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

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");


    try {
      const form = new FormData(e.currentTarget);
      const hash1 = form.get("name") as string;
      const hash2 = form.get("password") as string;

      if (isEmailStep) {
        if (!hash1 || hash1.length === 0) {
          setError("Please enter your SRM Mail ID.");
          setLoading(false);
          return;
        }

        const emailInput = hash1.includes("@srmist.edu.in") ? hash1 : `${hash1}@srmist.edu.in`;
        const { res } = await validateUser(emailInput.toLowerCase());

        if (res.data?.status_code === 400 || res.data?.status_code === 500 || res.error) {
          setError(String(res.data?.message || res.errorReason || "Invalid credentials"));
        } else if (res.data?.digest && res.data?.identifier) {
          setEmail({
            mail: emailInput.toLowerCase(),
            digest: res.data.digest,
            identifier: res.data.identifier,
          });
        } else {
          setError("Invalid response from server");
        }
      } else {
        if (!hash2 || hash2.length === 0) {
          setError("Please enter your password.");
          setLoading(false);
          return;
        }
        if (!email.digest || !email.identifier) {
          setError("System error: Missing identity token. Please restart login.");
          setLoading(false);
          return;
        }

        const { res } = await validatePassword({
          digest: email.digest,
          identifier: email.identifier,
          password: hash2,
        });

        if (res.data?.statusCode === 500 || res.data?.captcha?.required || res.error) {
          setError(String(res.data?.message || res.errorReason || "Authentication failed"));
        } else if (res.isAuthenticated && typeof res.data?.cookies === "string") {
          Cookies.set("token", res.data.cookies, { expires: 30, path: "/" });
          Cookies.set("user", email.mail, { expires: 30, path: "/" });
          return (window.location.href = "/app/timetable");
        } else {
          setError("Authentication failed");
        }
      }
    } catch (err) {
      if (typeof err === "string" && err.includes("HIP")) {
        setError("Captcha verification is required from SRM Backend. We cannot process your request at the moment. Please try again later.")
      }
      else 
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#1c1c21] overflow-hidden px-4 sm:px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full blur-[100px] opacity-20"
          style={{
            background: "radial-gradient(circle, #7C3AED, transparent 70%)",
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
        />
        <div className="absolute -top-[15rem] -right-[15rem] w-[30rem] h-[30rem] sm:w-[50rem] sm:h-[50rem] rounded-full blur-[120px] opacity-15"
             style={{ background: "radial-gradient(circle, #22D3EE, transparent 60%)" }} />
        <div className="absolute -bottom-[10rem] -left-[10rem] w-[28rem] h-[28rem] sm:w-[45rem] sm:h-[45rem] rounded-full blur-[110px] opacity-10"
             style={{ background: "radial-gradient(circle, #EF4444, transparent 60%)" }} />
      </div>

      {/* Grid Overlay */}
      <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

      {/* Header */}
      <nav className="relative z-50 w-full py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] flex items-center justify-center">
             <Image src={Icon} alt="Acadia OS" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-white">Acadia OS</div>
              <div className="text-xs sm:text-sm text-[#A5A6AA]">Academic Portal</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
           
            <Link href="/" className="p-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300">
              Back
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex justify-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.04)] backdrop-blur-xl text-xs sm:text-sm">
              <Shield size={14} className="text-[#10B981]" />
              <span className="text-[#E1E1E3]">Secure Authentication</span>
            </div>
          </motion.div>

          <div className="p-6 sm:p-8 rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl shadow-2xl">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Welcome Back</h1>
              <p className="text-xs sm:text-sm text-[#A5A6AA]">Access your academic dashboard</p>
            </div>

            {/* Step Indicator */}
            <div className="flex justify-center items-center mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <motion.div animate={{ scale: currentStep >= 1 ? 1 : 0.9, backgroundColor: currentStep >= 1 ? "#10B981" : "rgba(255,255,255,0.1)" }} transition={{ duration: 0.3 }} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                  {currentStep > 1 ? <CheckCircle size={18} className="text-white" /> : "1"}
                </motion.div>
                <motion.div animate={{ width: currentStep > 1 ? "36px" : "28px", backgroundColor: currentStep > 1 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)" }} transition={{ duration: 0.3 }} className="h-0.5" />
                <motion.div animate={{ scale: currentStep === 2 ? 1 : 0.9, backgroundColor: currentStep === 2 ? "#10B981" : "rgba(255,255,255,0.1)" }} transition={{ duration: 0.3 }} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-white">
                  2
                </motion.div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={HandleSubmit} className="space-y-4 sm:space-y-6">
              {isEmailStep ? (
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#A5A6AA]" />
                  <input id="name" name="name" type="text" placeholder="Email" autoComplete="email" required disabled={loading} className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[#6a6b70] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 disabled:opacity-50 text-sm sm:text-base" />
                  <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-[#A5A6AA]">@srmist.edu.in</span>
                </div>
              ) : (
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#A5A6AA]" />
                  <input id="password" name="password" type={eyeOpen ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" required disabled={loading} className="w-full pl-10 sm:pl-12 pr-10 py-3 sm:py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[#6a6b70] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 disabled:opacity-50 text-sm sm:text-base" />
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:text-white transition-colors" onClick={() => setEyeOpen(!eyeOpen)}>
                    {eyeOpen ? <Eye size={18} /> : <EyeOff size={18} />}
                  </div>
                </div>
              )}

              {!isEmailStep && (
                <div className="text-xs text-center -mt-1 sm:-mt-2 text-[#A5A6AA]">
                  Authenticating: <span className="text-white font-medium">{email.mail}</span>
                  <button type="button" onClick={() => setEmail({ mail: '', digest: '', identifier: '' })} className="ml-2 text-red-400 hover:text-red-300 underline">(Change)</button>
                </div>
              )}

              {error && <div className="text-red-400 text-xs font-medium border border-red-500/30 bg-red-500/10 p-2 rounded-lg text-center">{error}</div>}

              <button type="submit" disabled={loading} className="w-full py-3 sm:py-3 rounded-xl font-semibold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" /> : "Continue"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
      <footer className="relative z-10 border-t flex items-center justify-between border-[rgba(255,255,255,0.1)] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col  items-center gap-6">
          
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
                className="p-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-300"
              >
                <MessageCircle size={18} />
                
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
