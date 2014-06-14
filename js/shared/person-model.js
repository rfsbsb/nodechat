var ChatPerson = function(name) {
  this.name = name;
  this.message = null;
  this.id = 0;

  this.setMessage = function (message) {
    this.message = message;
  }
}