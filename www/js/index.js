/**
 * App config
 */
window.config = {
    api: "http://ping.ngrok.com/",

    fadeLength: 333
};

/**
 * Initialiser
 */
$(document).ready(function() {
    // showing of the "join existing" dialogue
    $(".home .btn-join").click(function(e) {
        e.preventDefault();

        $(".home .intro").slideToggle(window.config.fadeLength);
        $(".home .join").slideToggle(window.config.fadeLength);
    });

    // exit the "join existing" dialogue to the home screen
    $(".home .btn-cancel-join-room").click(function(e) {
        e.preventDefault();

        $(".home .intro").slideToggle(window.config.fadeLength);
        $(".home .join").slideToggle(window.config.fadeLength);
    });

    // hide loading indicator
    Pace.stop();
});