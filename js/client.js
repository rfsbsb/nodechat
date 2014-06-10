function WebSocketTest() {
  if ("WebSocket" in window) {
     // Let us open a web socket
     var ws = new WebSocket("ws://localhost:8080/");
     ws.onopen = function() {
        // Web Socket is connected, send data using send()
        ws.send("Message to send");
        console.log("Message is sent...");
     };
     ws.onmessage = function (evt) {
        var received_msg = evt.data;
        console.log("Message is received... " + received_msg);
     };
     ws.onclose = function() {
        // websocket is closed.
        console.log("Connection is closed...");
     };
  }
  else {
     // The browser doesn't support WebSocket
     console.log("WebSocket NOT supported by your Browser!");
  }
}

var ChatPerson = function(name) {
  this.name = name;
  this.lastMessage = null;
  this.allMessages = new Array();
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

var ChatClient = function() {
  this.ws = new WebSocket("ws://localhost:8080/");
  this.people = [1,2,3];
  var self = this;

  this.ws.onmessage = function(msg) {
    var message = JSON.parse(msg.data);
    var personName = message.name;

    // check if person is already logged
    var hasPeople = $.grep(self.people, function(e){ return e.name == personName; });
    if (hasPeople.length == 0) {
      var person = new ChatPerson(personName);
      person.setMessage(message.message);
      self.people.push(person);
    } else if (hasPeople.length == 1) {
      person = hasPeople[0];
      person.setMessage(message.message);
    }

    self.showMessage(person);
  }

  this.showMessage = function(person) {
    console.log("Person "+person.name+" said "+person.getMessage());
  }

  this.personSay = function(message) {
    person = new ChatPerson("john");
    person.setMessage(message);
    personData = JSON.stringify(person);
    this.ws.send(personData);
  }
};