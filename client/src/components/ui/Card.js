import React from "react";

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-md bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

export default Card;