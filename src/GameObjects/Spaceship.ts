export class Spaceship extends Phaser.Physics.Arcade.Image
{
    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'ship');

        scene.add.existing(this);
        scene.physics.add.existing(this); // Adds an Arcade Physics Body to the given Game Object

        this.setCollideWorldBounds(true);
        this.body.world.setBounds(150, 50, 500, 500); // TODO ajustar para pegar o retangulo no background!       
        this.setDamping(true);
        this.setDrag(0.99);
        this.setMaxVelocity(200);
    }

    acelerarParaBaixo() 
    {
        this.acelerar(-200);
    }

    acelerarParaCima() 
    {
        this.acelerar(200);
    }

    desacelerar() 
    {
        this.setAcceleration(0);
    }

    pararDeVirar() 
    {
        this.setAngularVelocity(0);
    }

    virarParaDireita() 
    {
        this.setAngularVelocity(300);
    }

    virarParaEsquerda() 
    {
        this.setAngularVelocity(-300);
    }    

    private acelerar(velocidade: number)
    {
        this.scene.physics.velocityFromRotation(this.rotation, velocidade, this.body.velocity);
    }
}