MainMenu = function(width,height)
{
    MainMenu.superclass.constructor.apply(this,arguments);

    this.backgroundColor = "#A67D65";

    // Play button
    this.addChild(new TGE.Button().setup( {
        text:"Play",
        x:this.percentageOfWidth(0.5),
        y:this.percentageOfHeight(0.42),
        pressFunction:this.playGame.bind(this)
    })).tweenFrom({
		    scaleX:0.1,
		    scaleY:0.1,
		    alpha:0,
		    duration:0.5,
		    delay:0.25,
		    easing:TGE.Tween.Back.Out,
		    easingParam:2 // amplitude
	    }).thenTweenTo({
		    scaleX:1.05,
		    scaleY:1.05,
		    duration:0.5,
		    delay:1,
		    loop:true,
		    rewind:true,
		    easing:TGE.Tween.Quadratic.InOut
	    })

    // Shop button
    this.addChild(new TGE.Button().setup( {
        text:"Shop",
        x:this.percentageOfWidth(0.5),
        y:this.percentageOfHeight(0.61),
        pressFunction:this.gotoShop.bind(this)
    })).tweenFrom({
		    scaleX:0.1,
		    scaleY:0.1,
		    alpha:0,
		    duration:0.5,
		    delay:0.5,
		    easing:TGE.Tween.Back.Out,
		    easingParam:2 // amplitude
	    });

    // Leaderboard button
    if(TGS.Leaderboard.isSupported())
    {
        this.addChild(new TGE.Button().setup( {
            text:TGS.Leaderboard.getLabel(),
            x:this.percentageOfWidth(0.5),
            y:this.percentageOfHeight(0.80),
            pressFunction:TGS.Leaderboard.Show.bind(this,{
                leaderboardID:0,
                timePeriod:"week",
                page:1,
                gameCanvas:TGE.Game.GameDiv()
            })
        })).tweenFrom({
		        scaleX:0.1,
		        scaleY:0.1,
		        alpha:0,
		        duration:0.5,
		        delay:0.75,
		        easing:TGE.Tween.Back.Out,
		        easingParam:2 // amplitude
	        });
    }

    // Logo
    this.addChild(new TGE.Sprite().setup({
        image:"logo",
        x:this.percentageOfWidth(0.5),
        y:-100
    })).tweenTo({
	    y:this.percentageOfHeight(0.21),
	    delay: 0.5,
		duration:2.5,
	    easing:TGE.Tween.Elastic.Out,
		easingParam:1.2
    });

    // Tresensa/HTML5 plug
    this.addChild(new TGE.Button().setup( {
        image:"tresensa_plug",
        x:this.percentageOfWidth(1.1),
        y:this.pixelsFromBottom(75),
		alpha:0,
        pressFunction:this.tresensaPlug.bind(this)
    })).tweenTo({
	    x:this.pixelsFromRight(120),
	    alpha:1,
	    duration:0.2,
	    delay:1,
	    easing:TGE.Tween.Quadratic.Out
    });

    // Welcome back message (blank - we'll update it later)
    this.welcomMessage = this.addChild(new TGE.Text().setup( {
        x:this.percentageOfWidth(0.5),
        y:this.percentageOfHeight(0.95),
        font:"22px Tahoma",
        color:"#0D0C0C",
		alpha:0
    }));
	this.welcomMessage.tweenTo({
		alpha:1,
		delay:1,
		duration:1
	})
    this.updateWelcomeMessage();

	// Load the TGS Login Widget
    this.loginWidget = TGS.Widget.CreateLoginWidget({
        x: this.pixelsFromLeft(10),
        y: this.pixelsFromBottom(200)
    });

    // Setup a TGS event listener to update the welcome message if highscore changes
    this.addEventListener("tgs_data_updated",this.updateWelcomeMessage.bind(this));
};

MainMenu.prototype =
{
    show: function() {
        MainMenu.superclass.show.apply(this,arguments);

        // Track screen
        TGS.Analytics.logScreen('MainMenu');
    },

    playGame: function()
    {
        // Opens a new window and closes this one when done
        this.loginWidget.close();
        this.transitionToWindow({windowClass:GameScreen,fadeTime:0.75});
    },

    gotoShop: function()
    {
        // Overlays a new window on top of this one
        this.loginWidget.close();
        this.overlayWindow({windowClass:ShopScreen,fadeTime:0.75});
    },

    tresensaPlug: function()
    {
        this.loginWidget.close();
        TGE.Game.OpenURL("http://www.tresensa.com/");
    },

    updateWelcomeMessage: function()
    {
        var highscore = TGS.DataStore.FetchIntValue("highscore",0);
        if(highscore>0)
        {
            this.welcomMessage.text = "Welcome back, your highscore is " + highscore + ".";
        }
        else
        {
            this.welcomMessage.text = "";
        }
    }
}
extend(MainMenu,TGE.Window);
