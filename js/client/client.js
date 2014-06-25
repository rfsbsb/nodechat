var ChatClient = function(personName) {
  this.ws = new WebSocket("ws://localhost:8080/");
  this.personName = personName;
  this.view = new ChatView();
  this.db = new Database();
  var self = this;

  this.ws.onopen = function() {
    self.person = new ChatPerson(self.personName);
    self.ws.send(JSON.stringify({proto: "open", "person": self.person}));
  }

  this.ws.onmessage = function(msg) {
    var data = JSON.parse(msg.data);
    if (data.proto == "send") {
      self.showMessage(data);
      self.db.saveMessage(data.person);
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

var Database = function() {
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
  }

  this.indexedDB = {};
  this.db = null;
  var self = this;

  this.open = function () {
    var req = window.indexedDB.open("nodechat", 1.0);

    // hack para funcionar em versões antigas do Chrome
    req.onsuccess = function(e) {
      self.db = e.target.result;
      var db = self.db;
      if (db.setVersion) {
        if (db.version != dbVersion) {
          var req = db.setVersion(dbVersion);
          req.onsuccess = function () {
            if(db.objectStoreNames.contains("messages")) {
              db.deleteObjectStore("messages");
            }
            var store = db.createObjectStore("messages", {keyPath: "timeStamp"});
          };
        }
      }
    }

    req.onupgradeneeded = function(e) {
      self.db = e.target.result;
      var db = self.db;
      if(db.objectStoreNames.contains("messages")) {
        db.deleteObjectStore("messages");
      }
      var store = db.createObjectStore("messages", {keyPath: "timeStamp"});
    }

    req.onfailure = self.indexedDB.onerror;
    req.onerror = function(e) {
      console.error("Err:" + e);
    }
  }

  this.saveMessage = function(item) {
    if (!self.db) {
      this.open();
    }
    var db = self.db;
    var trans = db.transaction(['messages'], "readwrite");
    var store = trans.objectStore("messages");

    var data = {
      "mensagem": item.message,
      "pessoa": item.name,
      "timeStamp": new Date().getTime()
    };
    var request = store.put(data);
    request.onsuccess = function(e) {
      console.log("Salvou");
    };
    request.onerror = function(e) {
      console.error("Erro: ", e);
    };
  }

}