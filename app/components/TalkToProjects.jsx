"use client";
import { useState, useRef } from "react";
import Lottie from "lottie-react";
import rippleLoader from "../assets/animations/ripple-loader.json";
import MicIcon from "./icons/MicIcon";
import "./TalkToProjects.css";

export default function TalkToProjects() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasSpokenOnce, setHasSpokenOnce] = useState(false);
  const spokenCache = useRef(new Set());

  const typeStructuredResponse = (text) => {
    const cleanText = text
      .replace(/\s+/g, " ")
      .replace(/([.!?])([A-Za-z])/g, "$1 $2")
      .trim();

    const sentences = cleanText
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean);

    if (sentences.length === 0) {
      setDisplayText("");
      setIsTyping(false);
      return;
    }

    let sentenceIndex = 0;
    let wordIndex = 0;
    let words = (sentences[0].match(/\S+\s*/g) || [])
      .filter(Boolean)
      .filter(word => word != null && word !== undefined && word !== "undefined" && word !== "null");

    setDisplayText("");
    setIsTyping(true);

    const interval = setInterval(() => {
      // Strict check to prevent undefined
      if (wordIndex < words.length) {
        const word = words[wordIndex];
        if (word != null && word !== undefined && word !== "undefined" && word !== "null" && String(word).trim() !== "") {
          setDisplayText((prev) => prev + word);
        }
      }
      wordIndex++;

      if (wordIndex >= words.length) {
        sentenceIndex++;
        if (sentenceIndex >= sentences.length) {
          clearInterval(interval);
          setIsTyping(false);
        } else {
          setDisplayText((prev) => prev + "\n\n");
          words = (sentences[sentenceIndex].match(/\S+\s*/g) || [])
            .filter(Boolean)
            .filter(word => word != null && word !== undefined && word !== "undefined" && word !== "null");
          wordIndex = 0;
        }
      }
    }, 85);
  };

  const speakWithElevenLabs = async (text) => {
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "ElevenLabs failed");
      }

      const audioBlob = await res.blob();
      const audio = new Audio(URL.createObjectURL(audioBlob));
      
      audio.onerror = () => {
        setErrorMessage("Failed to play audio. Please try again.");
      };

      audio.onended = () => {
        // Audio finished
      };

      audio.play().catch(err => {
        console.error("Audio play error:", err);
        setErrorMessage("Voice generation failed.");
      });
    } catch (err) {
      console.error("ElevenLabs error:", err);
      setErrorMessage(err.message || "Voice generation failed. Please check your ElevenLabs API key.");
    }
  };

  const ask = async () => {
    if (!text.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setErrorMessage("");

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const data = await res.json();

      if (data.error) {
        setErrorMessage(data.error);
        setIsLoading(false);
        return;
      }

      const answer = data.text.trim();

      // 🖊️ Start typing animation
      typeStructuredResponse(answer);

      // 🔊 ELEVENLABS COST CONTROL
      const MAX_VOICE_CHARS = 300;

      const textForVoice =
        answer.length > MAX_VOICE_CHARS
          ? answer.slice(0, MAX_VOICE_CHARS) + "…"
          : answer;

      const shouldSkipVoice =
        textForVoice.split(" ").length < 8 ||
        hasSpokenOnce ||
        spokenCache.current.has(textForVoice);

      if (!shouldSkipVoice) {
        speakWithElevenLabs(textForVoice);
        spokenCache.current.add(textForVoice);
        setHasSpokenOnce(true);
      }

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  function startVoice() {
    if (isLoading || cooldown) return;
    
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setErrorMessage("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setText(transcript);
      // Auto-send after voice input
      if (transcript.trim()) {
        const questionText = transcript;
        setText("");
        setIsLoading(true);
        
        // Reuse ask logic directly
        fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: questionText })
        }).then(async (res) => {
          const data = await res.json();

          if (data.error) {
            setErrorMessage(data.error);
            setIsLoading(false);
            setCooldown(true);
            setTimeout(() => setCooldown(false), 15000);
            return;
          }

          const answer = data.text.trim();

          // 🖊️ Start typing animation
          typeStructuredResponse(answer);

          // 🔊 ELEVENLABS COST CONTROL
          const MAX_VOICE_CHARS = 300;

          const textForVoice =
            answer.length > MAX_VOICE_CHARS
              ? answer.slice(0, MAX_VOICE_CHARS) + "…"
              : answer;

          const shouldSkipVoice =
            textForVoice.split(" ").length < 8 ||
            hasSpokenOnce ||
            spokenCache.current.has(textForVoice);

          if (!shouldSkipVoice) {
            speakWithElevenLabs(textForVoice);
            spokenCache.current.add(textForVoice);
            setHasSpokenOnce(true);
          }

          setIsLoading(false);
        }).catch(err => {
          console.error("Error:", err);
          setErrorMessage("Something went wrong. Please try again.");
          setIsLoading(false);
        });
      }
    };

    rec.onerror = (e) => {
      console.error("Speech recognition error:", e);
      
      let errorMessage = "Speech recognition error. Please try typing instead.";
      
      // Handle specific error types
      if (e.error === "not-allowed") {
        errorMessage = "Microphone permission denied. Please allow microphone access and try again.";
      } else if (e.error === "no-speech") {
        errorMessage = "No speech detected. Please try again.";
      } else if (e.error === "audio-capture") {
        errorMessage = "No microphone found. Please check your microphone connection.";
      } else if (e.error === "network") {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (e.error === "aborted") {
        // User aborted, don't show error
        setIsLoading(false);
        return;
      }
      
      setErrorMessage(errorMessage);
      setIsLoading(false);
    };

    rec.onend = () => {
      // Reset loading state when recognition ends
      setIsLoading(false);
    };

    try {
      rec.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setErrorMessage("Failed to start speech recognition. Please try typing instead.");
      setIsLoading(false);
    }
  }

  return (
    <section className="talk-to-projects-section mt-24 mb-20 max-w-4xl mx-auto text-center animate-fade-in px-6">
      <h2 className="text-3xl font-semibold glow mb-2">Talk to My Projects</h2>
      <p className="text-gray-400 mb-8">Ask me anything about my projects and I'll explain them!</p>

      <div className="ai-input-wrapper">
        <input
          type="text"
          placeholder="Hello, I'm Harshit's AI assistant, ask me anything about his projects and I'll explain them!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          disabled={isLoading || cooldown}
        />

        <button className="icon-btn" onClick={startVoice} disabled={isLoading || cooldown} aria-label="Microphone">
          <MicIcon size={18} />
        </button>

        <button className="icon-btn send" onClick={ask} disabled={isLoading || cooldown} aria-label="Send">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {errorMessage && (
        <p className="ai-error-message">{errorMessage}</p>
      )}

      {isLoading && (
        <div className="loading-wrapper">
          <Lottie
            animationData={rippleLoader}
            loop
            autoplay
            style={{ width: 120, height: 120 }}
          />
        </div>
      )}

      {displayText && (
        <div className="response-box">
          {displayText}
          {isTyping && <span className="typing-cursor">▍</span>}
        </div>
      )}
    </section>
  );
}
