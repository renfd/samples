PauseScreen = function(width,height)
{
    PauseScreen.superclass.constructor.apply(this,arguments);

    // We want the game updates to originate from this window - everything below it will effectively be frozen
    TGE.Game.SetUpdateRoot(this);

    // Create a semi-transparent background
    this.addChild(new TGE.DisplayObject().setup({
        registrationX:0,
        registrationY:0,
        width:this.width,
        height:this.height,
        backgroundColor:"#000",
        alpha:0.6
    }));

    // Resume button
    this.addChild(new TGE.Button().setup( {
        text:"Resume",
        x:this.percentageOfWidth(0.5),
        y:this.percentageOfHeight(0.3),
        pressFunction:this.close.bind(this)
    }));

    // Restart button
    this.addChild(new TGE.Button().setup( {
        text:"Restart",
        x:this.percentageOfWidth(0.5),
        y:this.percentageOfHeight(0.5),
        pressFunction:this.restart.bind(this)
    }));

    // Main menu button
    this.addChild(new TGE.Button().setup( {
        text:"Main Menu",
        x:this.percentageOfWidth(0.5),
        y:this.percentageOfHeight(0.7),
        pressFunction:this.gotoMainMenu.bind(this)
    }));
}

PauseScreen.prototype =
{
    restart: function()
    {
        this.resetToWindow({windowClass:GameScreen});
    },

    gotoMainMenu: function()
    {
        this.resetToWindow({windowClass:MainMenu});
    }
}
extend(PauseScreen,TGE.Window);
