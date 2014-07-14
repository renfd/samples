


Coin = function() 
{
	// Call the superclass's constructor
	Coin.superclass.constructor.call(this);


	//Coin settings
	this.mRadius = 0;


	// Pointers to Game assets
	this.gAssets 	= TGE.Game.GetInstance().GetAssets();


	// Pointer to player
	this.mPlayer = null;


    // Destroy on screen exit
    this.cullToViewport(false,false,false,true);


    this.useWorldPosition(true);


	// Adds update event listener which calls updateCoin every frame
    this.addEventListener("update", this.updateCoin.bind(this));


    return this;
}








Coin.prototype = {


	setupCoin : function(params) 
	{
		this.mPlayer = params.referenceToPlayer;

		var settings = this.gAssets.coinSettings;
		
		this.mRadius = settings.radius;

       	this.addChild(new TGE.SpriteSheetAnimation().setup({
			looping: 	  true,
			visible: 	  true,
			image: 		  settings.image,
			rows: 		  settings.rows,
			columns: 	  settings.columns,
			totalFrames:  settings.totalFrames,
			fps: 		  settings.fps,
		}));

		// Call the superclass's setup
		Coin.superclass.setup.call(this,params);
		
    	return this;
	},


	updateCoin : function()
	{
		this.detectCollisions();
	},








	detectCollisions : function()
	{
		var playerBounds = this.mPlayer.getBounds();
		var coinBounds   = this.getBounds();

		if (coinBounds.intersects(playerBounds, this.mRadius, 0.7)) {
        	this.mPlayer.hitCoin();
        	this.markForRemoval();
		}	
	},
		
}

extend(Coin, TGE.DisplayObjectContainer);