import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./more.css";

export default function More() {
  const [dmText, setDmText] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const darkmode = localStorage.getItem("darkMode");
    if(darkmode === "true") {
      document.getElementById("dmIn").style.right = "0";
      document.getElementById("dm").style.textAlign = "left";
      document.getElementById("dm").style.direction = "ltr";
      setDmText("ON");
    } else {
      document.getElementById("dmIn").style.left = "0";
      document.getElementById("dm").style.textAlign = "right";
      document.getElementById("dm").style.direction = "rtl";
      setDmText("OFF");
    }
  }, [])

  const dm = () => {
    const darkmode = localStorage.getItem("darkMode") === "true";
    localStorage.setItem("darkMode", !darkmode);
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.setItem("isLogged", "false");
    localStorage.removeItem("role");
    localStorage.removeItem("status");
    navigate("/");
  }

  return (
    <div>
      <div className="moreBody">
        <ul>
          {localStorage.getItem("role") === "dev" ? <li onClick={() => navigate("/more/admin")}>Admin Panel</li> : null}
          <li className='dmLi' onClick={() => dm()}>Dark mode
            <div id='dm' className='dm'>{dmText}
              <div id='dmIn' className='dmInside'></div>
            </div>
          </li>
          <li onClick={() => navigate("/more/profile")}>Profile</li>
          <li onClick={() => navigate("/more/notices")}>Notices</li>
          <li onClick={() => navigate("/more/add_notices")}>Add Notices</li>
          {localStorage.getItem("status") === "teacher" || localStorage.getItem("role") === "dev" ? <li onClick={() => navigate("/more/edit_plan")}>Edit Lesson Plan</li> : null}
          <li onClick={logout}>Logout</li>
        </ul>
      </div>
    </div>
  )
}
