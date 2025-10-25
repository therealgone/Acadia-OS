const parseTimeToDate = (timeStr: string) => {
  // timeStr: "08:00 AM"
  const [time, modifier] = timeStr.split(" ");
  let hours;
  const [h, minutesRaw] = time.split(":").map(Number);
  hours = h;
  const minutes = minutesRaw;

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
    0
  );
};

const parseTimeRange = (timeRange: string) => {
  const [start, end] = timeRange.split(" - ");
  return { start: parseTimeToDate(start), end: parseTimeToDate(end) };
};

export const isCurrentClass = (timeRange: string) => {
  const now = new Date();
  const { start, end } = parseTimeRange(timeRange);
  const isCurrent = now >= start && now <= end;
  
  // Only log if it's actually a current class to reduce console spam
  if (isCurrent) {
    console.log("Current class detected:", {
      timeRange,
      now: now.toLocaleTimeString(),
      start: start.toLocaleTimeString(),
      end: end.toLocaleTimeString()
    });
  }
  
  return isCurrent;
};
