"use client";
import { useAuth } from "@/hooks/zustand";
import { validatePassword, validateUser } from "@/server/action";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Loader } from "../app/components/loader";

export const LoginComponent = () => {
  const [eyeOpen, setEyeOpen] = useState(false);
  const { error, setError, loading, setLoading, setEmail, email } = useAuth();

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

      // Validate email
      if (hash1 && hash1.length !== 0) {
        const emailInput = hash1.includes("@srmist.edu.in")
          ? hash1
          : `${hash1}@srmist.edu.in`;
        const { res } = await validateUser(emailInput.toLowerCase());

        if (res.data?.status_code === 400 || res.data?.status_code === 500 || res.error) {
          setError(String(res.data?.message || res.errorReason || "Invalid credentials"));
          setLoading(false);
          return;
        }

        if (res.data?.digest && res.data?.identifier) {
          setEmail({
            mail: emailInput.toLowerCase(),
            digest: res.data.digest as string,
            identifier: res.data.identifier as string,
          });
          setLoading(false);
          return;
        } else {
          setError("Invalid response from server");
          setLoading(false);
          return;
        }
      }

      // Validate password
      if (hash2 && hash2.length !== 0) {
        if (!email.digest || !email.identifier) {
          setError("Please enter your email first");
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
          setLoading(false);
          return;
        }

        if (res.isAuthenticated && typeof res.data?.cookies === "string") {
          Cookies.set("token", res.data.cookies, { expires: 30, path: "/" });
          Cookies.set("user", email.mail, { expires: 30, path: "/" });
          return (window.location.href = "/app/timetable");
        } else {
          setError("Authentication failed");
          setLoading(false);
          return;
        }
      }

      setError("Please enter your credentials");
      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 lg:px-0 min-h-screen" style={{background:"var(--bg-primary)"}}>
      <div className="relative max-w-md w-full rounded-3xl panel p-8">
        <div className="flex items-center justify-center text-3xl font-bold" style={{color:"var(--text-primary)"}}>
          Login
        </div>

        <div className="w-full flex flex-col items-center mt-8">
          <form
            onSubmit={HandleSubmit}
            className="w-full flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              {/* Email Input */}
              {email?.digest.length === 0 && (
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-[color:var(--border-weak)] focus:border-white/20 focus:ring-0 text-[color:var(--text-primary)] placeholder-[color:var(--muted)] outline-none transition-all duration-300"
                  placeholder="SRM Mail ID"
                  autoComplete="email"
                  autoFocus
                  required
                />
              )}

              {/* Password Input */}
              {email?.digest.length !== 0 && (
                <div className="relative w-full">
                  <input
                    id="password"
                    name="password"
                    type={eyeOpen ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-[color:var(--border-weak)] focus:border-white/20 focus:ring-0 text-[color:var(--text-primary)] placeholder-[color:var(--muted)] outline-none transition-all duration-300"
                    placeholder="Password"
                    autoComplete="current-password"
                    autoFocus
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" style={{color:"var(--text-secondary)"}}>
                    {eyeOpen ? (
                      <Eye onClick={() => setEyeOpen(false)} className="w-6 h-6" />
                    ) : (
                      <EyeOff onClick={() => setEyeOpen(true)} className="w-6 h-6" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && <div className="text-red-400 text-sm">{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-accent font-semibold hover-glow apply-hover-scale transition-all duration-300 flex items-center justify-center"
            >
              {loading ? <Loader className="w-5 h-5" /> : "Authenticate"}
            </button>
          </form>
        </div>

        <div className="mt-6 flex justify-center">
         
        </div>
      </div>
    </div>
  );
};
