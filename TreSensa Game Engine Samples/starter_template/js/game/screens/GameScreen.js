GameScreen = function(width,height)
{
    GameScreen.superclass.constructor.apply(this,arguments);

    // Background Color
    this.backgroundColor = "#3399FF";

    // Create a Rocket
    this.addRocket();
};

GameScreen.prototype =
{

    addRocket: function()
    {
        var rocket = new TGE.Sprite().setup({
            image: "tresensa_rocket"
        });

        // Add it to the scene
        this.addChild(rocket);
        rocket.x = this.percentageOfWidth(.5);
        rocket.y = this.height/2;
    }
};
extend(GameScreen,TGE.Window);
