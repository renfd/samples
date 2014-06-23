/**
* A plugin to assist in the integration of TreSensa Game Services (TGS).
*/
Phaser.Plugin.TreSensaPlugin = function (game) {

	Phaser.Plugin.call(this, game);

	this.game = game;
	this.widgetScale = 1;
	this.widgetX = 0;
	this.widgetY = 0;
};

//	Extends the Phaser.Plugin template, setting up values we need
Phaser.Plugin.TreSensaPlugin.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.TreSensaPlugin.prototype.constructor = Phaser.Plugin.TreSensaPlugin;

/**
 * Creates a TGS widget. The params object is the same as when used with the TGS.Widget.CreateWidget call (see http://developer.tresensa.com/docs/tgs/symbols/TGS.Widget.html#.CreateWidget),
 * with the addition of a 'scale' parameter which defines the base scaling factor for the widget. The placementFunc parameter is also not used as this plugin defines its own.
 * @param params Object containing parameters to customize the widget.
 * @returns {TGS.Widget} The TGS.Widget object created.
 */
Phaser.Plugin.TreSensaPlugin.prototype.createWidget = function (params) {

	this.widgetScale = params.scale ? params.scale : 1;
	this.widgetX = params.x ? params.x : 0;
	this.widgetY = params.y ? params.y : 0;

	// Determine the game div (this is copied directly from Phaser.Game.addToDOM)
	var target;
	if (this.game.parent)
	{
		if (typeof this.game.parent === 'string')
		{
			// hopefully an element ID
			target = document.getElementById(this.game.parent);
		}
		else if (typeof this.game.parent === 'object' && this.game.parent.nodeType === 1)
		{
			// quick test for a HTMLelement
			target = this.game.parent;
		}
	}

	// Fallback, covers an invalid ID and a non HTMLelement object
	if (!target)
	{
		target = document.body;
	}

	// Nuke some of the values going to TGS, we will control these via the placement function
	params.x = 0;
	params.y = 0;
	params.parentDiv = target;
	params.placementFunc = this._positionWidget.bind(this);

	return TGS.Widget.CreateWidget(params);
};


Phaser.Plugin.TreSensaPlugin.prototype._positionWidget = function () {

	var scaleObj = this.game.scale;
	var scale = scaleObj.scaleFactorInversed.y;

	return {
		x: scaleObj.bounds.x + this.widgetX*scale,
		y: scaleObj.bounds.y + this.widgetY*scale,
		scale: this.widgetScale*scale };
};
