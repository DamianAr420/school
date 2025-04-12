const mongoose = require('mongoose');

const Logs = new mongoose.Schema({
    operationName: String,
    by: String,
    date: String,
    desc: String,
}, { collection: 'logs' });

const LogsSchema = mongoose.model('Logs', Logs);

module.exports = LogsSchema;
