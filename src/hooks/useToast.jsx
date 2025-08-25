import { useState } from "react";

export function useToast() {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("info");

  function showToast(msg, type = "info") {
    setMessage(msg);
    setType(type);
    setTimeout(() => setMessage(null), 3000);
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
