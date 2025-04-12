import React from "react";
import "./modal.css";

export default function Modal({ closeModal, children }) {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal}>✖</button>
        {children}
      </div>
    </div>
  );
}
