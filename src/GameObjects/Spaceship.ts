import { Bullets } from "./Bullets";

export class Spaceship extends Phaser.Physics.Arcade.Image
{
    private tiros: Bullets;
    private isAtirando: boolean = false;

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'ship');

        scene.add.existing(this);
        scene.physics.add.existing(this); // Adds an Arcade Physics Body to the given Game Object

        this.setCollideWorldBounds(true);
        this.body.world.setBounds(150, 50, 500, 500);       
        this.setDamping(true);
        this.setVisible(true);
        this.setDrag(0.99);
        this.setMaxVelocity(200);

        // tiros
        this.tiros = new Bullets(this.scene);
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

    atirar() 
    {
        if (!this.isAtirando) {
            this.isAtirando = true;
            this.tiros.fireBullet(this.x, this.y, this.rotation);
        }   
    }

    pararDeAtirar() 
    {
        this.isAtirando = false;
    }

    public get getTiros(): Bullets
    {
        return this.tiros;
    }

    private acelerar(velocidade: number)
    {
        let accelerationVector: Phaser.Math.Vector2 = this.scene.physics.velocityFromRotation(this.rotation, velocidade);
        this.setAccelerationX(accelerationVector.x);
        this.setAccelerationY(accelerationVector.y);
    }
}