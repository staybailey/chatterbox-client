// YOUR CODE HERE:
// [] TODO: BackBone
// [] TODO: Styling
var app = {};

app.init = function(){};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.results = []

app.currentRoom = null;

app.rooms = {};

app.friends = {};

app.fetch = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    success: function (data) {
      console.log('fetch success!');
      app.results = data.results;
      app.clearMessages();
      _.each(app.results, function(item){
        if(app.currentRoom === null){
          app.currentRoom = item.roomname;
        }
        if (item.roomname === app.currentRoom) {
          app.addMessage(item);
        } 
        if (app.rooms[item.roomname] === undefined) {
          app.rooms[item.roomname] = true; // Dummy Value
          app.addRoom(item.roomname);
        }
      });
    },
    error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve');
    }
  });
};

app.send = function (message) {  
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.clearMessages = function(){
  $('.chats').empty();
};

app.addMessage = function(message){
  message = this.sanitizeMessage(message);
  if (app.friends[message.username] === undefined) {
    $('.chats').append('<p id="' + message.username + '">' + message.username + ": " + message.text + '</p>')
  } else {
    $('.chats').append('<p class="friends" id="' + message.username + '">' + message.username + ": " + message.text + '</p>')
  }
};

app.addRoom = function(room) {
  // if ($('option :input[value="' + room + '"]') === 0) { // #attached_docs :input[value="123"]
    console.log("Adding a room");
    $('.roomSelect').append('<option value="' + room + '">' + room + '</option>');
};

app.addFriend = function(friend) {
  $('[id="' + friend + '"]').attr("class", "friends");
  app.friends[friend] = friend;
};

app.sanitizeMessage = function(message) {
    _.each(message, function (item, key) {
      if (typeof item === 'string') {
        message[key] = item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
      } else {
        message[key] = 'Invalid Input';
      }
    });
    return message;
};

$(document).ready(function() {
  $('.submit').on('click', function () {
    var username = $('.inputName').val();
    var text = $('textarea').val();
    var message = {};
    message.username = username;
    message.text = text;
    message.roomname = app.currentRoom;
    app.send(message);
    setTimeout(function(){
      app.clearMessages();
      app.fetch();
    }, 50)
  });

  $('.clear').on('click', function () {
    app.clearMessages();
  });

  $('.roomSelect').change(function() {
    app.currentRoom = $("select option:selected").text();
    app.clearMessages();
    _.each(app.results, function(item){
      if (item.roomname === app.currentRoom) {
        app.addMessage(item);
      }
    });
  });

  $('.chats').on('click', 'p', function(e) {
    console.log("P was clicked")
    var username = $(e.target).attr('id');
    console.log(username);
    app.addFriend(username);
  })

  app.fetch();
  setInterval(app.fetch, 1000);
});
