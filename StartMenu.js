SpaceRocks.StartMenu = function(game) {
    this.startBG;
    this.instr;
    this.instructions;
    this.startPrompt;
    this.control;
};

SpaceRocks.StartMenu.prototype = { 
	
	create: function () {
		this.control = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.control.onDown.add(this.startGame, this);
        
		this.startBG = this.add.image(0, 0, 'titlescreen');
		this.startBG.height = this.world.height;
		this.startBG.width = this.world.width; 
		this.startBG.inputEnabled = true;
		this.startBG.events.onInputDown.addOnce(this.startGame, this);
		this.instr = 'Use Space to fire and Alt for Hyperspace';
		this.instructions = this.add.bitmapText(this.world.centerX-255, this.world.centerY+50, 'eightbitwonder', this.instr, 14);
		this.startPrompt = this.add.bitmapText(this.world.centerX-220, this.world.centerY+100, 'eightbitwonder', 'Press Space to Start', 24);
	},

	startGame: function (pointer) {
		//console.log('this.world.width == ' + this.world.width);
        //console.log('this.world.height == ' + this.world.height);
		this.state.start('Game');
	},
};
