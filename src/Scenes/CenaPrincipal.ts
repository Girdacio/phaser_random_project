import { Spaceship } from "../GameObjects/Spaceship";
import { Caixas } from "../GameObjects/Caixas";
import { Vidas } from "../GameObjects/Vidas";
import { Asteroids } from "../GameObjects/Asteroids";

export default class CenaPrincipal extends Phaser.Scene {
    private nave: Spaceship;
    private teclado: Phaser.Types.Input.Keyboard.CursorKeys;
    private textRotacao: Phaser.GameObjects.Text;
    private textAngulo: Phaser.GameObjects.Text;
    private textVidas: Phaser.GameObjects.Text;
    private textPontos: Phaser.GameObjects.Text;
    private box_group: Caixas;
    private healthGroup: Vidas;
    private health = 3;
    private pontos = 0;

    constructor() {
        super('principal');
    }

    preload() {
        this.load.image('background', 'assets/img/deep-space.jpg');
        this.load.image('ship', 'assets/img/ship.png');
        this.load.image('bullet', 'assets/img/bullet77.png');
        this.load.image('box', 'assets/img/crate.png');
        this.load.image('health', 'assets/img/mushroom16x16.png');
        this.load.image('asteroid', 'assets/img/asteroid1.png');
        this.load.image('asteroid2', 'assets/img/asteroid2.png');
    }

    create() {
        // fundo
        this.add.image(400, 300, 'background');

        // nave
        this.nave = new Spaceship(this, 400, 300);

        // retangulos de controle
        let bounds = new Phaser.Geom.Rectangle(300, 200, 300, 300);
        let container = new Phaser.Geom.Rectangle(150, 50, 500, 500);

        // vida
        this.healthGroup = new Vidas(this, container, bounds);

        // obstáculos - caixas       
        this.box_group = new Caixas(this, container, bounds);

        // inimigos - asteróides
        let asteroids = new Asteroids(this, container);




        // colisoes
        Phaser.Actions.RandomRectangle(asteroids.getChildren(), container);
        this.physics.add.collider(asteroids, [this.box_group, asteroids]);
        this.physics.add.collider(this.nave, this.box_group);
        this.physics.add.collider(this.nave.getTiros, this.box_group);

        this.physics.add.overlap(this.nave, this.healthGroup, this.coletarVida, null, this);
        this.physics.add.overlap(this.nave.getTiros, asteroids, this.asteroid_destroy, null, this);
        this.physics.add.overlap(this.nave, asteroids, this.damage, null, this);
        // input - teclado
        this.teclado = this.input.keyboard.createCursorKeys();

        // textos
        this.createTexts();
    }

    private createTexts() {
        this.textRotacao = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
        this.textAngulo = this.add.text(10, 30, '', { font: '16px Courier', fill: '#00ff00' });
        this.textVidas = this.add.text(585, 10, 'Health: ' + this.health, { font: '16px Courier', fill: '#00ff00' });
        this.textPontos = this.add.text(585, 22, 'Pontução: ' + this.pontos, { font: '16px Courier', fill: '#00ff00' });
    }

    update() {
        // nave - movimento
        this.tratarMovimentoNave();

        // atualiza textos
        this.updateTexts();
    }

    private tratarMovimentoNave() {
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
    }

    private updateTexts() {
        this.textRotacao.setText('Rotation: ' + this.nave.rotation);
        this.textAngulo.setText('Angle: ' + this.nave.angle);
        this.textVidas.setText('Health: ' + this.health);
        this.textPontos.setText('Pontuação: ' + this.pontos);
    }

    private coletarVida(player, vida) {
        vida.destroy();
        this.health++;
    }
    private damage(nave, asteroid) {
        asteroid.destroy();
        // Fazer nave ficar vermelha
        // nave.destroy() Nao funcionou , ao ser atingida o jogo trava
        this.health--;
    }

    private asteroid_destroy(tiro, asteroid) {
        asteroid.destroy();
        tiro.destroy();
        this.pontos += asteroid.pontos;
    }


}