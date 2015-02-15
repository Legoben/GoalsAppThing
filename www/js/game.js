var ws = new WebSocket("ws://ping.ngrok.com/ws")

ws.onmessage = function (event) {
    var j = JSON.parse(event.data)
    console.log(j)
    
    
    
}

