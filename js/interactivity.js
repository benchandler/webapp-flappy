jQuery("#scoresbtn").on("click", function() {
    jQuery("#content").empty();
    jQuery("#content").append(
        "<ul>"
            + "<li>" + "Me" + "</li>"
            + "<li>" + "Also me" + "</li>"
            + "<li>" + "Me again" + "</li>"
        + "</ul>"
    );
});

jQuery("#creditsbtn").on("click", function() {
    jQuery("#content").empty();
    jQuery("#content").append(
        "<div>" + "Game created by Bob!" + "</div>"
    );
});

jQuery("#helpbtn").on("click", function() {
    jQuery("#content").empty();
    jQuery("#content").append(
        "<ul>"
            + "<li>" + "Press SPACE to flap your wings" + "</li>"
            + "<li>" + "Avoid the incoming pipes" + "</li>"
        + "</ul>"
    );
});


jQuery("#sharing").on("click", function(){
    var text =
        "I scored "
        + score.toString()
        + " in Flappy Birdy! Can you do better?";
    var escapedText = encodeURIComponent(text);
    var url =
        "https:twitter.com/share?text="
        + escapedText
    jQuery("#sharing").attr("href", url);
});
