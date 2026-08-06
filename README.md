# Web Expense Tracker (PWA + Supabase + Next.js)

A full-stack, cloud-hosted, mobile-responsive Progressive Web Application (PWA) built with **Next.js (App Router)**, **Tailwind CSS**, **Supabase / PostgreSQL**, **Tesseract.js OCR**, and **Dexie.js IndexedDB** for real-time cloud data sync and offline expense tracking.

---

## 🌟 Key Features

- **⚡ Rapid Expense & Income Logging (<5s):** Fast entry modal with amount, date, category, payment method, and notes.
- **📷 OCR Receipt Scanning:** Auto-parse amount, merchant name, and transaction date from receipt photos using Tesseract.js.
- **🔀 Split Expenses:** Support for dividing a single expense across multiple categories.
- **💱 Multi-Currency Support:** Per-user currency selector (USD, EUR, GBP, INR, CAD, AUD, JPY).
- **🎯 Smart Budget Limits & Visual Warnings:** Set monthly category budgets with color-coded progress bars (Amber at 70-80%, Red pulse at >80%).
- **📊 Dynamic Visual Analytics:** Interactive spending pie/donut chart, daily cash flow trend area chart, and summary cards.
- **📱 PWA & Offline-First:** Installable on iOS/Android home screens. Stores data in IndexedDB when offline and auto-syncs when reconnected.
- **📥 Data Export:** Export full transaction ledger to CSV, JSON, or printable PDF summary report.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS, Lucide Icons, Recharts, Framer Motion
- **Database / Backend API:** PostgreSQL / Supabase, Node.js API Routes
- **Offline Sync & PWA:** Dexie.js (IndexedDB), Service Worker, Web App Manifest
- **OCR Engine:** Tesseract.js
- **Export Utilities:** jsPDF, jsPDF-AutoTable

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd MyExpenseTracker

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

Run the SQL schema provided in `implementation_plan.md` or `walkthrough.md` in your Supabase SQL Editor to create the necessary tables (`profiles`, `categories`, `budgets`, `transactions`), indexes, triggers, and Row Level Security (RLS) policies.

---

## 📦 Deployment

- **Frontend:** Deploy seamlessly on [Vercel](https://vercel.com).
- **Backend / Database:** Managed on [Supabase](https://supabase.com).
