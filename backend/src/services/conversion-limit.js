import { config } from "../config.js";
import { AppError } from "../utils/errors.js";

const usageByIp = new Map();

function normalizedIp(ip) {
  return String(ip || "unknown").replace(/^::ffff:/, "");
}

function currentUsage(ip, now = Date.now()) {
  const key = normalizedIp(ip);
  let usage = usageByIp.get(key);

  if (!usage || usage.resetAt <= now) {
    usage = {
      successful: 0,
      pending: 0,
      resetAt: now + config.conversionLimitWindowMs,
    };
    usageByIp.set(key, usage);
  }

  return { key, usage };
}

export function quotaForIp(ip) {
  const { usage } = currentUsage(ip);
  return {
    limit: config.dailyConversionLimit,
    remaining: Math.max(
      config.dailyConversionLimit - usage.successful - usage.pending,
      0,
    ),
    resetAt: new Date(usage.resetAt).toISOString(),
  };
}

export function reserveConversion(ip) {
  const { key, usage } = currentUsage(ip);
  if (
    usage.successful + usage.pending >=
    config.dailyConversionLimit
  ) {
    throw new AppError(
      "You reached today’s free conversion limit. Please try again tomorrow.",
      429,
      "DAILY_CONVERSION_LIMIT_REACHED",
    );
  }

  usage.pending += 1;
  let settled = false;

  return {
    commit() {
      if (settled) return quotaForIp(key);
      settled = true;
      usage.pending = Math.max(usage.pending - 1, 0);
      usage.successful += 1;
      return quotaForIp(key);
    },
    release() {
      if (settled) return;
      settled = true;
      usage.pending = Math.max(usage.pending - 1, 0);
    },
  };
}

export function resetConversionLimits() {
  usageByIp.clear();
}

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, usage] of usageByIp.entries()) {
    if (usage.resetAt <= now && usage.pending === 0) {
      usageByIp.delete(ip);
    }
  }
}, config.conversionLimitWindowMs);
cleanupTimer.unref();
