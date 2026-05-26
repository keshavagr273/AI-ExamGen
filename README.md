# 🚀 VedaAI - AI Assessment Creator

## 📌 Overview
An AI-powered assessment creator designed to help teachers quickly generate structured question papers. Built with Next.js, Express, BullMQ, and MongoDB, this platform features real-time WebSocket updates, robust background AI generation, and a polished, printable output layout based precisely on the provided Figma designs.

## ✨ Architecture Overview
The system follows a modern decoupled Full-Stack architecture:
1. **Frontend (Next.js & Zustand):** Captures user configurations (syllabus topics, difficulty distribution, marking schemes) and submits a REST API payload.
2. **Backend (Express & Redis):** Receives the request, validates the schema, and pushes a generation job to a BullMQ queue mapped in Redis, returning a unique jobId.
3. **Background Worker (BullMQ):** A dedicated worker thread picks up the job, constructs a highly-structured instructional prompt, and communicates with the Google Gemini API to generate the question paper as a strict JSON object.
4. **Database (MongoDB):** The worker sanitizes the JSON response and stores the generated paper to MongoDB.
5. **Real-time UX (Socket.io):** As the BullMQ worker progresses (Job Queued -> AI Generation -> DB Save), it emits granular progress events back to the client over WebSockets. Once completed, the client routes seamlessly to the live preview.

## 🛠️ Approach & Features
*   **LLM Hallucination Prevention:** The backend explicitly forces the AI structure via robust Prompt Engineering to return raw JSON matching our detailed MongoDB Assignment schema (avoiding markdown blocks and text blobs).
*   **Resiliency & Fallbacks (Zero-Setup Demo):** Engineered with fail-safes. If Redis or MongoDB are not running locally, the system automatically falls back to an in-memory queue and procedural template generation, ensuring the app never crashes during review.
*   **Print to PDF:** Used precise Tailwind CSS print-media modifiers (print:hidden, print:inline-block) to ensure the generated layout can be natively downloaded as a clean PDF without browser UI clutter.
*   **State Management:** Zustand is used to globally manage the complicated multi-step creation form state and socket ingestion events elegantly.
*   **Regenerate Pipeline:** Allows one-click reingestion of previous assignment parameters to retry generation seamlessly.

## 💻 Tech Stack
*   **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Zustand, Socket.io-client.
*   **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose).
*   **Queue & Cache:** Redis, BullMQ.
*   **AI Engine:** Google Gemini (1.5 Flash).

## 🚀 Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   Redis (Local server or Upstash - *optional due to fallback mode*)
*   Google Gemini API Key

### 1. Backend Setup
Open your terminal and navigate to the backend folder:
\\\ash
cd backend
npm install
\\\
Create a \.env\ file in the \ackend\ directory:
\\\env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
\\\
Start the backend server (using ts-node-dev):
\\\ash
npm run dev
\\\

### 2. Frontend Setup
Open a new terminal in the root directory:
\\\ash
npm install
\\\
*(No .env required for frontend. It automatically connects to \http://localhost:5000\ by default).*

Start the frontend server:
\\\ash
npm run dev
\\\
Visit **http://localhost:3000** in your browser.

## 🌍 Deployment Guidelines
To take this live, you need to deploy the components separately:
1. **Backend:** Deploy the backend Node.js Express server to an environment like **Render** or **Railway**. 
2. **Database & Cache:** Provision a free MongoDB cluster on **MongoDB Atlas** and a free Redis instance on **Upstash**. Plug these URLs into your backend environment variables.
3. **Frontend:** Push your GitHub repository to **Vercel** and import the root Next.js app. Make sure to update the \BACKEND_URL\ in the Zustand store (\useAssignmentStore.ts\) to point to your live backend domain instead of localhost.

---
*Created for the VedaAI Full Stack Engineering Assignment*
