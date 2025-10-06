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
  xMinConsecutiveToReachR: number | null; // null when impossible (R==100 and A<T)
  mMaxSkipsAllowed: number; // never negative in display, clamp to 0
  kMinAttendOutOfN: number | null; // null when impossible in window
  windowSize: number; // N used
  messages: string[];
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

  const messages: string[] = [];

  const currentPctRaw = toPct(A, T);
  const currentPct = roundPct(currentPctRaw);

  const pctIfAttendNext = roundPct(toPct(A + 1, T + 1));
  const pctIfSkipNext = roundPct(toPct(A, T + 1));

  let xMin: number | null;
  if (R === 100) {
    // Only possible if A==T
    if (A === T) {
      xMin = 0;
    } else {
      xMin = null;
      messages.push(
        "Impossible to reach 100% because you have already missed classes."
      );
    }
  } else {
    const numerator = R * T - 100 * A;
    const denom = 100 - R;
    const value = Math.max(0, numerator / denom);
    xMin = Math.ceil(value);
  }

  let mMax: number;
  if (R === 0) {
    // If required is 0, can skip arbitrarily; bound by math with large value
    mMax = Number.MAX_SAFE_INTEGER;
  } else {
    const value = (100 * A - R * T) / R;
    const floored = Math.floor(Math.max(-1, value));
    mMax = Math.max(0, floored);
  }

  // k_min over next N
  let kMin: number | null;
  const needed = (R / 100) * (T + N) - A;
  const kVal = Math.ceil(Math.max(0, needed));
  if (kVal > N) {
    kMin = null;
    messages.push("Impossible to reach required percentage in this window.");
  } else {
    kMin = kVal;
  }

  if (T === 0) {
    messages.push("No classes held yet — add classes in schedule.");
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
  };
}



