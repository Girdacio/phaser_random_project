export class Asteroids extends Phaser.Physics.Arcade.Group {

    constructor(scene, quantity) {
        super(scene.physics.world, scene);

        this.createMultiple({
            key: ['asteroid', 'asteroid2'],
            frameQuantity: quantity,
            classType: Phaser.Physics.Arcade.Image
        });

        this.getChildren().forEach((asteroid: Phaser.Physics.Arcade.Image) => {
            let x = Phaser.Math.Between(50, 750);
            let y = Phaser.Math.Between(50, 550);
            asteroid.body.reset(x, y);
            asteroid.setVelocity(Math.random() * 51);
            asteroid.setCollideWorldBounds(true);
            asteroid.setBounce(1);
            asteroid.setAngularVelocity(Math.floor(Math.random() * 60)),
                asteroid["pontos"] = asteroid.texture.key == 'asteroid' ? 5 : 10;
        });

    }
}