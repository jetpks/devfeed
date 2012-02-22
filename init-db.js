(function() {
  "use-strict";

  var cradle = require('cradle')
    , fs = require('fs')
    , cradle = new (cradle.Connection)
    , dbName = 'devfeed'
    , db
    , view
    ;

  view = {
    /*
    latestConfig: {
      map: function(doc) {
        if(doc.type === 'config') {
          emit(doc.timestamp, doc);
        }
      }
  ,
    internal: {
      map: function(doc) {
        if (doc.type === 'internal') {
          emit(doc.timestamp, doc);
        }
      }
    }
    */
  };

  db = cradle.database(dbName);
  db.create(function (createErr) {
    if (createErr) {
      console.log("Error creating db:\n" + createErr.reason);
      if (createErr.error != "file_exists")
        return;
    }
    console.log("Database created, or already existed!");
    db.save("_design/feed", view, function(err, res) {
      if (err) {
        console.log("Error encountered while saving document:");
        console.log(JSON.stringify(err, null, '  '));
        return;
      }
      console.log("Response: "+ res);
      console.log("(that means it probably worked)");
    });
  });
}());
