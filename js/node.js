var server = app.listen((process.env.PORT || 8080), function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Ben's Flappy Bird listening at http://%s:%s", host, port);
});
