const User = require('../db/models/user');
const Class = require('../db/models/class');
const Logs = require('../db/models/logs');
const bcrypt = require('bcrypt');

class Actions {

    async login(req, res) {
        const { login, password } = req.body; 
        try {
            const user = await User.findOne({ login: login });
            if(!user) {
                return res.status(401).json({ error: "The login given does not exist" });
            }
            if(!user.password) {
                return res.status(401).json({ error: "The user has no password assigned" });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if(passwordMatch) {
                return res.status(200).json({ user }); 
            } else {
                return res.status(401).json({ error: 'Incorrect password' });
            }
        } catch(err) {
            return res.status(500).json({ error: 'Error while logging in' });
        }
    };

    async fetchData(req, res) {
        try {
            const { userId } = req.params;
            
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
            }
    
            return res.status(200).json(user);
        } catch (err) {
            console.log("Błąd podczas pobierania danych użytkownika", err);
            return res.status(500).json({ error: 'Błąd podczas pobierania danych użytkownika' });
        }
    };

    async schedule(req, res) {
        try {
            const { userId } = req.params;

            const user = await User.findById(userId);
            if(!user) return res.status(404).json({ message: "Użytkownik nie znaleziony" });

            const userClass = await Class.findOne({ name: user.class });
            if(!userClass) return res.status(404).json({ message: "Klasa nie znaleziona"});

            res.json({ class: userClass.name, schedule: userClass.schedule });
        } catch(err) {
            console.error(err);
            res.status(500).json({ message: "Błąd serwera" });
        }
    };

    async newUser(req, res) {
        try {
            const { login, password, userClass, name, surname, status, role } = req.body;

            if (!login || !password || !userClass || !name || !surname) {
                return res.status(400).json({ error: "Wszystkie pola są wymagane" });
            }

            const existingUser = await User.findOne({ login });
            if (existingUser) {
                return res.status(400).json({ error: "Użytkownik już istnieje" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                login,
                password: hashedPassword,
                class: userClass,
                name: name,
                surname: surname,
                role: role,
                status: status,
            });

            await newUser.save();
            res.status(201).json({ message: "Użytkownik utworzony", user: newUser });
        } catch (err) {
            console.error("Błąd przy tworzeniu użytkownika:", err);
            res.status(500).json({ error: "Błąd serwera" });
        }
    }

    async editUser(req, res) {
        try {
            const { userId } = req.params;
            const { login, password, userClass, name, surname, status, role } = req.body;
    
            const existingUser = await User.findById(userId);
            if (!existingUser) {
                return res.status(404).json({ error: "User not exist" });
            }
    
            if (login && login !== existingUser.login) {
                const exLogin = await User.findOne({ login });
                if (exLogin) {
                    return res.status(400).json({ error: "Login exist" });
                }
                existingUser.login = login;
            }
    
            if (password) {
                const salt = await bcrypt.genSalt(10);
                existingUser.password = await bcrypt.hash(password, salt);
            }
    
            if (userClass) existingUser.userClass = userClass;
            if (name) existingUser.name = name;
            if (surname) existingUser.surname = surname;
            if (status) existingUser.status = status;
            if (role) existingUser.role = role;
    
            await existingUser.save();
    
            return res.status(200).json({ message: "User data has been updated", user: existingUser });
        } catch (err) {
            res.status(500).json({ error: "Server error" });
        }
    }        
    
    async fetchUsers(req, res) {
        try {
            const users = await User.find({});
            return res.status(200).json(users);
        } catch (err) {
            console.error("Error when fetching data", err);
            res.status(500).json({ error: "Server error" });
        }
    };

    async fetchLogs(req, res) {
        try {
            const logs = await Logs.find({});
            return res.status(200).json(logs);
        } catch (err) {
            console.error("Error while fetching logs", err);
            res.status(500).json({ error: "Server error" });
        }
    };

    async addLog(req, res) {
        try {
            const { operationName, by, date, desc } = req.body;

            const log = new Logs({
                operationName: operationName,
                by: by,
                date: date,
                desc: desc,
            });

            await log.save();
            res.status(201).json({ message: "Log was created", log: log });
        } catch (err) {
            console.error("Error while creating log:", err);
            res.status(500).json({ error: "Server error" });
        }
    };

    async fetchClasses(req, res) {
        try {
            const classesList = await Class.find({});
            return res.status(200).json(classesList);
        } catch (err) {
            console.error("Error while fetching classes list", err);
            res.status(500).json({ error: "Server error" });
        }
    }

    async editPlan(req, res) {
        try {
            const { className, date, lessons } = req.body;
        
            let classData = await Class.findOne({ name: className });
        
            if (!classData) return res.status(404).json({ message: "Class not found" });
        
            const scheduleIndex = classData.schedule.findIndex(s => s.date === date);
        
            if (scheduleIndex !== -1) {
              classData.schedule[scheduleIndex].lessons = lessons;
            } else {
              classData.schedule.push({ date, lessons });
            }
        
            await classData.save();
            res.json({ message: "Schedule updated successfully" });
          } catch (error) {
            res.status(500).json({ message: "Server error", error });
          }
    };

    async addNotice(req, res) {
        try {
            const { userId } = req.params;
            const { title, desc, status, by, date } = req.body;
    
            const existingUser = await User.findById(userId);
            if (!existingUser) {
                return res.status(404).json({ error: "User not exist" });
            }
    
            if (desc && title && status && by && date) {
                existingUser.notices.push({
                    title: title,
                    desc: desc,
                    status: status,
                    by: by,
                    date: date,
                });
            }
    
            await existingUser.save();
    
            return res.status(200).json({ message: "Notice has been added", user: existingUser });
        } catch (err) {
            res.status(500).json({ error: "Server error" });
        }
    }
    
}

module.exports = new Actions();
