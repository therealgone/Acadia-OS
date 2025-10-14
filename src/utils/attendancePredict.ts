export type PredictInputs = {
  attended: number; // A
  total: number; // T
  requiredPercentage: number; // R in 0..100
  windowSize?: number; // N
  upcomingClasses?: number; // Number of future classes for prediction
};

export type PredictResults = {
  currentPct: number;
  pctIfAttendNext: number;
  pctIfSkipNext: number;
  xMinConsecutiveToReachR: number | null;
  mMaxSkipsAllowed: number;
  kMinAttendOutOfN: number | null;
  windowSize: number;
  messages: string[];
  crt: {
    classesToReachTarget: number | null; // How many classes you must attend to reach R
    classesCanSkipBeforeDrop: number | null; // How many classes you can skip without dropping below R
    targetReached: boolean; // True if current % >= R
    predictedPctAfterScenario: number; // Predicted % after attending or skipping all upcoming classes
  };
};

function toPct(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}

function roundPct(value: number): number {
  return Math.round(value * 100) / 100; // two decimals
}

export function computePredict(inputs: PredictInputs): PredictResults {
  const A = Math.max(0, Math.floor(inputs.attended || 0));
  const T = Math.max(0, Math.floor(inputs.total || 0));
  const R = Math.min(100, Math.max(0, inputs.requiredPercentage || 0));
  const N = Math.max(0, Math.floor(inputs.windowSize ?? 10));
  const upcoming = Math.max(0, Math.floor(inputs.upcomingClasses ?? 1));

  const messages: string[] = [];

  const currentPct = roundPct(toPct(A, T));
  const pctIfAttendNext = roundPct(toPct(A + upcoming, T + upcoming));
  const pctIfSkipNext = roundPct(toPct(A, T + upcoming));

  // --- Original Logic ---
  let xMin: number | null;
  if (R === 100) {
    if (A === T) xMin = 0;
    else {
      xMin = null;
      messages.push("Impossible to reach 100% because you already missed classes.");
    }
  } else {
    const numerator = R * T - 100 * A;
    const denom = 100 - R;
    xMin = numerator <= 0 ? 0 : Math.ceil(numerator / denom);
  }

  let mMax: number;
  if (R === 0) mMax = Number.MAX_SAFE_INTEGER;
  else {
    const val = (100 * A - R * T) / R;
    mMax = Math.max(0, Math.floor(val));
  }

  let kMin: number | null;
  const needed = (R / 100) * (T + N) - A;
  kMin = needed > N ? null : Math.ceil(Math.max(0, needed));
  if (kMin === null) messages.push("Impossible to reach required percentage in this window.");

  if (T === 0) messages.push("No classes held yet — add classes in schedule.");

  // --- CRT Logic (Fixed for multiple classes) ---
  let classesToReachTarget: number | null = null;
  let classesCanSkipBeforeDrop: number | null = null;
  let targetReached = false;

  // Classes needed to reach target
  const diff = R - currentPct;
  if (diff <= 0) {
    targetReached = true;
    classesToReachTarget = 0;
  } else if (R === 100 && A < T) {
    classesToReachTarget = null;
  } else {
    classesToReachTarget = Math.ceil(((R / 100) * T - A) / (1 - R / 100));
  }

  // Classes you can skip before dropping below target
  if (currentPct < R) classesCanSkipBeforeDrop = 0;
  else classesCanSkipBeforeDrop = Math.floor((A - (R / 100) * T) / (R / 100));

  return {
    currentPct,
    pctIfAttendNext,
    pctIfSkipNext,
    xMinConsecutiveToReachR: xMin,
    mMaxSkipsAllowed: mMax,
    kMinAttendOutOfN: kMin,
    windowSize: N,
    messages,
    crt: {
      classesToReachTarget,
      classesCanSkipBeforeDrop,
      targetReached,
      predictedPctAfterScenario: scenario === "Assume Present" ? pctIfAttendNext : pctIfSkipNext,
    },
  };
}