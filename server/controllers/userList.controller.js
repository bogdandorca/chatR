responseApi = require('response-api');

module.exports = {
    onlineUsers: [],
    // Used when sending messages to other users
    userSockets: {},
    connect: function(io, socket){
        socket.emit('initOnlineUserList', this.onlineUsers);
    },
    createClientSpecificUserObject: function(user){
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isOnline: user.logged_in
        };
    },
    connectNewUser: function(io, socket){
        if(!this.userSockets[socket.request.user.id]){
            this.userSockets[socket.request.user.id] = socket;
            this.onlineUsers.push(this.createClientSpecificUserObject(socket.request.user));
        }
        io.emit('userConnected', responseApi.success('A new user has connected', socket.request.user, socket.request.user));
    },
    disconnect: function(io, socket){
        delete this.userSockets[socket.request.user.id];

        var currentUser = null;
        for(var i=0; i<this.onlineUsers.length; i++){
            if(this.onlineUsers[i].id === socket.request.user.id){
                currentUser = this.onlineUsers[i];
                this.onlineUsers.splice(i, 1);
            }
        }
        io.emit('userDisconnected', responseApi.success('A user has disconnected', currentUser, true));
    }
};