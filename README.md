# SHRAMA SATHI AI (श्रम साथी AI)
> **Sovereign Multilingual Voice & AI Companion for Indian Workers**

SHRAMA SATHI AI is an AI-powered portal and voice assistant designed to empower India's 450+ million unorganized and organized workers, daily-wage laborers, migrant workers, and blue-collar staff. The platform simplifies Indian labour laws, calculates fair wages with statutory overtime protections, facilitates government welfare scheme onboarding, and provides grievance redressal.

---

## 🏛️ Grounded in Indian Labour Law Framework
All reasoning, compliance checks, and advice are grounded in:
1. **The Code on Wages (2019)**: Enforces minimum wage standards and **Section 14 double-overtime (2x rate)** rule.
2. **Occupational Safety, Health and Working Conditions Code (2020)**: Workplace safety standards and emergency redressal.
3. **The Code on Social Security (2020)**: Universal social security, EPF/ESIC guidelines, and e-Shram registration.
4. **Industrial Relations Code (2020)**: Dispute resolution, worker rights, and protection against wrongful termination.

---

## 🏗️ Architectural Overview & Integrations

The architecture isolates independent integration layers with strict server-side credential isolation and zero fabricated API responses:

### 1. Gnani.ai Evon LLM Integration (`src/lib/evon.ts`)
- **Role**: Proprietary enterprise LLM tailored for multilingual Indian enterprise reasoning.
- **Modality**: Context-aware labor rights conversational engine with vernacular understanding.
- **Security & Integrity**: Credentials remain strictly server-side (`EVON_API_KEY`). If unconfigured, activates a verified statutory rule engine and reports API status honestly.

### 2. Gnani.ai Timbre TTS Voice Integration (`src/lib/timbre.ts`)
- **Role**: Proprietary expressiveness-tuned speech synthesis supporting Indian vernacular accents (Hindi, Kannada, Telugu, Tamil, Marathi, Bengali, Indian English).
- **Audio Delivery**: Server-synthesized base64 audio stream with automatic client-side Web Speech API playback fallback when credentials are not yet supplied.

### 3. Prisma ORM Database (`prisma/schema.prisma`)
- **Database**: SQLite default (`file:./dev.db`) for zero-configuration, seamless local development; fully compatible with PostgreSQL.
- **Models**:
  - `Worker`: Worker demographic, phone, language, state, trade, and e-Shram card identifier.
  - `Grievance`: Dispute logs (wage theft, unsafe sites, harassment) and administrative resolution notes.
  - `WelfareScheme`: Directory of central and state welfare benefits (e-Shram, PM-SYM, BOCW, PM-JAY, PMSBY).
  - `WageEntry`: Digital labour diary storing daily hours, base rates, statutory overtime, EPF/ESIC deductions, and net wage.
  - `AssistantInteraction`: Audit log for voice/chat queries, latency, and model provenance.

---

## 🚀 Quickstart & Running Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x tested and verified)
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
Configure `.env` (or copy from `.env.example`):
```env
DATABASE_URL="file:./dev.db"

# Optional: Add live Gnani.ai credentials
EVON_API_KEY=""
EVON_API_URL="https://api.gnani.ai/v1/evon/chat/completions"
EVON_MODEL="evon-v3.3"

TIMBRE_API_KEY=""
TIMBRE_API_URL="https://api.gnani.ai/v1/timbre/synthesize"
TIMBRE_DEFAULT_VOICE="timbre-hi-female-1"
```

### 4. Database Setup & Seeding
```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

### 5. Run Verification Tests
```bash
npm test
```

### 6. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/status` | `GET` | Health & integration status (Prisma, Evon LLM, Timbre TTS) |
| `/api/chat` | `POST` | Evon LLM conversational engine grounded in labour law |
| `/api/voice/synthesize` | `POST` | Timbre TTS multilingual voice synthesis |
| `/api/schemes` | `GET`, `POST` | Welfare scheme directory and eligibility queries |
| `/api/wages` | `GET`, `POST` | Digital wage diary with 2x overtime calculation |
| `/api/grievances` | `GET`, `POST`, `PATCH` | Worker grievance redressal and tracking |

---

## 📞 Emergency Labour Helplines
- **National Labour Helpline**: `14434`
- **e-Shram National Portal**: `https://eshram.gov.in`
- **Ministry of Labour & Employment (Shram Suvidha)**: `https://shramsuvidha.gov.in`
