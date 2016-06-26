game.TitleScreen = me.ScreenObject.extend({

	saveSettings: function() {

	},

	/**
	 * action to perform on state change
	 */
	onResetEvent : function () {

		if (game.music_volume > 0) { me.audio.playTrack("menu", game.music_volume); }

		// title screen
		var backgroundImage = new me.Sprite(
			me.game.viewport.width / 2,
			me.game.viewport.height / 2,
			{
				image: me.loader.getImage('title_screen'),
			}
		);

		game.TitleScreen.map_selected = 0;

		game.TitleScreen.controls = [
			 [ 65, 68, 87, 81 ],
			 [ 86, 66, 71, 70 ],
			 [ 74, 75, 73, 85 ],
			 [ 37, 39, 38, 32 ]
		];

		if (typeof game.TitleScreen.settings === 'undefined') {
			game.TitleScreen.settings = [
				{ text: "PLAY", values: []},
				{ text: "PLAYERCOUNT", values: [2,3,4], selection: 2, on_change: function(setting) { game.data.playerCount = setting.values[setting.selection]; } },
				{ text: "CONTROLS 1", values: ["ADWQ"], selection: 0, ctrl_id: 0 },
				{ text: "CONTROLS 2", values: ["VBGF"], selection: 0, ctrl_id: 1 },
				{ text: "CONTROLS 3", values: ["JKIU"], selection: 0, ctrl_id: 2 },
				{ text: "CONTROLS 4", values: ["ARROWSPACE"], selection: 0, ctrl_id: 3 },
				{ text: "MAP", values: [ "RANDOM", "BLOODY HALL", "DEEP DUNGEON", "PILLARS OF CLASH", "GOLDHAND", "4 COLORS", "WINDOW SHOPPERS", "UP AND DOWN", "CORRIDOR"], selection: 0,
					on_change: function(setting) { game.TitleScreen.map_selected = setting.selection; } },
				{ text: "MUSIC VOL", values: ["OFF", "ON"], selection: 1,
					on_change: function(setting) {
											if (setting.selection) {
												game.music_volume = 0.3;
												me.audio.playTrack("menu", game.music_volume);
											} else {
											  game.music_volume = 0.0;
											  me.audio.stopTrack();
											}
				} }
			];
		}

		game.TitleScreen.selected_setting = 0;

		// scale to fit with the viewport size
		backgroundImage.scale(me.game.viewport.width / backgroundImage.width, 1);

		// add to the world container
		me.game.world.addChild(backgroundImage, 1);

		// add a new renderable component with the scrolling text
		me.game.world.addChild(new (me.Renderable.extend ({
			// constructor
			init : function () {
				this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);

				// font for the scrolling text
				this.font = new me.BitmapFont("32x32_font", 32, 0.6);
				this.font_head = new me.BitmapFont("32x32_font", 32, 1.0);

				// a tween to animate the arrow
				this.scrollertween = new me.Tween(this).to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();

				this.scroller = "			 OH WHAT A SHAME! THE KING OF THE DWARFS HAS DIED!			 DWARFS OF THE WORLD UNITE AND FIGHT FOR THE CROWN!";
				this.scrollerpos = 600;
			},

			// some callback for the tween objects
			scrollover : function () {
				// reset to default value
				this.scrollerpos = 640;
				this.scrollertween.to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
			},

			update : function (dt) {
				return true;
			},

			draw : function (renderer) {
				txt = "FIGHT OF DWARVES!";
            x_off = Math.round( this.font_head.measureText(renderer, txt).width / 2 );
            this.font_head.draw(renderer, txt, 320 - x_off, 30);
				this.font.draw(renderer, this.scroller, this.scrollerpos, 440);

				// Draw 'settings'
				init_y = 100;
				for (var i = 0; i < game.TitleScreen.settings.length; i++) {
					setting = game.TitleScreen.settings[i];
					var txt = setting.text;
					if (game.TitleScreen.selected_setting == i) {
						txt = ">" + txt + "<";
					}
					this.font.draw(renderer, txt, 20, init_y + i * 40);
					if (setting.values.length > 0) {
						this.font.draw(renderer, setting.values[setting.selection], 300, init_y + i * 40);
					}
				}

			},
			onDestroyEvent : function () {
				//just in case
				this.scrollertween.stop();
			}
		})), 2);

		// change to play state on press Enter or click/tap
		// and with up/down buttons change active setting
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		me.input.bindKey(me.input.KEY.DOWN, "down", true);
		me.input.bindKey(me.input.KEY.LEFT, "left", true);
		me.input.bindKey(me.input.KEY.RIGHT, "right", true);
		me.input.bindKey(me.input.KEY.UP, "up", true);

		/**
		me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LY, threshold: -0.5}, me.input.KEY.UP);
		me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LY, threshold:	0.5}, me.input.KEY.DOWN);
		me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: -0.5}, me.input.KEY.LEFT);
		me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold:	0.5}, me.input.KEY.RIGHT);
		me.input.bindGamepad(0, {type:"buttons", code: me.input.GAMEPAD.BUTTONS.FACE_1}, me.input.KEY.ENTER);
		**/

		this.log_controls = -1;
		this.log_controls_state = -1;
		this.log_controls_str = "";
		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
			if (this.log_controls > -1) {
				game.TitleScreen.controls[this.log_controls][this.log_controls_state] = keyCode;
				this.log_controls_state++;
				this.log_controls_str = this.log_controls_str + String.fromCharCode(keyCode);

				if (this.log_controls_state == 1) {
					game.TitleScreen.settings[ game.TitleScreen.selected_setting ].values[0] = "RIGHT";
				}
				if (this.log_controls_state == 2) {
					game.TitleScreen.settings[ game.TitleScreen.selected_setting ].values[0] = "JUMP";
				}
				if (this.log_controls_state == 3) {
					game.TitleScreen.settings[ game.TitleScreen.selected_setting ].values[0] = "ATTACK";
				}
				if (this.log_controls_state > 3) {
					//console.log(game.TitleScreen.controls[this.log_controls]);
					this.log_controls = -1;
					this.log_controls_state = -1;
					game.TitleScreen.settings[ game.TitleScreen.selected_setting ].values[0] = this.log_controls_str;
				}
			} else {

				if (action === "enter") {
					if (game.TitleScreen.selected_setting == 0) { // start when "Play" is selected and enter is pressed
						me.audio.stopTrack();
						if (game.music_volume > 0) { me.audio.playTrack("03 Ferrous Rage", game.music_volume); }
						me.state.change(me.state.PLAY);
					}

					var setting = game.TitleScreen.settings[ game.TitleScreen.selected_setting ];
					if (setting.values.length == 1) {
						this.log_controls = setting.ctrl_id;
						this.log_controls_state = 0;
						this.log_controls_str = "";
						setting.values[0] = "LEFT";
					}
				}
				if (action === "down") {
					game.TitleScreen.selected_setting = ++game.TitleScreen.selected_setting % game.TitleScreen.settings.length;
				}
				if (action === "up") {
					game.TitleScreen.selected_setting--;
					if (game.TitleScreen.selected_setting < 0) { game.TitleScreen.selected_setting = game.TitleScreen.settings.length-1; }
					game.TitleScreen.selected_setting = game.TitleScreen.selected_setting % game.TitleScreen.settings.length;
				}
				if (action === "left") {
					var setting = game.TitleScreen.settings[ game.TitleScreen.selected_setting ];
					if (setting.values.length > 1) {
						setting.selection--;
						if (setting.selection < 0) {
							setting.selection = setting.values.length-1;
						}
						setting.selection = setting.selection % setting.values.length;
						if (typeof setting.on_change === 'function') {
							setting.on_change(setting); // fire on change callback if given
						}
					}
				}
				if (action === "right" || action === "enter") {
					var setting = game.TitleScreen.settings[ game.TitleScreen.selected_setting ];
					if (setting.values.length > 1) {
							setting.selection = ++setting.selection % setting.values.length;
							if (typeof setting.on_change === 'function') {
								setting.on_change(setting); // fire on change callback if given
							}
					}
				}

			}
		});
	},

	/**
	 * action to perform when leaving this screen (state change)
	 */
	onDestroyEvent : function () {
		me.event.unsubscribe(this.handler);
	}
});
