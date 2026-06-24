import { Queue, Worker } from "bullmq";
import redis from "../config/redis";
import { env } from "../config/env";

export type EmailJobData = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export const EMAIL_QUEUE = "inkspire:emails";

export const emailQueue = new Queue<EmailJobData>(EMAIL_QUEUE, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

export function startEmailWorker() {
  if (!env.RESEND_API_KEY) {
    console.warn("⚠️  RESEND_API_KEY not set — email worker disabled");
    return;
  }

  const worker = new Worker<EmailJobData>(
    EMAIL_QUEUE,
    async (job) => {
      const { Resend } = await import("resend");
      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: job.data.from ?? env.EMAIL_FROM,
        to: job.data.to,
        subject: job.data.subject,
        html: job.data.html,
      });
      console.log(`📧 Email sent: "${job.data.subject}" → ${job.data.to}`);
    },
    { connection: redis, concurrency: 5 },
  );

  worker.on("failed", (job, err) => {
    console.error(`❌ Email job ${job?.id} failed:`, err.message);
  });

  console.log("✅ Email worker started");
  return worker;
}

export async function sendEmail(data: EmailJobData) {
  return emailQueue.add("send", data);
}
