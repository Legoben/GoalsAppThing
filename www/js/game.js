function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = decodeURIComponent(value).trim();
	});
	return vars;
}

function playAudio(url) {
    // Play the audio file at url
    var my_media = new Media(url,
        // success callback
        function () {
            console.log("playAudio():Audio Success");
        },
        // error callback
        function (err) {
            console.log("playAudio():Audio Error: " + err);
        }
    );
    // Play audio
    my_media.play();
}

// SFX
var audioFiles = [
    [
         "audio/ben/1.mp3",
         "audio/ben/2.mp3",
         "audio/ben/3.mp3",
         "audio/ben/4.mp3",
         "audio/ben/5.mp3",
         "audio/ben/6.mp3"
    ],
    [
         "audio/trist/1.wav",
         "audio/trist/2.wav",
         "audio/trist/3.wav",
         "audio/trist/4.wav",
         "audio/trist/5.wav",
         "audio/trist/6.wav"
    ],
];

// Plays a "Pong !11!1!!1!!1!!!!!ekeven" sfx, given a distance
function playPong(distance, callback) {
    var potato = $(".sound-thing").val();
    var index = 0;

    if(distance < 1) {
        return
    } else if(distance == 1) {
        index = 5;
    } else if(distance >= 2 && distance <= 8) {
        index = 4;
    } else if(distance > 8 && distance <= 13) {
        index = 3;
    } else if(distance > 13 && distance <= 24) {
        index = 2;
    } else if(distance > 24 && distance <= 40) {
        index = 1;
    } else {
        index = 0;
    }

    // plox
    var audio = document.createElement('audio');

    if (!window.divice) {
        a = new Audio(audioFiles[potato][index])
        a.play()
    }else if (device.platform == 'Android') {
        playAudio('http://ping.helloben.co/' + audioFiles[potato][index])
    } else {
        a = new Audio(audioFiles[potato][index])
        a.play()
    }
}


// Determine if this is a new game or should be resumed
var gid = null;

// !!!
if(getUrlVars()['rid'] != ''){
    gid = getUrlVars()['rid'];
    $(".game .game-id").html(gid);
    $(".game #debug-gid").html(gid);

    // Connect the websocket
    var ws = new WebSocket("ws://" + window.config.apiUrl + "/ws?id=" + gid);

    // Update URL with game ID
    history.replaceState("game.html?rid=" + gid);
} else {
    var ws = new WebSocket("ws://" + window.config.apiUrl + "/ws");
}

// List of players and this player's ID
var players = [];
var myid = null;

// cache the last location
var lastLocation = null;

// message handler
ws.onmessage = function (event) {
    var j = JSON.parse(event.data);
    console.log(j);
    
    var e = j.event;
    if(e == "dopong") {
        // do we have a location?
        if(!lastLocation) return;

        // recalculate all the stuff
        var t = 0;

        for(i = 0; i < players.length; i++) {
            if(i != myid) {
                var distance = findDistance(lastLocation.coords.latitude, lastLocation.coords.longitude, 
                    j.data.dists[i].lat, j.data.dists[i].lon);

                players[i].distance = distance.km * 1000;
                var id = players[i].pid;
                
                // play sfx
                setTimeout(function() {
                    // play the pong pls 
                    playPong(distance.km * 1000, function() {
                        // remove the highlight after it finished playing
                        $(".players li[data-pid='" + id + "']").removeClass("active");
                    });

                    // highlight this row
                    $(".players li[data-pid='" + id + "']").addClass("active");
                }, t);

                t += 750;
            }
        }
        


        // update list
        updatePlayerList();
    } else if(e == "youjoin") {
        // Do Thing
        myid = j.data.youid;
        players = j.data.players;
        gid = j.data.gameid;

        // Update the history
        history.replaceState("game.html?rid=" + gid);

        // update game id
        $(".game .game-id").html(gid);
        $(".game #debug-gid").html(gid);

        // update list
        updatePlayerList();       
        
        startPos();
    } else if(e == "recmessage") {
        $('.chatstuff').prepend(j.data.msg);

        var num = parseInt($("#newchat").text()) + 1;
        $("#newchat").text(num + "");
    } else if(e == "playerjoin") {
        players.push(j.data);

        // update list
        updatePlayerList();
    } else if(e == "error") {
        window.location = "index.html";
    }
}

/**
 * Update the player list
 */
function updatePlayerList() {
    // clear list
    $(".game .players").html("");

    // render all players
    for(i = 0; i < players.length; i++) {
        var player = players[i];

        // render differently if this is the current player or nah
        if(i == myid) {
            var s = '<li class="list-group-item" data-pid="' + player.pid + '">';
            s += '<span style="color:' + player.color + '">' + player.name+' (you)</span></li>';
        } else {
            var s = '<li class="list-group-item" data-pid="' + player.pid + '">';

            if(player.distance >= 0) {
                s += '<span class="badge">' + Math.round(player.distance) + 'm</span>';
            }

            s += '<span style="color:' + player.color + '">' + player.name+'</span></li>';
        }
        
        // append to list
        $(".game .players").append(s);
    }
}

// various location stuff
var watchID = null;

// Sign up for location updates
function startPos(){
    console.log("READY")
    watchID = navigator.geolocation.watchPosition(locationUpdated, locationError, 
        { timeout: 5000, enableHighAccuracy: true });
}

// Stop location updates when the page is unloaded
$(document).unload(function() {
    navigator.geolocation.clearWatch(watchID);
});

// The location has updated
function locationUpdated(position) {
    // Send our location
    ws.send(JSON.stringify({
        event: "updateloc",
        data: {
            lon: position.coords.longitude,
            lat: position.coords.latitude,
            alt: position.coords.altitude,
            accuracy: position.coords.accuracy,
            pid: myid,

            /*device: {
                uuid: device.uuid,

                name: device.model,
                platform: device.platform,
                version: device.version
            }*/
        }, 
        gid: gid
    }));

    // cache the location
    lastLocation = position;

    // Update the debug information
    $(".game #debug-pos").html("(" + position.coords.latitude + ", " + position.coords.longitude + ")");
    $(".game #debug-altitude").html(Math.round(position.coords.altitude) + " m");
    $(".game #debug-accuracy").html(Math.round(position.coords.accuracy) + " m");

    // hide the alert, if it's visible
    $(".game .alert-location-invalid").fadeOut(window.config.fadeLength);
    $(".game .alert-location-error").fadeOut(window.config.fadeLength);
}

// An error occurred while getting the location.
function locationError(error) {
    // handle the error
    if(error.code == PositionError.PERMISSION_DENIED) {
        $(".game .alert-location-error p:first-child").html("To use Ping, you need to allow the application to use your location.");
        $(".game .alert-location-error").fadeIn(window.config.fadeLength);
        navigator.geolocation.clearWatch(watchID);
    } else if(error.code == PositionError.POSITION_UNAVAILABLE) {
        // Show an UI indicator
        $(".game .alert-location-invalid").fadeIn(window.config.fadeLength);
    } else {
        $(".game .alert-location-error p:first-child").html(error.message);
        $(".game .alert-location-error").fadeIn(window.config.fadeLength);
    }

    // Update debug
    $(".game #debug-error").html(error.message + " (code " + error.code + ")");
}

function ping() {
    ws.send(JSON.stringify({
        "event": "doping",
        "data": {
            "pid":myid
        }, 
        "gid": gid
    }));
}

function sendMessage() {
    var msg = $("#chattext").val()
    if(msg.trim() == "") {    
        return;
    }

    ws.send(JSON.stringify({
        event: "sendchat", 
        data: {
            pid: myid, 
            msg: msg
        },
        gid: gid
    }));

    $("#chattext").val("");
}

$(document).ready(function() {
    $("#chattext").keyup(function(event) {
        if(event.keyCode == 13){
            $("#chatbtn").click();
        }
    });
});