SpaceRocks.Game = function(game) {
    this.asteroidsgroup;
    this.bg;
    this.startAsteroids;
    this.asteroidCount;
    this.ship;
    this.shiprate;
    this.maxshiprate;
    this.shots;
    this.firerate;
    this.nextfire;
    this.burst;
    this.enemyBurst;
    this.enemy;
    this.enemyTimer;
    this.enemyShots;
    this.enemyShotTimer;
    this.beep;
    this.boom1;
    this.boom2;
    this.boom3;
    this.boop1;
    this.boop2;
    this.brr;
    this.bweeoop;
    this.deedeedee;
    this.cursors;
    this.control;
    this.hyperspace;
    this.hyperdelay;
    this.hypertimer;
    this.canhyperspace;
    this.shotFired;
    this.score;
    this.prevscore;
    this.scoremessage;
    this.lives;
    this.lifemessage;
    this.gameover;
    this.overmessage;
    this.timer;
    this.playerRespawnTime;
    this.asteroidTimer;
    this.haveRocks;
};

SpaceRocks.Game.prototype = {
    
    create: function() {
        this.lives = 3;
        this.score = 0;
        this.prevscore = 0;
        this.gameover = false;
        this.timer = 0;
        this.asteroidTimer = null;
        this.startAsteroids = 5;
        this.asteroidCount = 0;
        this.enemy = null;
        this.enemyTimer = null;
        this.enemyShotTimer = null;
        this.playerRespawnTime = 2500;
        this.firerate = 200;
        this.shiprate = 50;
        this.maxshiprate = 20;
        this.nextfire = 0;
        this.shotFired = false;
        this.hyperdelay = 5000;
        this.canhyperspace = true;
        this.haveRocks = false;
        
        this.beep =  this.add.audio('beep');
        this.boom1 = this.add.audio('boom1');
        this.boom2 = this.add.audio('boom2');
        this.boom3 = this.add.audio('boom3');
        this.boop1 = this.add.audio('boop1');
        this.boop2 = this.add.audio('boop2');
        this.brr =   this.add.audio('brr');
        this.bweeoop =   this.add.audio('bweeoop');
        this.deedeedee = this.add.audio('deedeedee');
        
        this.buildWorld();
    },
    
    buildWorld: function () {
        this.bg = this.add.image(0, 0, 'bg');
        this.bg.height = this.world.height;
        this.bg.width = this.world.width; 
        this.bg.z = 0;
        this.buildShip();
        this.buildEnemy();
        this.buildAsteroids();
        this.buildShots();
        this.buildEnemyShots();
        this.buildEmitter();
        this.buildEnemyEmitter();
        this.scoremessage = this.add.bitmapText(this.world.width-200,10, 'eightbitwonder', 'Score:' + this.score, 20);
        this.lifemessage = this.add.bitmapText(10, 10, 'eightbitwonder', 'Lives: ' + this.lives, 20);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.control = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.control.onDown.add(this.fireShot, this);
        this.hyperspace = this.input.keyboard.addKey(Phaser.Keyboard.ALT);
        this.hyperspace.onDown.add(this.goHyperspace, this);
        this.physics.enable(this.ship, Phaser.Physics.ARCADE);
        this.ship.body.maxVelocity.set(200);
    },
    
    buildShip: function() {
        this.ship = this.add.sprite(this.world.centerX, this.world.centerY, 'ship');
        this.ship.enableBody = true;
        this.ship.allowRotation = true;
        this.ship.anchor.setTo(0.5, 0.5);
    },
    
    buildShots: function() {
        this.shots = this.add.group();
        this.shots.physicsBodyType = Phaser.Physics.ARCADE;
        this.shots.enableBody = true;
        this.shots.createMultiple(50, 'shot');
        this.shots.setAll('checkWorldBounds', true);
        this.shots.setAll('outOfBoundsKill', true);
    },
    
    playRndSound: function(nm) {
        if (this.rnd.integerInRange(1,2) == 1) {
            if (nm == 'boom') {
                this.boom1.play();
            } else { 
                this.boop1.play();
            }
        } else {    // 2
            if (nm == 'boom') {
                this.boom2.play();
            } else {
                this.boop2.play();
            }
        }
    },
    
    fireShot: function() {
        if (this.gameover == false) {
            if (this.ship.exists) {
                if (this.time.now > this.nextfire && this.shots.countDead() > 0)
                {
                    this.nextfire = this.time.now + this.firerate;
            
                    var shot = this.shots.getFirstDead();
            
                    shot.reset(this.ship.x, this.ship.y);
                    this.physics.arcade.velocityFromRotation(this.ship.rotation-1.57, 400, shot.body.velocity);
                    this.playRndSound('boop');
                }
            }
        }
    },
    
    goHyperspace: function(game) {
        if (this.canhyperspace == true) {
            var rx = this.rnd.integerInRange(0, this.world.width);
            var ry = this.rnd.integerInRange(0, this.world.height);
            this.ship.reset(rx, ry);
            this.canhyperspace = false;
            this.hypertimer = this.time.now + this.hyperdelay;
        }
    },
    
    buildEmitter:function() {
        this.burst = this.add.emitter(0, 0, 50);
        this.burst.minParticleScale = 0.3;
        this.burst.maxParticleScale = 0.8;
        this.burst.minParticleSpeed.setTo(-50, 50);
        this.burst.maxParticleSpeed.setTo(50, -50);
        this.burst.makeParticles('explosion');
    },
    
    buildEnemyEmitter:function() {
        this.enemyBurst = this.add.emitter(0, 0, 30);
        this.enemyBurst.minParticleScale = 0.1;
        this.enemyBurst.maxParticleScale = 0.5;
        this.enemyBurst.minParticleSpeed.setTo(-90, 90);
        this.enemyBurst.maxParticleSpeed.setTo(90, -90);
        this.enemyBurst.makeParticles('explosion');
    },
    
    fireBurst: function(a, s) {
        if (this.gameover == false) {
            //play sound
            this.playRndSound('boom');
            
            //erase the shot
            var shot = this.shots.getFirstAlive();
            if (shot) {
                shot.kill();
            }
            
            this.burst.emitX = a.x;
            this.burst.emitY = a.y;
            this.burst.start(true, 500, null, 15); //(explode, lifespan, frequency, quantity)
            
            this.score++;
            this.scoremessage.setText('Score: ' + this.score);
            this.checkScore();
            
            if (a.exists) {
                if (a.custSize == 'large') {
                    this.goLargeToMedium(a);
                } else if (a.custSize == 'medium') {
                    this.goMediumToSmall(a);
                } else {
                    a.kill();
                    this.asteroidCount--;
                }
            }
        }
    },
    
    buildAsteroids: function() {
        this.asteroidsgroup = this.add.group();
        this.asteroidsgroup.enableBody = true;
        for(var i=0; i<this.startAsteroids; i++) {
            this.createOneLargeAsteroid();
        }
        this.haveRocks = true;
        //console.log("haveRocks=" + this.haveRocks);
    },
    
    respawnAsteroid: function(a) {
        if (this.gameover == false) {
            a.destroy();
            if (a.custSize == 'large') {
                this.createOneLargeAsteroid();
            } else if (a.custSize == 'medium') {
                this.createTwoMediumAsteroids();
            } else {
                this.asteroidCount--;
            }
        }
    },
    
    goLargeToMedium: function(a) {
      if (this.gameover == false) {
          var posX = a.x;
          var posY = a.y;
          a.destroy();
          this.createTwoMediumAsteroids(posX, posY);
      }  
    },
    
    goMediumToSmall: function(a) {
      if (this.gameover == false) {
          var posX = a.x;
          var posY = a.y;
          a.destroy();
          this.createTwoSmallAsteroids(posX, posY);
      }  
    },
    
    createOneLargeAsteroid: function() {
        var rndX = 0;
        var rndY = 0;
        do
            rndX = this.rnd.integerInRange(0, this.world.width-50);
        while (rndX <= this.world.centerX+50 && rndX >= this.world.centerX-50);
        do
            rndY = this.rnd.integerInRange(0, this.world.height);
        while(rndY <= this.world.centerY+50 && rndY >= this.world.centerY-50);
        var b = this.asteroidsgroup.create(rndX, rndY, 'large');
        b.anchor.setTo(0.5, 0.5);
        b.body.moves = true;
        b.custSize = 'large';
        b.scale.set(.75);
        if (this.gameover == false && b.exists) {
            b.body.velocity.x = this.rnd.integerInRange(-100, 100); 
            b.body.velocity.y = this.rnd.integerInRange(-100, 100);
            b.body.angle = this.rnd.integerInRange(0,180);
            b.body.angularVelocity = this.rnd.integerInRange(0,100);
        }
        this.asteroidCount++;
    },
    
    createTwoMediumAsteroids: function(posX, posY) {
        var b = this.asteroidsgroup.create(posX, posY, 'medium');
        b.anchor.setTo(0.5, 0.5);
        b.body.moves = true;
        b.custSize = 'medium';
        if (this.gameover == false && b.exists) {
            b.body.velocity.x = this.rnd.integerInRange(-100, 100); 
            b.body.velocity.y = this.rnd.integerInRange(-100, 100);
            b.body.angle = this.rnd.integerInRange(0,180);
            b.body.angularVelocity = this.rnd.integerInRange(0,100);
        }
        this.asteroidCount++;
        var b = this.asteroidsgroup.create(posX+5, posY+5, 'medium');
        b.anchor.setTo(0.5, 0.5);
        b.body.moves = true;
        b.custSize = 'medium';
        if (this.gameover == false && b.exists) {
            b.body.velocity.x = this.rnd.integerInRange(-100, 100); 
            b.body.velocity.y = this.rnd.integerInRange(-100, 100);
            b.body.angle = this.rnd.integerInRange(0,180);
            b.body.angularVelocity = this.rnd.integerInRange(0,100);
        }
        this.asteroidCount++;
    },
    
    createTwoSmallAsteroids: function(posX, posY) {
        var b = this.asteroidsgroup.create(posX, posY, 'small');
        b.anchor.setTo(0.5, 0.5);
        b.body.moves = true;
        if (this.gameover == false && b.exists) {
            b.body.velocity.x = this.rnd.integerInRange(-100, 100); 
            b.body.velocity.y = this.rnd.integerInRange(-100, 100);
            b.body.angle = this.rnd.integerInRange(0,180);
            b.body.angularVelocity = this.rnd.integerInRange(0,100);
        }
        this.asteroidCount++;
        var b = this.asteroidsgroup.create(posX+5, posY+5, 'small');
        b.anchor.setTo(0.5, 0.5);
        b.body.moves = true;
        if (this.gameover == false && b.exists) {
            b.body.velocity.x = this.rnd.integerInRange(-100, 100); 
            b.body.velocity.y = this.rnd.integerInRange(-100, 100);
            b.body.angle = this.rnd.integerInRange(0,180);
            b.body.angularVelocity = this.rnd.integerInRange(0,100);
        }
        this.asteroidCount++;
    },
    
    shipExplode: function(s, a) {
        if (this.gameover == false) {
            this.boom3.play();
            
            //erase the ship
            if (s.alive) {
                //erase the asteroid
                if (a) {
                    this.respawnAsteroid(a);
                }
    
                this.burst.emitX = s.x;
                this.burst.emitY = s.y;
                this.burst.start(true, 800, null, 30); //(explode, lifespan, frequency, quantity)
                
                this.canhyperspace = true;
                s.kill();
                this.lives--;
                if (this.lives < 1) {
                    this.endGame();
                } else { 
                    this.lifemessage.setText('Lives: ' + this.lives);
                    this.timer = this.time.now + this.playerRespawnTime;
                }
            }
        }
    },
    
    screenWrapMyShip: function() {
        if (this.ship.x < 0) {
            this.ship.x = this.game.width;
        } else if (this.ship.x > this.game.width) {
            this.ship.x = 0;
        }
    
        if (this.ship.y < 0) {
            this.ship.y = this.game.height;
        } else if (this.ship.y > this.game.height) {
            this.ship.y = 0;
        }
    },
    
    screenWrapShot: function() {
        var shot = this.shots.getFirstAlive();
        if (shot) {
            if (shot.x < 0) {
               shot.x = this.game.width;
            } else if (shot.x > this.game.width) {
                shot.x = 0;
            }
        
            if (shot.y < 0) {
                shot.y = this.game.height;
            } else if (shot.y > this.game.height) {
                shot.y = 0;
            }
        }
    },
    
     screenWrapAsteroids: function() {
        for (var ctr = 0; ctr <= this.asteroidsgroup.children.length; ctr++) {
            var a = this.asteroidsgroup.children[ctr];
            if (a) {
                if (a.x < 0) {
                   a.x = this.game.width;
                } else if (a.x > this.game.width) {
                    a.x = 0;
                }
            
                if (a.y < 0) {
                    a.y = this.game.height;
                } else if (a.y > this.game.height) {
                    a.y = 0;
                }
            }
        }
    },
    
    checkAsteroidCount: function(game) {
        var alive = 0;
        if (this.haveRocks == true) {
            if (this.asteroidsgroup.children.length > 0) {
                //this.asteroidsMessage.setText("Ast: " + this.asteroidsgroup.children.length);
                
                for (var ctr = 0; ctr < this.asteroidsgroup.children.length; ctr++) {
                    var a = this.asteroidsgroup.children[ctr];
                    if (a.exists) {
                        alive++;
                    }
                }
                if (alive == 0) {
                    this.asteroidTimer = this.time.now + 5000;
                    this.haveRocks = false;
                    //console.log("haveRocks=" + this.haveRocks);
                }
            }
        }
    },
    
    buildEnemy: function() {
        this.enemy = this.add.sprite(this.rnd.integerInRange(0,this.world.centerX), this.rnd.integerInRange(0,this.world.centerY), 'enemy');
        //this.enemy.physicsBodyType = Phaser.Physics.ARCADE;
        this.physics.enable(this.enemy, Phaser.Physics.ARCADE);
        //this.enemy.enable = true;
        //this.enemy.allowRotation = false;
        this.enemy.anchor.setTo(0.5, 0.5);
        this.enemy.kill();
        this.enemy.exists = false;
        this.enemyTimer = null;
    },
    
    checkForEnemy: function(game) {
        if (this.enemy.exists == false) {
            if (this.enemyTimer == null) {
                this.enemyTimer = this.time.now + this.rnd.integerInRange(10000,15000);
                console.log("Setting enemy timer to " + this.enemyTimer);
            }
        }    
    },
    
    rebuildEnemy: function() {
        if (this.gameover == false) {
            if (this.enemy.exists == false) {
                var x1 = 50;
                var y1 = 50;
                var x2 = this.world.width - 50;
                var y2 = this.world.height - 50;
                var pick = this.rnd.integerInRange(1,4);
                if (pick == 1) {
                    this.enemy.reset(x1, y1);
                } else if (pick == 2) {
                    this.enemy.reset(x1, y2);
                } else if (pick == 3) {
                    this.enemy.reset(x2, y1);
                } else {
                    this.enemy.reset(x2, y2);
                }
                this.makeEnemyMove();
            }
        }
    },
    
    makeEnemyMove: function() {
        if (this.enemy.exists == true) {
            if (this.enemy.body) {
                this.enemy.body.acceleration.set(100);
                this.physics.arcade.accelerateToXY(
                    this.enemy, //displayobject
                    this.rnd.integerInRange(0,this.world.height-50),  // y, 
                    100,                                              //speed, 
                    100,                                              //xSpeedMax, 
                    100);                                             //ySpeedMax) 
                
                //console.log("Enemy moving!");
                
                this.bweeoop.loopFull();
            }
        }
    },
    
    enemyExplode: function() {
        if (this.gameover == false) {
            if (this.enemy.exists == true) {
                this.bweeoop.stop();
                this.boom3.play();
                
                this.enemyBurst.emitX = this.enemy.x;
                this.enemyBurst.emitY = this.enemy.y;
                this.enemyBurst.start(true, 800, null, 30); //(explode, lifespan, frequency, quantity)
                
                this.enemy.kill();
                this.checkForEnemy();
                this.score = this.score + 10;
                this.checkScore();
                this.scoremessage.setText('Score: ' + this.score);
            }
        }  
    },
    
    buildEnemyShots: function() {
        this.enemyShots = this.add.group();
        this.enemyShots.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyShots.enableBody = true;
        this.enemyShots.createMultiple(20, 'shot');
        this.enemyShots.setAll('checkWorldBounds', true);
        this.enemyShots.setAll('outOfBoundsKill', true);
    },
    
    checkEnemyShot: function() {
        if (this.gameover == false) {
            if (this.enemy.exists == true && this.enemyShotTimer == null) {
                this.enemyShotTimer = this.time.now + 1500;
            }
        }  
    },
    
    fireEnemyShot: function() {
        if (this.gameover == false) {
            if (this.ship.exists && this.enemy.exists) {
                if (this.enemyShots.countDead() > 0)
                {
                    var eShot = this.enemyShots.getFirstDead();
            
                    eShot.reset(this.enemy.x, this.enemy.y);
                    //accelerateToObject(displayObject, destination, speed, xSpeedMax, ySpeedMax) 
                    this.physics.arcade.accelerateToObject(eShot, this.ship, 150, 150, 150);
                    this.playRndSound('beep');
                }
            }
        }
    },
    
    shipExplode: function(s, a) {
        if (this.gameover == false) {
            this.boom3.play();
            
            //erase the ship
            if (this.ship.exists) {
                //erase the asteroid
                if (a) {
                    this.respawnAsteroid(a);
                }
    
                this.burst.emitX = s.x;
                this.burst.emitY = s.y;
                this.burst.start(true, 800, null, 30); //(explode, lifespan, frequency, quantity)
                
                this.canhyperspace = true;
                this.ship.kill();
                //console.log("killed my ship");
                this.lives--;
                if (this.lives < 1) {
                    this.endGame();
                } else { 
                    this.lifemessage.setText('Lives: ' + this.lives);
                    this.timer = this.time.now + this.playerRespawnTime;
                    //console.log("this.timer is " + this.timer);
                }
            }
        }
    },
    
    screenWrapEnemy: function() {
        if (this.enemy.x < 0 || this.enemy.x > this.game.width) {
            this.bweeoop.stop();
            this.enemy.kill();
        }
    
        if (this.enemy.y < 0 || this.enemy.y > this.game.height) {
            this.bweeoop.stop();
            this.enemy.kill();
        }
    },
    
    enemyShipExplode: function(es, s) {
        // when an enemy shot hits my ship
        if (this.gameover == false) {
            //erase all shots
            this.enemyShots.forEachExists(
                function(eShot) {
                    eShot.kill();
                }, this);
            
            // kill my ship
            if (this.ship.exists == true) {
                this.bweeoop.stop();
                //console.log("making ship explode");
                this.shipExplode(s, null);
            }
        }
    },
    
    checkScore: function() {
        if (this.gameover == false) {
            if (this.score != 0) {
                if ((this.score < 500 && this.score - this.prevscore > 50) || 
                    (this.score - this.prevscore > 100))  {
                    this.deedeedee.play();
                    this.lives++;
                    this.lifemessage.setText('Lives: ' + this.lives);
                    this.prevscore = this.score;
                }    
            } 
        }
    },
    
    endGame: function() {
        this.gameover = true;
        this.ship.kill();
        this.enemy.kill();
        this.shots.forEachExists(
                function(shot) {
                    shot.kill();
                }, this);
        this.enemyShots.forEachExists(
                function(eShot) {
                    eShot.kill();
                }, this);
        this.asteroidsgroup.forEachExists(
                function(a) {
                    a.kill();
                }, this);
        
        this.bweeoop.stop();
        this.lifemessage.setText("Lives: 0");
        
        // remember this score
        if (this.game.device.localStorage) {
            localStorage.setItem('newestScore', this.score);
            console.log("newest score is " + localStorage.getItem('newestScore'));
        } else { 
            console.log('!!!!!!!!!! Cannot set high score - no local storage !!!!!!!!!!');   
        }
        
        // game over message
        this.overmessage = this.add.bitmapText(this.world.centerX-170, this.world.centerY-80, 'eightbitwonder', 'Game Over', 40);
        
        this.timer = this.time.now + 5000;
    },
    
    quitGame: function(pointer) {
        this.state.start('HighScores');
    },    
    
    doNothing: function() {
        //really.
    },
        
    update: function() {
        if (this.gameover == true && this.timer < this.time.now) {
            this.quitGame();
            this.timer = null;
        }
        
        if (this.gameover == false) {
            if (this.ship.exists == false && this.timer < this.time.now) {
                this.ship.reset(this.world.centerX, this.world.centerY);
                this.timer = null;
            }
            
            if (this.canhyperspace == false && this.hypertimer < this.time.now) {
                this.canhyperspace = true;
                this.hypertimer = null;
            }
            
            if (this.haveRocks == false && this.asteroidTimer < this.time.now) {
                this.asteroidsgroup.destroy();
                this.startAsteroids++;
                this.buildAsteroids();
                this.asteroidTimer = null;
            }
            
            if (this.enemy.exists == false && this.enemyTimer < this.time.now) {
                if (this.enemyTimer != null) {
                    console.log("need to rebuild enemy");
                    this.rebuildEnemy();
                    this.enemyTimer = null;
                }
            }
            
            if (this.enemy.exists == true && this.enemyShotTimer < this.time.now) {
                console.log("enemy takes a shot");
                this.fireEnemyShot();
                this.enemyShotTimer = null;
            }
            
            // keyboard inputs - left, right, up
            if (this.cursors.left.isDown) {
                if (this.ship && this.ship != undefined) this.ship.body.angularVelocity = -200;
            } else if (this.cursors.right.isDown) {
                if (this.ship && this.ship != undefined) this.ship.body.angularVelocity = 200;
            } else { 
                if (this.ship && this.ship != undefined) this.ship.body.angularVelocity = 0;
            }
            if (this.cursors.up.isDown)
            {
                var shipspeed = this.ship.velocity > 100 ? this.maxshiprate : this.shiprate;
                this.physics.arcade.accelerationFromRotation(this.ship.rotation-1.57, shipspeed, this.ship.body.acceleration);
                if (this.brr.isPlaying == false) {
                    this.brr.play();
                }
            } else {
                if (this.ship && this.ship != undefined) this.ship.body.acceleration.set(0);
                this.brr.stop();
            }
            
            this.screenWrapMyShip(this);
            this.screenWrapEnemy(this);
            this.screenWrapAsteroids(this);
            
            this.checkAsteroidCount(this);
            
            this.checkForEnemy(this);
            this.checkEnemyShot(this);
            
             // collisions
            this.physics.arcade.overlap(this.ship, this.asteroidsgroup, this.shipExplode, null, this);
            this.physics.arcade.overlap(this.enemy, this.asteroidsgroup, this.enemyExplode, null, this);
            this.physics.arcade.overlap(this.enemyShots, this.ship, this.enemyShipExplode, null, this);
            this.physics.arcade.overlap(this.enemy, this.shots, this.enemyExplode, null, this);
            this.physics.arcade.overlap(this.asteroidsgroup, this.shots, this.fireBurst, null, this);
        }
    }
};
