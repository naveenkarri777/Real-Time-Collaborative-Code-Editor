import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from 'url';
import fetch from "node-fetch";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const rooms = new Map();

// -------------------
// Supported Languages & Version Indexes
// -------------------

const versionIndexes = {
  java: "4",       // Java 17
  cpp17: "0",      // C++ 17
  c: "0",          // C
  csharp: "0",     // C#
  python3: "0",    // Python 3
  nodejs: "0",     // JavaScript (Node.js)
  ruby: "2",       // Ruby
  swift: "1",      // Swift
  go: "0"          // Golang
};

// Map common language names to JDoodle API names
function normalizeLanguage(language) {
  const map = {
    javascript: "nodejs",
    js: "nodejs",
    python: "python3",
    cplusplus: "cpp17",
    cpp: "cpp17",
    csharp: "csharp",
    java: "java",
    ruby: "ruby",
    swift: "swift",
    go: "go",
    c: "c"
  };
  return map[language.toLowerCase()] || language.toLowerCase();
}

function getVersionIndex(language) {
  return versionIndexes[normalizeLanguage(language)] ?? "0";
}




// -------------------
// Socket.IO Events
// -------------------
io.on("connection", (socket) => {
  console.log("User Connected", socket.id.bgGreen);

  let currentRoom = null;
  let currentUser = null;

  // User joins a room
  socket.on("join", ({ roomId, userName }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom) || []));
    }

    currentRoom = roomId;
    currentUser = userName;

    socket.join(roomId);

    if (!rooms.has(roomId)) rooms.set(roomId, new Set());
    rooms.get(roomId).add(userName);

    io.to(roomId).emit("userJoined", Array.from(rooms.get(currentRoom)));
  });

  // Code change broadcast
  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  // Typing indicator
  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("userTyping", userName);
  });

  // Language change
  socket.on("languageChange", ({ roomId, language }) => {
    io.to(roomId).emit("languageUpdate", language);
  });

  // Leave room
  socket.on("leaveRoom", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom) || []));
      socket.leave(currentRoom);
      currentRoom = null;
      currentUser = null;
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom) || []));
    }
    console.log("User Disconnected");
  });

  // -------------------
  // RUN CODE (JDoodle API)
  // -------------------
  socket.on("runCode", async ({ roomId, language, code, input }) => {
    const normalizedLang = normalizeLanguage(language);
    if (!versionIndexes[normalizedLang]) {
      io.to(roomId).emit("executionResult", `Error: Language \"${language}\" not supported`);
      return;
    }

    try {
      const response = await fetch("https://api.jdoodle.com/v1/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: process.env.JD_CLIENT_ID,
          clientSecret: process.env.JD_CLIENT_SECRET,
          script: code,
          stdin: input || "",
          language: normalizedLang,
          versionIndex: getVersionIndex(language),
          compileOnly: false
        })
      });


      const result = await response.json();
      console.log("JDoodle API Result:", result);

      if (result.error) {
        io.to(roomId).emit("executionResult", `JDoodle Error: ${result.error}`);
      } else {
        io.to(roomId).emit("executionResult", result.output ?? "No output");
      }

    } catch (err) {
      io.to(roomId).emit("executionResult", "Error: " + err.toString());
    }
  });
});

// -------------------
// Serve frontend
// -------------------

const port = process.env.PORT;



//api endpoints
app.get('/', (req, res) => {
  res.send("Api is working");
});

server.listen(port, () => {
  console.log(`✅ Server running on port ${port}`.bgYellow);
});
