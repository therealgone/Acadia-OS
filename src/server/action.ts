"use server";
import { redirect } from "next/navigation";
import {
  getAttendance,
  getCalendar,
  getCourse,
  getMarks,
  getTimetable,
  getUserInfo,
  PasswordInput,
  verifyPassword,
  verifyUser,
  logoutUser,
  getDayOrder,
} from "@/SRM-SCRAPPER";


export async function validateUser(email: string) {
  const res = await verifyUser(email);
  return { res };
}

export async function validatePassword({
  digest,
  identifier,
  password,
}: PasswordInput) {
  const res = await verifyPassword(identifier, digest, password);
  return { res };
}

export async function getLogout(cookie: string) {
  const res = await logoutUser(cookie);
  return { res };
}

export async function timetable(cookie: string) {
  const data = await getTimetable(cookie);
  // Instead of auto logout, return error and handle it on frontend
  if (data.status === 404) return { data, error: "Session expired" };
  return { data };
}

export async function attendance(cookie: string) {
  const data = await getAttendance(cookie);
  
  return { data };
}

export async function marks(cookie: string) {
  const data = await getMarks(cookie);
  
  return { data };
}

export async function Calendar(cookie: string) {
  const data = await getCalendar(cookie);
  
  return { data };
}

export async function Course(cookie: string) {
  const data = await getCourse(cookie);
  
  return { data };
}

export async function userInfo(cookie: string) {
  const data = await getUserInfo(cookie);
  
  return { data };
}

export async function dayOrder(cookie: string) {
  const data = await getDayOrder(cookie);
  
  return { data };
}
