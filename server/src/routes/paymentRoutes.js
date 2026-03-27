import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createPaymentOrder, verifyWebhookSignature } from "../services/paymentService.js";

const router = Router();

router.post("/order", requireAuth, async (req, res) => {
  const { amount = 49900 } = req.body;

  try {
    const order = await createPaymentOrder({
      amount,
      receipt: `resume-${Date.now()}`,
      notes: {
        userId: req.user.id,
        email: req.user.email
      }
    });

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not create order." });
  }
});

router.post("/webhook", expressRaw(), (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const rawBody = req.body.toString();

  if (!verifyWebhookSignature(rawBody, signature)) {
    return res.status(400).json({ message: "Invalid webhook signature." });
  }

  return res.json({ received: true });
});

function expressRaw() {
  return (req, _res, next) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      req.body = Buffer.concat(chunks);
      next();
    });
  };
}

export default router;
