// Game Config Global
var GameConfig = {

    LOG_LEVEL: 4,   // NONE = 0
                    // ERROR = 1
                    // WARNING = 2
                    // INFO = 3
                    // VERBOSE = 4

    GAME_ID: '',	//game ID not require until distribution or usage of game services
    TITLE: 'TreSensa Starter Template',
    VERSION: '1.0.0',

    ORIENTATION: 'landscape',   // portrait|landscape
                                // Portrait orientation games will use a canvas size of width = 640px and height = 832px
                                // Landscape orientation games will use a canvas size of width = 960px and height = 536px

    SOURCE: [
	    "js/mycanvasgame.js"
    ],

    LIB_DIR: "js/lib/",

    CSS: [
        "mystylesheet.css"
    ],

    EXCLUDE: [
    ],

	TGL: {
		VERSION: '1.0'
	},

    TGS: {
        ENABLED: false,
        VERSION: '0.3'
    },

    TGE: {
        ENABLED: false,
        FONT_LOADER: false,
        VERSION: '1.0'
    },

    GoogleAnalytics: {
        QA_ID:     '',      // Provide a Google Analytics Account ID if analytics features used during game development
        PROD_ID:   '',      // Provide a Google Analytics Account ID to be used once the game is provided to TreSensa for distribution
        LABEL: ''
    }
};