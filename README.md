# 📊 Finance Dashboard

A modern, responsive, and highly interactive personal finance dashboard built with React. This application provides real-time financial tracking, smart insights, and premium data visualizations using a clean, glassmorphism-inspired UI.

## ✨ Key Features

* **Advanced State Management:** Utilizes `Zustand` for lightning-fast, boilerplate-free global state management across components.
* **Smart Insights Engine:** An auto-calculating banner that analyzes transaction data to provide real-time warnings (e.g., low savings rates, whale expenses) or positive feedback.
* **Premium Visualizations:** Powered by `Recharts`, featuring:
  * Dynamic Area Charts with health-based gradient color shifting (Green/Orange/Red).
  * Artifact-free, stacked Donut Charts for expense breakdowns and net ratios.
  * Daily Cash Flow Bar Charts.
* **Interactive Data Table:** * Real-time search filtering by description.
  * Category-based dropdown filtering.
  * Auto-sorting by chronological date.
* **Role-Based Access Control (RBAC):** Simulated `Viewer` (read-only) and `Admin` (read/write/edit/delete) modes.
* **Full CRUD Functionality:** Admins can Add, Edit, and Delete transactions via beautifully animated, backdrop-blurred Modals.
* **Scroll Animations:** Custom `IntersectionObserver` hooks to trigger cascading fade-up animations as the user scrolls.
* **Localization:** Configured for Indian Rupee (₹) and the `en-IN` numbering system.

## 🛠️ Tech Stack

* **Framework:** [React 18](https://react.dev/) (via Vite)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Charts:** [Recharts](https://recharts.org/)
* **Icons:** Custom inline SVGs

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/rockaxorb13/finance-dashboard.git](https://github.com/rockaxorb13/finance-dashboard.git)
   cd finance-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the dashboard.

## 📂 Project Architecture

```text
src/
├── components/             # Reusable UI components
│   ├── AnimatedSection.jsx # Scroll animation wrapper
│   ├── InsightsBanner.jsx  # Algorithmic financial health alerts
│   ├── SummaryCards.jsx    # Top-level calculation cards
│   ├── TransactionTable.jsx# Searchable, filterable data table
│   ├── Visualizations.jsx  # Recharts implementation
│   ├── AddTransactionModal.jsx 
│   └── EditTransactionModal.jsx 
├── store/                  
│   └── useFinanceStore.js  # Zustand global state logic
├── data/                   
│   └── mockData.js         # Initial realistic seed data
├── App.jsx                 # Main application layout and grid
└── main.jsx                # React entry point
```

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
   
