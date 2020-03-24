(function(){

	var config = {
		type: Phaser.AUTO,
		width: 800,
		height: 600,
		parent: 'phaser-example',
		scene: {
			preload: preload,
			create: create,
			physics: {
				arcade: {
					debug: true,
					gravity: { y: 200 }
				},
				matter: {
					debug: true,
					gravity: { y: 0.5 }
				},
				impact: {
					gravity: 50,
					debug: false,
					setBounds: {
						x: 150,
						y: 50,
						width: 500,
						height: 500,
						thickness: 32
					},
					maxVelocity: 900
				}
			}
		}
	};


	var game = new Phaser.Game(config);

	function preload(){
		this.load.image('platform','img/checker.png');
		this.load.image('ship','img/ship.png');

	}

	function create(){
		this.add.image(400,300,'platform');
		this.impact.add.image(400, 300, 'ship').setActiveCollision().setVelocity(50, 50).setBounce(1);

	}

	function update(){

	}

}());