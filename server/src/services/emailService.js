import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.emailHost,
      port: env.emailPort,
      secure: false,
      auth: {
        user: env.emailUser,
        pass: env.emailPass
      }
    });
  }

  return transporter;
}

export async function sendResumeEmail({ to, subject, html, text }) {
  if (!env.emailHost || !env.emailUser || !env.emailPass) {
    throw new Error("Email service is not configured.");
  }

  return getTransporter().sendMail({
    from: env.emailFrom,
    to,
    subject,
    html,
    text
  });
}
