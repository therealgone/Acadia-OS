"use client";
export const dynamic = "force-static";


import { useEffect, useState } from "react";
import { Calculator, Target, TrendingUp, ArrowLeft, Award } from "lucide-react";
import Link from "next/link";
import React from "react";
export default React.memo(function Calculation() {
  const [internal, setInternal] = useState<number>(0);
  const [pass, setPass] = useState<number>(0);
  const [grade, setGrade] = useState<number>(0);
  const [predict, setPredict] = useState<number>(0);
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  useEffect(() => {
    const req = Number(50 - internal);
    const passmark = Number((req / 40) * 75);
    const predictreq = Math.abs(grade - internal);
    const predictpassmark = Number((predictreq / 40) * 75);
    setPass(passmark);
    setPredict(predictpassmark);
  }, [internal, grade]);

  const handleGradeClick = (gradeValue: number, gradeName: string) => {
    setGrade(gradeValue);
    setSelectedGrade(gradeName);
  };

  const gradeButtons = [
    { name: "O", value: 92 },
    { name: "A+", value: 82 },
    { name: "A", value: 72 },
    { name: "B+", value: 62 },
    { name: "B", value: 57 },
    { name: "C", value: 51 },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 p-5 scrollbar-none">
      {/* Back Button */}
      <Link className="flex btn px-2 py-2 items-center gap-2 text-white/70 hover:text-white transition-colors w-fit
        "  
        href="/app/dashboard">
        <ArrowLeft size={20} />
        <span className="font-medium ">Back</span>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl panel flex items-center justify-center">
          <Calculator size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold">Mark Calculator</h2>
          <p className="text-sm text-white/60">Calculate required external marks to pass or target grade</p>
        </div>
      </div>

      {/* Internal Mark Input */}
      <div className="panel p-5">
        <label className="flex items-center gap-2 text-sm font-bold mb-3">
          <Target size={16} />
          Internal Mark (out of 60)
        </label>
        <input
          type="number"
          placeholder="Enter your internal marks (0-60)"
          value={internal || ""}
          onChange={(e) => setInternal(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] outline-none transition-all duration-300 focus:border-white/30 text-white placeholder:text-white/40"
          min="0"
          max="60"
        />
        {internal > 60 && (
          <p className="text-xs text-[#EF4444] mt-2">Internal marks cannot exceed 60</p>
        )}
      </div>

      {/* Pass Mark Result */}
      {internal > 0 && (
        <div className="panel p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg panel flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/60">Required to Pass (50%)</p>
              <p className="text-sm font-bold">External marks needed out of 75</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white/70">You need:</span>
            <span className={`text-3xl font-extrabold ${pass > 75 ? "text-[#EF4444]" : "text-[#10B981]"}`}>
              {pass > 75 ? "Can't Pass" : `${pass.toFixed(1)} / 75`}
            </span>
          </div>
          
          {pass <= 75 && (
            <div className="w-full rounded-full h-2 overflow-hidden bg-[rgba(255,255,255,0.08)]">
              <div 
                className="h-2 transition-all duration-700 ease-out bg-[#10B981]" 
                style={{ width: `${(pass / 75) * 100}%` }}
              />
            </div>
          )}
          
          {pass > 75 && (
            <div className="mt-3 p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)]">
              <p className="text-xs text-[#EF4444]">
                ⚠️ With {internal} internal marks, passing is not possible even with full external marks
              </p>
            </div>
          )}
        </div>
      )}

      {/* Grade Selection */}
      <div className="panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award size={18} />
          <label className="text-sm font-bold">Target a Specific Grade</label>
        </div>
        <p className="text-xs text-white/60 mb-3">Select your desired grade to see required external marks</p>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {gradeButtons.map((gradeBtn) => (
            <button
              key={gradeBtn.name}
              onClick={() => handleGradeClick(gradeBtn.value, gradeBtn.name)}
              className={`relative px-4 py-3 rounded-xl border-2 transition-all duration-300 font-extrabold text-lg ${
                selectedGrade === gradeBtn.name
                  ? "bg-[#EF4444] text-white border-[#EF4444] scale-105 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] hover:scale-105"
              }`}
            >
              {gradeBtn.name}
              {selectedGrade === gradeBtn.name && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grade Prediction Result */}
      {selectedGrade && internal > 0 && (
        <div className={`panel p-5 ${predict > 75 ? "panel-red" : ""}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-lg ${predict > 75 ? "bg-[rgba(239,68,68,0.2)]" : "panel"} flex items-center justify-center`}>
              <Award size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/60">Target Grade: {selectedGrade}</p>
              <p className="text-sm font-bold">External marks needed out of 75</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white/70">You need:</span>
            <span className={`text-3xl font-extrabold ${predict > 75 ? "text-[#EF4444]" : "text-[#10B981]"}`}>
              {predict > 75 ? "Not Possible" : `${predict.toFixed(1)} / 75`}
            </span>
          </div>
          
          {predict <= 75 ? (
            <>
              <div className="w-full rounded-full h-2 overflow-hidden bg-[rgba(255,255,255,0.08)]">
                <div 
                  className="h-2 transition-all duration-700 ease-out bg-[#10B981]" 
                  style={{ width: `${(predict / 75) * 100}%` }}
                />
              </div>
              <div className="mt-3 p-3 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)]">
                <p className="text-xs text-[#10B981]">
                  ✓ Grade {selectedGrade} is achievable! Score {predict.toFixed(1)} or more in externals.
                </p>
              </div>
            </>
          ) : (
            <div className="mt-3 p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)]">
              <p className="text-xs text-[#EF4444]">
                ⚠️ With {internal} internal marks, achieving grade {selectedGrade} is not possible
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info Card */}
      {internal === 0 && (
        <div className="panel p-5 text-center">
          <Calculator size={32} className="mx-auto mb-3 text-white/40" />
          <p className="text-sm text-white/70 mb-1">Enter your internal marks to get started</p>
          <p className="text-xs text-white/50">Then select a target grade to see what you need in externals</p>
        </div>
      )}
    </div>
  );
})