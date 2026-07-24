# Kanban Task Board

This app is a Kanban-style task management application built with React, TypeScript, and Supabase. It helps users organize their tasks and work with an implemented drag-and-drop interface with persistent cloud storage, customizable task colors, and automatic overdue task tracking.

## Features

- Anonymous authentication with Supabase
- Create, edit, and delete tasks
- Drag-and-drop task organization
- Custom task color accents
- Automatic overdue task indicators
- Real-time task search
- Optimistic UI updates
- Responsive design for desktop and mobile
- Light and dark mode support
- Persistent cloud storage

---

## Live Demo

**Application:** https://kanban-task-board-chi-seven.vercel.app/

**Repository:** https://github.com/amanpalb/kanban-task-board

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- dnd-kit
- Lucide React

### Backend

- Supabase
  - PostgreSQL
  - Authentication
  - Database API

### Deployment

- Vercel

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/kanban-board.git
cd kanban-board
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

---

## Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Project Structure

```text
src/
├── components/
│   ├── board/
│   ├── task/
│   └── ui/
├── hooks/
├── lib/
├── services/
├── types/
├── App.tsx
└── main.tsx
```

---

## Key Features

### Drag-and-Drop Task Management

### Task Customization

### Overdue Tracking

### Responsive Design for Desktop, Tablet, and Mobile Devices


---

## Future Enhancements

Potential additions include:

- User accounts
- Multiple boards
- Labels and tags
- File attachments
- Task comments
- Notifications
- Recurring tasks
- Team collaboration

---

## Author

Created by **Aman Bains**

GitHub: https://github.com/amanpalb

LinkedIn: https://www.linkedin.com/in/amansbains/