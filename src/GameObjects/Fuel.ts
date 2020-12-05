export class Fuel extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene: Phaser.Scene, container: Phaser.Geom.Rectangle, bounds: Phaser.Geom.Rectangle,quantity) {
        super(scene.physics.world, scene);

        this.createMultiple({
            key: 'fuel',
            frameQuantity: quantity,
            classType: Phaser.Physics.Arcade.Image
        });

        this.getChildren().forEach((fuelPack: Phaser.Physics.Arcade.Image) => {
            let box_pos = Phaser.Geom.Rectangle.RandomOutside(container, bounds);
            fuelPack.body.reset(box_pos.x, box_pos.y);
        });

    }
}