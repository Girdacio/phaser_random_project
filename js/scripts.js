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
    var container = new Phaser.Geom.Rectangle(150, 50, 500, 500,);
    function preload () {
     this.load.image('platform','assets/img/checker.png');
     this.load.image('ship', 'assets/img/ship.png');
     this.load.image('box','assets/img/crate.png');
     this.load.image('asteroid','assets/img/asteroid.png');
 }

 function create () {
  this.add.image(400,300,'platform');
  sprite = this.physics.add.image(400, 300, 'ship');
  sprite.setCollideWorldBounds(true);
        // A linha abaixo posicioina a barreira para a nave e os asteroides;
        sprite.body.setBoundsRectangle(container);
        sprite.setDamping(true);
        sprite.setDrag(0.99);

        sprite.setMaxVelocity(200);

	// Essa linha de codigo define o tamanho e posicao da 'barreira' para as caixas
   var bounds = new Phaser.Geom.Rectangle(300, 200, 300, 300);

   box_group = this.physics.add.group({ immovable: true });

   for (var i = 0; i < 3; i++) {
            // Este laco cria e posiciona as caixas de forma aleatoria
            var pos = bounds.getRandomPoint();
            box_group.create(pos.x, pos.y, 'box');
        }

        this.physics.add.collider(sprite, box_group);

        cursors = this.input.keyboard.createCursorKeys();

        textRotacao = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });    
        textAngulo = this.add.text(10, 30, '', { font: '16px Courier', fill: '#00ff00' }); 

        // Funcoes cria asteroides
        
        var asteroid = this.physics.add.group({
            key: 'asteroid',
            quantity: 10,
            bounceX: 1,
            bounceY: 1,
            customBoundsRectangle: container,
            collideWorldBounds: true,
            velocityX: 120,
            velocityY: 100
        });

        // Funcao que posiciona os asteroids de forma aleatoria dentro do container
        Phaser.Actions.RandomRectangle(asteroid.getChildren(), container);
        this.physics.add.collider(
            asteroid,
            box_group
            );

        

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