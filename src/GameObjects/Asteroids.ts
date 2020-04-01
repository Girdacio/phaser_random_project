export class Asteroids extends Phaser.Physics.Arcade.Group
{
    constructor (scene, container)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            key: 'asteroid',
            frameQuantity: 2,
            //bounce: 1,
            //bounceY: 1,
            //customBoundsRectangle: container,
            //collideWorldBounds: true,
            //velocityX: 220,
            //velocityY: 200
            classType: Phaser.Physics.Arcade.Image
        });
        
        this.getChildren().forEach((asteroid: Phaser.Physics.Arcade.Image) => {
            asteroid.setVelocity(200);
            asteroid.setCollideWorldBounds(true);
            asteroid.setBounce(1);
            asteroid.body.world.collide(this, container);            
        });
    }
}