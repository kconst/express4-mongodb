// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var Exercise     = require('./models/exercise.js');

var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost'); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('***');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.send('hooray! welcome to our api!');
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

router.route('/exercises')

    // create a exercise (accessed at POST http://localhost:8080/api/exercises)
    .post(function(req, res) {

        var exercise = new Exercise(); 		// create a new instance of the exercise model
        exercise.name = req.body.name;  // set the exercises name (comes from the request)

        // save the exercise and check for errors
        exercise.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Exercise set created!' });
        });

    })

    // get all the exercises (accessed at GET http://localhost:8080/api/exercises)
    .get(function(req, res) {
        Exercise.find(function(err, exercises) {
            if (err)
                res.send(err);

            res.json(exercises);
        });
    });

router.route('/type/:sort')
    .get(function(req, res){
        Exercise.find({ Exercise : req.params.sort }, function(err, exercises){
            res.json(exercises);
        });
    });

router.route('/exercises/:exercise_id')

    // get the exercise with that id (accessed at GET http://localhost:8080/api/exercises/:exercise_id)
    .get(function(req, res) {
        Exercise.findById(req.params.exercise_id, function(err, exercise) {
            if (err)
                res.send(err);
            res.json(exercise);
        });
    })

    // update the exercise with this id (accessed at PUT http://localhost:8080/api/exercises/:exercise_id)
    .put(function(req, res) {

        // use our exercise model to find the exercise we want
        Exercise.findById(req.params.exercise_id, function(err, exercise) {

            if (err)
                res.send(err);

            exercise.name = req.body.name; 	// update the exercises info

            // save the exercise
            exercise.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Exercise updated!' });
            });

        });
    })

    // delete the exercise with this id (accessed at DELETE http://localhost:8080/api/exercises/:exercise_id)
    .delete(function(req, res) {
        Exercise.remove({
            _id: req.params.exercise_id
        }, function(err, exercise) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);