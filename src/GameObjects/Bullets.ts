import { Bullet } from "./Bullet";

export class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: 'bullet',
            active: false,
            visible: false,       
            classType: Bullet
        });        
    }

    fireBullet (x, y, rotation)
    {
        let bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(x, y, rotation);
        }
    }
}