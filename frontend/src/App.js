import React, { useEffect } from "react";
import { BrowserRouter as Router, Link, Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/login/login";
import Main from "./components/main/main";
import Grades from './components/grades/grades';
import LessonsPlan from "./components/lessonsPlan/lessonsPlan";
import More from './components/more/more';
import Admin from './components/more/admin/admin';
import Profile from './components/more/profile/profile';
import EditPlan from './components/more/editPlan/editPlan';
import Notices from './components/more/notices/notices';
import AddNotice from './components/more/addNotices/addNotice';
import './App.css';

function App() {

  useEffect(() => {
    const check = localStorage.getItem("darkMode");

    if (check === "false") {
      document.documentElement.style.setProperty('--main-color', '#2196f3');
      document.documentElement.style.setProperty('--secondary-color', '#1976d2');
      document.documentElement.style.setProperty('--secondary-color-second', '#64b5f6');

      document.documentElement.style.setProperty('--bcg-color', '#f5f5f5');
      document.documentElement.style.setProperty('--bcg-color-second', '#e0e0e0');

      document.documentElement.style.setProperty('--boxsh-color', 'rgba(0, 0, 0, 0.1)');
      document.documentElement.style.setProperty('--text-color', '#212121');
      document.documentElement.style.setProperty('--text-color-second', '#0d47a1');
    } else {
      document.documentElement.style.setProperty('--main-color', '#00bcd4');
      document.documentElement.style.setProperty('--secondary-color', '#00838f');
      document.documentElement.style.setProperty('--secondary-color-second', '#4dd0e1');

      document.documentElement.style.setProperty('--bcg-color', '#121212');
      document.documentElement.style.setProperty('--bcg-color-second', '#1e1e1e');

      document.documentElement.style.setProperty('--boxsh-color', 'rgba(255, 255, 255, 0.05)');
      document.documentElement.style.setProperty('--text-color', '#e0e0e0');
      document.documentElement.style.setProperty('--text-color-second', '#80deea');
    }
  }, []);

  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && (
        <div className="header">
          <Link className='navi' to="/main">Home</Link>
          <Link className='navi' to="/grades">Grades</Link>
          <Link className='navi' to="/lessons_plan">Plan</Link>
          <Link className='navi' to="/more">More</Link>
        </div>
      )}

      <div className="body">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/lessons_plan" element={<LessonsPlan />} />
          <Route path="/more" element={<More />} />
          <Route path="/more/admin" element={<Admin />} />
          <Route path="/more/profile" element={<Profile />} />
          <Route path="/more/edit_plan" element={<EditPlan />} />
          <Route path="/more/notices" element={<Notices />} />
          <Route path="/more/add_notices" element={<AddNotice />} />
        </Routes>
      </div>
    </>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
