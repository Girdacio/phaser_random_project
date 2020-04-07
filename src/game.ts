import 'phaser';
import CenaPrincipal from './Scenes/CenaPrincipal';
import CenaWelcomePage from './Scenes/CenaWelcomePage';
import GameOverScene from './Scenes/GameOverScene';

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
    scene: [CenaWelcomePage, CenaPrincipal, GameOverScene]
};

const game = new Phaser.Game(config);
