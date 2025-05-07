# CourseGPT

CourseGPT is a full-stack web application for generating, organizing, and managing educational course modules and lessons using AI (Google Gemini API). It features a modern React frontend and an Express/MongoDB backend.

## 🚀 Live Demo
- **Frontend (Netlify):** [https://your-app-name.netlify.app](https://your-app-name.netlify.app)
- **Backend API (Render):** [https://your-backend-name.onrender.com/api/modules](https://your-backend-name.onrender.com/api/modules)
- **Source Code:** [https://github.com/yourusername/coursegpt](https://github.com/yourusername/coursegpt)

> _Replace the above links with your actual deployed URLs and GitHub repo._

## Features
- Generate lesson content using Google Gemini API
- Edit lesson sections before saving
- Organize lessons into modules
- Suggest lesson order based on prerequisites
- View, add, and manage modules and lessons
- Responsive, modern UI

## Tech Stack
- **Frontend:** React, React Router, React Quill, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), dotenv, cors
- **AI Integration:** Google Gemini API

## How to Use (Deployed App)
1. Visit the [Live Demo](https://your-app-name.netlify.app) link.
2. Generate a lesson by entering a topic and lesson name, then click "Generate Lesson".
3. Edit any section of the lesson as needed.
4. Select a module and click "Add Lesson to Module" to save.
5. View and organize modules and lessons from the "Modules" page.
6. Use "Suggest Lesson Order" to reorder lessons based on prerequisites.

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd coursegpt
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster1.a9labds.mongodb.net/coursegpt
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
```

Start MongoDB (if not already running), then start the backend:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal in the project root:
```bash
npm install
npm start
```
The app will open at [http://localhost:3000](http://localhost:3000)

## API Endpoints (Backend)
- `GET /api/modules` — List all modules (with lessons)
- `POST /api/modules` — Create a new module
- `PUT /api/modules/:id` — Update a module (including lesson order)
- `DELETE /api/modules/:id` — Delete a module
- `GET /api/lessons` — List all lessons
- `POST /api/lessons` — Create a new lesson
- `PUT /api/lessons/:id` — Update a lesson
- `DELETE /api/lessons/:id` — Delete a lesson
- `POST /api/lessons/generate` — Generate lesson content using Gemini API

## Environment Variables
- `MONGODB_URI` — MongoDB Atlas connection string (e.g., mongodb+srv://<username>:<password>@cluster1.a9labds.mongodb.net/coursegpt)
- `PORT` — Backend server port (default: 5000)
- `GEMINI_API_KEY` — Your Google Gemini API key (required for AI content generation)

---

## Submission Instructions

To access and review this app:
- Use the **Live Demo** link above for the deployed frontend.
- The backend and database are already configured and running in the cloud.
- For code review, see the **Source Code** link.

If you have any questions or need further information, please contact me!
