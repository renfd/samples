ShopScreen = function(width,height)
{
    ShopScreen.superclass.constructor.apply(this,arguments);

    this.backgroundColor = "#A67D65";

    // Coins
    this.coinText = this.addChild(new TGE.Text().setup( {
        x:this.percentageOfWidth(0.5),
        y:this.percentageOfHeight(0.08),
        font:"bold 38px Tahoma",
        color:"#0D0C0C"
    }));
    this.updateCoinsMessage();

    // Listen for the data update event from TGS so we can update the coin count after purchase/login
    this.coinText.addEventListener("tgs_data_updated",this.updateCoinsMessage.bind(this));

    this.addChild(new TGE.Sprite().setup({
        image:"store_image",
        x:this.percentageOfWidth(0.5),
        y:this.percentageOfHeight(0.45)
    }));

    // Buy coins button
    this.addChild(new TGE.Button().setup( {
        text:"Get Coins!",
        width:250,
        x:this.percentageOfWidth(0.25),
        y:this.percentageOfHeight(0.87),
        pressFunction:this.buyCoins.bind(this)
    }));

    // Done button
    this.addChild(new TGE.Button().setup( {
        text:"Done",
        width:250,
        x:this.percentageOfWidth(0.75),
        y:this.percentageOfHeight(0.87),
        pressFunction:this.goBack.bind(this)
    }));
};


ShopScreen.prototype =
{
    show: function() {
        ShopScreen.superclass.show.apply(this,arguments);

        // Track screen
        TGS.Analytics.logScreen('Shop');
    },
    buyCoins: function()
    {
        var buyDialog = new TGE.Window(500,500);
        buyDialog.setup({
            backgroundColor: "#A69E8F",
            registrationX:0.5,
            registrationY:0.5,
            x:this.percentageOfWidth(0.5),
            y:this.percentageOfHeight(0.5)
        });

        buyDialog.setupFade(0.25);

        // Background
        buyDialog.addChild(new TGE.DisplayObjectContainer().setup({
            width:buyDialog.width-14,
            height:buyDialog.height-14,
            backgroundColor:"#D9C6B0"
        }));

        // Done button
        buyDialog.addChild(new TGE.Button().setup( {
            text:"Done",
            width:250,
            y:190,
            idleColor:"#FBE8D2",
            hoverColor:"#FBE8D2",
            downColor:"#FBE8D2",
            pressFunction:TGE.Window.prototype.close.bind(buyDialog)
        }));

        var iaps = TGS.Microtransactions.GetIAPProducts();
        var y = -190;
        for(var i=0; i<iaps.length; i++)
        {
            this.setupIAP(buyDialog,y,iaps[i]);
            y += 85;
        }

        // Show the product wall dialog window
        buyDialog.show(this);
    },

    setupIAP: function(buyDialog,y,iap)
    {
        //var numCoins = this.coinsInIAP(productID);
        var x = -210;

        // Title
        buyDialog.addChild(new TGE.Text().setup({
            text:iap.title,
            font:"bold 22px Tahoma",
            color:"#0D0C0C",
            hAlign:"left",
            x:x,
            y:y-18
        }));

        // Description
        buyDialog.addChild(new TGE.Text().setup({
            text:iap.description,
            font:"13px Tahoma",
            color:"#0D0C0C",
            hAlign:"left",
            x:x,
            y:y+1
        }));

        // Icon
        var useIcon = TGE.AssetManager.Exists("tgs_currency_icon");
        if(useIcon)
        {
            buyDialog.addChild(new TGE.Sprite().setup({
                image:"tgs_currency_icon",
                registrationX:0,
                registrationY:0,
                x:x,
                y:y+6,
                scale:0.5
            }))
        }

        // Cost
        buyDialog.addChild(new TGE.Text().setup({
            text:TGS.Microtransactions.PriceAsFormattedString(iap.price),
            font:"20px Tahoma",
            color:"#0D0C0C",
            hAlign:"left",
            x: useIcon ? x+30 : x,
            y:y+21
        }));

        // Buy button
        buyDialog.addChild(new TGE.Button().setup( {
            text:"BUY",
            width:110,
            height: 54,
            x:150,
            y:y,
            font:"bold 22px Tahoma",
            idleColor:"#FBE8D2",
            hoverColor:"#FBE8D2",
            downColor:"#FBE8D2",
            pressFunction:this.buyIAP.bind(this,iap.id)
        }));
    },

    buyIAP: function(productID)
    {
        var numCoins = this.coinsInIAP(productID);

        // Calculate the new coin total if the purchase is successful
        var newCoinTotal = TGE.Game.GetInstance().getCoins()+numCoins;

        // Initiate the transaction through TGS
        TGS.Microtransactions.PurchaseProduct({
            productID:productID,
            gameDataUpdates:{coins:newCoinTotal},
            onSuccess:this.purchaseSuccessful.bind(this),
            onFailure:this.purchaseFailed.bind(this)
        });
    },

    coinsInIAP: function(productID)
    {
        var numCoins = 0;
        switch(productID)
        {
            case "ITEM01": numCoins = 100; break;
            case "ITEM02": numCoins = 600; break;
            case "ITEM03": numCoins = 1500; break;
        }

        return numCoins;
    },

    updateCoinsMessage: function()
    {
        this.coinText.text = "You have " + TGE.Game.GetInstance().getCoins() + " spider coins.";
    },

    purchaseSuccessful: function(productID)
    {

    },

    purchaseFailed: function(item,errorMessage)
    {
        // TGS displays the error message, nothing more we need to do
    },

    goBack: function()
    {
        this.close();
    }
}
extend(ShopScreen,TGE.Window);
