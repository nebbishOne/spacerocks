var SpaceRocks = {};

SpaceRocks.Boot = function(game) {};

SpaceRocks.Boot.prototype = {

    preload: function() {
        //this.load.image('preloaderBar', 'images/loader_bar.png');
        this.load.image('titleimage', 'images/title.png');
    },

	create: function() {
		this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = false; // pause game on tab change

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 270;
		this.scale.minHeight = 460;
		this.scale.pageAlignVertically = true;
		//this.scale.pageAlignHorizontally = true;
		this.stage.forceLandscape = true;  
		this.scale.updateLayout(true);  // true will force screen resize no matter what

		this.input.addPointer();
		this.stage.backgroundColor = '#000000';
		
		this.state.start('Preloader');
	}
};
