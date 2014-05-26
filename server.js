var http = require('http');
var url = require('url');
var querystring = require('querystring');
var Practice = require('./practice.js').Practice;


http.createServer(function (req, res) {
    console.log("got request:"+req.url);
    var path = url.parse(req.url);
    var query = querystring.parse(path.query);

    res.writeHead(200, {'Content-Type': 'text/plain'});
    // Question
    if (path.pathname == "/question") {
        if (query.user == undefined) {
            res.end("Invalid question syntax");
            return;
        }
        Practice.prototype.question(query.user, function(err, data) {
            if (err !== null) {
                res.end("Error!!!");
                return;
            }
            res.end(data.toString());
        });
    }
    // Answer
    else if (path.pathname == "/answer") {
        if ((query.user == undefined) || (query.question == undefined) ||
            (query.answer == undefined) || (query.time == undefined)) {
            res.end("Invalid answer syntax");
            return;
        }
        Practice.prototype.answer(query.user, query.question, query.answer, query.time, function(err, data) {
            if (err !== null) {
                res.end("Error!!!");
                return;
            }
            res.end(data.toString());
        });
    }
    // Other
    else {
        res.end("Invalid request");
    }

}).listen(9000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:9000/');