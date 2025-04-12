import React, { useEffect, useState } from 'react';
import './addNotice.css';

export default function AddNotice() {
    const [message, setMessage] = useState(null);
    const [status, setStatus] = useState("positive");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loggedUser, setLoggedUser] = useState("");
    const [date, setDate] = useState("")
    const [userData, setUserData] = useState({
        title: "",
        desc: "",
        status: "positive",
        by: "",
        date: "",
    });

    useEffect(() => {
        setInterval(() => {
            setMessage("");
        }, 5000);
    }, [message])

    useEffect(() => {
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat("pl-PL", {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        }).format(now);

        setDate(formattedDate);
    }, [])

    useEffect(() => {
        setUserData({
            title: title,
            desc: desc,
            status: status,
            by: loggedUser,
            date: date
        });
    }, [title, desc, status, loggedUser]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_FETCH_USERS);
                const users = await response.json();
                setUsers(users);
            } catch (err) {
                setMessage(err.message);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const mainUserId = localStorage.getItem("userId");
        users.map((user) => {
            if (user._id === mainUserId) {
                setLoggedUser(`${user.name} ${user.surname}`);
            }
        });
    }, [users]);

    const submit = async (e) => {
        e.preventDefault();

        if (!selectedUser) {
            setMessage("Nie wybrano użytkownika");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_ADD_NOTICE}/${selectedUser}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) throw new Error("Błąd podczas aktualizacji danych");

            setMessage("Dane zostały zaktualizowane!");
        } catch (err) {
            setMessage(err.message);
            console.error("Błąd podczas aktualizacji:", err);
        }
    };

    return (
        <div className='addNotice'>
            <div className="addNoticeBox">
                <h1>Create new notice</h1>
                <label>Select user</label>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value={null}></option>
                    {users.map((user, index) => {
                        return (
                            <option key={index} value={user._id}>
                                {`${user.name} ${user.surname}`}
                            </option>
                        );
                    })}
                </select>
                <label>Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <label>Description</label>
                <input 
                    type="text" 
                    value={desc} 
                    onChange={(e) => setDesc(e.target.value)} 
                />
                <label>Select status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="positive">positive</option>
                    <option value="negative">negative</option>
                    <option value="info">info</option>
                </select>
                <button type="submit" onClick={submit}>Add</button>
                {message && <div className="message">{message}</div>}
            </div>
        </div>
    );
}
