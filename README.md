DevFeed
===

DevFeed is a communications server for developers that allows message sharing
in real time.

Some features:
  * JSON/Resty API.
  * Simple
  * History support (e.g. get all messages since <timestamp>);


API Documentation:
---

### `/send`
  * Usage: To post a message to the chat.
  * POST only.
  * Expecting an object that looks like this in the post body:

    {
        nick: "name"
      , message: "Message goes here."
    }
  * `nick` is the name that the user wishes to post under.
  * `message` is the message that the user wishes to post.


### `/update/:timestamp`
  * Usage: To get messages from the chat room.
  * GET only.
  * :timestamp needs to be replaced with a timestamp sometime in the past. The
    timestamp represents how far back you would like messages from. For
    example, if the current time was `1330071170397`, a :timestamp of 
    `1330071110397` would get all messages posted in the last minute.

    You could also post a :timestamp of 0 to get all messages ever posted in
    the room.


### `/server/time`
  * Usage: To get the server's current time.
  * GET only.
  * This is useful to calculate the offset between the client's time and the
    server time. Because all requests for `/update/:timestamp` are based on the
    server time, the offset is useful.
