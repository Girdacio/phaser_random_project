import 'phaser';

class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'bullet');
    }

    fire (x, y, rotation)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);
        this.rotation = rotation;
        this.scene.physics.velocityFromRotation(rotation, 400, this.body.velocity);        

        //this.lifespan = 2000;
        setTimeout(() => {
            this.setActive(false);
            this.setVisible(false);
        }, 2000);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
    }
}

class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: 'bullet',
            active: false,
            visible: false,       
            classType: Bullet
        });        
    }

    fireBullet (x, y, rotation)
    {
        let bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(x, y, rotation);
        }
    }
}

export default class Demo extends Phaser.Scene
{
    private nave;
    private teclado: Phaser.Types.Input.Keyboard.CursorKeys;
    private tiros;
    private atirando: boolean = false;

    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.image('background','assets/img/deep-space.jpg');
        this.load.image('ship', 'assets/img/ship.png');
        this.load.image('bullet', 'assets/img/bullet77.png');
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

        // nave - tiros
        this.tiros = new Bullets(this);

        // input - teclado
        this.teclado = this.input.keyboard.createCursorKeys();
    }

    update ()
    {
        // nave - movimento
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

        // nave - movimento tiro
        if (this.teclado.space.isDown) { //this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
            if (!this.atirando) {
                this.atirando = true;
                this.tiros.fireBullet(this.nave.x, this.nave.y, this.nave.rotation);
            }            
        }
        else {
            this.atirando = false;
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
