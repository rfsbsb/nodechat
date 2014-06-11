var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

// probably not the best way to include a model
// but for the sake of this exercise, will do
var fs = require('fs');
eval(fs.readFileSync('../shared/person-model.js')+'');


var people = [];
var clientId = 0;

wss.on('connection', function(ws) {
  var thisId = ++clientId;

  ws.on('message', function(msg) {
    var data = JSON.parse(msg);

    if (data.proto == "send") {
      postMessage(thisId, data);
    }

    if (data.proto == "list") {
      sendList();
    }

    if (data.proto == "open") {
      var person = getPerson(thisId, data.person.name);
      person.setMessage(person.name + " enters in the room...");
      sendList();
    }

  });

  ws.on('close', function(){
    var personInArray = people.filter(function(person){
      return person.id != thisId;
    });
    people = personInArray;
    sendList();
  });


});


function sendList() {
  var message = {proto: "list", "people":people};
  wss.broadcast(JSON.stringify(message));
}

function postMessage(id, data) {
  var person = getPerson(id, data.person.name);
  person.setMessage(data.person.message);
  var data = {proto: "send", "person": person};
  wss.broadcast(JSON.stringify(data));
}

function getPerson(id, personName) {
  var person = getPersonById(id);

  if (!person) {
    var num = getNameOccurrences(personName);
    if (num >= 1) {
      person = new ChatPerson(personName + " " + id);
    } else {
      person = new ChatPerson(personName);
    }
    person.id = id;
    people.push(person);
  }

  return person;
}

function getNameOccurrences(personName) {
  var personInArray = people.filter(function(person){
    var pattern = new RegExp("^" + personName + "([0-9 ]*)?$", "gi");
    return pattern.test(person.name);
  });
  return personInArray.length;
}

function getPersonById(id) {
  var personInArray = people.filter(function(person){
    return person.id == id;
  });

  var person = null;

  if (personInArray.length == 1) {
    return personInArray[0];
  }

  return person;
}

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};
