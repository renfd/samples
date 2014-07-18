


StartScreen = function() 
{
    StartScreen.superclass.constructor.apply(this, arguments);
    
    // Pointers to Game constructor and Game assets
    this.gGame   = TGE.Game.GetInstance();
    this.gAssets = this.gGame.GetAssets();

    return this;
};









StartScreen.prototype = {


    setup : function() 
    {
        this.setupBackgroundAndButton();
    },





    setupBackgroundAndButton : function() 
    {
        // Background
        var background_settings = this.gAssets.startScreenSettings["background"];

        // testing
        var backgrounddd = this.addChild(new TGE.Sprite().setup({
            x:      this.percentageOfWidth(0.5),
            y:      this.percentageOfHeight(0.5),
            image:  background_settings.image
        }));


        // Play button
        var button_settings = this.gAssets.startScreenSettings["button"];

        this.addChild(new TGE.Button().setup({
            x:              this.percentageOfWidth(0.72),
            y:              this.percentageOfWidth(0.45),
            image:          button_settings.image,
            pressFunction:  this.gGame.SwitchScreens.bind(null, this, GameScreen)
        }));
    },

    
}

extend(StartScreen, TGE.Window);