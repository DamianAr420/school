import React, { useState, useEffect } from "react";
import "./grades.css";
import GradeDetails from "./gradeDetails/gradeDetails";

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    fetch(`${process.env.REACT_APP_FETCH}/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.grades) {
          const fixedGrades = data.grades.map((grade, index) => ({
            ...grade,
            id: grade.id || `temp_${index}`,
          }));

          setGrades(fixedGrades);

          const uniqueSubjects = [...new Set(fixedGrades.map((grade) => grade.subject))];
          setSubjects(uniqueSubjects);
        }
      })
      .catch((error) => console.error("Error", error));
  }, []);

  const filteredGrades = grades.filter((grade) => grade.subject === selectedSubject);

  const showDetails = (grade) => {
    setSelectedGrade(grade);
    setIsOpen(true);
  };

  return (
    <div>
      <div className="gradesBox">
        <div className="leftSide">
          <div>
            {subjects.map((subject, index) => (
              <div 
                key={index} 
                className={`subjects ${subject === selectedSubject ? "active" : ""}`} 
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </div>
            ))}
          </div>
        </div>

        <div className="rightSide">
        <div className="subjectHeader">
          <h2>{selectedSubject || "📚 Wybierz przedmiot"}</h2>
        </div>

        <div className="rightSideBox">
          {filteredGrades.length > 0 ? (
            filteredGrades.map((grade, index) => (
              <div 
                key={index} 
                className="grades" 
                onClick={() => showDetails(grade)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className="gradesGrade"
                  style={{
                    backgroundColor:
                      grade.grade >= 5 ? "#14ec00" :
                      grade.grade >= 4 ? "#298100" :
                      grade.grade >= 3 ? "#fbff00" :
                      grade.grade >= 2 ? "#ff7300" :
                      "#ff0000"
                  }}
                >
                  {grade.grade}
                </div>
                <div className="gradesTitle">{grade.title || "Brak tytułu"}</div>
              </div>
            ))
          ) : (
            <div className="noGrades">
              <p>📝 Brak ocen dla tego przedmiotu.</p>
            </div>
          )}
        </div>
      </div>
      </div>

      {isOpen && <GradeDetails grade={selectedGrade} onClose={() => setIsOpen(false)} />}
    </div>
  );
}
