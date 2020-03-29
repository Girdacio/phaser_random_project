import 'phaser';

export default class Demo extends Phaser.Scene
{
    private nave;
    private teclado: Phaser.Types.Input.Keyboard.CursorKeys;

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
        this.nave.body.setBoundsRectangle(new Phaser.Geom.Rectangle(150, 50, 500, 500)); // TODO ajustar para pegar o retangulo no background!
        this.nave.setDamping(true);
        this.nave.setDrag(0.99);
        this.nave.setMaxVelocity(200);

        // input - teclado
        this.teclado = this.input.keyboard.createCursorKeys();
    }

    update ()
    {
        // movimento da nave
        if (this.teclado.up.isDown) {
            this.physics.velocityFromRotation(this.nave.rotation, 200, this.nave.body.acceleration);
        }
        else if (this.teclado.down.isDown) {
            this.physics.velocityFromRotation(this.nave.rotation, -200, this.nave.body.acceleration);
        }
        else {
            this.nave.setAcceleration(0);
        }

        if (this.teclado.left.isDown) {
            this.nave.setAngularVelocity(-300);
        }
        else if (this.teclado.right.isDown) {
            this.nave.setAngularVelocity(300);
        }
        else {
            this.nave.setAngularVelocity(0);
        }

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
