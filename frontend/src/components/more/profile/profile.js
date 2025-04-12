import React, { useEffect, useState } from 'react';
import './profile.css';

export default function Profile() {
  const [userData, setUserData] = useState({});
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    const fetchUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_FETCH}/${userId}`);
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error("Error while fetching user:", error);
        }
    };
    
    fetchUser();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    console.log(`Copied: ${text}`);
  };

  const handleEdit = (field, value) => {
    setEditField(field);
    setEditValue(value);
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!editField) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_EDIT_USER}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          [editField]: editValue,
        }),
      });
      if (response.ok) {
        setUserData((prev) => ({ ...prev, [editField]: editValue }));
        setEditField(null);
      }
    } catch (error) {
      console.error("Error while updating user data:", error);
    }
  };

  const handleCloseEdit = () => {
    setEditField(null);
  };

  if (!userData || Object.keys(userData).length === 0) {
    return <p style={{ color: "var(--text-color)" }}>Loading...</p>;
  }

  return (
    <div className='profile'>
      <div className="tableBody">
        <h1>{userData.name} {userData.surname}</h1>
        <table>
          <thead onClick={handleCloseEdit}>
            <tr>
              <th colSpan={2}>Click on a login or password to edit. Click here to cancel editing</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Login:</td>
              <td onClick={() => handleEdit('login', userData.login)}>
                {editField === 'login' ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <button onClick={handleSave}>Zapisz</button>
                  </>
                ) : (
                  <span>{userData.login}</span>
                )}
              </td>
            </tr>
            <tr>
              <td>Password:</td>
              <td onClick={() => handleEdit('password', '')}>
                {editField === 'password' ? (
                  <>
                    <input
                      type="password"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <button onClick={handleSave}>Zapisz</button>
                  </>
                ) : (
                  <span>Edit</span>
                )}
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Your Data</th>
            </tr>
            <tr>
              <td>Name:</td>
              <td onClick={() => handleCopy(userData.name)}>{userData.name}</td>
            </tr>
            <tr>
              <td>Surname:</td>
              <td onClick={() => handleCopy(userData.surname)}>{userData.surname}</td>
            </tr>
            <tr>
              <td>Class:</td>
              <td onClick={() => handleCopy(userData.class)}>{userData.class}</td>
            </tr>
            <tr>
              <td>Role:</td>
              <td onClick={() => handleCopy(userData.role)}>{userData.role}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td onClick={() => handleCopy(userData.status)}>{userData.status}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>In Your Data you can click on the cell and copy text</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
