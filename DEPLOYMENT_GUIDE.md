# 🚀 SHRAMA SATHI AI — Render Deployment Guide

This guide walks you through deploying **SHRAMA SATHI AI (श्रम साथी AI)** to [Render](https://render.com) for production.

---

## Architecture Overview on Render

- **Platform**: Render Web Service (Node.js runtime, free or starter tier)
- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite via Prisma ORM (`file:./dev.db`)
- **Speech Engine**: Gnani.ai Timbre v3.0 TTS (`https://api.vachana.ai/api/v1/tts/inference`)
- **Reasoning**: Gnani.ai Evon LLM / Google Gemini / 4 Labour Codes Statutory Engine
- **Health Check**: `/api/status`

---

## Option 1: 1-Click Blueprint Deployment (Recommended)

Since the repository already contains `render.yaml`, you can use Render Blueprints:

1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** in the top right corner and select **Blueprint**.
3. Connect your GitHub repository: `Shreyas126-tech/Shrama_AI`.
4. Render will automatically detect `render.yaml` and configure:
   - **Service Name**: `shrama-sathi-ai`
   - **Runtime**: `Node`
   - **Region**: `Singapore` (closest to India for low latency)
   - **Build Command**: `npm install && npm run render-build`
   - **Start Command**: `npm run start`
   - **Health Check Path**: `/api/status`
5. In the Environment Variables section, enter your secret keys:
   - `TIMBRE_API_KEY`: `vach_1ytE2CY5X2DwfRBWvzWHOLs6lm3jGKrl1HgxxiO6WIT1UNHnoMBV24Ly4Z53w37rgvLViUnLtwCgQkKKpsBBrr1QmbjJWzIG_f0dac4b2b7a9ec7c532acdd10bc77fd1`
   - *(Optional)* `EVON_API_KEY`: *(your Evon key if available)*
   - *(Optional)* `GEMINI_API_KEY`: *(your Gemini key if available)*
6. Click **Apply**. Render will clone, build, seed the database, and launch your live URL!

---

## Option 2: Manual Web Service Deployment (Step-by-Step)

If you prefer to configure the Web Service manually:

### Step 1: Create a New Web Service
1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Choose **Build and deploy from a Git repository**.
4. Select `Shreyas126-tech/Shrama_AI` (click **Connect**).

### Step 2: Configure Service Settings
| Field | Value |
| :--- | :--- |
| **Name** | `shrama-sathi-ai` |
| **Region** | `Singapore (Southeast Asia)` *(recommended for India)* |
| **Branch** | `main` |
| **Root Directory** | *(leave blank)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run render-build` |
| **Start Command** | `npm run start` |
| **Instance Type** | `Free` (or Starter) |

> **Note on `render-build`**:
> The `npm run render-build` script runs:
> `prisma generate && prisma db push && node prisma/seed.js && next build`
> This automatically generates the Linux Prisma client binary, syncs the SQLite database, seeds 5 Indian welfare schemes & demo workers, and runs the production build.

### Step 3: Add Environment Variables
Scroll down to the **Environment Variables** section and click **Add Environment Variable** for each:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `DATABASE_URL` | `file:./dev.db` | Local SQLite database |
| `TIMBRE_API_KEY` | `vach_1ytE2CY5X2DwfRBWvzWHOLs6lm3jGKrl1HgxxiO6WIT1UNHnoMBV24Ly4Z53w37rgvLViUnLtwCgQkKKpsBBrr1QmbjJWzIG_f0dac4b2b7a9ec7c532acdd10bc77fd1` | Live Gnani Timbre key |
| `TIMBRE_API_URL` | `https://api.vachana.ai/api/v1/tts/inference` | Gnani Vachana inference endpoint |
| `TIMBRE_DEFAULT_VOICE` | `Shivani` | Default Hindi female voice |
| `TIMBRE_MODEL` | `timbre-v3.0` | Gnani Timbre model version |
| `EVON_API_KEY` | *(leave empty or enter key)* | Gnani Evon LLM key |
| `EVON_API_URL` | `https://api.gnani.ai/v1/evon/chat/completions` | Evon LLM endpoint |
| `EVON_MODEL` | `evon-v3.3` | Evon model version |
| `GEMINI_API_KEY` | *(optional)* | Google Gemini fallback key |
| `GEMINI_MODEL` | `gemini-1.5-flash` | Gemini model version |
| `NEXT_PUBLIC_APP_NAME` | `SHRAMA SATHI AI` | Application branding |

### Step 4: Health Check (Optional but Recommended)
1. Expand **Advanced**.
2. Under **Health Check Path**, enter:
   ```
   /api/status
   ```
3. Click **Create Web Service**.

---

## Step 5: Verification of Live Deployment

Once Render finishes building and marks your service as **Live**:

1. Open your Render URL: `https://shrama-sathi-ai.onrender.com`.
2. Check the health check endpoint:
   ```
   https://shrama-sathi-ai.onrender.com/api/status
   ```
   You should see:
   ```json
   {
     "status": "online",
     "integrations": {
       "prisma": { "connected": true },
       "timbre": { "configured": true, "status": "READY" },
       "aiEngine": { "status": "STATUTORY_RULES_ACTIVE" }
     }
   }
   ```
3. Test speech synthesis:
   - Click the microphone icon or prompt chips in the **Voice Assistant**.
   - Live speech will stream from Gnani Timbre v3.0 directly to the browser!
