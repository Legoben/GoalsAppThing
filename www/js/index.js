/**
 * App config
 */
window.config = {
    api: "http://ping.ngrok.com/",

    fadeLength: 256,
    slideToggleLength: 333
};

/**
 * Initialiser
 */
$(document).ready(function() {
    // showing of the "join existing" dialogue
    $(".home .btn-join").click(function(e) {
        e.preventDefault();

        $(".home .intro").slideToggle(window.config.slideToggleLength);
        $(".home .join").slideToggle(window.config.slideToggleLength);
    });

    // exit the "join existing" dialogue to the home screen
    $(".home .btn-cancel-join-room").click(function(e) {
        e.preventDefault();

        $(".home .intro").slideToggle(window.config.slideToggleLength);
        $(".home .join").slideToggle(window.config.slideToggleLength);
    });

    // join an existing game
    $(".home .btn-join-room").click(function(e) {
        showLoader();
    })
});