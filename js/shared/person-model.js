var ChatPerson = function(name) {
  this.name = name;
  this.lastMessage = null;
  this.allMessages = [];
  this.message = null;
  this.id = 0;

  this.setMessage = function (message) {
    this.message = message;
    this.lastMessage = message;
    this.allMessages.push(message);
  }
}