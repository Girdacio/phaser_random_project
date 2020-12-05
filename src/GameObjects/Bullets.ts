import { Bullet } from "./Bullet";
import { CONFIG } from "../Config";

export class Bullets extends Phaser.Physics.Arcade.Group
{
    private MAX_TIROS = CONFIG.tiros.qtdeMax;

    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 1,
            key: 'bullet',
            active: false,
            visible: false,       
            classType: Bullet
        });        
    }

    fireBullet (x, y, rotation): boolean
    {
        let criarNovoTiro = this.getLength() < 1;  // this.MAX_TIROS;
        let bullet = this.getFirstDead(criarNovoTiro);

        if (bullet) {
            bullet.fire(x, y, rotation);
            return true;
        }

        return false;
    }
}