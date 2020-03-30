export class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'bullet');
    }

    fire (x, y, rotation)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);
        this.rotation = rotation;
        this.scene.physics.velocityFromRotation(rotation, 400, this.body.velocity);        

        //this.lifespan = 2000;
        setTimeout(() => {
            this.setActive(false);
            this.setVisible(false);
        }, 2000);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
    }
}