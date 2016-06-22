
/* Game namespace */
var game = {

    music_volume: 0.0,

    // an object where to store game information
    data : {
		    initHealth: 100,
		    playerCount: 4,
        health : []
    },

    players : [],

    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // Initialize the audio.
		me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING)
    },

    // Run on game resources loaded.
    "loaded" : function () {
		this.playScreen = new game.PlayScreen();
        me.state.set(me.state.PLAY, this.playScreen);
        me.state.set(me.state.MENU, new game.TitleScreen());

		game.data.health = [];
		for (var i = 0; i < game.data.playerCount; i++) {
			game.data.health.push(game.data.initHealth);
		}

    me.pool.register("player1", game.Player1Entity);
		me.pool.register("player2", game.Player2Entity);
		if (game.data.playerCount > 2) { me.pool.register("player3", game.Player3Entity); }
		if (game.data.playerCount > 3) { me.pool.register("player4", game.Player4Entity); }

		// enable the keyboard
    /**
		me.input.bindKey(me.input.KEY.LEFT,  "left1");
		me.input.bindKey(me.input.KEY.RIGHT, "right1");
		me.input.bindKey(me.input.KEY.UP,     "jump1", true);
		me.input.bindKey(me.input.KEY.Y, "attack1", true);

		me.input.bindKey(me.input.KEY.A,  "left2");
		me.input.bindKey(me.input.KEY.D, "right2");
		me.input.bindKey(me.input.KEY.W,     "jump2", true);
		me.input.bindKey(me.input.KEY.Q, "attack2", true);

		me.input.bindKey(me.input.KEY.F,  "left3");
		me.input.bindKey(me.input.KEY.G, "right3");
		me.input.bindKey(me.input.KEY.T,     "jump3", true);
		me.input.bindKey(me.input.KEY.R, "attack3", true);

		me.input.bindKey(me.input.KEY.B,  "left4");
		me.input.bindKey(me.input.KEY.N, "right4");
		me.input.bindKey(me.input.KEY.H,  "jump4", true);
		me.input.bindKey(me.input.KEY.J, "attack4", true);**/

        // Start the game.
		// display the menu title
		me.state.change(me.state.MENU);
        //me.state.change(me.state.PLAY);
    }

};
