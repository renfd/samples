


Runner = function()
{
    Runner.superclass.constructor.call(this);


    // Make the Assets object that will be referenced throughout game
    this.gameAssets = null;
    this.SetupAssets();
    

    // Setup font object    
    this.SetupFont();  


    // Start game on start screen
    TGE.FirstGameWindow = StartScreen;


    // Final stat vars
    this.finalScore = 0; 
    this.finalDistance = 0;                                        
    this.finalCoins = 0;


    return this;
};




Runner.prototype = 
{  

    SetupFont : function()
    {
        var myFont = new Font();
        myFont.fontFamily = "myFont";
        myFont.src = "assets/fonts/Geo.ttf";
    },








    SetupAssets : function()
    {
        this.gameAssets = new Assets();

        // Send asset list to the asset manager for loading and add the images required by TGS to the asset list     
        this.assetManager.addAssets("required", this.gameAssets.locations);
        TGS.AddRequiredImagesToAssetList("required");
    },


    GetAssets : function()
    {
        return this.gameAssets;
    },








    SetFinalStats : function(distance, coins) 
    {
        this.finalDistance = distance;
        this.finalCoins    = coins;
        if (coins == 0) this.finalScore = distance;
        else            this.finalScore = distance * coins;
    },

    GetFinalStats : function()
    {
        return { 
            finalScore:    this.finalScore, 
            finalDistance: this.finalDistance,
            finalCoins:    this.finalCoins
        };
    },



    





    PlayAudio : function(audioType) 
    {    
        var audio_settings = this.gameAssets.soundSettings[audioType];

        this.audioManager.Play({
            id:   audio_settings.id,
            loop: audio_settings.loop,
        });

    },

    PauseAudio : function(audioType) 
    {
        var audio_settings = this.gameAssets.soundSettings[audioType];

        this.audioManager.Pause({
            id: audio_settings.id
        });

    },






    SwitchScreens : function(currentScreen, nextScreen) 
    {

        currentScreen.transitionToWindow({
            windowClass: nextScreen,
            fadeTime:    1
        });
    },



    GetMouseDown : function() { return TGE.Game.GetInstance().isMouseDown(); },
    
}

extend(Runner,TGE.Game);

