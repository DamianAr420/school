const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    surname: {
        type: String,
    },
    role: {
        type: String,
    },
    status: {
        type: String
    },
    lessons: [{
        data: String,
        od: String,
        do: String,
    }],
    grades: [{
        subject: String,
        grade: String,
        date: String,
        by: String
    }],
    notices: [{
        title: String,
        desc: String,
        by: String,
        status: String,
        date: String
    }],
    class: {
        type: String
    }
}, { collection: 'users' });

const User = mongoose.model('User', UserSchema);

module.exports = User;