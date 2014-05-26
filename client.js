var http = require('http');
var async = require('async');
var readline = require('readline');


var question = '';
function getQuestion(callback){
    var options = {
        host: '127.0.0.1',
        port: 9000,
        path: '/question?user=0'
    };
    http.request(options, function(response) {
        question = '';

        response.on('data', function (chunk) { question += chunk; });
        response.on('end', function () { callback(null, question); });
        response.on('error', function (err) { callback(err, "question"); });

    }).end();
};

var answer = '';
var time = 0;

function readInput(callback){
    time = new Date().getTime();
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(question, function(ans) {
        answer = ans;
        time = new Date().getTime() - time;
        rl.close();
        callback(null, answer);
    });
};

function postAnswer(callback){
    var options = {
        host: '127.0.0.1',
        port: 9000,
        path: '/answer?'+
            'user=0&'+
            'question='+encodeURIComponent(question)+'&'+
            'answer='+encodeURIComponent(answer)+'&'+
            'time='+time
    };
    http.request(options, function(response) {
        var ret = '';

        response.on('data', function (chunk) { ret += chunk; });
        response.on('end', function () {
            console.log(ret + '\n');
            callback(null, ret);
        });
        response.on('error', function (err) { callback(err, "response"); });
    }).end();
};

function single(callback) {
    async.series([
        getQuestion,
        readInput,
        postAnswer
    ],
    function(err, results){
        console.log("Next question:");
        callback(err, results);
    });
}

async.forever(single, function(err) {
    console.log("Error : " + err);
});
