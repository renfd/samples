
LoadingScreen = function(width,height)
{
    LoadingScreen.superclass.constructor.apply(this,arguments);

    this.backgroundColor = "#A67D65";
		
    // Loading text
    this.loadingText = this.addChild(new TGE.Text().setup( {
        x:this.percentageOfWidth(0.5),
        y:this.percentageOfHeight(0.5),
        text:"LOADING 0%",
        font:"bold 40px Arial",
        color:"#A63232"
    }));

    // Add an event listener for the progress update
    this.addEventListener("progress",this.progressCallback.bind(this));
}


LoadingScreen.prototype =
{
    progressCallback: function(event)
    {
        var text = event.percentComplete<1 ? "LOADING " + Math.round(event.percentComplete * 100).toString() + "%" : "";
        this.loadingText.text = text;
    }
}
extend(LoadingScreen,TGE.Window);
