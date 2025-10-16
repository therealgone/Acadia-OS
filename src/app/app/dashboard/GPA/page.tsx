"use client";
export const dynamic = "force-static";


import React, { useState, useCallback, useMemo } from 'react';
import { GraduationCap, Plus, Trash2, Calculator, RotateCcw, TrendingUp, Award, BarChart3, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
interface Course {
  id: number;
  credits: number | '';
  grade: Grade;
}

interface GradePoints {
  [key: string]: number;
}

type Grade = 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F' ;

const GRADE_POINTS: GradePoints = {
  "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6,
  "C": 5.5,"F": 0,
};

const ALL_GRADES: Grade[] = (Object.keys(GRADE_POINTS) as Grade[]);

const INITIAL_COURSES: Course[] = [
  { id: 1, credits: 4, grade: 'O' },
  { id: 2, credits: 4, grade: 'O' },
  { id: 3, credits: 4, grade: 'O' },
  { id: 4, credits: 4, grade: 'O' },
];

function calculateGpa(courses: Course[]) {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    const credit = Number(course.credits);
    if (credit > 0 && GRADE_POINTS[course.grade] > 0) {
      const gradePoint = GRADE_POINTS[course.grade];
      totalPoints += credit * gradePoint;
      totalCredits += credit;
    }
  }

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  const percent = Math.min(100, Math.max(0, gpa * 10));

  return {
    gpa: gpa.toFixed(2),
    percent: percent.toFixed(0),
  };
}

const GpaCalculator: React.FC = React.memo(() => {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [showResult, setShowResult] = useState(false);
  const [nextId, setNextId] = useState(INITIAL_COURSES.length + 1);

  const { gpa, percent } = useMemo(() => calculateGpa(courses), [courses]);

  const handleCourseChange = useCallback((id: number, field: keyof Omit<Course, 'id'>, value: string | number) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
    setShowResult(false);
  }, []);

  const addCourse = useCallback(() => {
    setCourses(prevCourses => [
      ...prevCourses,
      { id: nextId, credits: 4, grade: 'A' },
    ]);
    setNextId(prevId => prevId + 1);
    setShowResult(false);
  }, [nextId]);

  const removeCourse = useCallback((id: number) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
    setShowResult(false);
  }, []);

  const handleCalculate = useCallback(() => {
    if (courses.some(c => Number(c.credits) > 0)) {
      setShowResult(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [courses]);

  const handleReset = useCallback(() => {
    setCourses(INITIAL_COURSES);
    setNextId(INITIAL_COURSES.length + 1);
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const gradeColors: Record<Grade, string> = {
'O': 'bg-[#1E3A8A]',   // Dark Blue – excellent
'A+': 'bg-[#3B82F6]',  // Bright Blue
'A': 'bg-[#10B981]',   // Vibrant Green
'B+': 'bg-[#22C55E]',  // Slightly softer green
'B': 'bg-[#FACC15]',   // Yellow – warning starts
'C': 'bg-[#F97316]',   // Orange – lower grade
'F': 'bg-[#EF4444]',   // Red – failing
    
    
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-5 scrollbar-none">
      {/* Back Button */}
      <Link className="btn px-2 py-2 flex items-center gap-2 text-white/70 hover:text-white transition-colors w-fit"
      href="/app/dashboard">
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl panel flex items-center justify-center">
          <GraduationCap size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold">GPA Calculator</h2>
          <p className="text-sm text-white/60">Calculate your semester GPA</p>
        </div>
      </div>

      {/* Result Section */}
      {showResult && (
        <div className="panel p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl panel flex items-center justify-center">
              <Award size={20} />
            </div>
            <h3 className="text-lg font-bold">Your Results</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="panel p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} />
                <p className="text-xs text-white/60">GPA Score</p>
              </div>
              <p className="text-3xl font-extrabold">{gpa}</p>
              <p className="text-xs text-white/50 mt-1">out of 10.0</p>
            </div>

            <div className="panel p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={18} />
                <p className="text-xs text-white/60">Percentage</p>
              </div>
              <p className="text-3xl font-extrabold">{percent}%</p>
              <p className="text-xs text-white/50 mt-1">equivalent score</p>
            </div>
          </div>

          <div className="w-full rounded-full h-3 overflow-hidden bg-[rgba(255,255,255,0.08)]">
            <div
              className="h-3 transition-all duration-700 ease-out bg-[#1eff00]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Course Table */}
      <div className=" p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={20} />
          <h3 className="font-bold">Course Details</h3>
        </div>

        <div className="space-y-3">
          {courses.map((course, index) => (
            <div key={course.id} className="panel p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <span className="font-bold text-white/80 w-20">Course {index + 1}</span>
              
              <div className="flex-1 flex flex-col md:flex-row gap-3 w-full">
                <div className="flex-1">
                  <label className="text-xs text-white/60 mb-1 block">Credits</label>
                 <input
  type="number"
  min="1"
  max="6"
  value={course.credits}
  onChange={(e) => handleCourseChange(course.id, 'credits', parseInt(e.target.value) || '')}
  className="
    w-full
    md:w-full
    px-4
    py-3
    text-white
    text-center
    md:text-left
    bg-[rgba(255,255,255,0.05)]
    border
    border-[rgba(255,255,255,0.1)]
    rounded-lg
    outline-none
    placeholder:text-white/40
    transition-all
    focus:border-white/50
    focus:bg-[rgba(255,255,255,0.1)]
    focus:shadow-[0_0_10px_rgba(255,255,255,0.2)]
    sm:text-base
    text-sm
  "
/>
                </div>

                <div className="flex-1">
                  <label className="text-xs text-white/60 mb-1 block">Grade</label>
                <select
  className={`
    w-full
    md:w-full
    px-4
    py-3
    text-white
    text-center
    md:text-left
    ${gradeColors[course.grade]}
    border border-[rgba(255,255,255,0.1)]
    rounded-lg
    font-bold
    outline-none
    cursor-pointer
    transition-all
    focus:border-white/50
    focus:shadow-[0_0_10px_rgba(255,255,255,0.2)]
    sm:text-base
    text-sm
    appearance-none
  `}
  value={course.grade}
  onChange={(e) => handleCourseChange(course.id, 'grade', e.target.value as Grade)}
>
  {ALL_GRADES.map(grade => (
    <option
      key={grade}
      value={grade}
      className=" text-white text-center flex justify-center items-center bg-[#1F2937]"
    >
      {grade}
    </option>
  ))}
</select>

                </div>

                <button
                  className="px-3 py-2 text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-all self-end md:self-center"
                  onClick={() => removeCourse(course.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button 
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl panel hover:scale-[1.02] transition-transform font-bold"
          onClick={addCourse}
        >
          <Plus size={18} />
          Add Course
        </button>
        
        <button 
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            showResult 
              ? 'bg-[rgba(255,255,255,0.1)] text-white/40 cursor-not-allowed' 
              : 'bg-[#EF4444] hover:scale-[1.02] shadow-[0_0_20px_rgba(239,68,68,0.4)]'
          }`}
          onClick={handleCalculate}
          disabled={showResult}
        >
          <Calculator size={18} />
          Calculate GPA
        </button>
        
        <button 
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl panel hover:scale-[1.02] transition-transform font-bold"
          onClick={handleReset}
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>
    </div>
  );
});

export default GpaCalculator;