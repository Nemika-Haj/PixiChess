import { Application, Container, Sprite, Text, TextStyle } from "pixi.js";
import { OBJECT_NAMES } from "../enums";
import { Pawn } from "./Pawn";

const containerDimensions = { x: 420, y: 100 };
const borderMargin = 25;

export class DeathContainer extends Container {
    private whitePawns: number = 0;
    private blackPawns: number = 0;

    constructor(app: Application) {
        super()
        this.name = OBJECT_NAMES.DEATH_CONTAINER;
        this.x = app.view.width - containerDimensions.x - borderMargin;

        const textStyle: TextStyle = new TextStyle({
            fontFamily: 'Arial',
            fontWeight: "bold",
            fill: '#000',
            stroke: '#000',
            strokeThickness: .5
        });

        const blackCollector: Text = new Text("Collected White Pawns", textStyle);
        blackCollector.position.set(100, 25);

        const whiteCollector: Text = new Text("Collected Black Pawns", textStyle);
        whiteCollector.position.set(100, 525);

        this.addChild(blackCollector);
        this.addChild(whiteCollector);
    }

    public add(pawn: Pawn, bottom?: boolean) {
        const newDeadSprite: Sprite = Pawn.fromTexture(pawn.texture);

        let x = 100 + (40 * ((!bottom ? this.whitePawns : this.blackPawns) % 7) );
        let y = (!bottom ? 100 : 600);
        
        const topMarginMultiplier = Math.floor((!bottom ? this.whitePawns : this.blackPawns) / 7 );

        y += 70 * topMarginMultiplier;

        newDeadSprite.position.set(x, y);

        !bottom ? this.whitePawns++ : this.blackPawns++;

        this.addChild(newDeadSprite);
    }

}