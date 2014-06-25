// Game Config Global
var GameConfig = {

    PROD_ENV: false,

    LOG_LEVEL: 4,

    GAME_ID: 'com.tresensa.test-game',
    TITLE: 'Spider!',
    VERSION: '1.0.9',

    ORIENTATION: 'landscape',

    CONSTRUCTOR: 'SpiderGame',
    SOURCE: [
        "js/game/SpiderGame.js",
		"js/game/screens/LoadingScreen.js",
        "js/game/screens/MainMenu.js",
        "js/game/screens/ShopScreen.js",
        "js/game/screens/GameScreen.js",
        "js/game/screens/PauseScreen.js",
        "js/game/screens/GameOver.js"
    ],

    CSS: [
        "css/spider.css"
    ],

    ADS: {
        INTERSTITIAL_INTERVAL: 15
    },

    TGL: {
        VERSION: '1.0'
    },

    TGS: {
        ENABLED: true,
        VERSION: '0.3'
    },

    TGE: {
        ENABLED: true,
        VERSION: '1.0'
    },

	GoogleAnalytics: {
		ENABLED: true
	}
};