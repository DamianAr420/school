import React from "react";
import "./gradeDetails.css";

export default function GradeDetails({ grade, onClose }) {
  if (!grade) return null;

  return (
    <div className="gradeDetailsOverlay" onClick={onClose}>
      <div className="gradeDetailsBox">
        <h2>Grade details</h2>
        <p><strong>Subject:</strong> {grade.subject}</p>
        <p><strong>Title:</strong> {grade.title || "Brak"}</p>
        <p><strong>Grade:</strong> {grade.grade}</p>
        <p><strong>Date:</strong> {grade.date}</p>
        <p><strong>By:</strong> {grade.by}</p>

        <button className="closeButton" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
