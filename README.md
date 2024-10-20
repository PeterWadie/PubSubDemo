# PubSubDemo

A simple demonstration of the **Message-based Architecture: Pub/Sub** pattern using **Node.js**, **Express**, **Redis**, **BullMQ**, and **Bull Board**. This project illustrates how a publisher and a subscriber can communicate through a Redis-backed message queue system. The publisher sends tasks (messages) to the message queue, while the subscriber processes the tasks and sends the result back through a response queue. Additionally, Bull Board provides a web-based interface for monitoring both queues in real-time.

## Features

- **Message Queue**: Publisher adds jobs to a Redis-backed queue (via **BullMQ**).
- **Response Queue**: Subscriber processes jobs and sends completion notifications back to the publisher.
- **Bull Board**: Web interface to monitor and visualize the status of jobs and queues.
- **Progress Tracking**: Job progress updates every 3 seconds, showing 25%, 50%, 75%, and 100% progress over 12 seconds.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Windows](#windows)
  - [Linux / macOS](#linux--macos)
- [Running the Project](#running-the-project)
- [Bull Board Monitoring](#bull-board-monitoring)
- [License](#license)

## Project Structure

```bash
.
├── publisher.js           # Publisher logic to send tasks and handle response queue
├── subscriber.js          # Subscriber logic to process tasks and send responses
├── package.json           # Project dependencies and metadata
├── .gitignore             # Git ignore file to exclude node_modules
└── README.md              # Documentation for the project
```

## Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Redis** (v5 or higher)

### Installing Node.js and Redis

- **Node.js**: Download from [nodejs.org](https://nodejs.org/).
- **Redis**: Instructions below for different platforms.

### Windows

#### Install Redis
1. Download Redis for Windows from [Microsoft's Redis Releases](https://github.com/microsoftarchive/redis/releases).
2. Extract and run `redis-server.exe`.

Alternatively, you can use **Windows Subsystem for Linux (WSL)** to install Redis:
1. Install WSL on your Windows machine (requires Windows 10 or higher).
2. Install Redis:
   ```bash
   sudo apt-get update
   sudo apt-get install redis-server
   ```
3. Start Redis:
   ```bash
   redis-server
   ```

#### Install Node.js
1. Download and install Node.js from [https://nodejs.org/](https://nodejs.org/).

### Linux / macOS

#### Install Redis
1. **Linux**:
   ```bash
   sudo apt update
   sudo apt install redis-server
   ```
2. **macOS** (via Homebrew):
   ```bash
   brew install redis
   ```

3. Start the Redis server:
   ```bash
   redis-server
   ```

#### Install Node.js
1. **Linux**:
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```
2. **macOS** (via Homebrew):
   ```bash
   brew install node
   ```

### Clone and Install Dependencies

1. Clone the repository:

   ```bash
   git clone https://github.com/PeterWadie/PubSubDemo.git
   cd PubSubDemo
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

## Running the Project

### Step 1: Start Redis

Ensure the Redis server is running:

```bash
redis-server
```

### Step 2: Run the Publisher

In one terminal window, start the **Publisher**:

```bash
node publisher.js
```

The **Publisher** service will be running at `http://localhost:3000`. Bull Board will be accessible at `http://localhost:3000/admin`.

### Step 3: Run the Subscriber

In another terminal window, start the **Subscriber**:

```bash
node subscriber.js
```

The **Subscriber** will start processing jobs from the **message queue** and will send completion notifications to the **response queue**.

### Step 4: Publish Jobs

You can add jobs to the **message queue** by navigating to the following URL in your browser:

```bash
http://localhost:3000/publish/<YourMessage>
```

For example, to publish a job with the message "HelloWorld", visit:

```bash
http://localhost:3000/publish/HelloWorld
```

### Step 5: Monitor Progress

As the **subscriber** processes jobs, you can observe the job's progress in the terminal where the **subscriber** is running. The job will update its progress every 3 seconds (25%, 50%, 75%, 100%).

## Bull Board Monitoring

Bull Board provides a web-based UI for monitoring jobs in the **message queue** and the **response queue**. To access the Bull Board:

1. Open your browser and navigate to:

   ```bash
   http://localhost:3000/admin
   ```

2. You will see two queues:
   - **messageQueue**: This is where new jobs are published by the **publisher**.
   - **responseQueue**: This queue contains job completion notifications from the **subscriber**.

Bull Board updates every 3 seconds, showing job statuses and progress.
