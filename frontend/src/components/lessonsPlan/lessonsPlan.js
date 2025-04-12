import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./lessonsPlan.css";

export default function LessonsPlan() {
  const [schedule, setSchedule] = useState([]);
  const [className, setClassName] = useState('');
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredLessons, setFilteredLessons] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      fetch(`${process.env.REACT_APP_SCHEDULE}/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Błąd sieci');
          }
          return response.json();
        })
        .then(data => {
          if (data.schedule) {
            setSchedule(data.schedule);
            setClassName(data.class);
          }
        })
        .catch(error => {
          console.error('Błąd pobierania planu lekcji:', error);
          setError('Nie udało się pobrać planu lekcji.');
        });
    }
  }, []);

  useEffect(() => {
    if (schedule.length > 0) {
      const formattedDate = selectedDate.toLocaleDateString('en-CA');
      const day = schedule.find(d => d.date === formattedDate);
      setFilteredLessons(day ? day.lessons : []);
    }
  }, [schedule, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <div className="lessonsPlanBody">
        <div><h1>Plan lekcji {className}</h1>
        {error && <p className="error">{error}</p>}
        
        <div className="calendar">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
          />
        </div></div>
        
        <div className='lessonsPlanRightSide'><h1>Plan lekcji na {selectedDate.toLocaleDateString()}</h1>

        {filteredLessons.length > 0 ? (
          <ul>
            {filteredLessons.map((lesson, index) => (
              <li key={index} className="lessonItem">
                <strong>{lesson.subject}</strong> - {lesson.teacher}
                <br />
                <div className="lessonItemDate">
                  {lesson.from} - {lesson.to}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Brak lekcji w tym dniu.</p>
        )}</div>
      </div>
    </div>
  );
}
