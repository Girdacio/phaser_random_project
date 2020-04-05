import { Bullet } from "./Bullet";
import { CONFIG } from "../Config";

export class Bullets extends Phaser.Physics.Arcade.Group
{
    private MAX_TIROS = CONFIG.tiros.qtdeMax;

    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: this.MAX_TIROS,
            key: 'bullet',
            active: false,
            visible: false,       
            classType: Bullet
        });        
    }

    fireBullet (x, y, rotation): boolean
    {
        let criarNovoTiro = this.getLength() < this.MAX_TIROS;
        let bullet = this.getFirstDead(criarNovoTiro);

        if (bullet) {
            bullet.fire(x, y, rotation);
            return true;
        }

        return false;
    }
}