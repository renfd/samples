SpiderGame = function()
{
    // Make sure to call the constructor for the TGE.Game superclass
    SpiderGame.superclass.constructor.call(this);

     // These are assets we need for the game
    this.assetManager.addAssets("required",[
        {id:'tresensa_plug',   url:'images/tresensa_plug.png'},
        {id:'logo',   url:'images/logo.png'},
        {id:'spider_crawl', url:'images/spider_crawl.png'},
        {id:'tutorial_bubble', url:'images/tutorial_bubble.png'},
        {id:'store_image', url:'images/store_image.png'},
        {id:'pause_button', url:'images/pause_button.png'}
      ]);

    // Add the images required by TGS to the asset list
    TGS.AddRequiredImagesToAssetList("required");

    // Set some defaults for our placeholder button graphics
    TGE.Button.DefaultFont = "bold 34px Tahoma";
    TGE.Button.DefaultTextColor = "#A63232";
    TGE.Button.DefaultIdleColor = "#D9C6B0";
    TGE.Button.DefaultHoverColor = "#FBE8D2";
    TGE.Button.DefaultDownColor = "#FBE8D2";
    TGE.Button.DefaultWidth = 350;
    TGE.Button.DefaultHeight = 80;

    // Global game variables
    this.bestScore = 0;
    this.coins = 0;

    // Set our default loading screen
    TGE.LoadingWindow = LoadingScreen;

    // Start the game off with the main menu screen
    TGE.FirstGameWindow = MainMenu;

    // Setup the callback for purchase restore requests from TGS
    TGS.Microtransactions.RestorePurchaseCallback = this.onTGSPurchaseRestored.bind(this);
}

SpiderGame.prototype =
{
    getBestScore: function()
    {
        return this.bestScore;
    },

    gotNewScore: function(newScore)
    {
        // Returns true if this is a new highscore
        if(newScore>this.bestScore)
        {
            this.bestScore = newScore;
            return true;
        }

        return false;
    },

    getCoins: function()
    {
        return this.coins;
    },

    awardCoins: function(coins)
    {
        this.coins += coins;
    },

    saveState: function()
    {
        TGS.DataStore.SaveValues({highscore:this.bestScore,coins:this.coins});
    },

    onTGSDatastoreUpdated: function()
    {
        // Fetch the coin count and highscore in case they changed
        this.bestScore = TGS.DataStore.FetchIntValue("highscore",0);
        this.coins = TGS.DataStore.FetchIntValue("coins",0);
    },

    onTGSPurchaseRestored: function(productID)
    {
        //
        if(productID==="LEVELS")
        {

        }
    }
}
extend(SpiderGame,TGE.Game);

