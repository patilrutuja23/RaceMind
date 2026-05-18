import { useState, useEffect, useRef, useCallback } from "react";
import { currentTelemetry as mockFallback } from "../data/mockData";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8000/ws/telemetry";
const RECONNECT_DELAY = 3000;

export function useLiveTelemetry() {
  const [data, setData] = useState(mockFallback);
  const [connected, setConnected] = useState(false);
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      clearTimeout(reconnectRef.current);
    };

    ws.onmessage = (e) => {
      const frame = JSON.parse(e.data);
      setData(frame);
      setHistory((prev) => {
        const next = [...prev, frame];
        return next.length > 50 ? next.slice(-50) : next; // keep last 50 frames
      });
    };

    ws.onclose = () => {
      setConnected(false);
      reconnectRef.current = setTimeout(connect, RECONNECT_DELAY);
    };

    ws.onerror = () => ws.close();
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { data, connected, history };
}
