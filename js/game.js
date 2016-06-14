
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        health1 : 100,
		health2 : 100
    },


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
        me.state.change(me.state.LOADING);
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        me.pool.register("mainPlayer", game.PlayerEntity);
		me.pool.register("secondPlayer", game.secondPlayer);
		
		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,  "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.X,     "jump", true);
		me.input.bindKey(me.input.KEY.C, "attack", true);
		
		me.input.bindKey(me.input.KEY.A,  "left2");
		me.input.bindKey(me.input.KEY.D, "right2");
		me.input.bindKey(me.input.KEY.W,     "jump2", true);
		me.input.bindKey(me.input.KEY.Q, "attack2", true);

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};