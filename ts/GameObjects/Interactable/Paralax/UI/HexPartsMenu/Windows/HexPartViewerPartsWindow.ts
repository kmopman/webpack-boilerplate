import Window from './HexPartsViewerWindow';
import {IHexBodyPart, IHexPart} from '../HexPartsData';
import Atlases from '../../../../../../Data/Atlases';

export default class PartsWindow extends Window
{
    private _centerImage: Phaser.Sprite;
    private _breathingTween: Phaser.Tween;

    private _mask: Phaser.Graphics;

    private _subPickup1: Phaser.Sprite;
    private _subPickup2: Phaser.Sprite;
    private _subPickup3: Phaser.Sprite;

    constructor(game: Phaser.Game)
    {
        super(game, 'a part', 'Hex_Collecting_UI_Screen');

        this._centerImage = new Phaser.Sprite(game, 0, 0, Atlases.Interface, '');
        this._centerImage.anchor.set(.5);
        this.addChild(this._centerImage);

        this._centerImage.y = this.game.height * -.005;

        this._breathingTween = this.game.add.tween(this._centerImage)
            .to({y: this.game.height * .005}, 1800, Phaser.Easing.Cubic.InOut, true, 0, Infinity, true)
            .start();

        this._mask = new Phaser.Graphics(this.game);
        this.addChild(this._mask);

        this._subPickup1 = new Phaser.Sprite(game, 0, 0, Atlases.Interface, '');
        this._subPickup1.anchor.set(.5);
        this._subPickup1.mask = this._mask;
        this.addChild(this._subPickup1);

        this._subPickup2 = new Phaser.Sprite(game, 0, 0, Atlases.Interface, '');
        this._subPickup2.anchor.set(.5);
        this._subPickup2.mask = this._mask;
        this.addChild(this._subPickup2);

        this._subPickup3 = new Phaser.Sprite(game, 0, 0, Atlases.Interface, '');
        this._subPickup3.anchor.set(.5);
        this._subPickup3.mask = this._mask;
        this.addChild(this._subPickup3);

        this.visible = false;
    }

    public animateScale(targetScale: number, duration: number): Phaser.Tween
    {
        this.visible = true;

        let superTween: Phaser.Tween = super.animateScale(targetScale, duration);

        this.tweens.push(
            this.game.add.tween(this._centerImage.scale)
                .to({x: targetScale, y: targetScale}, duration, Phaser.Easing.Cubic.Out)
                .start()
        );

        let targetY: number = targetScale > 0 ? this.height * .38 : this.height * .6;

        this.tweens.push(

            this.game.add.tween(this._subPickup1)
                .to({y: targetY}, duration, Phaser.Easing.Cubic.Out)
                .start(),

            this.game.add.tween(this._subPickup2)
                .to({y: targetY}, duration, Phaser.Easing.Cubic.Out)
                .start(),

            this.game.add.tween(this._subPickup3)
                .to({y: targetY}, duration, Phaser.Easing.Cubic.Out)
                .start()

        );

        return superTween;
    }

    public showPart(data: IHexBodyPart): void
    {
        this._subPickup1.visible = false;
        this._subPickup2.visible = false;
        this._subPickup3.visible = false;

        let allSubPartsAreCollected: boolean = true;

        Object.keys(data.subParts).forEach( (key: any, index: number) => {

            let currentPart: IHexPart = data.subParts[key];
            let newFrameName: string = currentPart.frameName + (currentPart.collected ? '' :  '_silhouette');

            if (currentPart.collected === false) { allSubPartsAreCollected = false; }

            switch (index)
            {
                case 0:
                    this._subPickup1.frameName = newFrameName;
                    this._subPickup1.visible = true;
                    break;

                case 1:
                    this._subPickup2.frameName = newFrameName;
                    this._subPickup2.visible = true;
                    break;

                case 2:
                    this._subPickup3.frameName = newFrameName;
                    this._subPickup3.visible = true;
                    break;

                default:
                    break;
            }

        });

        this.contentName.text = data.name;
        this._centerImage.frameName = data.frameName + (allSubPartsAreCollected ? '' : '_silhouette');

    }

    public resize(): void
    {
        super.resize();

        this._mask.beginFill(0xff0ff0);
        this._mask.drawRect(0, 0, this.width, this.height * .98);
        this._mask.endFill();

        this._mask.x = this.width * -.5;
        this._mask.y = this.height * -.5;

        this._centerImage.scale.set(0);

        this._subPickup1.x = this.width * -.3;
        this._subPickup1.y = this.game.height * .6;

        this._subPickup2.y = this.game.height * .6;

        this._subPickup3.x = this.width * .3;
        this._subPickup3.y = this.game.height * .6;

    }

    public destroy(): void
    {
        super.destroy();

        if (this._centerImage) { this._centerImage.destroy(true); }
        this._centerImage = null;

        if (this._breathingTween) { this._breathingTween.stop(true); }
        this._breathingTween = null;

        if (this._mask) { this._mask.destroy(true); }
        this._mask = null;

        if (this._subPickup1) { this._subPickup1.destroy(true); }
        this._subPickup1 = null;

        if (this._subPickup2) { this._subPickup2.destroy(true); }
        this._subPickup2 = null;

        if (this._subPickup3) { this._subPickup3.destroy(true); }
        this._subPickup3 = null;
    }
}
