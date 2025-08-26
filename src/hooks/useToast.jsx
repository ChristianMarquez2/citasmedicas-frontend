import { useState, useRef } from "react";

export function useToast() {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("info");
  const timeoutRef = useRef(null);

  function showToast(msg, type = "info") {
    setMessage(msg);
    setType(type);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage(null), 3000);
  }

  function Toast() {
    if (!message) return null;
    return (
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: "10px 15px",
          borderRadius: 6,
          background: type === "error" ? "tomato" : "seagreen",
          color: "white",
        }}
      >
        {message}
      </div>
    );
  }

  return { showToast, Toast };
}
