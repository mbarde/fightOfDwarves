game.PlayScreen = me.ScreenObject.extend({

    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
      // Set controls regarding to title screen settings
      var ctrls = game.TitleScreen.controls;
      for (var i = 0; i < 4; i++) {
        me.input.bindKey(ctrls[i][0],  "left" + (i+1));
        me.input.bindKey(ctrls[i][1], "right" + (i+1));
        me.input.bindKey(ctrls[i][2],   "jump" + (i+1), true);
        me.input.bindKey(ctrls[i][3], "attack" + (i+1), true);

        me.input.bindGamepad(i, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: -0.5}, ctrls[i][0]);
        me.input.bindGamepad(i, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold:  0.5}, ctrls[i][1]);
        me.input.bindGamepad(i, {type:"buttons", code: me.input.GAMEPAD.BUTTONS.FACE_1}, ctrls[i][2]);
        me.input.bindGamepad(i, {type:"buttons", code: me.input.GAMEPAD.BUTTONS.FACE_2}, ctrls[i][3]);
      }

      var h = 0;
      if (game.TitleScreen.map_selected == 0) {
  		    h = Math.floor((Math.random() * 8) + 1);
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
      if (typeof this.HUD == 'undefined') {
          this.HUD = new game.HUD.Container();
      }
      if (!me.game.world.hasChild(this.HUD)) {
        me.game.world.addChild(this.HUD);
      }

      game.players = new Array(4);
  		game.players[0] = me.game.world.getChildByName("player1")[0];
  		game.players[1] = me.game.world.getChildByName("player2")[0];
  		game.players[2] = me.game.world.getChildByName("player3")[0];
  		game.players[3] = me.game.world.getChildByName("player4")[0];

      game.winner_screen = false;

      me.input.bindKey(me.input.KEY.ESC, "escape", true);
      var helper = this;
      this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
          if (action === "escape") {
            me.audio.stopTrack();
            me.state.change(me.state.MENU);
          }
          if (game.winner_screen) {
              game.winner_screen = false;
              //game.reset();
              //helper.reset();
              //game.reset();
              me.state.change(me.state.MENU);
              me.state.change(me.state.PLAY);
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
		if (c == game.data.playerCount-1 && !game.winner_screen) {
      me.audio.pauseTrack();
      game.winner_screen = true;

      // Add text Player X won!
      me.game.world.addChild(new (me.Renderable.extend ({
        init : function () {
          this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
          this.font = new me.BitmapFont("32x32_font", 32, 1.0);
          this.font_big = new me.BitmapFont("32x32_font", 32, 1.4);
        },

        update : function (dt) {
          return true;
        },

        draw : function (renderer) {
          var txt = "PLAYER " + (winner_id+1);
          var x_off = Math.round( this.font_big.measureText(renderer, txt).width / 2 );
          this.font_big.draw(renderer, txt, 320 - x_off, 270);

          txt = "THE NEW KING IS";
          x_off = Math.round( this.font.measureText(renderer, txt).width / 2 );
          this.font.draw(renderer, txt, 320 - x_off, 200);
        },
        onDestroyEvent : function () {
        }
      })), 9);
		}
	},

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD, true);
    }
});
