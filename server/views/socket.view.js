var UserListController = require('../controllers/userList.controller');

module.exports = function(io){
    io.on('connection', function(socket){
        UserListController.connect(io, socket);
        UserListController.connectNewUser(io, socket);

        // User disconnect
        socket.on('disconnect', function(){
            UserListController.disconnect(io, socket);
        });
        socket.on('disconnectClient', function(){
            UserListController.disconnect(io, socket);
        });
    });
};