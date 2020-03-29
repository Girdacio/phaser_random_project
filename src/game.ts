import 'phaser';

export default class Demo extends Phaser.Scene
{
    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.image('background','assets/img/deep-space.jpg');
    }

    create ()
    {
        // fundo
        this.add.image(400,300,'background');
    }
}

const config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
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
