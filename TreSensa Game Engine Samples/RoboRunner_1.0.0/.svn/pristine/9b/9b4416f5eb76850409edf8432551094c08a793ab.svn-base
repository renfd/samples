


MovingObstacle = function()
{
	// Call the superclass's constructor
    MovingObstacle.superclass.constructor.call(this);


	// Movement settings
	this.mBobAmplitude    = 0;
	this.mBobFrequency    = 0;
	this.mHorizontalSpeed = 0;
	this.mHackNum   = 0;
	this.mTriggered = false; 


	// Pointers to Game assets
	this.gAssets 	= TGE.Game.GetInstance().GetAssets();


	// Pointer to player
	this.mPlayer = null;


	// Destroy on screen exit
	this.cullToViewport(false, false, false, true);


	this.useWorldPosition(true);


	// Adds update event listener which calls updateMovingObstacle every frame
	this.addEventListener("update", this.updateMovingObstacle.bind(this));


	return this;
}






MovingObstacle.prototype = 
{

	setupMovingObstacle : function(params) 
	{
		// Get settings
		var settings = this.gAssets.movingObstSettings[params.type];
		params.image          = settings.image;
		this.mHorizontalSpeed = settings.speed;
		this.mBobAmplitude    = settings.bobAmplitude;
		this.mBobFrequency    = settings.bobFrequency;
		
		
		this.mPlayer = params.referenceToPlayer;
		

		params.worldX = this.findStartingPosition(params.startingPos);


		// Call the superclass's setup
		MovingObstacle.superclass.setup.call(this,params);

		return this;
	},


	updateMovingObstacle : function() 
	{
		this.updatePosition();
		this.detectCollisions();
	},







	findStartingPosition: function(startingPos) 
	{
    	var hack_extraTime   = this.stage.width/this.mPlayer.mHorizontalSpeed;
		var finalStartingPos = startingPos + hack_extraTime * this.mHorizontalSpeed;
		return finalStartingPos;
	},


	updatePosition : function() 
	{
		this.mHackNum += 0.04;
		this.worldY   += Math.sin(this.mHackNum * this.mBobFrequency) * this.mBobAmplitude;
		this.worldX   -= this.mHorizontalSpeed;
	},


	detectCollisions : function() 
	{	
		var playerBounds   = this.mPlayer.getBounds();
    	var obstacleBounds = this.getBounds();
		var obstacleBuffer = 0.7;
		var playerBuffer   = 0.5;

		if (!this.mTriggered && obstacleBounds.intersects(playerBounds, obstacleBuffer, playerBuffer)) {
			this.mTriggered = true; 
			this.mPlayer.hitObstacle();
			this.markForRemoval();
		}
	},

}

extend(MovingObstacle, TGE.Sprite); 