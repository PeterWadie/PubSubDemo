const { Worker, Queue } = require("bullmq");
const Redis = require("ioredis");

// Redis connection
const redisConnection = new Redis({ maxRetriesPerRequest: null });

// Response queue (to send job completion notifications to the publisher)
const responseQueue = new Queue("responseQueue", {
  connection: redisConnection,
});

// Main job queue (to receive tasks from the publisher)
new Worker(
  "messageQueue",
  async (job) => {
    console.log(`Job received: ${job.id} with data: ${job.data.text}`);
    // Simulate a long-running task
    for (let i = 1; i <= 4; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const progress = i * 25;
      await job.updateProgress(progress);
      console.log(`Job ${job.id} progress: ${progress}%`);
    }
    console.log(`Job completed: ${job.id}`);
    // Add the completion response to the response queue
    await responseQueue.add("response", {
      jobId: job.id,
      result: `Processed message: ${job.data.text}`,
    });
  },
  { connection: redisConnection }
);
