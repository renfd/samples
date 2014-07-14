


var GameConfig = {                          // Global game configurations


    LOG_LEVEL: 3,                           // Verbosity of the browser console
                                                // NONE = 0
                                                // ERROR = 1
                                                // WARNING = 2
                                                // INFO = 3
                                                // VERBOSE = 4

    GAME_ID: 'com.tresensa.test-game',      // A unique ID Tresensa assigns to your game
                                                // Not require until distribution or usage of Tresensa Game Services

    TITLE: 'RoboRunner',                    // Your game's name


    VERSION: '1.0.0',                       // Your game's version number
    

    ORIENTATION: 'landscape',               // The default orientation of your game on a device
                                                // portrait|landscape
                                                // Portrait orientation games will use a canvas size of width = 640px and height = 832px
                                                // Landscape orientation games will use a canvas size of width = 960px and height = 536px

    CONSTRUCTOR: 'Runner',                  // The js file that constructs your game
    

    SOURCE: [                               // The js files your game uses
        "js/game/Level.js",
        "js/game/Assets.js",
	    "js/game/Runner.js",
	    
	    "js/game/Objects/Player.js",
	    "js/game/Objects/Coin.js",
	    "js/game/Objects/StationaryObstacle.js",
	    "js/game/Objects/MovingObstacle.js",
	    
	    "js/game/Screens/GameScreen.js",
	    "js/game/Screens/EndScreen.js",
	    "js/game/Screens/StartScreen.js"
    ],

    
    LIB_DIR: "js/lib/",                     // The location of Tresensa's libraries


    CSS: [                                  // Any CSS you want to apply to the game
    ],


    EXCLUDE: [
    ],
    

	TGL: {                                 // Tresensa Game Loader
		VERSION: '1.0'
	},
    

    TGS: {                                  // Tresensa Game Services
        ENABLED: true,                          // includes services like leaderboard, microtransactions, analytics, etc.
        VERSION: '0.3'
    },

    
    TGE: {                                  // Tresensa Game Engine
        ENABLED:      true,                     // enable font loader here if you're loading fonts from GameConfig
        VERSION:      '1.0'                     // disable font loader here if you're specifying fonts in a CSS
        FONT_LOADER:  true,
    },

   
    GoogleAnalytics: {                      // Extra services
        ENABLED: false                          //disable these to decrease load time
    },
    Flurry: {
        ENABLED: false
    },
    Quantcast: {
        ENABLED: false
    }
};