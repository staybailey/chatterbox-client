// YOUR CODE HERE:
  
var app = {};

app.init = function(){};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.fetch = function(){
  var that = this;
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    success: function (data) {
      console.log('fetch success!');
      var results = data.results;
      for(var i = 0; i < results.length; i++) {
        that.addMessage(results[i]);
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
  $('.roomSelect').append('<option value="' + room + '">' + room + '</option>');
};

app.addFriend = function(friend) {
  $('[id=' + friend + ']').css("font-weight", "Bold");
};

app.sanitizeMessage = function(message) {
    _.each(message, function (item, key) {
      if (typeof item === 'string') {
        message[key] = item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
      } else {
        message[key] = 'Invalid Input';
      }
    });
    return message;
};

$('#Bailey').on('click', function(){
    app.addFriend('Bailey');
  })


$(document).ready(function() {
  $('.submit').on('click', function () {
    var text = $('textarea').val();
    app.send(text);
  });

  $('.clear').on('click', function () {
    app.clearMessages();
  });
});
