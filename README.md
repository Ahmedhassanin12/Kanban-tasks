# Kanban Board (Next.js + JSON Server)

A simple **Kanban board application** built with **Next.js** (frontend) and **JSON Server** (mock backend API).  
Supports **CRUD operations** on tasks and columns, with infinite scroll and drag-and-drop powered by `@dnd-kit`.

---

## 🚀 Features

- ✅ Columns (Todo, In Progress, Done)  
- ✅ Tasks with title & description  
- ✅ Full CRUD (Create, Read, Update, Delete)  
- ✅ JSON Server backend for mock REST API  
- ✅ pagination task lists with pagination  
- ✅ Drag & Drop task reordering (`@dnd-kit`)  
- ✅ Filtering by column  

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) — React framework  
- [React Query](https://tanstack.com/query) — Data fetching + caching  
- [Axios](https://axios-http.com/) — HTTP client  
- [json-server](https://github.com/typicode/json-server) — Mock backend API  
- [@dnd-kit](https://dndkit.com/) — Drag & drop  

---

## 📂 Project Structure
kanban-app/
├── src/ # Next.js app (UI + logic)
│ ├── app/
│ ├── components/
│ └── modules/


---

## ⚡ Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/Ahmedhassanin12/Kanban-tasks
cd kanban-app
npm install
npx json-server db.json --port 4000
npm run dev

