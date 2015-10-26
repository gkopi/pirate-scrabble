// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var http = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var game = require('./Game.js');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var users = {};
var numUsers = 0;
var letters = [];
var users_to_usernames = {};

function reset_users_words() {
	for (username in users) {
		users[username]['words'] = game.get_words_by_username(username);
	}
}

io.on('connection', function (socket) {
  var addedUser = false;
	io.sockets.emit('update display', { 
		users: users,
		letters: game.get_open_letters()
	});

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
		if(data.substring(0,1) != '/') {
			socket.broadcast.emit('new message', {
				username: socket.username,
				message: data
			});
		}	else {
			len = data.length;
			word = data.substring(1,len);
			if(game.steal_word(word,users_to_usernames[socket.username])) {
				reset_users_words();
				io.sockets.emit('update display', { 
					users: users,
					letters: game.get_open_letters()
				});
			}	
		}
  });

  socket.on('tile flip', function () {
		flipTile();
		io.sockets.emit('update display', { 
			users: users,
			letters: game.get_open_letters()
		});
	});

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
		users[username] = {};
		users[username]['words'] = [];
		users_to_usernames[username] = game.create_user(username)
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
		io.sockets.emit('update display', { 
			users: users,
			letters: game.get_open_letters()
		});
  });

  // when the client emits 'typing', we broadcast it to others
  function flipTile() {
		game.flip_tile();
    io.sockets.emit('update display', {
      users: users,
			letters: game.get_open_letters()
    });
  };

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
