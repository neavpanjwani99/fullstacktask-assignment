# Trainee Developer Assignment - Notes Management System

This repository contains the completed submission for the Full-Stack Developer Trainee Assignment, featuring the resolved mandatory Core Task and a premium, responsive Frontend workspace.

---

## Project Status Overview

1.  **Core Task (Mandatory)**: **100% Completed**
    *   Resolved all logical bugs and API route definitions in the core JavaScript debugger modules.
    *   Detailed breakdown of all found issues, root causes, and corresponding resolutions are fully documented in the PDF report located under:
        `core/buggy-code/Debugging Assignment - Issues Found & Fixed.pdf`
2.  **Notes Frontend (Optional)**: **100% Completed**
    *   Developed a premium, minimalist, and fully responsive Notes Workspace styled with the Airbnb design system.
3.  **Notes Backend (Optional)**: In Development / Mock Layer Active
    *   Frontend stores notes locally in `localStorage` with automated real-time saving and instant filtering.

---

## 1. Core Task (Mandatory Debugging)

All bugs within `core/buggy-code` have been fixed. Key issues resolved include:
*   **API Route Handlers**: Corrected parameter bindings and middleware scopes.
*   **Variable Scopes & Typos**: Repaired local identifier referencing errors causing runtime crashes.
*   **Error Handling**: Added robust validation for empty fields and unhandled Promise rejections.

For the exhaustive report of all 6+ major bugs discovered, read:
📄 **[Debugging Issues & Fixes Report](file:///s:/projects/assginment/fullstacktask/core/buggy-code/Debugging%20Assignment%20-%20Issues%20Found%20&%20Fixed.pdf)**

---

## 2. Frontend Task (Airbnb-style UI)

The frontend notes manager is built with **React 18 + Vite** using a **3-column split workspace** layout inspired by premium text utilities (Notion, Slack):

### Features:
*   **Dynamic 3-Column Layout**: 
    1.  *Sidebar*: Interactive category views (All Notes, Pinned) and dynamic Tags aggregator list.
    2.  *List Panel*: Real-time titles list, search filter query field, relative dates, and tag chips.
    3.  *Editor Workspace*: Autosave state dots, tag insertions, dynamic word/character statistics, and text areas.
*   **Airbnb Design System**: Utilizes a crisp light theme with Airbnb's trademark coral-pink (`#FF385C`) active indicators, off-white panels (`#F7F7F7`), and soft gray borders. Absolutely no emojis are used to preserve professional compliance.
*   **Full Mobile Responsiveness**:
    *   On screens $\le 768\text{px}$, the interface collapses to show only one pane at a time (switching dynamically between the Note Cards List and the Editor Workspace).
    *   Includes a mobile-only back navigation button (`ArrowLeft`) to return to the list pane.
*   **Instant Search & Sorting**: Filters notes in real-time by searching titles or descriptions. Pinned notes automatically bubble up to the top, sorted by last update time.
*   **Autosave Status Indicator**: Simulated autosave dot indicator (Teal/Amber colors) flashes automatically when typing in titles/body text areas.

For details on component structures and CSS queries, view [ARCHITECTURE.md](file:///s:/projects/assginment/fullstacktask/frontend/notes-ui/ARCHITECTURE.md).

---

## 3. How to Run the Frontend Workspace

### Prerequisites:
Make sure you have **Node.js** (v16 or higher) installed on your system.

### Steps to Run:

1.  **Navigate to the Frontend Directory**:
    ```powershell
    cd frontend/notes-ui
    ```

2.  **Install Dependencies**:
    ```powershell
    npm install
    ```

3.  **Start the Local Development Server**:
    ```powershell
    npm run dev
    ```
    Open your browser and navigate to the local URL (usually `http://localhost:5173`).

4.  **Run Production Build**:
    ```powershell
    npm run build
    ```
    Compiles optimized chunks into the `dist/` directory ready for deployment.

---

## 4. How to Run the Backend API

### Prerequisites:
*   **Node.js** (v16 or higher)
*   **MongoDB Compass** (or MongoDB local community service running on port `27017`)

### Steps to Run:

1.  **Navigate to the Backend Directory**:
    ```powershell
    cd backend/notes-api
    ```

2.  **Install Dependencies**:
    ```powershell
    npm install
    ```

3.  **Start the API Server**:
    *   For normal startup:
        ```powershell
        npm start
        ```
    *   For hot-reloading development startup:
        ```powershell
        npm run dev
        ```
    The server will startup on port `5000` (API endpoint: `http://localhost:5000/api/notes`).

---

## Submission Details

*   **Repository URL**: `https://github.com/neavpanjwani99/fullstacktask-assignment`
*   **OS Environment**: Windows (PowerShell Shell)
*   **Key Tech Stack**: Node.js, Express, MongoDB (Mongoose), React 18, Vite, Lucide-React, CSS3 Flex/Grid, Git

