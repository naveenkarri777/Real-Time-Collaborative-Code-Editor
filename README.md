# Real-Time Collaborative Code Editor

A **full-stack web application** that allows multiple users to collaborate on coding in real-time. Users can join rooms, edit code simultaneously, select programming languages, and see who is typing.  

> **Note:** Code execution feature will be developed in the future.

---

## Features

- Real-time code collaboration using **Socket.IO**
- Room-based system for multiple code sessions
- Live updates of code across all users in a room
- Typing indicators to see who is typing
- Select programming language: JavaScript, Python, Java, C++
- Copy Room ID to easily invite others
- Future: Code execution directly in the editor

---

## Project Structure

realtime-code-editor/
│── backend/
│ ├── index.js # Node.js + Express + Socket.IO server
│ ├── package.json
│── frontend/
│ ├── src/ # React app with Monaco Editor
│ ├── App.jsx
│ ├── package.json
│── package.json # Optional root-level



---

## Tech Stack

- **Backend:** Node.js, Express, Socket.IO  
- **Frontend:** React, Vite, Monaco Editor  
- **Realtime Communication:** WebSockets via Socket.IO  

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/naveenkarri777/Real-Time-Collaborative-Code-Editor.git
cd realtime-code-editor
2. Install dependencies


cd backend
npm install

cd ../frontend
npm install

3. Setup environment variables
Create a .env file in the backend/ folder:

PORT=5000
Create a .env file in the frontend/ folder:

VITE_BACKEND_URL=http://localhost:5000
4. Build Frontend


cd frontend
npm run build
5. Run the application



# Start backend server
cd ../backend
node index.js
Frontend will be served from the backend (/frontend/dist).

Future Enhancements
Code execution: Run code for supported languages directly in the browser or server

Authentication: User accounts and room security

Database integration: Save code snippets and rooms

Improved UI/UX: Themes, resizable editor, and mobile responsiveness

License
This project is open-source and free to use under the MIT License.

