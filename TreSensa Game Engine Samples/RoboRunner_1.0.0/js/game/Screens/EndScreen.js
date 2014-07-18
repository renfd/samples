EndScreen = function() 
{
    EndScreen.superclass.constructor.apply(this, arguments);


    // Pointers to Game constructor and Game assets
    this.gGame   = TGE.Game.GetInstance();
    this.gAssets = this.gGame.GetAssets();


    //Pause background music
    this.gGame.PauseAudio("backgroundMusic");


    return this;
}









EndScreen.prototype = {


    setup : function() 
    {
        this.setupBackgroundAndButton();
        this.setupStats();
    },






    setupBackgroundAndButton : function() 
    {
        // Background
        var background_settings = this.gAssets.endScreenSettings["background"];

        this.addChild(new TGE.Sprite().setup({
            x:      this.percentageOfWidth(0.5),
            y:      this.percentageOfHeight(0.5),
            image:  background_settings.image
        }));

        // Play Again Button
        var button_settings = this.gAssets.endScreenSettings["button"];

        this.addChild(new TGE.Button().setup({
            x:              this.percentageOfWidth(button_settings.xPos),
            y:              this.percentageOfHeight(button_settings.yPos),
            image:          button_settings.image,
            pressFunction:  this.gGame.SwitchScreens.bind(null, this, GameScreen)
        }));
    },


    setupStats : function() 
    {
        var stats = this.gGame.GetFinalStats();

        var stat_settings = this.gAssets.endScreenSettings["stats"];



        // Distance text
        this.addChild(new TGE.Text().setup(
        {
            x:      this.percentageOfWidth(stat_settings.xPos),
            y:      this.percentageOfHeight(stat_settings.distanceHeight),
            font:   stat_settings.font,
            hAlign: "right",
            color:  stat_settings.fontColor,
            text:   Math.floor(stats.finalDistance).toString()
        }));


        // Coin text
        this.addChild(new TGE.Text().setup(
        {
            x:      this.percentageOfWidth(stat_settings.xPos),
            y:      this.percentageOfHeight(stat_settings.coinHeight),
            font:   stat_settings.font,
            hAlign: "right",
            color:  stat_settings.fontColor,
            text:   Math.floor(stats.finalCoins).toString()
        }));


        // Score text
        this.addChild(new TGE.Text().setup(
        {
            x:      this.percentageOfWidth(stat_settings.xPos),
            y:      this.percentageOfHeight(stat_settings.scoreHeight),
            font:   stat_settings.font,
            hAlign: "right",
            color:  stat_settings.fontColor,
            text:   Math.floor(stats.finalScore).toString()
        }));
    },

}

extend(EndScreen, TGE.Window);
