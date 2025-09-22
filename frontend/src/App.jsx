import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io(backendUrl);


// Map frontend language names to backend/JDoodle names
const languageMap = {
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

const App = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [copySuccess, setCopySuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [openOutputWindow, setOpenOutputWindow] = useState(false);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState(""); // <-- New: User input

  useEffect(() => {
    socket.on("userJoined", (users) => setUsers(users));
    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 8)}... is Typing`);
      setTimeout(() => setTyping(""), 2000);
    });
    socket.on("languageUpdate", (newLanguage) => setLanguage(newLanguage));
    socket.on("executionResult", (result) => {
      if (Array.isArray(result)) {
        setOutput(result.join("\n"));
      } else {
        setOutput(result);
      }
    });

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("executionResult");
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => socket.emit("leaveRoom");
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const joinRoom = () => {
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("// start code here");
    setLanguage("javascript");
    setOpenOutputWindow(false);
    setOutput("");
    setInput(""); // Reset input
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  const runCode = () => {
    setOpenOutputWindow(true);
    setOutput("⏳ Running your code...");
    // Map language to backend value
    const backendLanguage = languageMap[language] || language;
    socket.emit("runCode", { roomId, language: backendLanguage, code, input });
  };

  // -------------------
  // JOIN PAGE
  // -------------------
  if (!joined) {
    return (
      <div className="join-container">
        <div className="join-form">
          <h1>Join Code Room</h1>
          <input
            type="text"
            placeholder="Room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      </div>
    );
  }

  // -------------------
  // OUTPUT WINDOW PAGE
  // -------------------
  if (openOutputWindow) {
    return (
      <div className="output-container">
        <h2>Execution Result</h2>
        <pre className="output-box">{output}</pre>
        <button className="leave-button" onClick={() => setOpenOutputWindow(false)}>
          Back to Editor
        </button>
      </div>
    );
  }

  // -------------------
  // MAIN EDITOR PAGE
  // -------------------
  return (
    <div className="editor-container">
      <div className="sidebar">
        <div className="room-info">
          <h2>Code Room: {roomId}</h2>
          <button onClick={copyRoomId} className="copy-button">Copy Id</button>
          {copySuccess && <span className="copy-success">{copySuccess}</span>}
        </div>

        <h3>You : {userName}</h3>
        <h3>Users in Room:</h3>
        <ul>{users.map((user, i) => <li key={i}>{user.slice(0, 8)}...</li>)}</ul>

        <h3>Typing User :</h3>
        <p className="typing-indicator">{typing}</p>

        <select className="language-selector" value={language} onChange={handleLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="ruby">Ruby</option>
          <option value="swift">Swift</option>
          <option value="go">Go</option>
          <option value="c">C</option>
        </select>

        {/* NEW: Input Textarea */}
        <textarea
          placeholder="Enter input here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full min-w-[200px] border p-2 rounded resize-y text-black"
        />


        <button className="leave-button" onClick={leaveRoom}>Leave Room</button>
        <button className="leave-button" onClick={runCode}>Run Code</button>
      </div>

      <div className="editor-wrapper">
        <Editor
          height="100%"
          language={language === "python" ? "python" : language === "cpp" ? "cpp" : language === "csharp" ? "csharp" : language === "javascript" ? "javascript" : language} // Monaco expects its own language ids
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>
    </div>
  );
};

export default App;
