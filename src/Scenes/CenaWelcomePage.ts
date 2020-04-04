import { GameObjects } from "phaser";
import { CONFIG } from "../Config";

export default class CenaWelcomePage extends Phaser.Scene {

    titleScreenImage: Phaser.GameObjects.Sprite;
    game: Phaser.Game;
    music: Phaser.Sound.BaseSound;
    btnPermitirSom: Phaser.GameObjects.Sprite;
    btnIniciar: Phaser.GameObjects.Sprite;

    constructor() {
        super(CONFIG.cenas.welcome);
    }

    preload() {
        this.load.image('welcome', 'assets/img/welcome.png');
        this.load.image('iniciar', 'assets/img/btn_iniciar.png');
        this.load.image('permissao', 'assets/img/btn_permitir_audio.png');
        this.load.audio('welcomeAudio', 'assets/audio/oedipus_ark_pandora.mp3');
    }

    create() {        
        this.titleScreenImage = this.add.sprite(400, 300, 'welcome');

        this.btnIniciar = this.add.sprite(400, 300, 'iniciar').setInteractive();
        this.btnIniciar.once('pointerdown', function () {
            this.music.stop();  // stop na música dessa cena
            this.scene.start(CONFIG.cenas.principal); // chamar próxima cena
        }, this);
        
        this.btnPermitirSom = this.add.sprite(400, 300, 'permissao').setInteractive();
        this.btnPermitirSom.once('pointerdown', function () {
            this.destroy(); // esconder botão de permissão
        });      
        
        this.music = this.sound.add('welcomeAudio');          
    }

    update() {
        // se já foi habilitado e o som não está tocando, colocar pra tocar!
        if (!this.btnPermitirSom.active && !this.music.isPlaying) {
            this.music.play();
        }
    }

}