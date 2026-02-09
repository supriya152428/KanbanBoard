# 📝 WebSocket-Powered Kanban Board

A **real-time Kanban board** built with **React** and **Node.js + Socket.IO**. Users can **add, update, move, and delete tasks**, assign **priority & category**, upload attachments, and visualize **task progress in real-time**. This project demonstrates **WebSocket implementation, frontend-backend integration, and testing**.

---

## 📌 Features

- Add, update, move, and delete tasks between columns (To Do, In Progress, Done)  
- Assign priority (Low, Medium, High) and category (Bug, Feature, Enhancement)  
- Upload attachments with previews  
- Real-time updates synced across multiple clients via WebSockets  
- Task progress chart showing counts and completion percentage  
- Testing:  
  - **Unit & Integration:** Vitest + React Testing Library  
  - **End-to-End:** Playwright  

---

## 🏗 Tech Stack

- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js, Express, Socket.IO  
- **Charts:** Chart.js / Recharts  
- **Testing:** Vitest, React Testing Library, Playwright  

---

## 📂 Project Structure

websocket-kanban-vitest-playwright
│── backend/ # Node.js + Socket.IO server
│ ├── server.js # Backend logic
│ ├── package.json # Backend dependencies
│
│── frontend/ # React app
│ ├── src/
│ │ ├── components/
│ │ │ └── KanbanBoard.jsx # Main Kanban Board component
│ │ ├── tests/
│ │ │ ├── unit/ # Unit tests (Vitest)
│ │ │ ├── integration/ # Integration tests (Vitest)
│ │ │ └── e2e/ # End-to-end tests (Playwright)
│ ├── package.json
│
└── README.md # Project guide
