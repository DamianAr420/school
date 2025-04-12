import react, { useEffect, useState } from "react";
import './main.css'

export default function Main() {
  const [grades, setGrades] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [notices, setNotices] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      fetch(`${process.env.REACT_APP_FETCH}/${userId}`)
        .then(response => response.json())
        .then(data => {
          const currentWeekGrades = (data.grades || []).filter(grade =>
            isDateInCurrentWeek(grade.date)
          );
          setGrades(currentWeekGrades);
          setNotices(data.notices || []);
        })
        .catch(error => console.error('Błąd podczas pobierania danych:', error));

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
            const today = new Date().toISOString().split('T')[0];
            const todaySchedule = data.schedule.find(item => item.date === today);
            if (todaySchedule) {
              setLessons(todaySchedule.lessons);
            }
          }
        })
        .catch(error => {
          console.error('Błąd pobierania planu lekcji:', error);
          setError('Nie udało się pobrać planu lekcji.');
        });
    } else {
      console.error('Brak ID użytkownika w localStorage');
    }
  }, []);

  function isDateInCurrentWeek(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
  
    const firstDayOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
  
    firstDayOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    firstDayOfWeek.setHours(0, 0, 0, 0);
  
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);
  
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  }

  return (
    <div>
      <div className="mainBody">
        <div className="mainBodyBox">
          <h1>Grades this week</h1>
          <ul>
            {grades.map((grade, index) => (
              <li key={index} className='gradesToday'>
                <div
                  className="gradeToday"
                  style={{
                    backgroundColor:
                      grade.grade >= 5 ? "#14ec00" :
                      grade.grade >= 4 ? "#298100" :
                      grade.grade >= 3 ? "#fbff00" :
                      grade.grade >= 2 ? "#ff7300" :
                      "#ff0000",
                  }}
                >
                  {grade.grade}
                </div>
                <div className='gradeSubjectToday'>{grade.subject}</div>
                <div className='gradeDateToday'>{grade.date}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mainBodyBox">
          <h1>Today Plan</h1>
          <ul>
            {lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <li key={index} className='lessonsToday'>
                  <div className='lessonsHours'>{lesson.from} - {lesson.to}</div>
                  <div className='lessonsSubject'>{lesson.subject}</div>
                </li>
              ))
            ) : (
              <li>Brak lekcji na dzisiaj</li>
            )}
          </ul>
        </div>

        <div className="mainBodyBox">
          <h1>Notices</h1>
          <ul>
            {notices.map((notice, index) => (
              <li key={index} className='mainNotices' style={{ color: notice.status === "positive" ? "green" : "red" }}>
                <strong>{notice.title}</strong>
                <div>{notice.desc}</div>
                <div className='noticesBy'>(by {notice.by})</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
