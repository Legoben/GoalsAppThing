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