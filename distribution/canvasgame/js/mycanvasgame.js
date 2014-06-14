function initGame(context)
{
    if (!context)return;
    var gameimage = new Image();

    gameimage.onload = function() {
        context.drawImage( gameimage,0,0);

    };
    gameimage.src = './myimage.png';
}