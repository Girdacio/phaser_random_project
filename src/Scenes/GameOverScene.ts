import { CONFIG } from "../Config";

export default class GameOverScene extends Phaser.Scene {

    titleScreenImage: Phaser.GameObjects.Sprite;
    game: Phaser.Game;
    music: Phaser.Sound.BaseSound;
    restartButton: Phaser.GameObjects.Sprite;


    constructor() {
        super(CONFIG.cenas.gameOver);
    }

    preload() {
        this.load.image('gameOverImage', 'assets/img/gameOverScene.jpg');
        this.load.image('restart', 'assets/img/btn_reiniciar.png');
        this.load.audio('gameOverSound', 'assets/audio/gameOver.wav');
    }
    create() {
        this.titleScreenImage = this.add.sprite(400, 300, 'gameOverImage');
        this.music = this.sound.add('gameOverSound');
        this.music.play();
        this.restartButton = this.add.sprite(400, 500, 'restart').setInteractive();
        this.restartButton.once('pointerdown', function () {
            this.music.stop();
            this.scene.start(CONFIG.cenas.principal); //Inicia o jogo novamente
        }, this);
    }
    
}