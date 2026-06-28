import { quotaForIp, reserveConversion } from "../services/conversion-limit.js";

export function conversionLimit(req, res, next) {
  let reservation;

  try {
    reservation = reserveConversion(req.ip);
  } catch (error) {
    const quota = quotaForIp(req.ip);
    error.quota = quota;
    res.setHeader("X-RateLimit-Limit", quota.limit);
    res.setHeader("X-RateLimit-Remaining", quota.remaining);
    res.setHeader("X-RateLimit-Reset", quota.resetAt);
    next(error);
    return;
  }

  req.conversionReservation = reservation;
  res.once("finish", () => reservation.release());
  next();
}

export function commitConversion(req, res) {
  const quota = req.conversionReservation.commit();
  res.setHeader("X-RateLimit-Limit", quota.limit);
  res.setHeader("X-RateLimit-Remaining", quota.remaining);
  res.setHeader("X-RateLimit-Reset", quota.resetAt);
  return quota;
}
