# AI-Powered Learning Assistant App

A full-stack MERN application powered by Google Gemini AI that helps students upload study materials, interact with documents, generate summaries, flashcards, quizzes, and track their learning progress.

## 🚀 Live Demo

- **Frontend:** [https://ai-learning-frontend.onrender.com](https://ai-learning-frontend.onrender.com)
- **Backend API:** [https://ai-learning-backend-g6h7.onrender.com](https://ai-learning-backend-g6h7.onrender.com)

## ✨ Features

### 👤 User Authentication
- Secure user registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes with middleware
- Persistent login sessions

### 📄 PDF Upload & Management
- Upload study materials in PDF format
- File size tracking
- Store file metadata in MongoDB
- Organized document management
- Delete and manage uploaded documents

### 📖 Embedded PDF Viewer
- View PDFs directly inside the application
- No need to download files
- Smooth and responsive document rendering
- In-app reading experience

### 🤖 AI-Powered Chat (Google Gemini)
- Context-aware Q&A based on uploaded document
- Conversational AI experience
- Intelligent response generation
- Document-based contextual understanding

### 📝 AI Document Summary
- Generate concise summaries of entire PDFs
- One-click summary generation
- Helpful for quick revision
- Structured and readable output

### 💡 AI Concept Explainer
- Ask for detailed explanations of specific topics
- Deep breakdown of difficult concepts
- Easy-to-understand AI responses

### 🃏 Auto-Generated Flashcards
- Automatically extract important concepts
- Generate flashcard sets from documents
- Flip animation for interactive learning
- Save and manage flashcards
- Mark flashcards as favorites

### 📊 AI Quiz Generator
- Generate multiple-choice quizzes
- Custom question count selection
- Context-aware question generation
- Intelligent answer options

### 📈 Quiz Results & Analytics
- Score tracking
- Correct answer review
- Explanation for each answer
- Performance insights

### 📊 Progress Tracking Dashboard
- Total documents uploaded
- Total flashcards created
- Total quizzes attempted
- Recent activity feed
- Learning analytics overview

### ⭐ Favorites System
- Mark important flashcards
- Quick-access review section
- Personalized revision system

### 📱 Responsive UI
- Modern UI built with Tailwind CSS
- Fully responsive (mobile, tablet, desktop)
- Clean and intuitive design
- Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router DOM** - Routing
- **React PDF Viewer** - PDF rendering
- **Vite** - Build tool
- **TypeScript** - Type safety

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **TypeScript** - Type safety

### AI Integration
- **Google Gemini API** - AI model
- Context-based prompt engineering
- Dynamic content generation

## 🔄 System Flow

### Document Processing Flow
1. User uploads PDF
2. Server extracts text from PDF
3. Text stored in database with metadata
4. User asks question / generates summary / quiz
5. Backend sends context to Gemini API
6. AI response returned to frontend

### Authentication Flow
1. User registers with email/password
2. Password hashed with bcrypt
3. JWT token generated upon successful login
4. Token stored in localStorage
5. Protected routes validate token via middleware

## 📁 Project Structure
AI-Learning-Application-main/
├── backend/
│ ├── config/ # Configuration files
│ ├── controller/ # Route controllers
│ ├── middleware/ # Custom middleware
│ ├── model/ # Database models
│ ├── routes/ # API routes
│ ├── utils/ # Utility functions
│ ├── server.ts # Entry point
│ └── package.json
├── frontend/
│ ├── public/ # Static assets
│ ├── src/ # Source code
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ ├── services/ # API services
│ │ ├── utils/ # Utility functions
│ │ └── App.tsx # Main component
│ ├── index.html
│ ├── vite.config.ts
│ └── package.json
├── .gitignore
└── README.md

text

## 🚢 Deployment

The application is deployed on **Render**:

- **Backend:** Web Service (Node.js)
- **Frontend:** Static Site (Vite build)
