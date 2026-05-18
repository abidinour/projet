import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋 I am your Security AI Assistant. I can help you understand web attacks, suspicious activities, and platform security status.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ NEW
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const messagesEndRef = useRef(null);

  const suggestions = [
    "What is SQL Injection?",
    "Explain XSS attack",
    "How many attacks today?",
    "Current security status",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /*
  =========================
  🎤 VOICE SETUP
  =========================
  */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.log("Voice error:", event.error);

      if (
        event.error !== "no-speech" &&
        event.error !== "network"
      ) {
        alert("Voice Error: " + event.error);
      }

      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      console.log("🎯 Voice:", transcript);

      setInput(transcript);

      // ✅ AUTO SEND
      setTimeout(() => {
        sendMessage(transcript);
      }, 500);
    };

    recognitionRef.current = recognition;
  }, []);

  /*
  =========================
  🎤 START VOICE
  =========================
  */
  const startVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert("Voice not supported");
      return;
    }

    if (isListening) return;

    try {
      recognitionRef.current.stop();

      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log("Start error:", e.message);
        }
      }, 300);
    } catch (e) {
      console.log("Restart error:", e.message);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = async (customText = null) => {
    const finalMessage = customText || input;

    if (!finalMessage.trim()) return;

    const userMessage = {
      sender: "user",
      text: finalMessage,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:3307/chatbot/message",
        { message: finalMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botMessage = {
        sender: "bot",
        text: res.data.reply,
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log(error);

      const botMessage = {
        sender: "bot",
        text: "Server connection error. Please try again.",
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="header-info">
            <div>
              <h1>Security AI Chatbot</h1>
              <p>
                Ask me about SQL Injection, XSS, attacks,
                suspicious requests, and platform security.
              </p>
            </div>

            <div className="status-badge">
              <span className="dot"></span>
              AI Protection Active
            </div>
          </div>
        </div>

        <div className="chat-window">
          <div className="suggestions">
            {suggestions.map((item, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => sendMessage(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender}`}>
              <div className={`message-bubble-wrapper ${msg.sender}`}>
                <div className="message-bubble">{msg.text}</div>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-wrapper bot">
              <div className="message-bubble bot typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Type your security question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          {/* 🎤 VOICE BUTTON */}
          <button onClick={startVoiceRecognition}>
            {isListening ? "🎙 Listening..." : "🎤"}
          </button>

          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    </Layout>
  );
}