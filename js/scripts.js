(function(){

	var config = {
        type: Phaser.CANVAS,
        width: 800,
        height: 600,
        physics: {
	        default: 'arcade',
	        arcade: { debug: true }
	    },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);
    var sprite;
    var cursors;
    var textRotacao;
    var textAngulo;

    function preload() {    	
        this.load.image('sky', 'assets/img/checker.png');
        this.load.image('ship', 'assets/img/ship.png');
    }

    function create() {

    	this.add.image(400, 300, 'sky');

        //  Our player ship
	    sprite = this.physics.add.sprite(300, 300, 'ship');
	    sprite.setCollideWorldBounds(true);
	 	sprite.setDamping(true);
	    sprite.setDrag(0.99);
	    sprite.setMaxVelocity(200);

	    //  Game input
	    cursors = this.input.keyboard.createCursorKeys();	

	    textRotacao = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });    
	    textAngulo = this.add.text(10, 30, '', { font: '16px Courier', fill: '#00ff00' }); 
    }

    function update() {
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

	    textRotacao.setText('Rotation: ' + sprite.rotation);
	    textAngulo.setText('Angle: ' + sprite.angle);
    }

}());