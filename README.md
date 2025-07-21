# 🧾 Claims Report Reconciliation System

An interactive web application built with **React**, **Tailwind CSS**, and **Recharts** that simulates and visualizes the reconciliation process between two insurance claims reports — Report A and Report B. The system automatically identifies matched and mismatched claims, displays detailed comparison results, and provides insightful visual analytics.

---

## 🚀 Features

- 🔍 **Automated Reconciliation**: Compare claims line-by-line and highlight differences.
- 📊 **Visual Analytics**:
  - Pie Chart showing the percentage of Matched vs. Mismatched claims.
  - Bar Chart showing frequency of mismatch types.
- 🧰 **Filters & Search**:
  - Filter by reconciliation status (Matched / Mismatched).
  - Filter by mismatch type (e.g., Claim Amount Mismatch).
  - Search by Claim ID.
- 📋 **Detailed Table View**: Tabular representation of comparison results with color cues.
- 🎨 **Clean & Responsive UI**: Tailwind CSS + Lucide icons for a polished user experience.

---

## 📁 Project Structure

/claims-reconciliation/
│
├── public/
│ └── index.html
│
├── src/
│ ├── App.js # Main React component with reconciliation logic
│ ├── index.js # Entry point
│ └── styles.css # Optional additional styles
│
├── package.json
└── README.md



---

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

---

## 🧪 How It Works

1. On page load, two synthetic reports (A & B) are generated.
2. Some intentional mismatches are introduced to simulate real-world discrepancies.
3. The system compares the reports using:
   - `claimId` as the primary key.
   - Field-level comparison (Amount, Status, Date, etc.).
4. Discrepancies are logged and categorized.
5. Results are displayed in an interactive dashboard.

---

## 📦 Getting Started

### Prerequisites

- Node.js (v14 or above)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/claims-reconciliation.git
cd claims-reconciliation
npm install


### *Run the App*
npm start



