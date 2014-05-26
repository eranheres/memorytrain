// Retrieve
var MongoClient = require('mongodb').MongoClient;

function getQuestions() {
    var questions = [];
    for (var first=1; first<=10; first++) {
        for (var second=1; second<=10; second++) {
            var entry = {
                question : first.toString() + ' X ' + second.toString() + '=',
                answer   : (first * second).toString()
            };
            questions.push(entry);
        }
    }
    return questions;
}

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
    if(!err) {
        console.log("We are connected");
    }

    // Populate questions
    db.createCollection('questions', {w:1}, function(err, collection) {
        if (err !== null) return console.dir(err);
        collection.remove({}, {w:1}, function(err, result) {
            if (err !== null) return console.dir(err);
            var questions = getQuestions();
            for (var i=0; i<questions.length; i++) {
                var entry = questions[i];
                collection.insert(entry, {w:1}, function(err, result) {});
            }
        });
    });

    // Populate users (only 1)
    db.createCollection('users', {w:1}, function(err, collection) {
        if (err !== null) return console.dir(err);
        collection.remove({}, {w:1}, function(err, result) {
            if (err !== null) return console.dir(err);
            var questions = getQuestions();
            for (var i=0; i<questions.length; i++) {
                var entry = {
                    userId : 0,
                    question : questions[i].question,
                    errors : 0,
                    times : []
                };
                collection.insert(entry, {w:1}, function(err, result) {});
            }
        });
    });

});
