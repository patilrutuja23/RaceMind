import { useState, useCallback, useRef } from "react";
import { mockResponses } from "../data/chatMockData";

const PHASES = [
  "Analyzing telemetry...",
  "Processing race data...",
  "Generating strategy...",
];

export function useChat() {
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "assistant",
      blocks: [
        { type: "recommendation", text: "Hello! I'm RaceMind AI — your race strategy copilot. Ask me anything about current telemetry, tire strategy, or lap performance." },
      ],
      ts: new Date(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [typingPhase, setTypingPhase] = useState(PHASES[0]);
  const [streamingId, setStreamingId] = useState(null);
  const phaseRef = useRef(null);

  const sendMessage = useCallback((text) => {
    const userMsg = { id: Date.now(), role: "user", text, ts: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    setTypingPhase(PHASES[0]);

    // Cycle through phases
    let phaseIdx = 0;
    phaseRef.current = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % PHASES.length;
      setTypingPhase(PHASES[phaseIdx]);
    }, 600);

    const totalDelay = 1800;
    setTimeout(() => {
      clearInterval(phaseRef.current);
      const blocks = mockResponses[text] ?? mockResponses.default;
      const msgId = Date.now() + 1;

      // Add message with streaming flag
      setMessages((prev) => [
        ...prev,
        { id: msgId, role: "assistant", blocks, ts: new Date(), streaming: true },
      ]);
      setStreamingId(msgId);
      setTyping(false);

      // Remove streaming flag after animation completes
      setTimeout(() => {
        setStreamingId(null);
        setMessages((prev) =>
          prev.map((m) => m.id === msgId ? { ...m, streaming: false } : m)
        );
      }, 1200);
    }, totalDelay);
  }, []);

  return { messages, typing, typingPhase, streamingId, sendMessage };
}
