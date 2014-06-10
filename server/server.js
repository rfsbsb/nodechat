var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

var ChatPerson = function(name) {
  this.name = name;
  this.lastMessage = null;
  this.allMessages = [];
  this.message = null;

  this.getMessage = function () {
    return this.message;
  }

  this.setMessage = function (message) {
    this.message = message;
    this.lastMessage = message;
    this.allMessages.push(message);
  }
}

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    var data = JSON.parse(message);
    console.log('received: %s', data.message);

    var person = new ChatPerson("bob");
    person.setMessage(data.message + " you " + data.name + "!");
    wss.broadcast(JSON.stringify(person))
  });
});

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};
