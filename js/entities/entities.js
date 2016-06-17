
PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
		
		// set the default horizontal & vertical speed (accel vector)
		this.body.setVelocity(3, 15);
		this.body.dead = false;
	 
		// set the display to follow our position on both axis
		// me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	 
		// ensure the player is updated even when outside of the viewport
		this.alwaysUpdate = true;
			 
		// define a basic walking animation (using all frames)
		this.renderable.addAnimation("walk",  [15, 14, 13, 12, 11, 10]);
		
		this.renderable.addAnimation("attack",  [9, 8, 7, 6]);
		
		this.renderable.addAnimation("die",  [4]);
		
		this.renderable.addAnimation("jump",  [8]);
		
		// define a standing animation (using the first frame)
		this.renderable.addAnimation("stand",  [16,17,18,19]);
		// set the standing animation as default
		this.renderable.setCurrentAnimation("jump");
    },

    /**
     * update the player pos
     */
    update : function (dt) {		
		var p = me.game.world.getChildByName("player" + this.playerid)[0];
		if (p.pos.y > 540) { 
			game.data.health[this.playerid-1] = 0;
		}
	
		if (game.data.health[this.playerid-1] <= 0) {
			game.data.health[this.playerid-1] = 0;
			if (!this.renderable.isCurrentAnimation("die")) {
				var b = this.body;
				this.body.dead = true;
				this.renderable.setCurrentAnimation("die", function() { b.dead = true; });
			}
		} else {
		
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
		
		if (!this.body.isAttacked && me.input.isKeyPressed('attack' + this.playerid)) {
			this.body.attacking = true;
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
			// set current vel to the maximum defined value
			// gravity will then do the rest
			this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
			// set the jumping flag
			this.body.jumping = true;
		  }
	 
		}

        // apply physics to the body (this moves the entity)
		this.body.update(dt);
	 
		// handle collisions against other shapes
		me.collision.check(this);
		} // if dead		
		
		// return true if we moved or if the renderable was updated
		this._super(me.Entity, 'update', [dt]);
		return true;
	},

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
			
		  if (!this.body.dead && response.a.body.attacking && !this.body.attacking && !this.body.isAttacked) {
				this.body.isAttacked = true;
				game.data.health[this.playerid-1] -= 10;
				var b = this.body;
				this.renderable.flicker(100, function() { b.isAttacked = false; });
		  }
		  return false;
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