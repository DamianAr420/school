import React, { useEffect, useState } from "react";
import './editUser.css';

const DataFetcher = () => {
    const [userDataOrginal, setUserDataOrginal] = useState({
        login: "",
        password: "",
        userClass: "",
        name: "",
        surname: "",
        status: "",
        role: ""
    });
    const [userData, setUserData] = useState({
        login: "",
        password: "",
        userClass: "",
        name: "",
        surname: "",
        status: "",
        role: ""
    });

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const [operationName, setOperationName] = useState("");
    const [by, setBy] = useState("");
    const [updatedData, setUpdatedData] = useState([]);

    useEffect(() => {
        const updatedFields = [];
    
        Object.keys(userData).forEach((key) => {
            if (userData[key] !== userDataOrginal[key]) {
                updatedFields.push(key);
            }
        });
        setUpdatedData(updatedFields);
    }, [userData]);

    useEffect(() => {
            setOperationName("Update user");
            const mainUserId = localStorage.getItem("userId");
        
            const fetchUser = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_FETCH}/${mainUserId}`);
                    const data = await response.json();
                    setBy(`${data.name} ${data.surname}`);
                } catch (error) {
                    console.error("Error while fetching user:", error);
                }
            };
        
            fetchUser();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_FETCH_USERS);
                const users = await response.json();
                setUsers(users);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!selectedUser) return;

            try {
                const response = await fetch(`${process.env.REACT_APP_FETCH}/${selectedUser}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                setUserData({
                    login: result.login || "",
                    userClass: result.class || "",
                    name: result.name || "",
                    surname: result.surname || "",
                    status: result.status || "",
                    role: result.role || "",
                    password: ""
                });
                setUserDataOrginal({
                    login: result.login || "",
                    userClass: result.class || "",
                    name: result.name || "",
                    surname: result.surname || "",
                    status: result.status || "",
                    role: result.role || "",
                    password: ""
                });
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserData();
    }, [selectedUser]);

    const updateUser = async (e) => {
        e.preventDefault();
    
        if (!selectedUser) {
            setError("Nie wybrano użytkownika");
            return;
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_EDIT_USER}/${selectedUser}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(userData),
            });
    
            if (!response.ok) throw new Error("Błąd podczas aktualizacji danych");
    
            console.log("Dane użytkownika zostały zaktualizowane!");
            setMessage("Dane zostały zaktualizowane!");
    
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
    
                const logDesc = `${userData.name} ${userData.surname} ${updatedData}`;
                await fetch(process.env.REACT_APP_ADD_LOG, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ operationName, date: formattedDate, by, desc: logDesc })
                });
            } catch (logError) {
                console.error("Błąd podczas zapisu do logów:", logError);
                setMessage(`Server error: ${logError.message}`);
            }
        } catch (err) {
            setError(err.message);
            console.error("Błąd podczas aktualizacji:", err);
        }
    };    

    useEffect(() => {
        setTimeout(() => {
            setMessage("");
        }, 3000);
    },[message]);

    if (loading) return <p>Ładowanie danych...</p>;
    if (error) return <p>Błąd: {error}</p>;

    return (
        <div className="editUser">
            <form onSubmit={updateUser}>
                <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
                    <option value="">Wybierz użytkownika</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {`${user.name} ${user.surname}`}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Login"
                    value={userData.login}
                    onChange={(e) => setUserData({ ...userData, login: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Class"
                    value={userData.userClass}
                    onChange={(e) => setUserData({ ...userData, userClass: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Surname"
                    value={userData.surname}
                    onChange={(e) => setUserData({ ...userData, surname: e.target.value })}
                    required
                />
                <hr />
                <select value={userData.status} onChange={(e) => setUserData({ ...userData, status: e.target.value })}>
                    <option value="">Select Status</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
                <select value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })}>
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="dev">Dev</option>
                </select>
                <hr />
                <button type="submit">Aktualizuj</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DataFetcher;
