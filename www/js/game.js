var ws = new WebSocket("ws://ping.ngrok.com/ws");

var players = []
var myid = null;
var gid = null;

// message handler
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

// various location stuff
var watchID = null;

// Sign up for location updates
$(document).ready(function() {
    watchID = navigator.geolocation.watchPosition(locationUpdated, locationError, 
        { timeout: 10000, enableHighAccuracy: true });
});

// Stop location updates when the page is unloaded
$(document).unload(function() {
    navigator.geolocation.clearWatch(watchID);
});

// The location has updated
function locationUpdated(position) {
    console.log(position);

    ws.send(JSON.stringify({
        "event":"doping", 
        data: {
            "lon": position.coords.longitude,
            "lat": position.coords.latitude,
            "alt": position.coords.altitude,
            "accuracy": position.coords.accuracy,
            "pid": myid}, 
        gid: gid
    }));
}

// An error occurred while getting the location.
function locationError(error) {
    console.log(error);

    alert("Error getting location:\n\n" + error.message);
}