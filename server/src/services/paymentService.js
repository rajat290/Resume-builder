import crypto from "crypto";
import Razorpay from "razorpay";
import { env } from "../config/env.js";

const razorpay =
  env.razorpayKeyId && env.razorpayKeySecret
    ? new Razorpay({
        key_id: env.razorpayKeyId,
        key_secret: env.razorpayKeySecret
      })
    : null;

export async function createPaymentOrder({ amount, receipt, notes }) {
  if (!razorpay) {
    throw new Error("Razorpay is not configured.");
  }

  return razorpay.orders.create({
    amount,
    currency: "INR",
    receipt,
    notes
  });
}

export function verifyWebhookSignature(rawBody, signature) {
  if (!env.razorpayWebhookSecret) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
}
