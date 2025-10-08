"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Eye, EyeOff, Mail, Lock, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/zustand";
import { validatePassword, validateUser } from "@/server/action";
import { Loader } from "../app/components/loader";

export const LoginComponent = () => {
  const [eyeOpen, setEyeOpen] = useState(false);
  const { error, setError, loading, setLoading, setEmail, email } = useAuth();

  // Determine the current step (1: Email, 2: Password)
  const isEmailStep = email?.digest.length === 0;
  const currentStep = isEmailStep ? 1 : 2;

  useEffect(() => {
    window.localStorage.clear();
  }, []);

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData(e.currentTarget);
      const hash1 = form.get("name") as string;
      const hash2 = form.get("password") as string;

      // --- Step 1: Email Validation ---
      if (isEmailStep) {
        if (!hash1 || hash1.length === 0) {
          setError("Please enter your SRM Mail ID.");
          setLoading(false);
          return;
        }

        const emailInput = hash1.includes("@srmist.edu.in")
          ? hash1
          : `${hash1}@srmist.edu.in`;

        const { res } = await validateUser(emailInput.toLowerCase());

        if (res.data?.status_code === 400 || res.data?.status_code === 500 || res.error) {
          setError(String(res.data?.message || res.errorReason || "Invalid credentials"));
        } else if (res.data?.digest && res.data?.identifier) {
          setEmail({
            mail: emailInput.toLowerCase(),
            digest: res.data.digest as string,
            identifier: res.data.identifier as string,
          });
        } else {
          setError("Invalid response from server");
        }
      } 
      // --- Step 2: Password Validation ---
      else {
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
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative flex-1 flex items-center justify-center px-4 lg:px-0 min-h-screen overflow-hidden pt-12" 
      style={{background:"var(--bg-primary)"}}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-15%] w-[32rem] h-[32rem] rounded-full blur-[150px] opacity-25" style={{background:"radial-gradient(circle, var(--accent-secondary), transparent 60%)"}}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[36rem] h-[36rem] rounded-full blur-[170px] opacity-20" style={{background:"radial-gradient(circle, var(--accent-primary), transparent 60%)"}}></div>
      </div>

      <div className="relative w-full max-w-lg mx-auto p-1 border border-transparent rounded-3xl z-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500">
        <div className="p-6 sm:p-8 md:p-10 rounded-[1.4rem] panel border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 rounded-[1.4rem] pointer-events-none transition-all duration-500" style={{ boxShadow: `0 0 50px rgba(124, 58, 237, 0.4), inset 0 0 10px rgba(0, 114, 255, 0.2)` }}></div>

          <div className="relative text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2 sm:mb-3 text-2xl sm:text-3xl font-bold" style={{color:"var(--text-primary)"}}>
              <CheckCircle size={28} className="sm:w-8 sm:h-8" style={{ color: 'var(--accent-primary)' }} />
              <span>Acadia OS</span>
            </div>
            <h1 className="text-lg sm:text-xl font-medium" style={{color:"var(--text-secondary)"}}>Secure Academic Portal Access</h1>
          </div>

          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors duration-300 ${currentStep >= 1 ? 'btn-accent text-white' : 'bg-white/10 text-[color:var(--text-secondary)]'}`}>1</span>
              <div className={`w-10 sm:w-12 h-0.5 transition-colors duration-300 ${currentStep > 1 ? 'bg-white/30' : 'bg-white/10'}`}></div>
              <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors duration-300 ${currentStep === 2 ? 'btn-accent text-white' : 'bg-white/10 text-[color:var(--text-secondary)]'}`}>2</span>
            </div>
          </div>

          <form onSubmit={HandleSubmit} className="relative flex flex-col gap-4 sm:gap-6 z-10">
            <div className="relative w-full">
              {isEmailStep && (
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{color:"var(--text-secondary)"}} />
                  <input id="name" name="name" type="text" placeholder="SRM Mail ID" autoComplete="email" required disabled={loading} className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3 rounded-xl bg-white/5 border border-white/20 text-[color:var(--text-primary)] placeholder-[color:var(--text-secondary)] outline-none transition-all duration-300 focus:border-[color:var(--accent-primary)] focus:ring-1 focus:ring-[color:var(--accent-primary)] text-sm sm:text-base" />
                </div>
              )}

              {!isEmailStep && (
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{color:"var(--text-secondary)"}} />
                  <input id="password" name="password" type={eyeOpen ? "text" : "password"} placeholder="Password" autoComplete="current-password" required disabled={loading} className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3 rounded-xl bg-white/5 border border-white/20 text-[color:var(--text-primary)] placeholder-[color:var(--text-secondary)] outline-none transition-all duration-300 focus:border-[color:var(--accent-primary)] focus:ring-1 focus:ring-[color:var(--accent-primary)] text-sm sm:text-base" />
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:text-white transition-colors" style={{color:"var(--text-secondary)"}}>
                    {eyeOpen ? <Eye onClick={() => setEyeOpen(false)} className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff onClick={() => setEyeOpen(true)} className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                </div>
              )}
            </div>

            {!isEmailStep && (
              <div className="text-xs sm:text-sm text-center -mt-2 sm:-mt-4" style={{color:"var(--text-secondary)"}}>
                Authenticating for: <span className="font-semibold text-white">{email.mail}</span>
                <button type="button" onClick={() => setEmail({ mail: '', digest: '', identifier: '' })} className="ml-2 text-xs text-red-400 hover:text-red-300 underline">
                  (Change)
                </button>
              </div>
            )}

            {error && <div className="text-red-400 text-xs sm:text-sm font-medium border border-red-500/30 bg-red-500/10 p-2 sm:p-3 rounded-lg text-center">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-3 sm:py-3 rounded-xl font-bold text-white shadow-xl shadow-black/50 transition-all duration-300 flex items-center justify-center space-x-2 btn-accent hover-glow hover:scale-[1.01] disabled:opacity-60 text-sm sm:text-base">
              {loading ? <Loader className="w-4 h-4 sm:w-5 sm:h-5" /> : (isEmailStep ? "Continue" : "Login Securely")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
