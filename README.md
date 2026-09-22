# NutriMind — Personal Diet Planner with Cloud & Local Storage

A modern, responsive, full-featured personal diet planner application built with **React 18**, **Vite**, **Firebase (Auth & Firestore)**, and **Recharts**.

Designed to run **100% locally with zero external billing or credit cards required**, while also offering seamless cloud synchronization via Firebase.

---

## 🌟 Key Features

- **⚡ Dual Storage Architecture**: Works both 100% offline with zero setup/billing (browser LocalStorage) and with Google Cloud (Firebase Auth + Firestore).
- **📊 Scientific BMR & Macro Calculator**:
  - Implements the **Mifflin-St Jeor formula** for accurate Basal Metabolic Rate (BMR).
  - Calculates Total Daily Energy Expenditure (TDEE) based on customizable activity levels.
  - Automatically derives tailored daily caloric quotas and macro distribution (Protein, Carbohydrates, Fats) based on fitness goals (Weight Loss / Maintenance / Muscle Gain).
- **🍽 Automated Day Meal Planner**:
  - Algorithmic meal generator matching target calories and macros.
  - Respects dietary choices (Omnivore, Vegetarian, Vegan, Keto, Paleo) and allergen exclusions (Nuts, Lactose, Gluten, Shellfish, Soy).
  - Multi-cuisine support (Indian, Asian, Mediterranean, Mexican, Global).
  - One-click meal plan saving and history retrieval.
- **📋 Real-Time Food Intake Tracker**:
  - Built-in food database with gram-level precision.
  - Interactive SVG macro ring and progress gauges.
  - Daily calorie deficit / surplus breakdown.
- **📈 Progress & Analytics**:
  - 7-day calorie adherence trend visualization using Recharts.
- **💎 Premium Glassmorphism UI**:
  - High-contrast dark theme with glowing accents, animated transitions, responsive sidebar, and mobile drawer.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (bundled with Node.js)

### Installation & Launch

1. Clone this repository:
   ```bash
   git clone <your-github-repo-url>
   cd "AI-Powered Personal Diet Planner/diet-planner"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   👉 **http://localhost:5173**

---

## ⚡ Zero Billing / Local Mode
No credit card or Firebase setup required!
On the landing page, simply click:
> **"⚡ Continue in Free Mode (Zero Billing)"**

All features (profile setup, meal plans, food logging, charts) run locally in your browser with full persistent storage.

---

## ☁️ Optional: Connecting Firebase Cloud

To enable cloud synchronization across multiple devices:
1. Create a free project at [Firebase Console](https://console.firebase.google.com).
2. Enable **Email/Password Authentication** and create a **Cloud Firestore Database** (Start in Test mode).
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your Firebase keys in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

---

## 🧪 Testing & Verification

- **Unit Tests (Vitest)**:
  ```bash
  npm run test
  ```
- **Automated End-to-End Browser Tests (Cypress)**:
  ```bash
  npm run cypress:run
  ```

---

## 📁 Project Structure

```
diet-planner/
├── src/
│   ├── components/       # Reusable UI components (MacroRing, MealCard, Navbar, etc.)
│   ├── contexts/         # Authentication & session context
│   ├── data/             # Nutritional database (foods catalog)
│   ├── pages/            # Views: Dashboard, Login, ProfileSetup, MealPlan, IntakeLog
│   ├── services/         # Storage layer (dual-mode LocalStorage + Firestore)
│   ├── utils/            # BMR/TDEE calculations, macro algorithms, validators
│   ├── App.jsx           # App router & layout shell
│   ├── index.css         # Modern design tokens, utilities & animations
│   └── main.jsx          # App entry point
├── cypress/              # End-to-end browser automation test suite
└── package.json          # Dependencies & npm scripts
```

---

## 📄 License
MIT
