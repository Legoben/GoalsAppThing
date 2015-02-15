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
        { timeout: 15000, enableHighAccuracy: true });
});

// Stop location updates when the page is unloaded
$(document).unload(function() {
    navigator.geolocation.clearWatch(watchID);
});

// The location has updated
function locationUpdated(position) {
    console.log(position);

    ws.send(JSON.stringify({
        event: "updateloc",
        data: {
            lon: position.coords.longitude,
            lat: position.coords.latitude,
            alt: position.coords.altitude,
            accuracy: position.coords.accuracy,
            pid: myid,

            device: {
                uuid: device.uuid,

                name: device.model,
                platform: device.platform,
                version: device.version
            }
        }, 
        gid: gid
    }));

    // Update the debug information
    $(".game #debug-pos").html("(" + position.coords.latitude + ", " + position.coords.longitude + ")");
    $(".game #debug-altitude").html(position.coords.altitude + "m");
    $(".game #debug-accuracy").html(position.coords.accuracy + "m");

    // hide the alert, if it's visible
    $(".game .alert-location-invalid").fadeOut(window.config.fadeLength);
    $(".game .alert-location-error").fadeOut(window.config.fadeLength);
}

// An error occurred while getting the location.
function locationError(error) {
    console.error(error);

    // handle the error
    if(error.code == PositionError.PERMISSION_DENIED) {
        alert("To use Ping, you need to allow the application to use your location.");
        navigator.geolocation.clearWatch(watchID);
    } else if(error.code == PositionError.POSITION_UNAVAILABLE) {
        // Show an UI indicator
        $(".game .alert-location-invalid").fadeIn(window.config.fadeLength);
    } else {
        $(".game .alert-location-error p:first-child").html(error.message);
        $(".game .alert-location-error").fadeIn(window.config.fadeLength);
    }

    // Update debug
    $(".game #debug-error").html(error.message + "(" + error.code + ")");
}