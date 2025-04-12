const express = require('express');
const app = express();
const { port } = require('./config');
const apiRouters = require('./routers/api');
const cors = require('cors');

require('./db/db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouters);
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }));

app.get('/fetchData/:userId', apiRouters);
app.post('/login', apiRouters);
app.get('/schedule/:userId', apiRouters);
app.post('/newUser', apiRouters);
app.put('/editUser/:userId', apiRouters);
app.get('/fetchUsers', apiRouters);
app.get('/fetchLogs', apiRouters);
app.post('/addLog', apiRouters);
app.get('/fetchClasses', apiRouters);
app.post('/editPlan', apiRouters);
app.post('/addNotice/:userId', apiRouters);

app.listen(port, () => {
    console.log('Serwer działa na porcie: ' + port);
});

module.exports = app;
