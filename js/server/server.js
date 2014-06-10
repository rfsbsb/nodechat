var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

// probably not the best way to include a model
// but for the sake of this exercise, will do
var fs = require('fs');
eval(fs.readFileSync('../shared/person-model.js')+'');


var people = [];

wss.on('connection', function(ws) {
  ws.on('message', function(msg) {
    var data = JSON.parse(msg);
    if (data.proto == "send") {
      postMessage(data);
    }

    if (data.proto == "list") {
      var message = {proto: "list", "people":people};
      ws.send(JSON.stringify(message));
    }

    if (data.proto == "open") {
      var person = getPersonByName(data.person.name);
      person.setMessage(person.name + " enters in the room...");
    }

  });
});

function postMessage(data) {
  var person = getPersonByName(data.person.name);
  person.setMessage(data.person.message);
  var data = {proto: "send", "person": person};
  wss.broadcast(JSON.stringify(data));
}

function getPersonByName(personName) {
  var personInArray = people.filter(function(person){
    var pattern = new RegExp("^" + personName + "([0-9 ]*)?$", "gi");
    return pattern.test(person.name);
  });

  var person = null;
  if (personInArray.length > 0) {
    person = new ChatPerson(personName + " " + (personInArray.length + 1));
    people.push(person);
  } else {
    person = new ChatPerson(personName);
    people.push(person);
  }

  return person;
}

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};
