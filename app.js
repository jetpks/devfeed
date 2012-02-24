(function() {
  "use strict";

  var connect = require('connect')
    , messages = require('./routers/messages')
    , meta = require('./routers/server')
    , server
    ;

  server = connect.createServer(
      connect.favicon()
    , connect.bodyParser()
    , connect.router(messages)
    , connect.router(meta)
    , connect.static(__dirname + '/public')
  );
  module.exports = server;
}());
