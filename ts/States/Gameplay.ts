import 'phaser-ce';

import BuildingVisualizer from '../GameObjects/Environment/Paralax/BuildingVisualizer';
import UI from '../GameObjects/Interactable/Paralax/UI/UI';
import Player from '../GameObjects/Interactable/Perspective/Player';
import SoundManager from '../Systems/Sound/SoundManager';
import Sounds from '../Data/Sounds';

// import PickupSpawner from '../Systems/PickupSpawner';
import SpawnEditor from '../Systems/SpawnEditor';
import Road from '../Rendering/Road';
import PerspectiveRenderer from '../Rendering/PerspectiveRenderer';
import Pickup from '../GameObjects/Interactable/Perspective/Pickup';
import Constants from '../Data/Constants';

export default class Gameplay extends Phaser.State
{
    public static Name: string = 'gameplay';

    public name: string = Gameplay.Name;

    private _worldMood: number;

    private _audioVisualizer: BuildingVisualizer;

    private _userInterface: UI;
    private _player: Player;

    // private _pickupSpawner: PickupSpawner;

    private _perspectiveRenderer: PerspectiveRenderer;
    private _road: Road;
    private _glowFilter: Phaser.Filter;

    private _gamePaused: boolean = false;
    private spawnEditor: SpawnEditor;

    constructor()
    {
        super();
    }

    public init(): void
    {
        SoundManager.getInstance(this.game);
    }

    public create(): void
    {
        super.create(this.game);

        this.spawnEditor = new SpawnEditor();
        this.spawnEditor = this.spawnEditor;
        //remove below comment to start recording the spawn editor.
        //this.spawnEditor.startRecording();

        this._worldMood = this._worldMood;

        SoundManager.getInstance().playMusic(Sounds.headUp);

        this._glowFilter = new Phaser.Filter(this.game, null, Constants.glowFilter);

        this._road = new Road(this.game);
        this.game.add.existing(this._road);
        this._road.filters = [this._glowFilter];

        this._audioVisualizer = new BuildingVisualizer(this.game, this.game.width, this.game.height * .2);
        this.game.add.existing(this._audioVisualizer);

        this._perspectiveRenderer = new PerspectiveRenderer(this.game, new Phaser.Point(.5, .5));

        this._userInterface = new UI(this.game);
        this.game.add.existing(this._userInterface);

        this._player = new Player(this.game, this._perspectiveRenderer);
        this.game.add.existing(this._player);

        setInterval(() => {
            this._player.lane ++;
        }, 2000);

        // this._pickupSpawner = new PickupSpawner(this.game, this._perspectiveRenderer);

        new Pickup(this.game, this._perspectiveRenderer, .2, .2);
        new Pickup(this.game, this._perspectiveRenderer, -.2, -.2);

        this._userInterface.onPause.add(this.pause, this);

        this.resize();
    }

    public update(): void
    {

        if (!this._gamePaused)
        {
            this._audioVisualizer.render();
            this._road.render(this._perspectiveRenderer.horizonPoint);
            this._perspectiveRenderer.render();
        }
    }

    public resize(): void
    {
        this._audioVisualizer.resize();
        this._road.render(this._perspectiveRenderer.horizonPoint);
    }

    public pause(): void
    {
        this._gamePaused = !this._gamePaused;
    }

    public shutdown(): void
    {
        super.shutdown(this.game);

        this._audioVisualizer.destroy();
        this._audioVisualizer = null;
    }
}
