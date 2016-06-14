game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
		
		// load a level
		me.levelDirector.loadLevel("area01");
		
        // reset the score
        game.data.health1 = 100;
        game.data.health2 = 100;

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
