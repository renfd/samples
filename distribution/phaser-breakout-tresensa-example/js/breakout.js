var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update});

function preload() {

    game.load.atlas('sprites', 'assets/breakout-sprites.png', 'assets/breakout-sprites.json');
    game.load.image('starfield', 'assets/starfield.jpg');
    game.load.image('replayBtn', 'assets/replay-button.png');
    game.load.image('wrongOrientation', 'assets/orientation.jpg');
    
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
var currentLevel = 1;

var s;

function create() {
    
    // Load Tresensa Plugin (only used with the TGS Widget)
    game.Tresensa = game.plugins.add(Phaser.Plugin.TreSensaPlugin);
    
    // Handle mobile scaling
    initMobileScaling();

    // We check bounds collisions against all walls other than the bottom one
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // We check bounds collisions against all walls other than the bottom one
    game.physics.arcade.checkCollision.down = false;

    s = game.add.tileSprite(0, 0, 1024, 768, 'starfield');

    bricks = game.add.group();
    bricks.enableBody = true;
    bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick;

    /*
        Create the breakout bricks. 
        Randomize them to create a colorful effect
    */
    for (var y = 0; y < 6; y++)
    {
        for (var x = 0; x < 14; x++)
        {   
            brick = bricks.create(140 + (x * 85), 100 + (y * 72), 'sprites', 'brick-' + Math.floor((Math.random() * 4) + 1) + '.png');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }

    // Scale the bricks down a bit
    bricks.scale.set(0.7, 0.7);

    // Create paddle
    paddle = game.add.sprite(game.world.centerX, game.world.height - 100, 'sprites', 'platform.png');

    // Enable physics on the paddle and make paddle collidable with world bounds 
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;

     // Let's make the paddle a bit bigger 
    paddle.scale.set(1.5, 1.5);

    // Allow horizontal dragging in mobile 
    if (!game.device.desktop)
    {
        paddle.inputEnabled = true;
        paddle.input.enableDrag(false);
        paddle.input.allowVerticalDrag = false;
    }
    
    ball = game.add.sprite(game.world.centerX, paddle.y - 33, 'sprites', 'ball-0.png');
    ball.anchor.set(0.5);
    ball.checkWorldBounds = true;

    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);

    //Add a ball animation to the sprite
    ball.animations.add('spin', [ 'ball-0.png', 'ball-1.png', 'ball-2.png', 'ball-3.png', 'ball-4.png', 'ball-5.png' ], 50, true, false);

    /* ----- Subscribe to when the ball is lost and run ballLost function ----- */
    ball.events.onOutOfBounds.add(ballLost, this);

    // Add some UI to the game
    levelText = game.add.text(100, 550, 'Level: 1', { font: "50px Arial", fill: "#bdeaef", align: "left" });
    scoreText = game.add.text(100, 610, 'Score: 0', { font: "50px Arial", fill: "#bdeaef", align: "left" });
    
    livesText = game.add.text(750, 550, 'Lives: 3', { font: "50px Arial", fill: "#bdeaef", align: "left" });
    introText = game.add.text(game.world.centerX, game.world.centerY + 150, '- Click to Start -', { font: "70px Arial", fill: "#ffffff", align: "center" });
    
    introText.anchor.setTo(0.5, 0.5);
   
    /*
        On Desktop release the ball on mouse down but on
        mobile release the ball off the paddle on mouse up
    */
    if (game.device.desktop)
        game.input.onDown.add(releaseBall, this);
    else
        game.input.onUp.add(releaseBall, this);

    // Create replay button and make it invisible
    replayBtn = game.add.button(0, 0, 'replayBtn', resetGame, this);
    replayBtn.position.set((game.world.width / 2) - (replayBtn.width / 2), game.world.centerY + 200);
    replayBtn.visible = false;

    // Create a wrong orientation image for mobile
    if (!game.device.desktop)
    {   
        darkBG = game.add.graphics(0, 0);
        
        // set a fill style
        darkBG.beginFill('#000');
        
        // draw a shape
        darkBG.moveTo(0,0);
        darkBG.lineTo(game.width, 0);
        darkBG.lineTo(game.width, game.height);
        darkBG.lineTo(0, game.height);
        darkBG.lineTo(0,0);
        darkBG.endFill();
        darkBG.visible = false;

        wrongOrient = game.add.image(0, 0, 'wrongOrientation');
        wrongOrient.position.set((game.width / 2) - (wrongOrient.width / 2), (game.height / 2) - (wrongOrient.height / 2));
        wrongOrient.visible = false;

        // When the game loads check if its the wrong orientation
        checkCorrectOrientation ();
    }

}

function enterWrongOrient ()
{   
    darkBG.visible = true;
    wrongOrient.visible = true;
    game.paused = true;
}

function leaveWrongOrient ()
{
    darkBG.visible = false;
    wrongOrient.visible = false;
    game.paused = false;
}

function checkCorrectOrientation ()
{
    if (!game.scale.incorrectOrientation) return;
    
    darkBG.visible = true;
    wrongOrient.visible = true;
    game.paused = true; 
}

function update () {

    // On desktop, the paddle follows the mouse position
    if (game.device.desktop)
        paddle.body.x = game.input.x;
   
    if (paddle.x < 24)
    {
        paddle.x = 24;
    }
    else if (paddle.x > game.width - 24)
    {
        paddle.x = game.width - 24;
    }

    // Keep the ball glued to the paddle if its not released and reset its frame to 0
    if (ballOnPaddle)
    {
        ball.body.x = paddle.x + 130;
        ball.body.y = paddle.y - 35;
        ball.animations.frame = 0;
    }
    else
    {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
    }

}


function releaseBall () {
    
    if (ballOnPaddle)
    {
        ballOnPaddle = false;
        ball.body.velocity.y = -450; // Velocity direction
        ball.body.velocity.x = -75; // Velocity directions
        ball.animations.play('spin');
        introText.visible = false;
    }

}

function ballLost () {

    // Update the lives
    lives--;
    livesText.text = 'Lives: ' + lives;

    if (lives === 0)
    {
        gameOver();
    }
    else
    {
        ballOnPaddle = true;

        ball.reset(paddle.body.x + 16, paddle.y - 33);
        
        ball.animations.stop();
    }

}

function gameOver () {

    ball.body.velocity.setTo(0, 0);
    
    introText.text = 'Game Over!';
    introText.visible = true;
    paddle.visible = false; 

     // Go back to level 1
    levelText.text = "level: 1";
    currentLevel = 1;

    // Make replay visible when game over occurs
    replayBtn.visible = true;

}

/* 
    This callback runs when the TGS widget is closed/
    It resets all the game data and UI
*/
function resetGame ()
{
    // And bring the bricks back from the dead :)
    bricks.callAll('revive');

    //reset game stats
    score = 0;
    currentLevel = 1;
    lives = 3;

    // Reset all the game text
    scoreText.text = 'Score: ' + score;
    levelText.text = 'Level: ' + currentLevel;
    livesText.text = 'Lives: ' + lives;
    introText.text = '- Click to Start -';

    paddle.visible = true;

    // Make replayBtn invisble
    replayBtn.visible = false;

    // Put the ball back onto the paddle
    ballOnPaddle = true;
    ball.reset(paddle.body.x + 16, paddle.y - 16);
    ball.animations.stop();
}

function ballHitBrick (_ball, _brick) {

    _brick.kill();

    score += 10;

    scoreText.text = 'Score: ' + score;

    //  Are they any bricks left?
    if (bricks.countLiving() == 0)
    {
        //  New level starts
        score += 1000;
        scoreText.text = 'Score: ' + score;

        // Move to the next level
        currentLevel++;
        levelText.text = 'Level: ' + currentLevel;
        
        introText.visible = true;
        introText.text = '- Level ' + currentLevel + '-';

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
        _ball.body.velocity.x = (-5 * diff);
    }
    else if (_ball.x > _paddle.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = _ball.x -_paddle.x;
        _ball.body.velocity.x = (5 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }

}

/* 
    Handle mobile and desktop scaling scaling.
    Also handle 'wrong orientation'
*/
function initMobileScaling() 
{
   
    if (game.device.desktop)
    {   
        // Restrict the game canvas to to be max 1024px X 768px on desktop
        game.scale.maxWidth = 1024;
        game.scale.maxHeight = 768;
    }

    // Handle mobile scaling
    else
    {
        game.scale.minWidth = 480;

        // Force landscape orientation
        game.scale.forceOrientation(true, false);

        // Mobile specific functions that help your game scale to the right size
        game.scale.startFullScreen();
        game.scale.setShowAll();
        game.scale.refresh();

        // Handle incorrect orientation events
        game.scale.enterIncorrectOrientation.add(enterWrongOrient, game);
        game.scale.leaveIncorrectOrientation.add(leaveWrongOrient, game);

    }

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.setScreenSize(true);
}

