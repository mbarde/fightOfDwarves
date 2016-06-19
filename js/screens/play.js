game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {

      // Set controls regarding to title screen settings
      var ctrls = game.TitleScreen.controls;
      for (var i = 1; i < 5; i++) {
        me.input.bindKey(ctrls[i-1][0],  "left" + i);
        me.input.bindKey(ctrls[i-1][1], "right" + i);
        me.input.bindKey(ctrls[i-1][2],   "jump" + i, true);
        me.input.bindKey(ctrls[i-1][3], "attack" + i, true);
      }

      var h = 0;
      if (game.TitleScreen.map_selected == 0) {
  		    h = Math.floor((Math.random() * 7) + 1);
      } else {
          h = game.TitleScreen.map_selected;
      }
  		me.levelDirector.loadLevel("area0" + h);

      // reset the score
      game.data.health = [];
  		for (var i = 0; i < game.data.playerCount; i++) {
  			game.data.health.push(game.data.initHealth);
  		}

      // add our HUD to the game world
      this.HUD = new game.HUD.Container();
      me.game.world.addChild(this.HUD);

      me.input.bindKey(me.input.KEY.ESC, "escape", true);
      this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
          if (action === "escape") {
            //me.game.world.removeChild(this.HUD);
            me.state.change(me.state.MENU);
          }
      });

    },

	check_for_win: function() {
		var c = 0;
		var winner_id = -1;
		for (var i = 0; i < game.data.health.length; i++) {
			if (game.data.health[i] <= 0) { c++; }
			else { winner_id = i; }
		}
		if (c == game.data.playerCount-1) {
			console.log('Player ' + (winner_id+1) + ' wins!');
			alert('Player ' + (winner_id+1) + ' wins!');
			this.reset();
		}
	},

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
