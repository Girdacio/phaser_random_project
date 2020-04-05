export class Caixas extends Phaser.Physics.Arcade.StaticGroup {
    private varsX;
    private varsY;
    private pos;
    constructor(scene: Phaser.Scene, boxes_container: Phaser.Geom.Rectangle, bounds: Phaser.Geom.Rectangle) {

        super(scene.physics.world, scene);

        this.createMultiple({
            key: 'box',
            frameQuantity: 3,
            classType: Phaser.Physics.Arcade.Image
        });
        let i = 0;
        this.varsX = [];
        this.varsY = [];

        this.getChildren().forEach((caixa: Phaser.Physics.Arcade.Image) => {
        this.pos = Phaser.Geom.Rectangle.RandomOutside(boxes_container, bounds);

            if (i == 0) {
                caixa.body.reset(Math.ceil(this.pos.x), Math.ceil(this.pos.y));
                this.varsX.push(caixa.x);
                this.varsY.push(caixa.y);
                console.info(caixa.x);
            } else {
                this.pos = Phaser.Geom.Rectangle.RandomOutside(boxes_container, bounds);
                for (let ii = 0; i < this.varsX.length; i++) {
                    if (this.pos.x < this.varsX[ii] + 50 && this.pos.x > this.varsY[ii] - 50 && this.pos.y < this.varsY[ii] + 50 && this.pos.y > this.varsY[ii] - 50) {
                        this.pos = Phaser.Geom.Rectangle.RandomOutside(boxes_container, bounds);
                        ii = 0;
                    }
                }
                caixa.body.reset(Math.ceil(this.pos.x), Math.ceil(this.pos.y));
                this.varsX.push(caixa.x);
                this.varsY.push(caixa.y);
                console.info(caixa.x);
                console.info(this.varsX.length)

            }
            // this.pos = Phaser.Geom.Rectangle.RandomOutside(boxes_container, bounds);
            // console.info(this.pos.x, this.pos.y);
            // caixa.body.reset(this.pos.x, this.pos.y);
            i++;
        });

    }
}