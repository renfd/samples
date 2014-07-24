/* 
	This is an example of a fake custom game engine. If you are creating 
	your game with your own custom game engine and want to integrate with Tresensa, 
	use this game example as a guide.  The most important parts that are necessary
	for the TGS widget to work are marked with "IMPORTANT"
*/

/* Our Custom Game Engine class */
CGE = {};

/* The canvas or our game */
CGE.canvas = null;

/* The function to initialize the game */
CGE.Game = function (gameDivID, canvasWidth, canvasHeight) 
{
	// IMPORTANT: Cache the the original width/height of our game. We will use this when scaling the TGS widget
	this.origWidth = canvasWidth;

	/*----------------------------------------------------------------------------------------    

		We Create and insert a canvas element into our container game div. 
	
		IMPORTANT: Notice that the canvas is nested into the game container div.
		Make sure that the game div is the same size as the canvas
		We do this in our css file (css/style.css) but you can do it in your JS too if you want.
	
	------------------------------------------------------------------------------------------*/

	this.gameContainer = document.getElementById(gameDivID);
	this.gameCanvas = document.createElement('canvas');
	this.gameContainer.appendChild(this.gameCanvas);
	
	// Size the canvas element. Notice we set sizes 
	// for canvas.width/canvas.height and style.width/style.height
	this.gameCanvas.setAttribute('width', canvasWidth + 'px');
	this.gameCanvas.setAttribute('height', canvasHeight + 'px');
	this.gameCanvas.style.width = canvasWidth + 'px';
	this.gameCanvas.style.height = canvasHeight + 'px';

	this.gameCanvas.style.backgroundColor = '#fff';

	// Make the canvas avaible to use in other functions
	CGE.canvas = this.gameCanvas; 

	/*----------------------------------------------------------------------------------------*/
	
	// Resize the game when it first loads
	CGE.resizeGame();

	// On the resize event, scale our game to fit the viewport
	window.addEventListener("resize", CGE.resizeGame);
}

// Function that will resize the game
CGE.resizeGame = function () {
	
    // Get the dimensions of the viewport
    var viewport = {

      width: window.innerWidth,
      height: window.innerHeight
    
    };

    //Scale the game to fit the width of the viewport
    // We get the height by getting the ratio (original height / original width) 
    //and multiplying it by the new game width
    var newGameWidth = viewport.width, 
    	newGameHeight = (CGE.canvas.height / CGE.canvas.width) * newGameWidth;
  
 	// Resize game
    CGE.canvas.style.width = newGameWidth + "px";
    CGE.canvas.style.height = newGameHeight + "px";

 }

// Function to render text
CGE.text = function (params)
{
	var ctx = CGE.canvas.getContext("2d");
	ctx.fillStyle = params.color;
	ctx.font = params.font;
	ctx.fillText(params.text,params.x,params.y);
}