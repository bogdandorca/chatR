angular.module('app').factory('SocketService', function(){
    return {
        socket: null,
        init: function(){
            if(!this.socket){
                this.socket = io();
            }
        }
    };
});