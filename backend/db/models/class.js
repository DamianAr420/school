const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    subject: String,  
    teacher: String,  
    from: String,       
    to: String          
});

const ClassSchema = new mongoose.Schema({
    name: { type: String }, 
    subjects: [{
        name: String,
        teacher: String
    }],
    schedule: [{  
        date: String,
        lessons: [LessonSchema]
    }]
}, { collection: 'classes' });

const Class = mongoose.model('Class', ClassSchema);

module.exports = Class;
