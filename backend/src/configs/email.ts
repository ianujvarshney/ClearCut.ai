import nodemailer from "nodemailer";
import { env } from "./env";

export const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!env.SMTP_HOST) return { skipped: true, to, subject };
  return mailer.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}
