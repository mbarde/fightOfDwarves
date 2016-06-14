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
 
    this.health1 = 100;
	this.health2 = 100;
  },
 
  /**
  * update function
  */
  update : function (dt) {
    if (this.health1 !== game.data.health1 || this.health2 !== game.data.health2) {
      this.health1 = game.data.health1;
	  this.health2 = game.data.health2;
      return true;
    }
    return false;
  },
  
  draw : function (renderer) {
    this.font.draw (renderer, game.data.health1, this.pos.x + 20, this.pos.y);	
    this.font.draw (renderer, game.data.health2, this.pos.x + 540, this.pos.y);
  }
});
