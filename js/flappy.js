// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

var width = 790;
var height = 400;
var originalSpeed = 300;
var gameSpeed = 300;
var originalGravity = 400;
var gameGravity = 400;
var jumpPower = 300;
var bgspeed = gameSpeed*2;

var gapSize = 100;
var gapMargin = 50;
var blockheight = 50;
var pipeGap = 50;
var pipeEndHeight = 25;

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);
var score = 0;
var labelScore;
var player;
var pipes = [];
var balloons = [];
var weights = [];
var stars = [];
var pipeInterval = 1.75 * Phaser.Timer.SECOND;

/*
 * Loads all resources for the game and gives them names.
 */


function preload() {
  game.load.image("playerImg", "../assets/easy.png"); //jamesBond.gif
  game.load.audio("score", "../assets/point.ogg");
  game.load.image("pipeBlock","../assets/pipe.png");
  game.load.image("pipeEnd","../assets/pipe-end.png");
game.load.image("balloons","../assets/balloons.png");
game.load.image("weights","../assets/weight.png");
game.load.image("background","../assets/background.png");
game.load.image("star","../assets/star.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {

    // set the background colour of the scene
    game.stage.setBackgroundColor("#F3D3A3");
    game.add.text(350, 20, "Arbitrary text insert", {font: "30px Arial", fill: "#FF0000"});
game.add.sprite(10, 270, "playerImg");
var bg = game.add.tileSprite(0,0,width,height,"background");
bg.autoScroll(-10,0);
//game.input.onDown.add(clickHandler);



// alert(score);
 labelScore = game.add.text(20, 20, "0");

 player = game.add.sprite(100, 200, "playerImg");


 game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
                    .onDown.add(moveRight);

game.input
          .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
          .onDown
    .add(playerJump);


generatePipe();

game.physics.startSystem(Phaser.Physics.ARCADE);
game.physics.arcade.enable(player);
player.anchor.setTo(0.5, 0.5);



player.body.gravity.y = gameGravity;


//var pipeInterval = 1.75 * Phaser.Timer.SECOND;
game.time.events.loop(
    pipeInterval,
    generate
);

}



function generate() {
  gameSpeed+=10;
//  pipeInterval -= 5;
    var diceRoll = game.rnd.integerInRange(1, 10);
    if(diceRoll==1) {
        generateBalloon();
    } else if(diceRoll==2) {
        generateWeight();
    }
        generatePipe();

}

function generateBalloon() {
  // alert("b");
  var bonus = game.add.sprite(width,height, "balloons");
  balloons.push(bonus);
  game.physics.arcade.enable(bonus);
  bonus.body.velocity.x = - 200;
  bonus.body.velocity.y = -game.rnd.integerInRange(50,100);
}

function generateWeight() {

  var bonus = game.add.sprite(width,0, "weights");
  weights.push(bonus);
  game.physics.arcade.enable(bonus);
  bonus.body.velocity.x = - game.rnd.integerInRange(200,300);
  bonus.body.velocity.y =  game.rnd.integerInRange(50,150);
}

function addStar(x, y) {
var star = game.add.sprite(x,y,"star");
stars.push(star);
game.physics.arcade.enable(star);
star.body.velocity.x = -gameSpeed;
}


/*
 * This function updates the scene. It is called for every new frame.
 */
 function update() {
     game.physics.arcade.overlap(
         player,
 		  pipes,
 		  gameOver);

      // game.physics.arcade.overlap(player,balloons,function(){
      //
      // });

      for(var i=balloons.length - 1; i>=0; i--){
          game.physics.arcade.overlap(player,balloons[i], function(){

              changeGravity(-50);
              balloons[i].destroy();
              balloons.splice(i,1);

          });
      }

      for(var i=weights.length - 1; i>=0; i--){
          game.physics.arcade.overlap(player,weights[i], function(){

              changeGravity(200);
              weights[i].destroy();
              weights.splice(i,1);

          });
      }

      for(var i = stars.length -1; i>=0; i--){

          game.physics.arcade.overlap(player,stars[i], function(){
            changeScore();

            stars[i].destroy();
            stars.splice(i,1);
          });
      }


      player.rotation = Math.atan(player.body.velocity.y / 200);

      if(player.body.y < 0 || player.body.y > 400){
      gameOver();
  }


 }

 function gameOver(){
   score = 0;
   gameGravity = originalGravity;
   gameSpeed = originalSpeed;
   stars = [];
   pipes = [];
   balloons = [];
   weights = [];
   pipeInterval = 1.75 * Phaser.Timer.SECOND;
   game.state.restart();

//    location.reload();
 }


function clickHandler(event) {
   alert("The position is: " + event.x + "  " + event.y);
}
function spaceHandler() {
    game.sound.play("score");
}
function changeScore() {
	score = score + 1;
	labelScore.setText(score.toString());
}
function moveRight() {
	player.x += 10;
}


function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);


addPipeEnd(width-5, gapStart -  25);
    for(var y=gapStart; y > 0 ; y -= blockheight){
        addPipeBlock(width,y - blockheight);
    }

addPipeEnd(width-5, gapStart + gapSize);
    for(var t = gapStart + gapSize; t < height; t +=  blockheight) {
        addPipeBlock(width, t);
    }

      addStar(width, gapStart + gapSize/1.6);


}

function addPipeEnd(x,y) {
var pipeEnd = game.add.sprite(x,y,"pipeEnd");
pipes.push(pipeEnd);
game.physics.arcade.enable(pipeEnd);
pipeEnd.body.velocity.x = -gameSpeed;
}

//alert("y");

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipeBlock");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -gameSpeed;
}



function playerJump() {
    player.body.velocity.y = -jumpPower;
}

function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}



// var actions = { preload: preload, create: create, update: update };
// var width = 700;
// var height = 400;
// var game = new Phaser.Game(width, height, Phaser.AUTO, "game", actions);
// var score = 0;
// var labelScore;
// var player;
// // Global pipes variable initialised to an empty array
// var pipes = [];
// var gameGravity = 200;
// var gameSpeed = 200;
// var jumpPower = 200;
// var pipeInterval = 1.75;
// var pipeGap = 100;
//
// function preload() {
//     game.load.image("playerImg","../assets/flappy-cropped.png");
//     game.load.audio("score", "../assets/point.ogg");
//     game.load.image("pipe","../assets/pipe.png");
//     game.load.image("pipeEnd","../assets/pipe-end.png");
// }
//
// function create() {
//     game.stage.setBackgroundColor("#BADA55");
//     labelScore = game.add.text(20, 60, "0",
//         {font: "30px Arial", fill: "#FFFFFF"});
//     player = game.add.sprite(80, 200, "playerImg");
//     player.anchor.setTo(0.5, 0.5);
//     game.physics.startSystem(Phaser.Physics.ARCADE);
//     game.physics.arcade.enable(player);
//     player.body.gravity.y = gameGravity;
//     game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);
//     game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);
// }
//
// function update() {
//     game.physics.arcade.overlap(player, pipes, gameOver);
//     if(0>player.body.y || player.body.y>width){
//         gameOver();
//     }
//     player.rotation = Math.atan(player.body.velocity.y/gameSpeed);
// }
//
// function addPipeBlock(x, y) {
//     var block = game.add.sprite(x, y, "pipe");
//      pipes.push(block);
//     game.physics.arcade.enable(block);
//     block.body.velocity.x = -gameSpeed;
// }
//
// function addPipeEnd(x, y) {
//     var block = game.add.sprite(x, y, "pipeEnd");
//     pipes.push(block);
//     game.physics.arcade.enable(block);
//     block.body.velocity.x = -gameSpeed;
// }
//
// function generatePipe() {
//     var gapStart = game.rnd.integerInRange(50, height - 50 - pipeGap);
//
//     addPipeEnd(width-5,gapStart - 25);
//     for(var y=gapStart - 75; y>-50; y -= 50){
//         addPipeBlock(width,y);
//     }
//     addPipeEnd(width-5,gapStart+pipeGap);
//     for(var y=gapStart + pipeGap + 25; y<height; y += 50){
//         addPipeBlock(width,y);
//     }
//     changeScore();
// }
//
// function playerJump() {
//     player.body.velocity.y = - jumpPower;
// }
//
// function changeScore() {
//     score++;
//     labelScore.setText(score.toString());
// }
//
// function gameOver() {
//     score = 0;
//     game.state.restart();
// }
