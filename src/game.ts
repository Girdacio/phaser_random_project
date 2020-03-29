import 'phaser';

export default class Demo extends Phaser.Scene
{
    private nave;

    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.image('background','assets/img/deep-space.jpg');
        this.load.image('ship', 'assets/img/ship.png');
    }

    create ()
    {
        // fundo
        this.add.image(400,300,'background');

        // nave
        this.nave = this.physics.add.image(400, 300, 'ship');
        this.nave.setCollideWorldBounds(true);
        this.nave.body.setBoundsRectangle(new Phaser.Geom.Rectangle(150, 50, 500, 500,));
        this.nave.setDamping(true);
        this.nave.setDrag(0.99);
        this.nave.setMaxVelocity(200);
    }

    update ()
    {
        this.physics.world.wrap(this.nave, 32); // TODO pra que serve?
    }
}

const config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,    
    clearBeforeRender: false,  //  This will run in Canvas mode, so let's gain a little speed and display
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            debug:true,
            gravity: { y: 0 }
        }
    },
    scene: Demo
};

const game = new Phaser.Game(config);
