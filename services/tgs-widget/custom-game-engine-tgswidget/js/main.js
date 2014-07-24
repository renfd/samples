// Initialize our game
var game = new CGE.Game('game', 800, 500);

CGE.text({

	text: "Custom Game Engine TGS Widget Example",
	font: "bold 30px Verdana, Geneva, sans-serif",
	color: '#e05050',
	x: 40,
	y: 260
});

var openWidgetBtn = document.getElementById('display-tgs-widget'),
	closeWidgetBtn =  document.getElementById('close-tgs-widget');

// Display the TGS widget when the 'display-tgs-widget' is clicked
openWidgetBtn.addEventListener('click', displayWidget);

// Close the TGS widget when the 'close-tgs-widget' is clicked. 
// This is hidden until the TGS widget is displayed.
closeWidgetBtn.addEventListener('click', closeWidget);

/* 
	displayWidget() Makes sure TGS is loaded and ready to be used.
*/
function displayWidget () 
{
	if(!window.TGS || !TGS.IsReady())
	{
		return;
	}

	initWidget();
}

/*
	initWidget() houses the actual code that we can use to initialize the widget.

	IMPORTANT: TGS.Widget.CreateWidget() is the function you use to initialize the TGS widget.
	Notice we are also setting game.tgsWidget(a variable we made up) to the return a value
	of the CreateWidget() function. We can use this later to close the widget.
	
	The parentDiv property is the DOM element that the TGS widget will be inserted into and positioned relative to.
	
	placementFunc() runs the first time the widget is initialized and on every resize event. 
	It is how you can positon and scale the widget. To scale the TGS Widget 
	We can take the current game canvas width and divide it by the original game canvas width.

	What this means is that if the current and the original widths are the same, 
	we get a scale of 1, (ex: 800 / 800 = 1) but if our current canvas width is 
	smaller (because we're playing the game on mobile and we have scaled down our canvas)
	then the widget scale will be smaller than 1 (ex: 480 / 800 = 0.6).

*/
function initWidget ()
{
	// vars for positioning the TGS Widget 
	game.tgsWidgetX = 100;
	game.tgsWidgetY = 50;

	// We will use this to scale the widget
	game.tgsWidgetScale = null;

	game.tgsWidget = TGS.Widget.CreateWidget({
		
		parentDiv: document.getElementById('game'), 
		
		// The placement function runs everytime there's a resize event
		placementFunc: function ()
		{	
			//Reset the scale of the widget which we get by dividing the canvas's current width by its original width
			game.tgsWidgetScale = parseInt(game.gameCanvas.style.width) / game.origCanvasWidth;

			return {
				x: game.gameCanvas.offsetLeft + game.tgsWidgetX * game.tgsWidgetScale, // Canvas X position + Widget X position * the widget scale
				y: game.gameCanvas.offsetTop + game.tgsWidgetY * game.tgsWidgetScale, // Canvas Y position + Widget Y position * the widget scale
				scale: game.tgsWidgetScale
			}
		}  

	});

	// Toggle the buttons
	closeWidgetBtn.style.display = 'block';
	openWidgetBtn.style.display = 'none';
}

/* 
	TIP: The function to close the widget. 
	Once the widget is closed you will see an interstial ad (pop-up ad) which you will
	be able to close within a couple of seconds. After you have closed the widget and trigger the interstial ad, 
	a two minute timer is initiated and you can not trigger the ad until that timer run out. 
	That is to say you can open and close the widget all you want but you won't trigger the ad until 2 minutes have passed.

	TIP: You can also optionally pass a callback function into the close() function which will execute when the widget closes.
*/
function closeWidget ()
{
	game.tgsWidget.close();
	closeWidgetBtn.style.display = 'none';
	openWidgetBtn.style.display = 'block';
}