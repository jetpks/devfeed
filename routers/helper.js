(function() {
  "use strict";

  var helpers = {

      respondFail: function (res, message) {
        var response = { success: false, result: message };
        res.end(JSON.stringify(response));
      }

    , respondSuccess: function (res, message) {
        var response = { success: true, result: message };
        res.end(JSON.stringify(response));
      }

    , isNum: function(n) {
        if(typeof n === 'string') {
          n.replace(/\w/, '');
        }
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
  }

  module.exports = helpers;
}());
