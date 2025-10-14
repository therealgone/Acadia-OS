export type PredictInputs = {
  attended: number; // A
  total: number; // T
  requiredPercentage: number; // R in 0..100
  windowSize?: number; // N
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
    // ✅ Added CRT Info
    classesToReachTarget: number | null;
    classesCanSkipBeforeDrop: number | null;
    targetReached: boolean;
  };
};

function toPct(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}

function roundPct(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computePredict(inputs: PredictInputs): PredictResults {
  const A = Math.max(0, Math.floor(inputs.attended || 0));
  const T = Math.max(0, Math.floor(inputs.total || 0));
  const R = Math.min(100, Math.max(0, inputs.requiredPercentage || 0));
  const N = Math.max(0, Math.floor(inputs.windowSize ?? 10));

  const messages: string[] = [];

  const currentPct = roundPct(toPct(A, T));
  const pctIfAttendNext = roundPct(toPct(A + 1, T + 1));
  const pctIfSkipNext = roundPct(toPct(A, T + 1));

  // --- Existing Logic ---
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
    const value = Math.max(0, numerator / denom);
    xMin = Math.ceil(value);
  }

  let mMax: number;
  if (R === 0) mMax = Number.MAX_SAFE_INTEGER;
  else {
    const value = (100 * A - R * T) / R;
    const floored = Math.floor(Math.max(-1, value));
    mMax = Math.max(0, floored);
  }

  let kMin: number | null;
  const needed = (R / 100) * (T + N) - A;
  const kVal = Math.ceil(Math.max(0, needed));
  if (kVal > N) {
    kMin = null;
    messages.push("Impossible to reach required percentage in this window.");
  } else {
    kMin = kVal;
  }

  if (T === 0) messages.push("No classes held yet — add classes in schedule.");

  // --- ✅ New CRT Logic ---
  let classesToReachTarget: number | null = null;
  let classesCanSkipBeforeDrop: number | null = null;
  let targetReached = false;

  if (R === 100 && A < T) {
    classesToReachTarget = null;
  } else {
    const diff = R - currentPct;
    if (diff <= 0) {
      targetReached = true;
      classesToReachTarget = 0;
    } else {
      const num = R * T - 100 * A;
      const den = 100 - R;
      classesToReachTarget = Math.ceil(num / den);
    }
  }

  // how many you can skip before going below target
  if (currentPct <= R) {
    classesCanSkipBeforeDrop = 0;
  } else {
    const val = (100 * A - R * T) / R;
    classesCanSkipBeforeDrop = Math.floor(val >= 0 ? val : 0);
  }

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
    },
  };
}