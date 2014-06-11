var ChatView = function() {
  this.listContainer = $(".user-list ul");
  this.messageContainer = $(".talking");

  this.createListElement = function(elementData) {
    $(this.listContainer).append('<li class="person-name">' + elementData + "</li>");
  }

  this.createMessageElement = function(person) {
    $(this.messageContainer).append('<div class="message-item"><span class="person-name">' + person.name + '</span>  says: <span class="message">' + person.message + "</span></div>");
  }

  this.drawList = function(list) {
    $(this.listContainer).html("");
    for (person in list) {
      this.createListElement(list[person].name);
    }
  }

  this.drawNewMessage = function(person) {
    this.createMessageElement(person);
  }
}