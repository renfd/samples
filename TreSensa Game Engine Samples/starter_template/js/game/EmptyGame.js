EmptyGame = function()
{
    // Make sure to call the constructor for the TGE.Game superclass
    EmptyGame.superclass.constructor.call(this);

     // These are assets we need for the game
    this.assetManager.addAssets("required",[
        {id:'tresensa_rocket',   url:'images/tresensa_rocket.png'}
      ]);

    // Start the game off with the main menu screen
    TGE.FirstGameWindow = GameScreen;
};

EmptyGame.prototype =
{


};

extend(EmptyGame,TGE.Game);

