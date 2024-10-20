const express = require("express");
const { Queue, Worker } = require("bullmq");
const Redis = require("ioredis");
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const app = express();
const redisConnection = new Redis({ maxRetriesPerRequest: null });

// Main job queue (to send tasks to the subscriber)
const messageQueue = new Queue("messageQueue", { connection: redisConnection });

// Response queue (to receive completion notifications from the subscriber)
const responseQueue = new Queue("responseQueue", {
  connection: redisConnection,
});

// Bull Board setup for monitoring both message and response queues
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin");

createBullBoard({
  queues: [
    new BullMQAdapter(messageQueue), // Monitor the message queue
    new BullMQAdapter(responseQueue), // Monitor the response queue
  ],
  serverAdapter: serverAdapter,
  options: {
    ui: {
      // Set Bull Board's default polling interval to 3 seconds
      pollingInterval: 3000,
    },
  },
});

app.use("/admin", serverAdapter.getRouter());

// API to publish new jobs
app.get("/publish/:message", async (req, res) => {
  const message = req.params.message;
  // Add the message to the main job queue
  const job = await messageQueue.add("messageJob", { text: message });
  res.send(`Published message: ${message}, Job ID: ${job.id}`);
});

// Worker to listen to the response queue (for job completions)
new Worker(
  "responseQueue",
  async (job) => {
    console.log(
      `Received response for job ${job.data.jobId}: ${job.data.result}`
    );
  },
  { connection: redisConnection }
);

app.listen(3000, () => {
  console.log("Publisher service running on http://localhost:3000");
  console.log("Bull Board is running on http://localhost:3000/admin");
});
