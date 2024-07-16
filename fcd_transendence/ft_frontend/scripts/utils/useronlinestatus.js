function userOnlineSocketStart(userId) {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/active/?user_id=' + userId);

    socket.onopen = function(e) {
        console.log('WebSocket connection opened.');
        //socket.send(JSON.stringify({'type': 'connect', 'user_id': userId}));
    };

    socket.onclose = function(e) {
        console.log('WebSocket connection closed.');
        //socket.send(JSON.stringify({'type': 'disconnect', 'user_id': userId}));
    };

    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    return socket;
}
