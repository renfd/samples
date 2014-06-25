GameOver = function()
{
    GameOver.superclass.constructor.apply(this,arguments);

    // Setup the scene
    this.backgroundColor = "#A67D65";

    this._mUix = this.percentageOfWidth(0.32);

    // Game over message
    this.addChild(new TGE.Text().setup( {
        x:this._mUix,
        y:this.percentageOfHeight(0.16),
        text:"GAME OVER",
        font:"bold 75px Tahoma",
        color:"#0D0C0C",
        strokeWidth:5,
        strokeColor:"#A63232"
    }));

    // Score
    this.scoreMessage = this.addChild(new TGE.Text().setup( {
        x:this._mUix,
        y:this.percentageOfHeight(0.28),
        font:"bold 36px Tahoma",
        color:"#D9C6B0",
        strokeWidth:2,
        strokeColor:"#000"
    }));

    // Highscore message
    this.highscoreMessage = this.addChild(new TGE.Text().setup( {
        x:this._mUix,
        y:this.percentageOfHeight(0.35),
        font: "22px Tahoma",
        color: "#0D0C0C"
    }));
};

GameOver.prototype =
{
    show: function() {
        GameOver.superclass.show.apply(this,arguments);

        // Track screen
        TGS.Analytics.logScreen('GameOver');
    },

    // The setup function is defined in the TGE.DisplayObject base class - we can override it here if our window
    // has custom information we need to pass in. In this case we'll pass in the score and highscore so we can
    // customize the game over screen.
    setup: function(params)
    {
        GameOver.superclass.setup.call(this,params);

        var score = params.score;
        var newHighscore = params.newHighscore;

        this.scoreMessage.text = "You scored: " + score;
        this.highscoreMessage.text = newHighscore ? "New Highscore!" : "Your best score is " + TGE.Game.GetInstance().getBestScore();
        if(newHighscore)
        {
            this.highscoreMessage.textColor = "#A63232";
        }

        TGS.Leaderboard.SubmitScore({
            score: score,
            leaderboardID: 0
        });

        // Buttons
        var x = this._mUix;
        var y = this.percentageOfHeight(0.55);
        var ySpacing = this.percentageOfHeight(0.22);
        var width = 270;
        var height = 80;

        // Try again button
        this.addChild(new TGE.Button().setup( {
            text:"Try Again",
            x:x,
            y:y,
            width:width,
            height:height,
			pressFunction:this.playAgain.bind(this)
            // pressFunction:this.showInterstitial.bind(this, this.playAgain.bind(this))
        }));
        y += ySpacing;

        // Main menu button
        this.addChild(new TGE.Button().setup( {
            text:"Main Menu",
            x:x,
            y:y,
            width:width,
            height:height,
			pressFunction:this.gotoMainMenu.bind(this)
            // pressFunction:this.showInterstitial.bind(this, this.gotoMainMenu.bind(this))
        }));
        y += ySpacing;

		// TGS Game Over Widget
		this.widget = TGS.Widget.CreateWidget({
			x: 610,
			y: 70,
			shareMessage: "I just crushed " + score + " spiders on Spider!",
            leaderboardID: 0,
            closeCallback: function(){
                // called when the widget has finished closing
            }
		});

        return this;
    },

    showInterstitial: function(closeCallBack){
/*
		this.widget.close();
        TGS.Advertisement.DisplayInterstitialAd({
            closeCallback:closeCallBack
        });
*/
    },

    playAgain: function() {
        var self = this;
		this.widget.close(function(){
            // called when the widget has finished closing, after the closeCallback passed to TGS.Widget.CreateWidget
            self.transitionToWindow({windowClass:GameScreen});
        });
    },

    gotoMainMenu: function() {
        var self = this;
        this.widget.close(function(){
            // called when the widget has finished closing, after the closeCallback passed to TGS.Widget.CreateWidget
    		self.transitionToWindow({windowClass:MainMenu})
        });
    }
};
extend(GameOver,TGE.Window);