import React from "react";

function BackgroundImage({ children }) {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)", // soft gradient for a professional feel
      }}
    >
      {children}
    </div>
  );
}

export default BackgroundImage;
