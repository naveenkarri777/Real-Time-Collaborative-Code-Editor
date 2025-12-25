# Real-Time Collaborative Code Editor

A web-based code editor that allows multiple users to collaborate in real time, write and execute code in multiple languages, and see each other's changes instantly. Built with React (frontend), Node.js/Express (backend), Socket.IO for real-time communication, Monaco Editor for code editing, and  API for code execution.


## 🌐 Live Demo

🔗 [Click here to Real-Time Collaborative Code Editor](https://real-time-collaborative-code-editor-eosin.vercel.app/)


## Features

- **Real-Time Collaboration:** Multiple users can join a room and edit code together live.
- **Multi-Language Support:** Write and execute code in JavaScript, Python, Java, C++, C#, Ruby, Swift, Go, and C.
- **Code Execution:** Run code directly in the browser using the API and view output instantly.
- **User Presence:** See who is in the room and who is currently typing.
- **Input Support:** Provide custom input for code execution.
- **Room System:** Create or join rooms using a unique Room ID.
- **Copy Room ID:** Easily share the room with others.
- **Syntax Highlighting:** Monaco Editor provides rich code editing experience.

## Tech Stack

- **Frontend:** React, Vite, Monaco Editor, Socket.IO-client
- **Backend:** Node.js, Express, Socket.IO,APi for code execution
- **Other:** dotenv, node-fetch, colors

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### 1. Clone the Repository
```sh
git clone https://github.com/naveenkarri777/Real-Time-Collaborative-Code-Editor.git
cd Real-Time-Collaborative-Code-Editor
```

### 2. Setup Backend
```sh
cd backend
npm install
```

#### Environment Variables
# backend/.env
PORT=5000
JD_CLIENT_ID=your_client_id
JD_CLIENT_SECRET=your_client_secret

# frontend/.env
VITE_BACKEND_URL=http://localhost:5000

### 3. Setup Frontend
cd ../frontend
npm install


#### Configure Backend URL
Create a `.env` file in the `frontend` folder:
```
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Run the Application

#### Start Backend
cd backend
npm run server


#### Start Frontend

cd ../frontend
npm run dev

- Open your browser and go to `http://localhost:5173` (or the port Vite shows).

## Usage

1. Enter a Room ID and your name to join a room.
2. Select a programming language from the dropdown.
3. Write code in the Monaco Editor.
4. (Optional) Enter custom input for your code.
5. Click **Run Code** to execute and see the output.
6. Share the Room ID with others to collaborate in real time.

## Supported Languages
- JavaScript (Node.js)
- Python 3
- Java
- C++ (C++17)
- C
- C#
- Ruby
- Swift
- Go

## Project Structure

```
Real-Time-Collaborative-Code-Editor/
├── backend/
│   ├── index.js
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── public/
│   ├── index.html
│   └── ...
├── .gitignore
└── README.md
```
## Tech Highlights
- Real-time collaboration with Socket.IO
- Rich code editor with Monaco Editor
- Multi-language code execution 
- Full-stack React + Node.js implementation


## Security & Notes
- Code execution is handled via API'S. Do **not** expose your credentials in public repos.
- This project is for educational/demo purposes. For production, consider sandboxing, rate limiting, and authentication.

## Credits
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Socket.IO](https://socket.io/)


> **Important:**  
> Make sure `.env` is listed in your `.gitignore` file to keep your credentials safe.


## License
MIT License
