$(document).ready(function(){

  // adjusting the user-bar and chat area heights
  $(window).resize(function(){
    newheight = $(window).innerHeight() - $(".command-bar").innerHeight();
    $(".user-list").innerHeight(newheight);
    $(".talking").innerHeight(newheight);
  });
  $(window).resize();

  // Starting chat client
  var personName = prompt("Please enter your name", "John doe");
  chat = new ChatClient(personName);

  $(".command-bar").on("click", ".send-message", function(){
    var message = $(".message-box").val();
    var messageIsBlank = (!message || /^\s*$/.test(message));
    if (!messageIsBlank) {
      chat.sendMessage(message);
      $(".message-box").val("");
    }
    return false;
  });

});