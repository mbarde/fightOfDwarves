/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.HealthItem(80, 440));
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.HealthItem = me.Renderable.extend( {
  /**
  * constructor
  */
  init: function(x, y) {
 
    // call the parent constructor
    // (size does not matter here)
    this._super(me.Renderable, 'init', [x, y, 10, 10]);
 
    // create a font
    this.font = new me.BitmapFont("32x32_font", 32);
    this.font.set("right");
	
	this.health_offs = [ {x: 20, y: 0}, {x: 540, y: 0}, {x: 20, y: -430}, {x: 540, y: -430} ]
 
	this.health = [];
    for (var i = 0; i < game.data.playerCount; i++) { this.health.push(game.initHealth); }
  },
 
  /**
  * update function
  */
  update : function (dt) {
	made_changes = false;
	for (var i = 0; i < game.data.playerCount; i++) {
		if (this.health[i] !== game.data.health[i]) {
		  this.health[i] = game.data.health[i];
		  made_changes = true;
		}
	}
    return made_changes;
  },
  
  draw : function (renderer) {
	for (var i = 0; i < game.data.playerCount; i++) {
		this.font.draw(renderer, game.data.health[i], this.pos.x + this.health_offs[i].x, this.pos.y + this.health_offs[i].y);
	}
  }
});
