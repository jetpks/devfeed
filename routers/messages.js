(function() {
  "use strict";


  var cradle = require('cradle')
    , forEachAsync = require('forEachAsync')
    , db = new(cradle.Connection)().database('devfeed')
    , helper = require('./helper')
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
        helper.respondFail(res, { status: false, message: "Missing nick or message." });
      }
      nick = req.body.nick;
      message = req.body.message;

      db.save({nick: nick, message: message, type: "message", timestamp: timestamp}, function (err, response) {
        if(err) { 
          console.log("Problem with database: ", err); 
          helper.respondFail(res, "Problem saving to database.");
          return;
        }
        helper.respondSuccess(res, "Saved!");
        return;
      });
    }

    function allFrom(req, res) {
      if(!req.params.hasOwnProperty('timestamp') || !helper.isNum(req.params.timestamp)) {
        helper.respondFail(res, "Timestamp missing!");
        return;
      }
      var timestamp = req.params.timestamp
        , msgGroup = {}
        ;

      db.view('feed/messages', function(err, dbRes) {
        if(!dbRes) {
          helper.respondSuccess(res, {});
          return;
        }
        forEachAsync(dbRes, function(next, key, value) {
          if(key > timestamp) {
            msgGroup[key] = value;
          }
          next();
        }).then(function() {
          helper.respondSuccess(res, msgGroup);
        });
      });
    }

  }
  module.exports = handler;

}());
