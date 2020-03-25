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
    var text;

    var game = new Phaser.Game(config);

    function preload ()
    {
     this.load.image('platform','img/checker.png');
     this.load.image('ship', 'img/ship.png');
 }

 function create ()
 {
   this.add.image(400,300,'platform');
   sprite = this.physics.add.image(400, 300, 'ship');
   sprite.setCollideWorldBounds(true);
   sprite.body.setBoundsRectangle(new Phaser.Geom.Rectangle(150, 50, 500, 500,));
   sprite.setDamping(true);
   sprite.setDrag(0.99);
   sprite.setMaxVelocity(200);

   cursors = this.input.keyboard.createCursorKeys();

}

function update ()
{
    if (cursors.up.isDown)
    {
        this.physics.velocityFromRotation(sprite.rotation, 200, sprite.body.acceleration);
    }
    else if (cursors.down.isDown)
    {
        this.physics.velocityFromRotation(sprite.rotation, -200, sprite.body.acceleration);
    }
    else
    {
        sprite.setAcceleration(0);
    }

    if (cursors.left.isDown)
    {
        sprite.setAngularVelocity(-300);
    }
    else if (cursors.right.isDown)
    {
        sprite.setAngularVelocity(300);
    }
    else
    {
        sprite.setAngularVelocity(0);
    }



    this.physics.world.wrap(sprite, 32);

}
}());


   // var config = {
    //  type: Phaser.AUTO,
    //  width: 800,
    //  height: 600,
    //  parent: 'phaser-example',
    //  scene: {
    //      preload: preload,
    //      create: create,
    //      physics: {
    //          default:'arcade',
    //          arcade: {
    //              debug: true,
    //              gravity: { y: 0 }
    //          },
    //          matter: {
    //              debug: true,
    //              gravity: { y: 0.5 }
    //          },
    //          impact: {
    //              gravity: 50,
    //              debug: false,
    //              setBounds: {
    //                  x: 150,
    //                  y: 50,
    //                  width: 500,
    //                  height: 500,
    //                  thickness: 32
    //              },
    //              maxVelocity: 900
    //          }
    //      }
    //  }
    // };

    // var cursors;
    // var sprite;
    // var game = new Phaser.Game(config);

    // function preload(){
    //  this.load.image('ship','img/ship.png');

    // }

    // function create(){
    //  sprite = this.physics.add.image(400,300,'ship');
    //  sprite.body.setMaxSpeed(200);

    //  cursors = this.input.keyboard.createCursorKeys();
    //  console.log(cursors);

    //  }

    //  function update(){


    //      if (cursors.up.isDown)
    //      {
    //          this.physics.velocityFromRotation(sprite.rotation, sprite.body.maxSpeed, sprite.body.acceleration);
    //      }
    //      else
    //      {
    //          sprite.setAcceleration(0);
    //      }

    //      if (cursors.left.isDown)
    //      {
    //          sprite.setAngularVelocity(-300);
    //      }
    //      else if (cursors.right.isDown)
    //      {
    //          sprite.setAngularVelocity(300);
    //      }
    //      else
    //      {
    //          sprite.setAngularVelocity(0);
    //      }


    //      this.physics.world.wrap(sprite, 100);


    //  }
