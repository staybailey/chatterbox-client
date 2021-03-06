// YOUR CODE HERE:
// [] TODO: BackBone
// [] TODO: Styling

var Message = Backbone.Model.extend({

  initialize: function(message){
    message = this.sanitizeMessage(message);
    this.set(message); // back bone will automatically set username, roomname, and text.
  },

  sanitizeMessage: function(message) {
    _.each(message, function (item, key) {
      if (typeof item === 'string') {
        message[key] = item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
      } else {
        message[key] = 'Invalid Input';
      }
    });
    return message;
  }
});



var MessageView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change:text', this.render, this); // May make sense to have it update on different cases
  },
  render: function() {
    console.log("Render Called");
    var html = [
      '<div>',
        '<span class="' + this.model.get('username') + '">',
          this.model.get('username'),
        '</span>',
        '<span>: </span>',
        '<span class="message">',
          this.model.get('text'),
        '</span>',
        '</br>',
      '</div>'
    ].join('');
    console.log(html);
    return this.$el.html(html);
  }
});

var Messages = Backbone.Collection.extend({
  model: Message;
});


var MessagesView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('change:text', this.render, this);
  },

  render: function(){
    var html = [
      '<ul>',
      '</ul>'
    ].join('');

    this.$el.html(html);
    this.$el.find('ul').append(this.collection.map(function(message){
      var messageView = new MessageView({model: message});
      return messageView.render();
    }));
    return this.$el;
  }
});

var Room = Backbone.Model.extend({
  initialize: function(message){
    this.set('name', message.roomname);
    this.set('messages', new Messages(message));
  }
});

var RoomView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change:messages', this.render, this);
  },
  render: function() {
    var html = [
      '<div>',
        '<span class="' + this.model.get('name') + '">',
          this.model.get('name'),
        '</span>',
        '</br>',
        '<span class="messages">',
          this.model.get('messages').render();,
        '</span>',
        '</br>',
      '</div>'
    ].join('');
    return this.$el.html(html);
  }
});

var Rooms = Backbone.Collection.extend({
  model: Room;
});


var RoomsView = Backbone.View.extend({
  initialize: function(room){
    this.collection.on('change:messages', this.render, this);
  },
  render: function(){
    var html = [
      '<span>',
        
      '</span>'
    ].join('');

    this.$el.html(html);
    
    return this.$el;
  }
});



var App = Backbone.Model.extend({
  initialize: function() {
    this.set('currentRoom', null);
    this.set('server', 'https://api.parse.com/1/classes/chatterbox');
    this.set('rooms', new Rooms());
    this.set('friends', )
  }
});


var app = {};

app.init = function(){};

app.server = 'https://api.parse.com/1/classes/chatterbox';



app.friends = {};

app.fetch = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    success: function (data) {
      console.log('fetch success!');
      _.each(data.results, function(item){
        if (app.rooms[item.roomname] === undefined) {
          app.rooms[item.roomname] = new Messages();
          app.addRoom(item.roomname);
        }
        app.rooms[item.roomname].add(item);
        if(app.currentRoom === null){
          app.currentRoom = item.roomname;
        }
      });
    },
    error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve');
    }
  });
};

// Append it to the page (uncomment this when you are ready):



app.send = function (message) {  
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.astringify(message),
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
