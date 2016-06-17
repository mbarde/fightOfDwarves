game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
		
		// load a level
		var h = Math.floor((Math.random() * 7) + 1);
		//h = 7;
		me.levelDirector.loadLevel("area0" + h);
		
        // reset the score
        game.data.health = [];
		for (var i = 0; i < game.data.playerCount; i++) {
			game.data.health.push(game.data.initHealth);
		}
		
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
