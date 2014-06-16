
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.atlas('breakout', 'assets/breakout.png', 'assets/breakout.json');
    game.load.image('starfield', 'assets/starfield.jpg');

}

var ball;
var paddle;
var bricks;

var ballOnPaddle = true;

var lives = 3;
var score = 0;

var scoreText;
var livesText;
var introText;
var levelText;

var s;

// Keep track of the levels
var currentLevel = 1; 

// Num of times the ball has been released during a game (until gameover, when it gets reset)
var numTimesBallReleasedInGame = 0; 

// Num of times the player hit the ball with paddle during a given level. 
var numTimesBallReleasedInLevel = 0;

// Used to check when its the first time the player is playing
var timesPlayed = 0; 


function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    // We check bounds collisions against all walls other than the bottom one
    game.physics.arcade.checkCollision.down = false;

    s = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    bricks = game.add.group();
    bricks.enableBody = true;
    bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick;

    // Create the breakout bricks
    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 15; x++)
        {
            brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }

    // Create paddle
    paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
    paddle.anchor.setTo(0.5, 0.5);

    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    // Make paddle collidable with world bounds
    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;

    ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
    ball.anchor.set(0.5);
    ball.checkWorldBounds = true;

    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);

    //Add a ball animation to the sprite
    ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);

    /* ----- Subscribe to when the ball is lost and run ballLost function ----- */
    ball.events.onOutOfBounds.add(ballLost, this);

    // Add some UI to the game
    scoreText = game.add.text(120, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    livesText = game.add.text(680, 550, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
    introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
    introText.anchor.setTo(0.5, 0.5);

    // Create text to keep track of the levels
    levelText = game.add.text(32, 550, 'level: 1', { font: "20px Arial", fill: "#ffffff", align: "left" });
    
    // Release the ball off the paddle on mousedown
    game.input.onDown.add(releaseBall, this);

}

function update () {

    paddle.body.x = game.input.x;

    if (paddle.x < 24)
    {
        paddle.x = 24;
    }
    else if (paddle.x > game.width - 24)
    {
        paddle.x = game.width - 24;
    }

    // Keep the ball glued to the paddle if its not released
    if (ballOnPaddle)
    {
        ball.body.x = paddle.x;
    }
    else
    {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
    }

}

function releaseBall () {
    
    // TRESENSA - log level start and game start
    logGameBegin();
    logLevelStart();
    
    // increment these vars for analytics purposes
    // We make sure to increment AFTER the Tresensa logging events 
    // because they depend on these vars
    numTimesBallReleasedInLevel++;
    numTimesBallReleasedInGame++;

    if (ballOnPaddle)
    {
        ballOnPaddle = false;
        ball.body.velocity.y = -300; // Velocity direction
        ball.body.velocity.x = -75; // Velocity directions
        ball.animations.play('spin');
        introText.visible = false;
    }

}

function ballLost () {

    //Update google analytics with ballLost event
    logBallLost();

    // Update the lives
    lives--;
    livesText.text = 'lives: ' + lives;

    if (lives === 0)
    {
        gameOver();
    }
    else
    {
        ballOnPaddle = true;

        ball.reset(paddle.body.x + 16, paddle.y - 16);
        
        ball.animations.stop();
    }

}

function gameOver () {

    ball.body.velocity.setTo(0, 0);
    
    introText.text = 'Game Over!';
    introText.visible = true;

    // TRESENSA - log num times the ball was released, level failed and game end
    logNumTimesBallReleased();
    logLevelFail(); 
    logGameEnd();

     // Go back to level 1
    levelText.text = "level: 1";
    currentLevel = 1;
    numTimesBallReleasedInLevel = 0;
    numTimesBallReleasedInGame = 0;

}

function ballHitBrick (_ball, _brick) {

    _brick.kill();

    score += 10;

    scoreText.text = 'score: ' + score;

    //  Are they any bricks left?
    if (bricks.countLiving() == 0)
    {
        //  New level starts
        score += 1000;
        scoreText.text = 'score: ' + score;
        
        // TRESENSA - Log num times the ball was released and level complete!
        logNumTimesBallReleased(); 
        logLevelComplete();

        // Move to the next level
        currentLevel++;
        levelText.text = 'level: ' + currentLevel;
        
        introText.visible = true;
        introText.text = '- Level ' + currentLevel + '-';
        numTimesBallReleasedInLevel = 0;

        //  Let's move the ball back to the paddle
        ballOnPaddle = true;
        ball.body.velocity.set(0);
        ball.x = paddle.x + 16;
        ball.y = paddle.y - 16;
        ball.animations.stop();

        //  And bring the bricks back from the dead :)
        bricks.callAll('revive');
    }

}

function ballHitPaddle (_ball, _paddle) {

    var diff = 0;

    if (_ball.x < _paddle.x)
    {
        //  Ball is on the left-hand side of the paddle
        diff = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    }
    else if (_ball.x > _paddle.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = _ball.x -_paddle.x;
        _ball.body.velocity.x = (10 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }

}

/*---------------------------------------------\             
|         TRESENSA ANALYTICS FUNCTIONS         | 
\---------------------------------------------*/

/*
    logLevelStart()
    The numTimesBallReleasedInLevel var starts out as 0 when you begin a level
    and increments as the level goes on. Once the player finishes or fails a level,
    numTimesBallReleasedInLevel goes back to 0. Therefore we can use it to check whether
    a player has started a level by seeing if its equal to 0 and if it is, we log our 'start' event.
*/
function logLevelStart () 
{
    console.log('number of times ball released: ' + numTimesBallReleasedInLevel);
    // If player is not starting a new level, exit out.
    if (numTimesBallReleasedInLevel != 0) return; 
   
    TGS.Analytics.logLevelEvent('start', currentLevel);
    console.log('Level '+ currentLevel + ' Started!');
}

/*
    logLevelComplete()
    If the player completed the level, log the 'complete' event
*/
function logLevelComplete ()
{
     TGS.Analytics.logLevelEvent('complete', currentLevel);
     console.log('Level '+ currentLevel + ' Completed!');
}

/*
    logLevelFail()
    If the player failed the level, log the 'fail' event
*/
function logLevelFail ()
{
     TGS.Analytics.logLevelEvent('fail', currentLevel);
     console.log('Level '+ currentLevel + ' Failed!');
}

/*
    logGameStart()
    Log an event when player first starts the game
    numTimesBallReleasedInGame works similar to numTimesballReleasedInLevel 
    (used in the logLevelStart() function above) except that it does not get reset everytime the player completes a level. 
*/
function logGameBegin ()
{
    // If player is not starting the game, exit.
    if (numTimesBallReleasedInGame != 0) return;
    
    TGS.Analytics.logGameEvent('begin');
    console.log('Game Started!');
}

/*
    logGameEnd()
    Log the custom event everytime the the player experiences game over
*/
function logGameEnd ()
{
    TGS.Analytics.logGameEvent('end');
    console.log('GameOver!');
}

/*
    logBallLost()
    Log the custom event: 'ballLost' everytime the ball falls below the screen
*/
function logBallLost ()
{
    TGS.Analytics.logCustomEvent('ballLost');
    console.log('Ball Lost!');
}

/*
    logTimesBallReleased()
    Log the amount of times ball was released/hit by the paddle in a given level
*/
function logNumTimesBallReleased ()
{
    TGS.Analytics.logCustomEvent('numTimesBallReleased', numTimesBallReleasedInLevel);
}
