GameScreen = function(width,height)
{
    GameScreen.superclass.constructor.apply(this,arguments);

    // UI
    this.scoreText = null;
    this.coinsText = null;

    // Game stuff
    this.score = 0;
    this.spiderSpeed = 100;
    this.spiderAnimationSpeed = 24;
    this.gameOver = false;
	this.paused = false;
    this.gameTime = 0;

    // Setup an event listener to get an update event every frame
    this.addEventListener("update",this.updateGame.bind(this));

	// Setup an event listener to bring up the pause screen when the game is put in a deactivated state
	this.addEventListener("deactivate",this.pauseGame.bind(this));

    // Setup the scene:
    this.backgroundColor = "#A67D65";

    this.scoreText = this.addChild(
        new TGE.Text().setup({
            x:this.pixelsFromLeft(10),
            y:this.pixelsFromTop(20),
            hAlign:"left",
            text:"SCORE: 0",
            font:"bold 20px Tahoma",
            color:"#0D0C0C"
        }));

    // Highscore text (static)
	this.addChild(
        new TGE.Text().setup({
            x:this.pixelsFromLeft(10),
            y:this.pixelsFromTop(45),
            hAlign:"left",
            text:"HIGHSCORE: "+TGE.Game.GetInstance().getBestScore(),
            font:"bold 20px Tahoma",
            color:"#0D0C0C"
        }));

    this.coinsText = this.addChild(
        new TGE.Text().setup({
            x:this.pixelsFromLeft(10),
            y:this.pixelsFromTop(70),
            hAlign:"left",
            text:"COINS: "+TGE.Game.GetInstance().getCoins(),
            font:"bold 20px Tahoma",
            color:"#0D0C0C"
        }));

    // Setup pause button
    this.addChild(new TGE.Button().setup({
            x:this.pixelsFromRight(45),
            y:this.pixelsFromTop(45),
            image:"pause_button",
            pressFunction:this.pauseGame.bind(this)
        }));

    // Create a spider to set things off
    this.addTheSpider();

    // Track game start and screen
    TGS.Analytics.logGameEvent('begin');
    TGS.Analytics.logScreen('Gameplay');
};


GameScreen.prototype =
{
	pauseGame: function()
	{
		if(!this.paused)
		{
            TGS.Analytics.logGameEvent('pause');
			this.overlayWindow({windowClass:PauseScreen,fadeTime:0.25});
			this.paused = true;
		}
	},

    getScore: function()
    {
        return this.score;
    },

    addTheSpider: function()
    {
        var spider = new TGE.SpriteSheetAnimation().setup({
            image:"spider_crawl",
            rows:5,
            columns:4,
            totalFrames:19,
            fps:this.spiderAnimationSpeed
        });

        // Play the animation (loops by default)
        spider.play();

        // Add it to the scene
        this.addChild(spider);
        spider.x = this.percentageOfWidth(this.score===0 ? 0.5 : Math.random()*0.85);
        spider.y = this.height + spider.height/2;

        // Setup an event handler to update the object every frame
        spider.addEventListener("update",this.updateSpider.bind(this));

        // Set up an event handler so when it's tapped it gets destroyed
        spider.addEventListener("mousedown",this.spiderClicked.bind(this));

        // Tutorial bubble if it's the first spider
        if(this.score===0)
        {
            // Add a little tutorial bubble
            var bubble = spider.addChild(new TGE.Sprite().setup({
                image:"tutorial_bubble",
                x:90,
                y:-90
            }));

            // Add device specific text to the tutorial bubble
            bubble.addChild(new TGE.Text().setup({
                text: (TGE.BrowserDetect.isMobileDevice ? "TAP" : "CLICK") + " ME!",
                font:"bold 24px Tahoma",
                textColor:"#000",
                x:6,
                y:-6
            }))
        }
    },

    updateSpider: function(event)
    {
        var spider = event.currentTarget;

        // Update the spider's vertical position
	    if(!spider.squished)
	    {
            spider.y -= this.spiderSpeed*event.elapsedTime;
	    }

        // If the spider makes it to the top of the screen the player lost
        if(spider.y <= -spider.height/2)
        {
            this.endGame();
        }
    },

    spiderClicked: function(event)
    {
        // Remove this entity
        var spider = event.currentTarget;
	    spider.squished = true;

	    // Remove any child objects (like the tutorial bubble)
	    spider.removeChildren();

	    // Animate the spite away and then remove it from the scene
	    spider.tweenTo({
		    rotation:200 * (Math.random()>0.5 ? -1 : 1),
		    duration:0.3,
		    scaleX:2.5,
		    scaleY:2.5,
		    alpha:0,
		    easing:TGE.Tween.Cubic.Out,
		    onComplete: function() {spider.markForRemoval();}
	    });

        // Give the player a point and a coin
        this.score++;
        TGE.Game.GetInstance().awardCoins(1);

        // Make the next spider crawl faster
        this.spiderSpeed += 50;
        this.spiderAnimationSpeed += 5;

        // Add a new one
        this.addTheSpider();
    },

    updateGame: function(event)
    {
        // If the update event is getting fired it means we're not paused anymore
        if(this.paused){
            this.paused = false;
            TGS.Analytics.logGameEvent('resume');
        }

        // Update the UI
        this.scoreText.text = "SCORE: " + this.score;
        this.coinsText.text = "COINS: " + TGE.Game.GetInstance().getCoins();

        // Keep track of elapsed game time
        this.gameTime += event.elapsedTime;
    },

    endGame: function()
    {
        if(this.gameOver)
        {
            return;
        }

        // Save the highscore and earned coins to the TGS server
        var newHighscore = TGE.Game.GetInstance().gotNewScore(this.score);
        TGE.Game.GetInstance().saveState();

        // Make sure we don't call this function again
        this.gameOver = true;

        // Track game end, include the elapsed game time (rounded to the nearest second)
        TGS.Analytics.logGameEvent('end', Math.round(this.gameTime));

        // We need to pass some additional parameters into the GameOver window setup
        this.transitionToWindow({
            windowClass:GameOver,
            fadeTime:0.75,
            score:this.score,
            newHighscore:newHighscore
        });
    }
}
extend(GameScreen,TGE.Window);
