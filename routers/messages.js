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
    app.get('/update/since/:timestamp', since);
    app.get('/update/last/:seconds', last);

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
        helper.respondSuccess(res, {saved: true, timestamp: timestamp});
        return;
      });
    }

    function since(req, res) {
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
            delete msgGroup[key]._id;
            delete msgGroup[key]._rev;
          }
          next();
        }).then(function() {
          helper.respondSuccess(res, msgGroup);
        });
      });
    }

    function last(req, res) {
      if(!req.params.hasOwnProperty('seconds') || !helper.isNum(req.params.seconds)) {
        helper.respondFail(res, "Bad query! (missing seconds)");
        return;
      }
      var seconds = req.params.seconds * 1000
        , msgGroup = {}
        , now = Date.now()
        ;

      db.view('feed/messages', function(err, dbRes) {
        if(!dbRes) {
          helper.respondSuccess(res, {});
          return;
        }
        forEachAsync(dbRes, function(next, key, value) {
          if(now - key < seconds) {
            msgGroup[key] = value;
            delete msgGroup[key]._id;
            delete msgGroup[key]._rev;
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
