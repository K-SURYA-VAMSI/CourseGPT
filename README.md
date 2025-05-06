# CourseGPT

CourseGPT is a full-stack web application for generating, organizing, and managing educational course modules and lessons using AI (Google Gemini API). It features a modern React frontend and an Express/MongoDB backend.

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

## Setup Instructions

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
MONGODB_URI=mongodb://localhost:27017/coursegpt
PORT=5000
GEMINI_API_KEY=AIzaSyDfTk52veSZ696lw1Hne0a4HD0oC1bq7BE
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

## Usage
1. Generate a lesson by entering a topic and lesson name, then click "Generate Lesson".
2. Edit any section of the lesson as needed.
3. Select a module and click "Add Lesson to Module" to save.
4. View and organize modules and lessons from the "Modules" page.
5. Use "Suggest Lesson Order" to reorder lessons based on prerequisites.

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
- `MONGODB_URI` — MongoDB connection string (default: mongodb://localhost:27017/coursegpt)
- `PORT` — Backend server port (default: 5000)
- `GEMINI_API_KEY` — Your Google Gemini API key (required for AI content generation)
