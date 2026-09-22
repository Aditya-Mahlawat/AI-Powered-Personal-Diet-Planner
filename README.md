# NutriMind — Personal Diet Planner with Cloud & Local Storage

A modern, responsive, full-featured personal diet planner application built with **React 18**, **Vite**, **Firebase (Auth & Firestore)**, and **Recharts**.

Designed to run **100% locally with zero external billing or credit cards required**, while also offering seamless cloud synchronization via Firebase.

---

## 🌟 Key Features

- **⚡ Resilient Storage Architecture**: Works both 100% offline with zero external billing needed (automatic local browser persistence) and with Google Cloud (Firebase Auth + Firestore).
- **🇮🇳 Comprehensive Indian Food & Regional Diet Plans**:
  - 8 curated regional and lifestyle presets: North Indian Homestyle, South Indian Traditional, High-Protein Indian Vegetarian, Indian High-Protein Non-Veg, Jain/Satvik Pure Veg, Indian Calorie Deficit, Indian Keto, and Student Quick-Prep.
  - Expansive database of authentic Indian staples (Roti, Idli, Dosa, Sambar, Paneer, Chole, Rajma, Moong Dal, Soya Chunks, Sattu, Chaas, Makhana, Poha, Khichdi, etc.).
- **🍽 Structured 4-Meal Slot Day Planner**:
  - Automatically divides daily targets across Breakfast, Lunch, Evening Snack, and Dinner.
  - Algorithmic meal generator matching target calories and macros.
  - Dynamic portion scaling based on individual BMR/TDEE targets.
  - Respects dietary choices (Omnivore, Vegetarian, Vegan, Keto, Paleo) and allergen exclusions.
- **🛒 Smart Grocery Shopping Checklist**:
  - Auto-compiles ingredients from active meal plans grouped by aisle (Grains, Dairy & Protein, Fresh Produce, Pantry).
  - Multiplier support for 1-day, 3-day, or 7-day meal preparation.
  - Interactive item check-offs and one-click clipboard export.
- **💧 Daily Hydration & Water Intake Tracker**:
  - Visual 8-glass (2.0L) daily water intake logger with animated status badges.
- **📋 Real-Time Food Intake Tracker**:
  - Built-in food database with gram-level precision categorized by meal slots.
  - Interactive SVG macro ring and progress gauges.
  - Daily calorie deficit / surplus breakdown.
- **🔍 Indian Nutrition & Food Explorer**:
  - Searchable catalog of 60+ foods with macronutrient breakdowns per 100g and quick-log capabilities.
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
   git clone https://github.com/Aditya-Mahlawat/AI-Powered-Personal-Diet-Planner.git
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

## ⚡ Effortless Local & Cloud Execution
No cloud configuration or credit cards required!
Simply launch the app, enter your name, email, and password to sign in or create an account. The application features seamless local persistence: all user profiles, customized meal plans, grocery checklists, hydration data, and intake logs are saved reliably in your browser with zero billing barriers. When Firebase credentials are configured in `.env`, it automatically synchronizes with Google Cloud.

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
