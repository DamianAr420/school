import React, { useEffect, useState } from 'react';
import "./newUser.css"

export default function NewUser() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [userClass, setUserClass] = useState("");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [status, setStatus] = useState("");
    const [role, setRole] = useState("");

    const [operationName, setOperationName] = useState("");
    const [by, setBy] = useState("");

    useEffect(() => {
        setOperationName("Create user");
        const userId = localStorage.getItem("userId");
    
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FETCH}/${userId}`);
                const data = await response.json();
                setBy(`${data.name} ${data.surname}`);
            } catch (error) {
                console.error("Error while fetching user:", error);
            }
        };
    
        fetchUser();
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
    
        try {
            const response = await fetch(process.env.REACT_APP_NEWUSER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ login, password, userClass, name, surname, role, status })
            });
    
            const data = await response.json();
            const logDesc = `${name} ${surname}`;
            if (response.ok) {
                setMessage("Użytkownik utworzony!");
                setLogin("");
                setPassword("");
                setUserClass("");
                setName("");
                setSurname("");
                setRole("");
                setStatus("");
            } else {
                setMessage(data.error || "Błąd rejestracji");
            }
            try {
                const now = new Date();
                const formattedDate = new Intl.DateTimeFormat("pl-PL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }).format(now);

                await fetch(process.env.REACT_APP_ADD_LOG, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ operationName, date: formattedDate, by, desc: logDesc })
                });
            } catch (erro) {
                setMessage(`Server error: ${erro.message}`);
            };
        } catch (err) {
                setMessage(`Server error: ${err.message}`);
        };
    };
    return (
        <div className='newUser'>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Class"
                    value={userClass}
                    onChange={(e) => setUserClass(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                /><hr/>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Select Status</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="dev">Dev</option>
                </select><hr />
                <button type="submit">Dodaj użytkownika</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}
