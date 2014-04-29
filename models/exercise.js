var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExerciseSchema   = new Schema({
    Workout : String,
    Time : Date,
    TimeReadable : String,
    Date : String,
    Exercise : String,
    Equipment : String,
    Set : String,
    Weight : Number,
    Reps : Number,
    TargetReps : Number
});

module.exports = mongoose.model('Exercise', ExerciseSchema);