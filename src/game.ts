import 'phaser';
import { Bullets } from './GameObjects/Bullets';
import { Spaceship } from './GameObjects/Spaceship';
import { Asteroids } from './GameObjects/Asteroids';

export default class Demo extends Phaser.Scene
{
    private nave: Spaceship;
    private teclado: Phaser.Types.Input.Keyboard.CursorKeys;
    private atirando: boolean = false;
    private textRotacao: Phaser.GameObjects.Text;
    private textAngulo: Phaser.GameObjects.Text;
    private textVidas: Phaser.GameObjects.Text;
    private box_group;
    private healthGroup;
    private health = 3;

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
        this.load.image('health','assets/img/mushroom16x16.png');
        this.load.image('asteroid','assets/img/asteroid1.png');
    }

    create ()
    {
        // fundo
        this.add.image(400,300,'background');

        // nave
        this.nave = new Spaceship(this, 400, 300);

        let bounds = new Phaser.Geom.Rectangle(300, 200, 300, 300);
        let container = new Phaser.Geom.Rectangle(150, 50, 500, 500);
        let boxes_container = new Phaser.Geom.Rectangle(170, 70, 460, 460);

        // vida
        this.healthGroup = this.physics.add.group({ immovable: true });

        for (let i = 0; i < 3; i++) {
            // Este laco cria e posiciona as vidas de forma aleatoria
            let life_pos = Phaser.Geom.Rectangle.RandomOutside(container, bounds); // TODO ajustar rectangles pq ainda está sobrepondo
            this.healthGroup.create(life_pos.x, life_pos.y, 'health');
        }        

        // obstáculos - caixas       
        this.box_group = this.physics.add.group({ immovable: true });

        for (let i = 0; i < 3; i++) {
            // Este laco cria e posiciona as caixas de forma aleatoria
            let box_pos = Phaser.Geom.Rectangle.RandomOutside(boxes_container, bounds); // TODO ajustar rectangles pq ainda está sobrepondo
            this.box_group.create(box_pos.x, box_pos.y, 'box');
        }

        // inimigos - asteróides
        let asteroids = new Asteroids(this, container);

        // Funcao que posiciona os asteroids de forma aleatoria dentro do container
        Phaser.Actions.RandomRectangle(asteroids.getChildren(), container);
        this.physics.add.collider(asteroids, [this.box_group, asteroids]);
        this.physics.add.collider(this.nave, [asteroids, this.box_group]);
        this.physics.add.collider(this.nave.getTiros, [this.box_group, asteroids, container]);

        this.physics.add.overlap(this.nave, this.healthGroup, this.coletarVida, null, this);

        // input - teclado
        this.teclado = this.input.keyboard.createCursorKeys();

        // textos
        this.textRotacao = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });    
        this.textAngulo = this.add.text(10, 30, '', { font: '16px Courier', fill: '#00ff00' });
        this.textVidas = this.add.text(585, 10, 'Health: ' + this.health, { font: '24px Courier', fill: '#00ff00' });
    }

    update ()
    {        
        // nave - movimento
        if (this.teclado.up.isDown) {            
            this.nave.acelerarParaCima();
        }
        else if (this.teclado.down.isDown) {            
            this.nave.acelerarParaBaixo();
        }
        else {
            this.nave.desacelerar();            
        }

        if (this.teclado.left.isDown) {            
            this.nave.virarParaEsquerda();
        }
        else if (this.teclado.right.isDown) {            
            this.nave.virarParaDireita();
        }
        else {            
            this.nave.pararDeVirar();
        }

        // nave - movimento tiro
        if (this.teclado.space.isDown) {
            this.nave.atirar();
        }
        else {
            this.nave.pararDeAtirar();           
        }        

        this.physics.world.wrap(this.nave, 32); // TODO pra que serve?

        // atualiza textos
        this.textRotacao.setText('Rotation: ' + this.nave.rotation);
        this.textAngulo.setText('Angle: ' + this.nave.angle);
        this.textVidas.setText('Health: ' + this.health);
    }

    coletarVida(player, vida)
    {
        vida.disableBody(true, true);
        this.health++;
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
