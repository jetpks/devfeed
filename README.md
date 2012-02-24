DevFeed
===

DevFeed is a communications server for developers that allows message sharing
in real time.

# Some features:
  * JSON/Resty API.
  * Simple
  * History support (e.g. get all messages since <timestamp>);


API Documentation:
---

### Structure
##   Responses are always formatted as such:

  * On success: `{ success: true, result: { data: data } }`
  * On failure: `{ success: false, result: "Message about the failure." }`

  * `success` tells you whether or not your request was successfull, and 
  * If `success` is true, then `result` contains the data you were asking for.
  * If `success` is false, then `result` contains an error message.


### Resources
## `/send`
  * Usage: To post a message to the chat.
  * POST only.
  * Expecting an object that looks like this in the post body:

```json
      {
          nick: "name"
        , message: "Message goes here."
      }
```

  * `nick` is the name that the user wishes to post under.
  * `message` is the message that the user wishes to post.
  * Successful response looks like this: 

```json
    { "success": true, "result": { "saved": true, "timestamp": 1330073393938 }}
```

## `/update/since/:timestamp`
  * Usage: To get messages from the chat room.
  * GET only.
  * `:timestamp` needs to be replaced with a timestamp sometime in the past. The
    timestamp represents how far back you would like messages from. For
    example, if the current time was `1330071170397`, a `:timestamp` of 
    `1330071110397` would get all messages posted in the last minute.

    You could also post a `:timestamp` of 0 to get all messages ever posted in
    the room.

  * Success looks like this:

```json
    {
        "result": {
            "1329941180485": {
                "message": "Hello there.", 
                "nick": "eric", 
                "timestamp": 1329941180485, 
                "type": "message"
            }, 
            "1330073393938": {
                "message": "I'm a bus!", 
                "nick": "eric", 
                "timestamp": 1330073393938, 
                "type": "message"
            }
        }, 
        "success": true
    } 
```

## `/update/last/:seconds`
  * Usage: To get messages from the chat room that happened during previous
    `:seconds` amount of seconds.
  * GET only.
  * `:seconds` needs to be replaced with a positive integer value which
    indicates the maximum age in seconds of the posts that will be returned.

  * Success looks like this:

```json
    {
        "result": {
            "1330073393938": {
                "message": "I'm a bus!", 
                "nick": "eric", 
                "timestamp": 1330073393938, 
                "type": "message"
            }, 
        }, 
        "success": true
    }


## `/server/time`
  * Usage: To get the server's current time.
  * GET only.
  * This is useful to calculate the offset between the client's time and the
    server time. Because all requests for `/update/:timestamp` are based on the
    server time, the offset is useful.
