import { Spaceship } from "../GameObjects/Spaceship";
import { Vidas } from "../GameObjects/Vidas";
import { Asteroids } from "../GameObjects/Asteroids";
import { CONFIG } from "../Config";

export default class CenaPrincipal extends Phaser.Scene {
    private nave: Spaceship;
    private teclado: Phaser.Types.Input.Keyboard.CursorKeys;
    private textRotacao: Phaser.GameObjects.Text;
    private textAngulo: Phaser.GameObjects.Text;
    private textVidas: Phaser.GameObjects.Text;
    private textPontos: Phaser.GameObjects.Text;
    private textTiros: Phaser.GameObjects.Text;
    private healthGroup: Vidas;
    private health;
    private qtdeTiros;
    private pontos;
    private music: Phaser.Sound.BaseSound;
    private explosionSound: Phaser.Sound.BaseSound;
    private tiroSound: Phaser.Sound.BaseSound;
    private meteoroDestroySound: Phaser.Sound.BaseSound;
    private collectVidaSound: Phaser.Sound.BaseSound;
    private hitObstacleSound: Phaser.Sound.BaseSound;
    private background: Phaser.GameObjects.TileSprite;


    constructor() {
        super(CONFIG.cenas.principal);
    }

    preload() {
        this.load.image('background', 'assets/img/deep-space.jpg');
        this.load.image('ship', 'assets/img/ship.png');
        this.load.image('bullet', 'assets/img/bullet77.png');
        this.load.image('box', 'assets/img/crate.png');
        this.load.image('health', 'assets/img/mushroom16x16.png');
        this.load.image('asteroid', 'assets/img/asteroid1.png');
        this.load.image('asteroid2', 'assets/img/asteroid2.png');

        this.load.spritesheet('boom', 'assets/img/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });

        this.load.audio('thema', ['assets/audio/TitleSong.mp3', 'assets/audio/TitleSong.ogg', 'assets/audio/TitleSong.wav']);
        this.load.audio('explosion', 'assets/audio/explosion.mp3');
        this.load.audio('tiroSound', 'assets/audio/blaster.mp3');
        this.load.audio('meteoroDestroySound', 'assets/audio/alien_death1.wav');
        this.load.audio('collectVidaSound', 'assets/audio/key.wav');
        this.load.audio('hitObstacleSound', ['assets/audio/squit.mp3', 'assets/audio/squit.ogg']);
    }

    create() {

        this.health = 3;
        this.pontos = 0;
        this.qtdeTiros = 1;

        // fundo
        this.background = this.add.tileSprite(400, 300, 512, 512, 'background');

        // nave
        this.nave = new Spaceship(this, 400, 300);
        let explosionConfig = {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 23, first: 23 }),
            frameRate: 50,
            repeat: 0
        };
        this.anims.create(explosionConfig)

        // retangulos de controle
        let bounds = new Phaser.Geom.Rectangle(300, 200, 300, 300);
        let container = new Phaser.Geom.Rectangle(150, 50, 500, 500);

        // vida
        this.healthGroup = new Vidas(this, container, bounds);

        // inimigos - asteróides
        let asteroids = new Asteroids(this, container);

        // audio
        this.music = this.sound.add('thema');
        this.music.play('', { loop: true });

        this.explosionSound = this.sound.add('explosion');
        this.tiroSound = this.sound.add('tiroSound');
        this.meteoroDestroySound = this.sound.add('meteoroDestroySound');
        this.collectVidaSound = this.sound.add('collectVidaSound');
        this.hitObstacleSound = this.sound.add('hitObstacleSound');

        // colisoes
        Phaser.Actions.RandomRectangle(asteroids.getChildren(), container);
        this.physics.add.collider(asteroids, asteroids);

        this.physics.add.overlap(this.nave, this.healthGroup, this.coletarVida, null, this);
        this.physics.add.overlap(this.nave.getTiros, asteroids, this.asteroid_destroy, null, this);
        this.physics.add.overlap(this.nave, asteroids, this.damage, null, this);

        // input - teclado
        this.teclado = this.input.keyboard.createCursorKeys();

        // textos
        this.createTexts();
        localStorage.setItem("pontuacao", this.pontos);
    }

    private createTexts() {
        this.textRotacao = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
        this.textAngulo = this.add.text(10, 30, '', { font: '16px Courier', fill: '#00ff00' });
        this.textVidas = this.add.text(585, 10, 'Health: ' + this.health, { font: '16px Courier', fill: '#00ff00' });
        this.textPontos = this.add.text(585, 22, 'Pontução: ' + this.pontos, { font: '16px Courier', fill: '#00ff00' });
        this.textTiros = this.add.text(585, 34, 'Tiros:' + this.qtdeTiros);
    }

    update() {
        // mover fundo
        this.background.tilePositionY += 0.2;

        // nave - movimento
        this.tratarMovimentoNave();

        // atualiza textos
        this.updateTexts();
        if (this.health === 0)
            return;
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
            let atirou = this.nave.atirar();
            if (atirou) {
                this.tiroSound.play();
            }
        }
        else {
            this.nave.pararDeAtirar();
        }
    }

    private updateTexts() {
        this.textRotacao.setText('Rotation: ' + this.nave.rotation);
        this.textAngulo.setText('Angle: ' + this.nave.angle);
        if (this.health === 0) {
            this.textVidas.setText('Health: ' + this.health);
        } else
            this.textVidas.setText('Health: ' + this.health);

        this.textPontos.setText('Pontuação: ' + this.pontos);
        this.textTiros.setText('Tiros:' + (this.qtdeTiros - this.nave.getTiros.getTotalUsed()));        
    }

    private coletarVida(player, vida) {
        vida.destroy();
        this.health++;
        this.collectVidaSound.play();
    }

    private damage(nave, asteroid) {
        // O valor é 1 pq conta com mais 1 dano e vai diminuir a 0 a Vida
        if (this.health != 1) {
            asteroid.destroy();
            this.health--;
            this.explosionSound.play();
            this.playEfeitoExplosao();
        } else {
            this.physics.pause();
            this.nave.setVisible(false);
            this.music.stop();
            this.scene.start(CONFIG.cenas.gameOver,{pontuacao: this.pontos});
        }

    }

    private playEfeitoExplosao() {
        let naveMorta = this.add.sprite(this.nave.x, this.nave.y, 'ship');
        naveMorta.anims.play('explode');
        setTimeout(() => naveMorta.destroy(), 1000);
    }

    private asteroid_destroy(tiro, asteroid) {
        asteroid.destroy();
        tiro.destroy();
        this.pontos += asteroid.pontos;
        this.meteoroDestroySound.play();
    }

}