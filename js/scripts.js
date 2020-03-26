(function(){

    var config = {
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                fps: 60,
                gravity: { y: 0 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var sprite;
    var cursors;
    var box_group;
    var textRotacao;
    var textAngulo;

    var game = new Phaser.Game(config);

    function preload () {
       this.load.image('platform','assets/img/checker.png');
       this.load.image('ship', 'assets/img/ship.png');
       this.load.image('box','assets/img/crate.png');
   	}

	function create () {
		this.add.image(400,300,'platform');
	 	sprite = this.physics.add.image(400, 300, 'ship');
	 	sprite.setCollideWorldBounds(true);
	 	sprite.body.setBoundsRectangle(new Phaser.Geom.Rectangle(150, 50, 500, 500,));
	 	sprite.setDamping(true);
	 	sprite.setDrag(0.99);
	 	sprite.setMaxVelocity(200);

		var bounds = new Phaser.Geom.Rectangle(300, 200, 300, 300);
		box_group = this.physics.add.group({ immovable: true });

	 	for (var i = 0; i < 3; i++) {
	    	var pos = bounds.getRandomPoint();
	    	box_group.create(pos.x, pos.y, 'box');
		}

    	this.physics.add.collider(sprite, box_group);
    
    	cursors = this.input.keyboard.createCursorKeys();
	
		textRotacao = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });    
		textAngulo = this.add.text(10, 30, '', { font: '16px Courier', fill: '#00ff00' }); 
	}

	function update () {
	    if (cursors.up.isDown) {
	        this.physics.velocityFromRotation(sprite.rotation, 200, sprite.body.acceleration);
	    }
	    else if (cursors.down.isDown) {
	        this.physics.velocityFromRotation(sprite.rotation, -200, sprite.body.acceleration);
	    }
	    else {
	        sprite.setAcceleration(0);
	    }

	    if (cursors.left.isDown) {
	        sprite.setAngularVelocity(-300);
	    }
	    else if (cursors.right.isDown) {
	        sprite.setAngularVelocity(300);
	    }
	    else {
	        sprite.setAngularVelocity(0);
	    }

	    this.physics.world.wrap(sprite, 32);
	    
	    textRotacao.setText('Rotation: ' + sprite.rotation);
		textAngulo.setText('Angle: ' + sprite.angle);
	}
}());