(function() {
  "use strict";

  var cradle = require('cradle')
    , forEachAsync = require('forEachAsync')
    , db = new(cradle.Connection)().database('devfeed')
    ;

  function handler(app) {
    /* routers */
    app.post('/send', incoming);
    app.get('/update/:timestamp', allFrom);

    /* router workers */
    function incoming(req, res) {
      var nick
        , message
        , timestamp = Date.now()
        ;

      if(!req.body.hasOwnProperty('nick')
      || !req.body.hasOwnProperty('message')) {
        res.end(JSON.stringify({ status: false, message: "Missing nick or message." }));
      }
      nick = req.body.nick;
      message = req.body.message;

      db.save({nick: nick, message: message, type: "message", timestamp: timestamp}, function (err, response) {
        if(err) { 
          console.log("Problem with database: ", err); 
          respondFail(res, "Problem saving to database.");
          return;
        }
        respondSuccess(res, "Saved!");
        return;
      });
    }

    function allFrom(req, res) {
      if(!req.params.hasOwnProperty('timestamp') || !isNum(req.params.timestamp)) {
        respondFail(res, "Timestamp missing!");
        return;
      }
      var timestamp = req.params.timestamp
        , msgGroup = {}
        ;

      db.view('feed/messages', function(err, dbRes) {
        forEachAsync(dbRes, function(next, key, value) {
          if(key > timestamp) {
            msgGroup[key] = value;
          }
          next();
        }).then(function() {
          res.end(JSON.stringify(msgGroup));
        });
      });
    }

    /* helpers */
    function respondFail(res, message) {
      var response = { success: false, result: message };
      res.end(JSON.stringify(response));
    }
    
    function respondSuccess(res, message) {
      var response = { success: true, result: message };
      res.end(JSON.stringify(response));
    }

    function isNum(n) {
      if(typeof n === 'string') {
        n.replace(/\w/, '');
      }
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  }
  module.exports = handler;

}());
