// YOUR CODE HERE:
// [] TODO: Room resets on every submit
// [] TODO: Implement the bold friend function
// [] TODO: Allow users to select username for submit
// [] TODO: Have messages refresh periodically
// [] TODO: BackBone
// [] TODO: Styling
var app = {};

app.init = function(){};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.results = []

app.currentRoom = '';

app.fetch = function(){
  var that = this;
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    success: function (data) {
      console.log('fetch success!');
      that.results = data.results;
      _.each(that.results, function(item){
        if (item.roomname === that.currentRoom) {
          that.addMessage(item);
        }
      });
      var roomNames = [];
      // Needs to be fixed to only show 
      for(var i = 0; i < that.results.length; i++) {
        roomNames.push(that.results[i].roomname);
      }
      $('.roomSelect').empty();
      var uniqRooms = _.uniq(roomNames);
      uniqRooms.sort();
      for(var i = 0;i<uniqRooms.length;i++){
        that.addRoom(uniqRooms[i]);
      }
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
  $('.chats').append('<p id="' + message.username + '">' + message.username + ": " + message.text + '</p>');
};

app.addRoom = function(room) {
  // if ($('option :input[value="' + room + '"]') === 0) { // #attached_docs :input[value="123"]
    console.log("Adding a room");
    $('.roomSelect').append('<option value="' + room + '">' + room + '</option>');
};

app.addFriend = function(friend) {
  $('[id=' + friend + ']').css("font-weight", "Bold");
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

$('#Bailey').on('click', function(){
    app.addFriend('Bailey');
  });


$(document).ready(function() {
  $('.submit').on('click', function () {
    var text = $('textarea').val();
    var message = {};
    message.username = 'Bailey+Justin';
    message.text = text;
    message.roomname = 'floor 8';
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
});
