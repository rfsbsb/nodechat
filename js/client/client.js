var ChatClient = function(personName) {
  this.ws = new WebSocket("ws://localhost:8080/");
  this.personName = personName;
  this.view = new ChatView();
  var self = this;

  this.ws.onopen = function() {
    self.person = new ChatPerson(self.personName);
    self.ws.send(JSON.stringify({proto: "open", "person": self.person}));
  }

  this.ws.onmessage = function(msg) {
    var data = JSON.parse(msg.data);
    if (data.proto == "send") {
      self.showMessage(data);
    }
    if (data.proto == "list") {
      self.assebleListUsers(data);
    }
  }

  this.showMessage = function(data) {
    this.view.drawNewMessage(data.person);
  }

  this.assebleListUsers = function(data) {
    this.view.drawList(data.people);
  }

  this.sendMessage = function(message) {
    this.person.setMessage(message);
    console.log(this.person);
    var message = {proto: "send", "person": this.person};
    this.ws.send(JSON.stringify(message));
  }

  this.getListUsers = function() {
    var message = JSON.stringify({proto: "list"});
    this.ws.send(message);
  }
};