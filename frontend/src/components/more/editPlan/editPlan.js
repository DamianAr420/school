import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./editPlan.css";

export default function EditPlan() {
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_FETCH_CLASSES)
      .then((response) => response.json())
      .then((data) => {
        setClassesList(data);
      })
      .catch((error) => {
        console.error("Error", error);
        setError("Failed to fetch classes.");
      });
  }, []);

  useEffect(() => {
    if (!selectedClass || !selectedDate) {
      setLessons([]);
      return;
    }

    const selectedClassData = classesList.find(cls => cls.name === selectedClass);
    if (!selectedClassData) {
      setLessons([]);
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString('en-CA');
    const dailySchedule = selectedClassData.schedule.find(entry => entry.date === formattedDate);

    setLessons(dailySchedule ? dailySchedule.lessons : []);
  }, [selectedDate, selectedClass, classesList]);

  const timeToDecimal = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  const decimalToTime = (decimal) => {
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const handleAddLesson = (index, position) => {
    const lessonDuration = 1.5;
    const breakTime = 10 / 60;
    let fromTime, toTime;

    if(position === "") {
      toTime = timeToDecimal("9:30");
      fromTime = toTime - lessonDuration;
    } else if (position === "before") {
      toTime = timeToDecimal(lessons[index].from) - breakTime;
      fromTime = toTime - lessonDuration;

      if (fromTime < 8) return;

      if (index === 0 && lessons.length >= 8) return;
    } else {
      fromTime = timeToDecimal(lessons[index].to) + breakTime;
      toTime = fromTime + lessonDuration;
      if (toTime > 21.2) return;
    }

    const newLesson = { subject: "", teacher: "", from: decimalToTime(fromTime), to: decimalToTime(toTime) };
    let updatedLessons = [...lessons];

    updatedLessons.splice(position === "before" ? index : index + 1, 0, newLesson);
    
    for (let i = 0; i < updatedLessons.length - 1; i++) {
      updatedLessons[i + 1].from = decimalToTime(timeToDecimal(updatedLessons[i].to) + breakTime);
      updatedLessons[i + 1].to = decimalToTime(timeToDecimal(updatedLessons[i + 1].from) + lessonDuration);
    }

    setLessons(updatedLessons);
  };

  const handleDeleteLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const addButtonBefore = (index) => {
    if (timeToDecimal(lessons[index].from) > 8 && lessons.length < 8) {
      if (lessons.length === 7 && (timeToDecimal(lessons[index].from) > 8 && timeToDecimal(lessons[index].from) < 11)) {
        return <button className='editPlanAddLessonBefore' onClick={() => handleAddLesson(index, "before")}>➕</button>;
      }
      if (lessons.length !== 7 || timeToDecimal(lessons[index].from) !== 8) {
        return <button className='editPlanAddLessonBefore' onClick={() => handleAddLesson(index, "before")}>➕</button>;
      }
    }
  }

  const addButtonAfter = (index) => {
    if (lessons.length < 8 && (index < lessons.length - 1 || timeToDecimal(lessons[index].to) < 21)) {
      if (timeToDecimal(lessons[lessons.length - 1].from) > 19 && timeToDecimal(lessons[index + 1].from) <= 20) {
        return <button className='editPlanAddLessonAfter' onClick={() => handleAddLesson(index, "after")}>➕</button>
      }
      if (timeToDecimal(lessons[lessons.length - 1].from) < 19) {
        return <button className='editPlanAddLessonAfter' onClick={() => handleAddLesson(index, "after")}>➕</button>
      }
    }
  }

  const handleSaveSchedule = async () => {
    if (!selectedClass || !selectedDate || lessons.length === 0) {
      setError("Select a class and date before saving.");
      return;
    }
  
    const formattedDate = selectedDate.toLocaleDateString('en-CA');
  
    try {
      const response = await fetch(process.env.REACT_APP_EDIT_PLAN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: selectedClass,
          date: formattedDate,
          lessons,
        }),
      });
  
      if (response.ok) {
        setError("Schedule saved successfully!")
      } else {
        setError("Failed to save schedule.");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      setError("An error occurred.");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(null);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [error]);  

  return (
    <div className='editPlan'>
      {error && <p>{error}</p>}
      <div className='editPlanBody'>
        <div className='editPlanCalendar'>
          <h1>Lessons Plan</h1>
          <div className='editPlanCalendarItem'>
            <Calendar onChange={setSelectedDate} value={selectedDate} />
          </div>
        </div>

        <div className='editPlanList'>
          <h1>Edit plan for {selectedDate.toLocaleDateString()}</h1>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classesList.map((classItem, index) => (
              <option key={index} value={classItem.name}>{classItem.name}</option>
            ))}
          </select>

          <ul>
            {lessons.length === 0 && selectedClass !== "" ? <button onClick={() => handleAddLesson(0, "")}>➕</button> : null}
            {lessons.map((lesson, index) => (
              <li key={index}>
                <div className="lesson-buttons">
                  {addButtonBefore(index)}
                  {addButtonAfter(index)}
                </div>
                
                <input type="text" placeholder="Subject" value={lesson.subject} onChange={(e) => {
                  const updatedLessons = [...lessons];
                  updatedLessons[index].subject = e.target.value;
                  setLessons(updatedLessons);
                }} />

                <input type="text" placeholder="Teacher" value={lesson.teacher} onChange={(e) => {
                  const updatedLessons = [...lessons];
                  updatedLessons[index].teacher = e.target.value;
                  setLessons(updatedLessons);
                }} />

                <span>{lesson.from} - {lesson.to}</span>

                <button onClick={() => handleDeleteLesson(index)}>❌</button>
              </li>
            ))}
          </ul>
          <button className="save-schedule-btn" onClick={handleSaveSchedule}>💾 Save Schedule</button>
        </div>
      </div>
    </div>
  );
}
