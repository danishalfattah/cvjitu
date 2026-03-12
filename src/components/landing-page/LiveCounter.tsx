"use client";

import { useState, useEffect } from "react";

export function LiveCounter() {
  const [liveCount, setLiveCount] = useState(1234);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-gentle-pulse" />
      <span className="text-sm font-medium text-gray-700">
        <strong className="text-[var(--red-normal)]">
          {liveCount.toLocaleString()}
        </strong>{" "}
        orang sedang membuat CV sekarang
      </span>
    </>
  );
}
