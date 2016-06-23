
PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
    // call the constructor
    this._super(me.Entity, 'init', [x, y , settings]);

		// set the display to follow our position on both axis
		// me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		// ensure the player is updated even when outside of the viewport
		this.alwaysUpdate = true;

		// define a basic walking animation (using all frames)
		this.renderable.addAnimation("walk",  [15, 14, 13, 12, 11, 10]);

		this.renderable.addAnimation("attack",  [9, 8, 7, 6]);

		this.renderable.addAnimation("die",  [4]);

		this.renderable.addAnimation("jump",  [8]);

		this.renderable.addAnimation("climb",  [0]);

		// define a standing animation (using the first frame)
		this.renderable.addAnimation("stand",  [16,17,18,19]);

    this.reset();
    },

    reset: function() {
      // set the default horizontal & vertical speed (accel vector)
  		this.body.setVelocity(3, 15);

  		// custom init
  		this.body.dead = false; // is body dead?
  		this.body.boost_active = false; // is a boost active? (trampoline effect)
      this.body.push_power_x = 0; // a additional vertical velocity added up to x velocity and being reduced each timestep
      this.body.attacking = false; // is body currently performing attack move
      this.body.isAttacked = false; // is body currently being attacked
      this.body.current_attack_power = 0; // power of current attack (amount of health reduce to enemy). Is set to certain value when attack starts.
                                          // Set to 0 when enemy has been hit to avoid multiple hits per attack.

  		// set the standing animation as default
  		this.renderable.setCurrentAnimation("jump");
    },

    /**
     * update the player pos
     */
    update : function (dt) {
		  var p = game.players[ this.playerid-1 ];
		  if (p.pos.y > 540) {
			     game.data.health[this.playerid-1] = 0;
      }

		if (game.data.health[this.playerid-1] <= 0) {
			game.data.health[this.playerid-1] = 0;
			if (!this.renderable.isCurrentAnimation("die")) {
        me.audio.play("dead01");
				var b = this.body;
				this.body.dead = true;
      	this.body.vel.x = 0;
				this.renderable.setCurrentAnimation("die", function() { b.dead = true; });
			}
		} else {

		if (this.body.boost_active && this.body.falling) {
			this.body.boost_active = false;
		}

		if (me.input.isKeyPressed('left' + this.playerid)) {
		  // flip the sprite on horizontal axis
		  this.renderable.flipX(true);
		  // update the entity velocity
		  this.body.vel.x -= this.body.accel.x * me.timer.tick;
		  // change to the walking animation
		  if (!this.renderable.isCurrentAnimation("walk") && !this.body.attacking) {
			this.renderable.setCurrentAnimation("walk");
		  }
		} else if (me.input.isKeyPressed('right' + this.playerid)) {
			// unflip the sprite
			this.renderable.flipX(false);
			// update the entity velocity
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			// change to the walking animation
			if (!this.renderable.isCurrentAnimation("walk") && !this.body.attacking) {
				this.renderable.setCurrentAnimation("walk");
			}
		} else {
  			this.body.vel.x = 0;
  			// change to the standing animation
  			if (!this.body.attacking) { this.renderable.setCurrentAnimation("stand"); }
		}

    // Push power added up to X velocity and reduced per time step
    if (this.body.push_power_x != 0) {
      this.body.vel.x += this.body.push_power_x * me.timer.tick;
      if (this.body.push_power_x > 0) {
        this.body.push_power_x -= me.timer.tick*2;
        if (this.body.push_power_x <= 0) {
          this.body.push_power_x = 0;
        }
      }
      if (this.body.push_power_x < 0) {
        this.body.push_power_x += me.timer.tick*2;
        if (this.body.push_power_x >= 0) {
          this.body.push_power_x = 0;
        }
      }
    }

		if (!this.body.isAttacked && !this.body.attacking && me.input.isKeyPressed('attack' + this.playerid)) {
      me.audio.play("attack02");
			this.body.attacking = true;
      this.body.current_attack_power = 10;
			var b = this.body;
			this.renderable.setCurrentAnimation("attack", function() {
				b.attacking = false;
				this.setCurrentAnimation("stand");
			});
		}

		if ( this.body.vel.y !=0 && !this.renderable.isCurrentAnimation("jump") && !this.body.attacking ) {
			this.renderable.setCurrentAnimation("jump");
		}

		if (this.body.vel.y == 0 && this.body.vel.x == 0 && !this.renderable.isCurrentAnimation("stand") && !this.body.attacking) {
			this.renderable.setCurrentAnimation("stand");
		}

		if (me.input.isKeyPressed('jump' + this.playerid)) {
			// make sure we are not already jumping or falling
			if (!this.body.jumping && !this.body.falling) {
          me.audio.play("jump01");
				// set current vel to the maximum defined value
				// gravity will then do the rest
				this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
				// set the jumping flag
				this.body.jumping = true;
			}
		}

		}

        // apply physics to the body (this moves the entity)
		this.body.update(dt);

		// handle collisions against other shapes
		me.collision.check(this);
		 // if dead

		// return true if we moved or if the renderable was updated
		this._super(me.Entity, 'update', [dt]);

		game.playScreen.check_for_win();
		return true;
	},

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
      if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
  			if (!this.body.boost_active && response.b.type == "boost") {
  				this.body.boost_active = true;
  				this.body.vel.y = -this.body.maxVel.y * 3 * me.timer.tick;
  			} else {
  				this.body.boost_active = false;
  			}
  			if (!this.body.dead && response.a.body.attacking && !this.body.attacking
            && !this.body.isAttacked && response.a.body.current_attack_power > 0
            && ( // check if attacker has right direction to be able to hit attacked
              (response.a.renderable.lastflipX && response.a.pos.x >= response.b.pos.x) // attacker stands on right side of attacked
              ||
              (!response.a.renderable.lastflipX && response.a.pos.x <= response.b.pos.x) // attacker stands on left side of attacked
            )
          ) {
  				      this.body.isAttacked = true;
			          game.data.health[this.playerid-1] -= response.a.body.current_attack_power;
                response.a.body.current_attack_power = 0;
                me.audio.play("hit01");

                //this.body.vel.y = - this.body.maxVel.y * 0.2 * me.timer.tick;
                if (response.a.pos.x > response.b.pos.x) {
                  this.body.push_power_x = -35;
                } else {
                  this.body.push_power_x = 35;
                }

			          var b = this.body;
	              this.renderable.flicker(100, function() { b.isAttacked = false; });
  		  }
  		  return false;
      } else {
			if (this.body.boost_active) {
			     this.body.boost_active = false;
	    }
    }
		// Make all other objects solid
		return true;
    }
});

game.Player1Entity = PlayerEntity.extend({
    init:function (x, y, settings) {
			this._super(PlayerEntity, 'init', [x, y , settings]);
			this.playerid = 1;
	}
});
game.Player2Entity = PlayerEntity.extend({
    init:function (x, y, settings) {
			this._super(PlayerEntity, 'init', [x, y , settings]);
			this.playerid = 2;
	}
});
game.Player3Entity = PlayerEntity.extend({
    init:function (x, y, settings) {
			this._super(PlayerEntity, 'init', [x, y , settings]);
			this.playerid = 3;
	}
});
game.Player4Entity = PlayerEntity.extend({
    init:function (x, y, settings) {
			this._super(PlayerEntity, 'init', [x, y , settings]);
			this.playerid = 4;
	}
});
