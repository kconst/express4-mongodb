// BASE SETUP
// =============================================================================

// call the packages we need
//var express    = require('express'); 		// call express
//var app        = express(); 				// define our app using express
//var bodyParser = require('body-parser');
var Exercise     = require('./models/exercise.js'),
    fs = require('fs'),
    data = JSON.parse(fs.readFileSync('data.json')),
    mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost'); // connect to our database

//console.log(data);

data.forEach(function(e){
    var exercise = new Exercise();

    exercise.Date = e.Date;
    exercise.Time = new Date(e.Date + ' ' + e.Time);
    exercise.TimeReadable = e.Time;
    exercise.Workout = e.Workout;
    exercise.Exercise = e.Exercise;
    exercise.Equipment = e.Equipment;
    exercise.Set = e.Set.split(' ')[1];
    exercise.Weight = e['Weight (lbs)'];
    exercise.Reps = e.Reps;
    exercise.TargetReps = e.TargetReps;

    exercise.save(function(err, exercises) {
        if (err) {
            return console.log(err);
        }

        console.log(exercises);
    });
});

