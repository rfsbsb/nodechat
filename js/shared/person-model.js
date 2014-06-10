var ChatPerson = function(name) {
  this.name = name;
  this.lastMessage = null;
  this.allMessages = [];
  this.message = null;

  this.setMessage = function (message) {
    this.message = message;
    this.lastMessage = message;
    this.allMessages.push(message);
  }
}