var Socket = (function() {

  var SocketConstr = function(io, server) {
    var socket;

    this.init = function(logMessages) {
      socket = io.connect(server);
      if (logMessages) {
        socket.on('message', function(msg) {
          console.log(msg);
        });
      }
    };

  };

  return SocketConstr;

})();