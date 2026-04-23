import { useState } from "react"
import Layout from "../components/Layout"
import "./Chatbot.css"

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋 I am your Security AI Assistant. How can I help you today?"
    }
  ])

  const [input, setInput] = useState("")

  const getBotResponse = (text) => {
    const msg = text.toLowerCase()

    if (
      msg.includes("sql") ||
      msg.includes("injection") ||
      msg.includes("or 1=1")
    ) {
      return "SQL Injection (SQLi) is a web attack where malicious SQL queries are inserted into input fields to manipulate the database."
    }

    if (
      msg.includes("xss") ||
      msg.includes("cross site scripting")
    ) {
      return "XSS (Cross-Site Scripting) is an attack where malicious JavaScript code is injected into web pages viewed by other users."
    }

    if (msg.includes("csrf")) {
      return "CSRF (Cross-Site Request Forgery) tricks authenticated users into performing unwanted actions on a web application."
    }

    if (
      msg.includes("bonjour") ||
      msg.includes("hello") ||
      msg.includes("salut")
    ) {
      return "Hello 👋 I am your Security AI Assistant. I can help you understand web attacks and platform security status."
    }

    if (
      msg.includes("profil") ||
      msg.includes("profile")
    ) {
      return "Your profile information is managed securely inside the admin dashboard."
    }

    if (
      msg.includes("attaque") ||
      msg.includes("attacks today") ||
      msg.includes("combien")
    ) {
      return "Today's detected attacks include suspicious SQL Injection attempts, XSS payloads, and abnormal traffic patterns."
    }

    if (
      msg.includes("security status") ||
      msg.includes("status")
    ) {
      return "Current security status: System protected ✅ No critical threats detected."
    }

    return "I'm still learning. Try asking about SQL Injection, XSS, CSRF, attacks today, or security status."
  }

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage = {
      sender: "user",
      text: input
    }

    const botMessage = {
      sender: "bot",
      text: getBotResponse(input)
    }

    setMessages([...messages, userMessage, botMessage])
    setInput("")
  }

  return (
    <Layout>
      <div className="chatbot-page">

        <div className="chatbot-header">
          <h1>Security AI Chatbot</h1>
          <p>Ask me about SQL Injection, XSS, attacks, and system security.</p>
        </div>

        <div className="chatbot-box">

          <div className="messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender}`}
              >
                <span>
                  {msg.sender === "bot" ? "🤖" : "👤"}
                </span>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />

            <button onClick={sendMessage}>
              Send
            </button>
          </div>

        </div>
      </div>
    </Layout>
  )
}