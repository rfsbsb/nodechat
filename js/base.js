$(document).ready(function(){

  $(window).resize(function(){
    newheight = $(window).innerHeight() - $(".command-bar").innerHeight();
    $(".user-list").innerHeight(newheight);
    $(".talking").innerHeight(newheight);
  });

  chat = new ChatClient();

  $(window).resize();
});