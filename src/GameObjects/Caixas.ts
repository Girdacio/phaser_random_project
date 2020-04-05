export class Caixas extends Phaser.Physics.Arcade.StaticGroup {
    
    constructor(scene: Phaser.Scene, boxes_container: Phaser.Geom.Rectangle, bounds: Phaser.Geom.Rectangle) {

        super(scene.physics.world, scene);

        this.createMultiple({
            key: 'box',
            frameQuantity: 3,
            classType: Phaser.Physics.Arcade.Image
        });

        this.getChildren().forEach((caixa: Phaser.Physics.Arcade.Image) => {
            let posicao;
            // loop para gerar a posição de cada caixa até que ela não intersecta com as outras
            do {
                posicao = Phaser.Geom.Rectangle.RandomOutside(boxes_container, bounds);
                caixa.body.reset(posicao.x, posicao.y);
            } while (this.conflito(posicao, caixa));
        });
    }

    conflito(posicao: Phaser.Geom.Rectangle, caixaTeste) {

        let caixaAtual;
        let intersects;

        for(let i = 0; i < this.getLength() - 1; i++) {

            caixaAtual = this.getChildren()[i];

            if (caixaAtual == caixaTeste) {
                continue;
            }

            let bodyCaixaAtual: any = caixaAtual.body;
            let boundsCaixaAtual = new Phaser.Geom.Rectangle(bodyCaixaAtual.x, bodyCaixaAtual.y, bodyCaixaAtual.width, bodyCaixaAtual.height);

            intersects = Phaser.Geom.Intersects.RectangleToRectangle(boundsCaixaAtual, posicao);            

            if (intersects) {
                console.info('ajustando posição das caixas!');
                return true;
            }
        }

        return false;
    }
}