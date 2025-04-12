const express = require('express');
const router = express.Router();
const actions = require('../api/actions');

router.post('/login', actions.login);
router.get('/fetchData/:userId', actions.fetchData);
router.get('/schedule/:userId', actions.schedule);
router.post('/newUser', actions.newUser);
router.put('/editUser/:userId', actions.editUser);
router.get('/fetchUsers', actions.fetchUsers);
router.get('/fetchLogs', actions.fetchLogs);
router.post('/addLog', actions.addLog);
router.get('/fetchClasses', actions.fetchClasses);
router.post('/editPlan', actions.editPlan);
router.post('/addNotice/:userId', actions.addNotice);

module.exports = router;
