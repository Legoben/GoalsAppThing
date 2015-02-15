var ws = new WebSocket("ws://ping.ngrok.com/ws");


var players = []
var myid = null;
var gid = null;

ws.onmessage = function (event) {
    var j = JSON.parse(event.data)
    console.log(j)
    
    var e = j.event
    
    
    if(e == "dopong"){
        
        
    } else if(e == "youjoin"){
        console.log("HERE")
        //Do Thing
        myid = j.data.youid;
        players = j.data.players;
        gid = j.data.gameid;
        
        console.log("You're in!")
        
    } else if(e == "playerjoin"){
        //Do other thing
    
    }
}

function ping(){
    //Get Location
    
    ws.send(JSON.stringify({"event":"doping", data:{"lon":0, "lat":0, "pid": myid}, gid: gid}))


}
