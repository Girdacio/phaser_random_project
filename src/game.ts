import 'phaser';
import { Bullets } from './objects/bullets';

export default class Demo extends Phaser.Scene
{
    private nave;
    private teclado: Phaser.Types.Input.Keyboard.CursorKeys;
    private tiros;
    private atirando: boolean = false;
    private textRotacao: Phaser.GameObjects.Text;
    private textAngulo: Phaser.GameObjects.Text;
    private textVidas: Phaser.GameObjects.Text;
    private box_group;
    private healthGroup;
    private maxHealt = 3;
    
    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.image('background','assets/img/deep-space.jpg');
        this.load.image('ship', 'assets/img/ship.png');
        this.load.image('bullet', 'assets/img/bullet77.png');
        this.load.image('box','assets/img/crate.png');
        this.load.image('health','assets/img/mushroom2.png');
        this.load.image('asteroid','assets/img/asteroid1.png');
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

        let bounds = new Phaser.Geom.Rectangle(300, 200, 300, 300);
        let container = new Phaser.Geom.Rectangle(150, 50, 500, 500);
        let boxes_container = new Phaser.Geom.Rectangle(170, 70, 460, 460);

        // vida
        this.healthGroup = this.physics.add.staticGroup({
            key: 'health',
            frameQuantity: 3
        });
    
        let children = this.healthGroup.getChildren();
        for (let i = 0; i < children.length; i++){
            let pos = Phaser.Geom.Rectangle.RandomOutside(container, bounds);;
            children[i].setPosition(pos.x, pos.y);
        }

        // nave - tiros
        this.tiros = new Bullets(this);

        // obstáculos - caixas       
        this.box_group = this.physics.add.group({ immovable: true });
        this.physics.add.collider(this.nave, this.box_group);

        for (let i = 0; i < 3; i++) {
            // Este laco cria e posiciona as caixas de forma aleatoria
            let box_pos = Phaser.Geom.Rectangle.RandomOutside(boxes_container, bounds); // TODO ajustar rectangles pq ainda está sobrepondo
            this.box_group.create(box_pos.x, box_pos.y, 'box');
        }

        // inimigos - asteróides
        let asteroid = this.physics.add.group({
            key: 'asteroid',
            quantity: 2,
            bounceX: 1,
            bounceY: 1,
            customBoundsRectangle: container,
            collideWorldBounds: true,
            velocityX: 220,
            velocityY: 200
        });

        // Funcao que posiciona os asteroids de forma aleatoria dentro do container
        Phaser.Actions.RandomRectangle(asteroid.getChildren(), container);
        this.physics.add.collider(asteroid, this.box_group,);
        this.physics.add.collider(asteroid, this.nave);

        // input - teclado
        this.teclado = this.input.keyboard.createCursorKeys();

        // textos
        this.textRotacao = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });    
        this.textAngulo = this.add.text(10, 30, '', { font: '16px Courier', fill: '#00ff00' });
        this.textVidas = this.add.text(585, 10, 'Health: 3', { font: '24px Courier', fill: '#00ff00' });
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
        if (this.teclado.space.isDown) {
            if (!this.atirando) {
                this.atirando = true;
                this.tiros.fireBullet(this.nave.x, this.nave.y, this.nave.rotation);
            }            
        }
        else {
            this.atirando = false;
        }

        this.physics.world.wrap(this.nave, 32); // TODO pra que serve?

        // atualiza textos
        this.textRotacao.setText('Rotation: ' + this.nave.rotation);
        this.textAngulo.setText('Angle: ' + this.nave.angle);
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
