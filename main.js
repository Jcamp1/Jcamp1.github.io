
/*TO DO:
    -convert into jquery where reasonable
    -add bus routes to map
    -add ability to click bus points for more info
    -color bus data symbols by routes
*/


//Comments for the code below are in progress, lol


//Get the current webpage and highlight the current page in the menu bar on document load
 $(document).ready(function() {

    let pathname = window.location.pathname.split("/").pop();
    $(".nav").find(".active").addClass("text-primary");
    $(".nav").find(".active").removeClass("active");
    $('.nav > li > a[href="'+pathname+'"]').addClass('active');
    $('.nav > li > a[href="'+pathname+'"]').removeClass('text-primary');
});

//Load the bus data and set the time of last update on document load
$(document).ready(function() {
    updateBusPoints()
    updateText.innerHTML = lastUpdate()
});

//Check screen width for nav menu responsiveness on document load
$(document).ready(function() {
    checkWidth(true);

    $(window).resize(function() {
        checkWidth(false);
    });
});


//Function that handles responsiveness of nav menu
function checkWidth(init) {

    if ($(window).width() > 750) {
        $("#navItems").collapse('hide');
        $('.nav-pills').removeClass('flex-column');
    }
    else{
        $('.nav-pills').addClass('flex-column');
    }
};