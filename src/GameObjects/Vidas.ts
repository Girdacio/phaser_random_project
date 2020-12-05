export class Vidas extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene: Phaser.Scene, container: Phaser.Geom.Rectangle, bounds: Phaser.Geom.Rectangle, quantity) {
        super(scene.physics.world, scene);

        this.createMultiple({
            key: 'health',
            frameQuantity: quantity,
            classType: Phaser.Physics.Arcade.Image
        });

        this.getChildren().forEach((vida: Phaser.Physics.Arcade.Image) => {
            // Este laco posiciona as vidas de forma aleatoria
            let box_pos = Phaser.Geom.Rectangle.RandomOutside(container, bounds); // TODO ajustar rectangles pq ainda está sobrepondo
            vida.body.reset(box_pos.x, box_pos.y);
        });

    }
}