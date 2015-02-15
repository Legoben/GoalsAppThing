/**
 * Returns the ID of the current user. This is a UUID stored in localStorage.
 */
/*function getUserID() {
    if(!localStorage.getItem("uid")) {
        localStorage.setItem("uid", generateUUID());
    }

    return localStorage.getItem("uid");
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}*/

/**
 * App config
 */
window.config = {
    apiUrl: "ping.ngrok.com",

    fadeLength: 256,
    slideToggleLength: 333
};

/**
 * loading indicator
 */
window.loaderImages = [
    {
        src: "img/loading1.gif",
        width: 312
    },
    {
        src: "img/loading2.gif",
        width: 480
    }
];

function showLoader() {
    // width, pls
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 32;

    // select a random indicator, pls
    var index = getRandomInt(0, (window.loaderImages.length - 1));

    // apply it
    $(".loader img").attr("src", window.loaderImages[index].src);

    var imageWidth = Math.min(w, window.loaderImages[index].width);
    $(".loader img").css("max-width", imageWidth + "px");

    // display it
    $(".loader").fadeIn(window.config.fadeLength);
}

function hideLoader() {
    $(".loader").fadeOut(window.config.fadeLength);
}

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator
    
/* main function */
function findDistance(inlat1, inlng1, inlat2, inlng2) {
    var t1, n1, t2, n2, lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk, mi, km;
    
    // hide a bunch of functions
    var helpers = {
        // convert degrees to radians
        deg2rad: function(deg) {
            return deg * Math.PI/180;
        },

        // round to the nearest 1/1000
        round: function(x) {
            return Math.round(x * 1000) / 1000;
        }
    };

    // convert coordinates to radians
    lat1 = helpers.deg2rad(inlat1);
    lon1 = helpers.deg2rad(inlng1);
    lat2 = helpers.deg2rad(inlat2);
    lon2 = helpers.deg2rad(inlng2);
    
    // find the differences between the coordinates
    dlat = lat2 - lat1;
    dlon = lon2 - lon1;
    
    // here's the heavy lifting
    a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
    c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
    dm = c * Rm; // great circle distance in miles
    dk = c * Rk; // great circle distance in km
    
    // round the results down to the nearest 1/1000
    mi = helpers.round(dm);
    km = helpers.round(dk);
    
    // display the result
    return {
        "mi": mi,
        "km": km;
    };
}