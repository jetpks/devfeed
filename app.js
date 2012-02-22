(function() {
  "use strict";

  var connect = require('connect')
    , messages = require('./messages')
    , server
    ;

  server = connect.createServer(
      connect.favicon()
    , connect.bodyParser()
    , connect.router(messages)
    , connect.static(__dirname + '/public')
  );
  module.exports = server;
}());
