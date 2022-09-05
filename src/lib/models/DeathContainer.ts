import { Application, Container, Sprite } from "pixi.js";
import { OBJECT_NAMES } from "../enums";
import { Pawn } from "./Pawn";

const containerDimensions = { x: 420, y: 100 };
const borderMargin = 25;

export class DeathContainer extends Container {
    private whitePawns: number = 0;
    private blackPawns: number = 0;

    constructor(app: Application) {
        super()
        this.name = OBJECT_NAMES.DEATH_CONTAINER
        this.x = app.view.width - containerDimensions.x - borderMargin;
    }

    public add(pawn: Pawn, bottom?: boolean) {
        const newDeadSprite: Sprite = Pawn.fromTexture(pawn.texture)

        let x = 100 + (40 * ((!bottom ? this.whitePawns : this.blackPawns) % 7) )
        let y = (!bottom ? 50 : 400)
        
        const topMarginMultiplier = Math.floor((!bottom ? this.whitePawns : this.blackPawns) / 7 )

        y += 70 * topMarginMultiplier

        console.log(y)

        newDeadSprite.position.set(x, y)

        !bottom ? this.whitePawns++ : this.blackPawns++

        this.addChild(newDeadSprite)
    }

}