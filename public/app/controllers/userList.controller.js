angular.module('app').controller('UserListCtrl', function($scope, SocketService, AuthService){
    $scope.users = [];

    // Initialize the Online User List
    SocketService.socket.on('initOnlineUserList', function(onlineUserList){
        angular.forEach(onlineUserList, function(value, key){
            if(value.email !== AuthService.get().email){
                $scope.users.push(value);
            }
        });
        $scope.$apply();
    });

    // Add new user to the Online List
    SocketService.socket.on('userConnected', function(msg){
        var newUser = msg.success.object;
        var newUserObject = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isOnline: newUser.logged_in
        };

        if(newUserObject.email !== AuthService.get().email){
            var userExists = false;
            angular.forEach($scope.users, function(value, key){
                if(value.email === newUserObject.email){
                    // If the user is not online, push as online
                    if(value.isOnline !== true){
                        $scope.users[key].isOnline = true;
                        $scope.$apply();
                    } else {
                        userExists = true;
                    }
                }
            });
            if(!userExists){
                $scope.users.push(newUserObject);
                $scope.$apply();
            }
        }
    });

    // Disconnect a user
    SocketService.socket.on('userDisconnected', function(user){
        angular.forEach($scope.users, function(value, key){
            if(value.email === user.success.object.email){
                $scope.users.splice(key, 1);
                $scope.$apply();
            }
        });
    });
});