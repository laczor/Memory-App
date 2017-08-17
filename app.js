
var express =               require("express");
var app =                   express();
var bodyParser =            require("body-parser");

app.set("view engine", "ejs")                                                           // Using the res.render without typing ejs all the time

app.use(express.static("public"));                                                      //For external styling and functionality + js, we can enable our server with express to provide the requested files to anybody

app.use(bodyParser.urlencoded({extended: true}));                                       //Using the body-parser package for the psting method

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Memory game has been started");
});                                                                                     // Tells express to listen to a certain port, which c9.io is telling to listen, on IP which c9.io is telling 


// Routing home page
app.get("/", function(req, res) {
    res.render("home");
})

// starting a new game
app.get("/game/new", function(req, res) {
    res.render("newgame");
})

//Create a new game
app.post("/game/new", function(req, res, next) {
    console.log(req.body.game);
    var size = req.body.game.board_size;
    var player1 = req.body.game.player_name1.substring(0, 8);                       //To ensure only 8 characther is passed through
    var player2 = req.body.game.player_name2.substring(0, 8);
    var player3 = req.body.game.player_name3.substring(0, 8);
    var player4 = req.body.game.player_name4.substring(0, 8);
    var theme = req.body.game.theme_version;
    var fading = req.body.game.fading;
    var flipping = req.body.game.flipping_time;
    var timer = req.body.game.timer;
//The values from the req.body has to be insterted in the ejs file, so the paramaters can be passed.
    res.render("game",{
        size : size,
        player1 : player1,
        player2 : player2,
        player3 : player3,
        player4 : player4,
        theme : theme,
        fading : fading,
        flipping : flipping,
        timer : timer,
    });
    
})

// // starting a new game, once mongodb server will run, parameters from the post /game/new request will be passed and redirected to /game/id route
// app.get("/game/id", function(req, res) {
//     res.render("game");
// })