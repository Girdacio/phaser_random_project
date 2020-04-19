export class Asteroids extends Phaser.Physics.Arcade.Group
{
    
    constructor (scene,quantity)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            key: ['asteroid','asteroid2'],
            frameQuantity: quantity,
            classType: Phaser.Physics.Arcade.Image
        });
        
        this.getChildren().forEach((asteroid: Phaser.Physics.Arcade.Image) => {
            asteroid.setVelocity(Math.random() * 51);
            asteroid.setCollideWorldBounds(true);
            asteroid.setBounce(1);
            asteroid.setAngularVelocity(Math.floor(Math.random() * 60)),
            asteroid ["pontos"] = asteroid.texture.key == 'asteroid' ? 5 : 10;
        });

    }
}