(function(){

    var config = {
        type: Phaser.CANVAS,
        parent: 'phaser-example',
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                fps: 60,
                debug:true,
                gravity: { y: 0 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
            render: render
        }
    };

    var box_group;
    var currentHealt = 3;
    var cursors;
    var healthGroup;
    var maxHealt = 3;
    var sprite;
    var text;
    var textRotacao;
    var textAngulo;

    var game = new Phaser.Game(config);
    var container = new Phaser.Geom.Rectangle(150, 50, 500, 500,);
    var boxes_container = new Phaser.Geom.Rectangle(170, 70, 460, 460,);
    var bounds = new Phaser.Geom.Rectangle(350, 250, 200, 200);


    function preload () {
        this.load.image('platform','assets/img/checker.png');
        this.load.image('ship', 'assets/img/ship.png');
        this.load.image('box','assets/img/crate.png');
        this.load.image('asteroid','assets/img/asteroid.png');
        this.load.image('health','assets/img/mushroom16x16.png');

    }

    function create () {
		//  This will run in Canvas mode, so let's gain a little speed and display
       this.clearBeforeRender = false;
       this.roundPixels = true;

       this.add.image(400,300,'platform');

       sprite = this.physics.add.image(400, 300, 'ship');
       sprite.setCollideWorldBounds(true);
       sprite.body.setBoundsRectangle(container);
       sprite.setDamping(true);
       sprite.setDrag(0.99);
       sprite.setMaxVelocity(200);


       healthGroup = this.physics.add.staticGroup({
        key: 'health',
        frameQuantity: 3,
        immovable: true
    });

       var children = healthGroup.getChildren();
       for (var i = 0; i < children.length; i++){
        // Este laco posiciona os cogumelos 
        var pos = Phaser.Geom.Rectangle.RandomOutside(container,bounds);;
        children[i].setPosition(pos.x, pos.y);
    }


    // Essa linha de codigo define o tamanho e posicao da 'barreira' para as caixas

    box_group = this.physics.add.group({ immovable: true });

    for (var i = 0; i < 3; i++) {
            // Este laco cria e posiciona as caixas de forma aleatoria
            var box_pos = Phaser.Geom.Rectangle.RandomOutside(boxes_container,bounds);;
            box_group.create(box_pos.x, box_pos.y, 'box');
        }

        this.physics.add.collider(sprite, box_group);

        cursors = this.input.keyboard.createCursorKeys();

        textRotacao = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });    
        textAngulo = this.add.text(10, 30, '', { font: '16px Courier', fill: '#00ff00' }); 
        text = this.add.text(585, 10, 'Health: 3', { font: '24px Courier', fill: '#00ff00' });
        // Funcao cria asteroides
        
        var asteroid = this.physics.add.group({
            key: 'asteroid',
            quantity: 2,
            bounceX: 1,
            bounceY: 1,
            customBoundsRectangle: container,
            collideWorldBounds: true,
            velocityX: 220,
            velocityY: 200
        });


        // Funcao que posiciona os asteroids de forma aleatoria dentro do container
        Phaser.Actions.RandomRectangle(asteroid.getChildren(), container);
        this.physics.add.collider(asteroid,box_group,);
        this.physics.add.collider(asteroid, sprite);

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

   function render() {}
}());