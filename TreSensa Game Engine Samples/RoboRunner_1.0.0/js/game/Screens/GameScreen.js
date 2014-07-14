


GameScreen = function(width, height) 
{
	GameScreen.superclass.constructor.apply(this, arguments);


	// Game vars
	this.mPlaying = true;


	// Level vars
	this.mEventTimer   = 0;
	this.mEventIndex   = 0;
	this.mLastCoin     = 0;
	this.mLastObstacle = 0;


	// Coin generation params
	this.mCoinFrequency     = 0;
	this.mCoinWaveAmplitude = 0;
	this.mCoinWaveFrequency = 0;
	this.mCoinWaveTimer     = 0;
	this.mCoinHeight        = this.height / 2;


	// Obstacle generation params
	this.mObstaclePattern      = "";
	this.mObstaclePatternIndex = 0;
	this.mObstacleFrequency    = 0;
	this.mMovingObstacleHeight = this.height / 2;


	// Pointers to Game constructor and Game assets
	this.gGame 	 = TGE.Game.GetInstance();
	this.gAssets = this.gGame.GetAssets();
    
	return this;
};









GameScreen.prototype = {


	setup : function() 
	{
		// Setup static elements
		this.setupCamera();  
		this.setupLayers();	
		this.setupHud();
		this.setupParallaxPlanes();
		this.setupPlayer();


		// Play obstacle sound and background music when first starting
		this.gGame.PlayAudio("obstacleSound");
	    this.gGame.PlayAudio("backgroundMusic");


		// Setup an event listener to get an update event every frame
		this.addEventListener("update", this.update.bind(this));
	},


	update : function(gameData) 
	{
		if (!this.mPlaying) return;

		// Move camera
		this.updateCamera();

		// Update the HUD display
		this.updateHud();

		// Read & make level objects
		var event = level[this.mEventIndex];
		if (event == null) return;	


		// If it's time to move on to next event, then process it
		this.mEventTimer += gameData.elapsedTime;
		if (this.mEventTimer >= event.time) {
			this.updateLevel(event);

		}
		
		// Make any game objects ready to be spawned
		this.spawnObstacles(gameData.elapsedTime);
		this.spawnCoins(gameData.elapsedTime);
	},








	setupCamera : function() 
	{
    	this.gGame.mCameraLocation = new TGE.Point();
    	this.gGame.mCameraLocation.y = 180;
	},


	/** 
	* creates layers to dictate the order objects will be drawn on screen
	* ex. art (background images) are always draw first, coins are draw on top on art, etc.
	* TGE layer extends TGE DisplayObjectContainer, so a layer is really just a container for game objects
	*/
	setupLayers : function() 
	{
		this.createLayer("art");  
		this.createLayer("coins");
		this.createLayer("obstacles");
		this.createLayer("UI");
	},


	setupHud : function() 
	{
		// Makes distance HUD including distance traveled text and distance icon

		var distanceHud_settings = this.gAssets.hudSettings["distanceHUD"];

		this.getLayer("UI").addChild(this.distanceDisplay = new TGE.Text().setup({
			x:  	75,
			y:  	distanceHud_settings.height,
			text: 	"0",
			hAlign: "left",
			font:   distanceHud_settings.font,
			color:  distanceHud_settings.fontColor
		}));

	    this.getLayer("UI").addChild(new TGE.Sprite().setup({
	    	x:  	40,
	        y:  	distanceHud_settings.height + 5,
	    	image:  distanceHud_settings.icon,
	    }));


	    // Makes coin HUD including coins collected text and coin icon

	    var coinHud_settings = this.gAssets.hudSettings["coinHUD"];

		this.getLayer("UI").addChild(this.coinDisplay = new TGE.Text().setup({
			x:  	75,
			y:  	coinHud_settings.height,
			text:   "0",
			hAlign: "left",
			font:   coinHud_settings.font,
			color:  coinHud_settings.fontColor
		}));
	    this.getLayer("UI").addChild(new TGE.Sprite().setup({
	    	x:  	40,
	        y:  	coinHud_settings.height + 5,
	    	image:  coinHud_settings.icon,
	    }));
	},


	setupParallaxPlanes : function() 
	{
		var background_settings = this.gAssets.parPlaneSettings["background"];

		this.getLayer("art").addChild(new TGE.ParallaxPane().setup({
			image:          background_settings.image,
			worldY:         background_settings.height,
			trackingSpeed:  background_settings.speed
		}));


		var middleground_settings = this.gAssets.parPlaneSettings["middleground"];

		this.getLayer("art").addChild(new TGE.ParallaxPane().setup({
			image:          middleground_settings.image,
			worldY:         middleground_settings.height,
			trackingSpeed:  middleground_settings.speed
		}));


		var ground_settings = this.gAssets.parPlaneSettings["ground"];

		this.getLayer("art").addChild(new TGE.ParallaxPane().setup({
			image:          ground_settings.image,
			worldY:         ground_settings.height,
			trackingSpeed:  ground_settings.speed
		}));
	},


	setupPlayer : function() 
	{
		this.mPlayer = this.addChild(new Player().setupPlayer({
			x:  				   this.percentageOfWidth(0.5),
			y:  				   this.percentageOfHeight(0.5),
			referenceToGameScreen: this
		}));
	},










	updateCamera : function() 
	{
        this.gGame.mCameraLocation.x = this.mPlayer.worldX + 300;
    }, 


	updateHud : function() 
    {
    	this.distanceDisplay.text = Math.floor(this.mPlayer.getDistance());
		this.coinDisplay.text     = this.mPlayer.getCoins();
    },

	
	updateLevel : function(event)
	{

		switch(event.event)
		{  

			case "change_settings":
				if (event.ground_height) 			this.mPlayer.setGroundHeight(event.ground_height);
				if (event.player_speed) 			this.mPlayer.setSpeed(event.player_speed);
				if (event.fall_speed) 				this.mPlayer.setFallSpeed(event.fall_speed);
				if (event.boost_speed) 				this.mPlayer.setBoostSpeed(event.boost_speed);
				if (event.coin_frequency) 			this.mCoinFrequency = event.coin_frequency;
				if (event.coin_height) 				this.mCoinHeight = event.coin_height * this.height;	
				if (event.obstacle_frequency) 		this.mObstacleFrequency = event.obstacle_frequency;
				if (event.movingObstacle_height)	this.mMovingObstacleHeight = event.movingObstacle_height * this.height;
				break;

			case "make_coinWave":
				this.mCoinWaveAmplitude = event.amplitude;
				this.mCoinWaveFrequency = event.amplitude == 0 ? 0 : event.frequency;
				this.mCoinWaveTimer = 0;
				break;

			case "make_coinBox":
	            this.generateCoinBox(event.size);
	        	break;
			
			case "make_obstacles":
				this.mObstaclePattern = event.pattern;
				this.mObstaclePatternIndex = 0;
				break;

			case "stop_segment":
				this.mEventTimer = 0;
				this.mCoinFrequency = 0;
				this.mObstacleFrequency = 0;
				break;

			case "end_game":
				this.EndGame();
				break;
			
			default: break;			
		}

		this.mEventIndex++;
		
	},













	spawnObstacles : function(elapsedTime)
	{
		
		var playerX = this.mPlayer.worldX;
		
		if (this.mObstacleFrequency == 0) {
			this.mLastObstacle = playerX;
		} 
		
		// If it's time for another obstacle
		if ((this.mPlayer.worldX - this.mLastObstacle) > this.mObstacleFrequency) {

			var typeNum  = -1;
			var typeChar = "";
			
			// Determine type of obstacle
			if (this.mObstaclePattern.charAt(this.mObstaclePatternIndex) != "X") {
				
				typeNum  = this.mObstaclePattern.charCodeAt(this.mObstaclePatternIndex) - 48;
				typeChar = this.mObstaclePattern.charAt(this.mObstaclePatternIndex);
				this.mObstaclePatternIndex++;
			}

			if (typeNum > 0) {
				
				
				// Spawn stationary obstacle (if number)
				if (typeNum <= 9) {

					this.getLayer("obstacles").addChild(new StationaryObstacle().setupStationaryObstacle({
						type   			  : typeNum,
						worldX 			  : this.mPlayer.worldX + this.width * 2,
						referenceToPlayer : this.mPlayer
					}));

				} 
				

				// Spawn moving obstacle (if letter)
				else {

					var newMovingObstacle = new MovingObstacle().setupMovingObstacle({
						worldY     		  : this.mMovingObstacleHeight,
						type	   		  : typeChar,
                        startingPos 	  : this.mPlayer.worldX + this.width * 2,
						referenceToPlayer : this.mPlayer
                    });
                    this.getLayer("obstacles").addChild(newMovingObstacle);
  
				}
			}


			this.mLastObstacle = this.mPlayer.worldX;
		}
	},


	spawnCoins : function(elapsedTime) 
	{

		var x = this.mPlayer.worldX;
		if (this.mCoinFrequency == 0) {
			this.mLastCoin = x;
		} 

		// If it's time for another coin, create it
		else if ((x - this.mLastCoin) > this.mCoinFrequency) {

			var extra = (x - this.mLastCoin) - this.mCoinFrequency;
			var cx    = x - extra;
			var cy    = this.mCoinHeight + Math.sin(this.mCoinWaveTimer * this.mCoinWaveFrequency) * this.mCoinWaveAmplitude;
			
			this.getLayer("coins").addChild(new Coin().setupCoin({
				worldX:  cx + this.width * 2,
				worldY:  cy,
				referenceToPlayer: this.mPlayer
			}));

			this.mLastCoin = cx;
		}

		this.mCoinWaveTimer += elapsedTime;
	},

	
	generateCoinBox: function(size)
	{
        var size = Math.max(2,size);
        

        // Define the origin position
        var ox = this.mPlayer.worldX + this.width * 2;
        var oy = this.mCoinHeight;
    
        var coinSize = 56;
        var cx = ox - (coinSize * size) / 2;
        var cy = oy - (coinSize * size) / 2;    
    
    	// Make the matrix of coins
        for(var y = 0; y < size; y++)
        {
            cx = ox - (coinSize * size) / 2;

            for(var x = 0; x < size; x++)
            {
                this.getLayer("coins").addChild(new Coin().setupCoin({
                    worldX : cx + this.width * 2,
                    worldY : cy,
					referenceToPlayer: this.mPlayer
                }));
                    
                cx += coinSize;
            }
            cy += coinSize;
        }
    },








	endGame : function() 
	{
		this.gGame.SetFinalStats(this.mPlayer.getDistance(), this.mPlayer.getCoins());

		this.gGame.SwitchScreens(this, EndScreen);

	},
}

extend(GameScreen, TGE.Window);
