(function() {
  "use strict";

  var cradle = require('cradle')
    , db = new(cradle.Connection)().database('devfeed')
    ;

  function handler(app) {
    /* routers */
    app.post('/send', incoming);
    app.get('/update/:nick/:timestamp', allFrom);

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
      });
    }

    function allFrom(req, res) {
      var notify = false
        , nick
        , timestamp
        ;

      if(!req.params.hasOwnProperty(timestamp)
      || !req.params.hasOwnProperty(nick)) {
        respondFail(res, "Timestamp or nickname missing!");
      }
      
      // Needs to grab new messages from the db and send them back to the user.

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
  }
  module.exports = handler;

}());
