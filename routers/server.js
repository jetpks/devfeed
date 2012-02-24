(function() {
  "use strict";

  var helper = require('./helper')
    ;

  function handler(app) {
    /* routers */
    app.get('/server/time', now);

    /* router workers */
    function now(req, res) {
      helper.respondSuccess(res, {serverTime: Date.now()});
    }
  }

  module.exports = handler;

}());
