import 'phaser-ce';

import {Lanes} from '../Enums/Lanes';
//** Handles reading input */
export default class Input
{
    public game: Phaser.Game;

    public onInputDown: Phaser.Signal;

    /** how to use it!
     *  this.inputy = new Input(this.game);this.inputy.onInputDown.add((r: Lanes) => {console.log(r);});
     */

    constructor(game: Phaser.Game)
    {
        this.game = game;

        this.onInputDown = new Phaser.Signal();
        this.game.input.onDown.add((pointer: Phaser.Pointer) => this.inputDown(pointer));
    }

    private inputDown(pointer: Phaser.Pointer): void
    {
        this.onInputDown.dispatch(Lanes.Conversions.screenPositionToLane(this.game, pointer.clientX, pointer.clientY));
    }

    public destroy(): void
    {
        this.onInputDown.removeAll();
        this.onInputDown = null;
    }

}
