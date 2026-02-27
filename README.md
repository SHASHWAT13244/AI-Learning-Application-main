# 🤖 AI-Powered Learning Assistant – Your Smart Study Companion  
**MongoDB • Express • React • Node.js • Google Gemini AI • TypeScript**  
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](#)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Live Demo](https://img.shields.io/badge/Live-Demo-ff69b4?style=for-the-badge&logo=render)](https://ai-learning-frontend.onrender.com)

A powerful full-stack learning assistant that leverages Google Gemini AI to help students upload study materials, interact with documents, generate summaries, flashcards, quizzes, and track their learning progress.

---

## ✨ Overview  
**AI-Powered Learning Assistant** transforms how students interact with study materials by providing:

🤖 **Google Gemini AI** integration for intelligent document analysis  
📄 **PDF upload & processing** with embedded viewer  
🧠 **AI-generated summaries, flashcards & quizzes** from your documents  
💬 **Context-aware chat** with your uploaded materials  
📊 **Progress tracking** dashboard with analytics  
🔐 **Secure authentication** with JWT  

Built with the MERN stack and TypeScript, this application demonstrates advanced AI integration, file processing, and responsive design principles.

---

## 🔧 Key Features  

### 📄 PDF Upload & Management  
- Upload study materials in PDF format  
- File size tracking and management  
- Organized document library  
- Delete and manage uploaded documents  

### 📖 Embedded PDF Viewer  
- View PDFs directly in the browser  
- No downloads required  
- Smooth, responsive rendering  

### 🤖 AI-Powered Chat (Google Gemini)  
- Context-aware Q&A based on uploaded documents  
- Conversational AI experience  
- Document-specific understanding  

### 📝 AI Document Summary  
- Generate concise summaries of entire PDFs  
- One-click summary generation  
- Perfect for quick revision  

### 💡 AI Concept Explainer  
- Get detailed explanations of specific topics  
- Deep breakdown of difficult concepts  
- Easy-to-understand AI responses  

### 🃏 Auto-Generated Flashcards  
- Automatically extract key concepts  
- Generate flashcard sets from documents  
- Flip animation for interactive learning  
- Save and favorite flashcards  

### 📊 AI Quiz Generator  
- Create multiple-choice quizzes from your materials  
- Custom question count selection  
- Context-aware question generation  
- Detailed answer explanations  

### 📈 Progress Tracking  
- Track total documents uploaded  
- Monitor flashcards created  
- View quiz attempts and scores  
- Recent activity feed  
- Learning analytics overview  

### ⭐ Favorites System  
- Mark important flashcards  
- Quick-access review section  
- Personalized revision system  

---

## 📁 Project Structure  
AI-Learning-Application-main/
│
├── backend/ # Node.js + Express + TypeScript
│ ├── config/ # Configuration files
│ ├── controller/ # Route controllers
│ ├── middleware/ # Auth & validation middleware
│ ├── model/ # MongoDB models
│ ├── routes/ # API endpoints
│ ├── utils/ # Helper functions
│ └── server.ts # Entry point
│
├── frontend/ # React + TypeScript + Vite
│ ├── public/ # Static assets
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page views
│ │ ├── services/ # API services
│ │ ├── utils/ # Helper functions
│ │ └── App.tsx # Main component
│ ├── index.html
│ └── vite.config.ts
│
├── .gitignore
└── README.md

text

---

## 🧠 Technologies Used  

| Technology          | Description                                    |
|---------------------|------------------------------------------------|
| MongoDB             | NoSQL database for users, documents & progress |
| Express.js          | Backend framework for RESTful API              |
| React.js            | Front-end SPA with TypeScript                  |
| Node.js             | Backend runtime environment                    |
| TypeScript          | Type safety throughout the stack                |
| Google Gemini AI    | AI model for content generation & analysis     |
| JWT                 | Secure user authentication                      |
| Bcrypt              | Password hashing for secure storage             |
| Tailwind CSS        | Modern, responsive styling                      |
| Multer              | File upload handling                            |
| Axios               | HTTP client for API communication               |
| React PDF Viewer    | Embedded PDF rendering                          |

---

## 🔄 System Flow  

### Document Processing Flow  
1. **User uploads PDF** – File is processed and stored  
2. **Text extraction** – Server extracts text from the PDF  
3. **Database storage** – Text and metadata saved to MongoDB  
4. **User interaction** – Ask questions, generate summaries, create quizzes  
5. **AI processing** – Backend sends context to Google Gemini API  
6. **Response delivery** – AI-generated content returned to frontend  

### Authentication Flow  
1. **User registers** – Email and password provided  
2. **Password hashing** – Secured with bcrypt  
3. **JWT generation** – Token created upon successful login  
4. **Client storage** – Token saved in localStorage  
5. **Route protection** – Middleware validates token for protected routes  

---

## 🎨 Design Highlights  

### Dashboard  
- Clean, intuitive grid layout  
- Learning progress overview  
- Quick access to documents and flashcards  
- Recent activity feed  

### PDF Viewer  
- Seamless in-app document viewing  
- No external downloads needed  
- Responsive on all devices  

### AI Chat Interface  
- Conversational design  
- Document context displayed  
- Real-time responses  

### Flashcard System  
- Interactive flip animations  
- Favorite marking  
- Organized by document  

### Quiz Interface  
- Multiple-choice format  
- Instant feedback  
- Detailed explanations  

---

## 🌐 Live Demo  

🔗 **[Frontend](https://ai-learning-frontend.onrender.com)** – Explore the application  
🔗 **[Backend API](https://ai-learning-backend-g6h7.onrender.com)** – RESTful API endpoint  



---

## 🧑‍💻 Author  

**Shashwat Khandelwal**  
🎓 B.Tech Computer Science Student | 💻 MERN Stack Developer | 🤖 AI Enthusiast  

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SHASHWAT13244)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shashwat-khandelwal-a0564532b/)  
📧 **Email:** shashwatk340@gmail.com  

---



