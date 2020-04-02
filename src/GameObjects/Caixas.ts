export class Caixas extends Phaser.Physics.Arcade.StaticGroup
{
    constructor (scene: Phaser.Scene, boxes_container: Phaser.Geom.Rectangle, bounds: Phaser.Geom.Rectangle)
    {
        ;
        super(scene.physics.world, scene);

        this.createMultiple({
            key: 'box',
            frameQuantity: 3,
            classType: Phaser.Physics.Arcade.Image
        });
        
        this.getChildren().forEach((caixa: Phaser.Physics.Arcade.Image) => {
            let box_pos = Phaser.Geom.Rectangle.RandomOutside(boxes_container, bounds); // TODO ajustar rectangles pq ainda está sobrepondo
            caixa.body.reset(box_pos.x, box_pos.y);
            
        });

    }
}