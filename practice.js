var MongoClient = require('mongodb').MongoClient;

function Practice(userId) {
    this.userId = userId
}

function avg(items) {
    if (items.length == 0) return 0;
    var sum = 0;
    for (var i=0; i<items.length; i++)
        sum = sum + items[i];
    return sum/items.length;
}

function findQuestion(answers) {
    if (answers.length == 0) return "Can find question in empty list";
    var choice = 0;
    for (var i=0; i<answers.length; i++) {
        var answer = answers[i];
        var choiceAnswer = answers[choice];
        var currentErrRate = (answer.errors + 1) / (answer.times.length + 1);
        var choiceErrRate  = (choiceAnswer.errors + 1) / (choiceAnswer.times.length + 1);
        if (currentErrRate > choiceErrRate) {
            choice = i;
            continue;
        }
        if (currentErrRate == choiceErrRate) {
            var choiceAvg  = avg(choiceAnswer.times);
            var currentAvg = avg(answer.times);
            if ((currentAvg == 0) || (choiceAvg > currentAvg)) {
                choice = i;
                continue;
            }
        }

    }
    return answers[choice].question;
}

Practice.prototype.question = function(userId, callback) {
    MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
        if (err !== null) return callback(err, null);
        var collection = db.collection('users');
        collection.find({userId:{$eq:Number(userId)}}).toArray(function(err, answers) {
            if (err !== null) {
                db.close();
                return callback(err, null);
            }
            callback(null, findQuestion(answers));
            db.close();
        });
    });
}

Practice.prototype.answer = function(userId, question, answer, milisec, callback) {
    MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
        if (err !== null) return callback(err, null);
        var questions = db.collection('questions');
        questions.findOne({question:{$eq:question}}, function(err, ret) {
            if (err !== null) {
                db.close();
                return callback(err, null);
            }
            var users = db.collection('users');
            if (ret.answer == answer) {
                if (milisec < 3 * 60 *1000)
                    users.update({question:{$eq:question}}, {$push:{times:Number(milisec)}}, {w:1}, function(err, result) {});
                db.close();
                return callback(null,"Right!!!");
            } else {
                if (milisec < 3 * 60 *1000)
                    users.update({question:{$eq:question}}, {$inc:{errors:1}}, {w:1}, function(err, result) {});
                db.close();
                return callback(null,"Wrong!!!");
            }
        });
    });
}

exports.Practice = Practice;



