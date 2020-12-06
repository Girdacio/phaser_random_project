import { Spaceship } from "../GameObjects/Spaceship";
import { Vidas } from "../GameObjects/Vidas";
import { Asteroids } from "../GameObjects/Asteroids";
import { CONFIG } from "../Config";
import { Fuel } from "../GameObjects/Fuel";

export default class CenaPrincipal extends Phaser.Scene{
    private container: Phaser.Geom.Rectangle;
    private bounds: Phaser.Geom.Rectangle;
    private nave: Spaceship;
    private teclado: Phaser.Types.Input.Keyboard.CursorKeys;
    private textFuel: Phaser.GameObjects.Text;
    private textVidas: Phaser.GameObjects.Text;
    private textPontos: Phaser.GameObjects.Text;
    private healthGroup: Vidas;
    private health;
    private qtdeTiros;
    private currentFuel;
    private timeFuelReduce;
    private maxFuel;
    private reduceFuel;
    private pontos;
    private barFuel;
    private fuelCount;
    private groupFuel: Fuel;
    private music: Phaser.Sound.BaseSound;
    private explosionSound: Phaser.Sound.BaseSound;
    private tiroSound: Phaser.Sound.BaseSound;
    private meteoroDestroySound: Phaser.Sound.BaseSound;
    private collectVidaSound: Phaser.Sound.BaseSound;
    private hitObstacleSound: Phaser.Sound.BaseSound;
    private background: Phaser.GameObjects.TileSprite;
    private asteroids;
    private totalAsteroids = 6;
    private QTDE_MIN_ASTEROIDS = 4;

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
        this.load.image('fuel', 'assets/img/fuel.png');

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
        this.maxFuel = 10;
        this.currentFuel = 10;
        this.fuelCount = 0;
        this.timeFuelReduce = 3000;


        // retangulos de controle
        this.bounds = new Phaser.Geom.Rectangle(300, 200, 300, 300);
        this.container = new Phaser.Geom.Rectangle(150, 50, 500, 500);

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


        // inimigos - asteróides
        this.asteroids = new Asteroids(this, this.totalAsteroids);

        // audio
        this.music = this.sound.add('thema');
        this.music.play('', { loop: true });

        this.explosionSound = this.sound.add('explosion');
        this.tiroSound = this.sound.add('tiroSound');
        this.meteoroDestroySound = this.sound.add('meteoroDestroySound');
        this.collectVidaSound = this.sound.add('collectVidaSound');
        this.hitObstacleSound = this.sound.add('hitObstacleSound');

        // colisoes
        this.updateColisions();
        // input - teclado
        this.teclado = this.input.keyboard.createCursorKeys();

        // reduzir combustivel
        this.reduceFuel = this.time.addEvent({ delay: this.timeFuelReduce, callback: this.funReduceFuel, callbackScope: this, loop: true });

        // textos
        this.createTexts();
        localStorage.setItem("pontuacao", this.pontos);

        // faz o meteoro desaparecer de um lado e aparecer no outro
        this.physics.world.wrap(this.asteroids, 72);        
    }

    private createTexts() {
        this.textVidas = this.add.text(585, 10, 'Health: ' + this.health, { font: '16px Courier', fill: '#00ff00' });
        this.textPontos = this.add.text(585, 22, 'Pontução: ' + this.pontos, { font: '16px Courier', fill: '#00ff00' });
        this.textFuel = this.add.text(140, 20, this.updateBarFuel(), { font: '20px Courier', fill: '#00ffff' });
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

        // monitora a gasosa
        this.isFuelEmpty();

        // faz o asteroid sumir em uma direcao e aparecer na direcao oposta
        //this.physics.world.wrap(this.asteroids, -1);

        if (this.deveCriarMaisAsteroids()) this.criarMaisAsteroids();
    }

    private tratarMovimentoNave() {
        if (this.currentFuel === 0) {
            return;
        } else if (this.teclado.up.isDown) {
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
        this.textVidas.setText('Health: ' + this.health);
        this.textPontos.setText('Pontuação: ' + this.pontos);
        this.textFuel.setText(this.updateBarFuel());
    }

    private coletarVida(player, vida) {
        vida.destroy();
        this.health++;
        this.collectVidaSound.play();
    }

    private damage(nave, asteroid) {
        this.totalAsteroids--;
        // O valor é 1 pq conta com mais 1 dano e vai diminuir a 0 a Vida
        if (this.health != 1) {
            setTimeout(() => {
                this.healthGroup = new Vidas(this, this.container, this.bounds, 1);
                this.updateColisions();
            }, 6000);
            this.health--;
            asteroid.destroy();
            this.explosionSound.play();
            this.playEfeitoExplosao();
        } else {
            this.health--;
            asteroid.destroy();
            this.physics.pause();
            this.explosionSound.play();
            this.playEfeitoExplosao();
            this.nave.setVisible(false);
            setTimeout(() => {
                this.music.stop();
                this.scene.start(CONFIG.cenas.gameOver, { pontuacao: this.pontos, deadBy: 'Você ficou sem vidas!' });
            }, 1000);
        }       
    }

    private criarMaisAsteroids() {
        this.asteroids = new Asteroids(this, 1);
        this.totalAsteroids += 1;
        this.updateColisions();
    }

    private playEfeitoExplosao() {
        let naveMorta = this.add.sprite(this.nave.x, this.nave.y, 'ship');
        naveMorta.anims.play('explode');
        setTimeout(() => naveMorta.destroy(), 1000);
    }

    private asteroid_destroy(tiro, asteroid) {
        this.totalAsteroids--;
        asteroid.destroy();
        tiro.destroy();
        this.pontos += asteroid.pontos;
        this.meteoroDestroySound.play();        
    }

    private updateBarFuel() {
        this.barFuel = 'Fuel: ';
        for (let i = 0; i < this.currentFuel; i++) {
            this.barFuel += '|'
        }
        return this.barFuel;
    }

    private funReduceFuel() {
        this.currentFuel -= 0.25;
        if (this.currentFuel === 0) this.physics.pause();
    }

    private colectFuel(nave, combustivel) {
        this.fuelCount--;
        this.currentFuel = this.maxFuel
        combustivel.destroy();
        this.collectVidaSound.play();
    }

    private isFuelEmpty() {
        if (this.currentFuel === 0) {
            this.playEfeitoExplosao();
            this.nave.setVisible(false);
            setTimeout(() => {
                this.music.stop();
                this.scene.start(CONFIG.cenas.gameOver, { pontuacao: this.pontos, deadBy: 'Acabou o combustível!' });
            }, 1000);
        }
        if (this.currentFuel == 4 && this.fuelCount == 0) {
            this.groupFuel = new Fuel(this, this.container, this.bounds, 1);
            this.updateColisions();
            this.fuelCount++;
        }
    }

    private updateColisions() {
        this.physics.add.collider(this.asteroids, this.asteroids);
        this.physics.add.overlap(this.nave, this.healthGroup, this.coletarVida, null, this);
        this.physics.add.overlap(this.nave, this.groupFuel, this.colectFuel, null, this);
        this.physics.add.overlap(this.nave.getTiros, this.asteroids, this.asteroid_destroy, null, this);
        this.physics.add.overlap(this.nave, this.asteroids, this.damage, null, this);
    }

    private deveCriarMaisAsteroids() {
        return this.totalAsteroids <= this.QTDE_MIN_ASTEROIDS;
    }
}