function initGame(context)
{
    if (!context)return;
    var gameimage = new Image();

    gameimage.onload = function() {
        context.drawImage( gameimage,0,0);
        TGS.Analytics.logGameEvent('begin');
    };
    gameimage.src = './myimage.png';
}