import type { ListenerFn } from "eventemitter3";
import { DisplayObject, ObservablePoint, Sprite, Texture, type IPointData } from "pixi.js";
import type { PAWN } from "../types";
import DragHandler from "../handlers/DragHandler";
import { PawnColors, PawnNames } from "../enums";

const PATH_TO_PAWNS: String = "assets/images/pawns/";
const PAWN_SIZE: number = 80;

export class Pawn extends Sprite {
    public figure: string;
    public color: string;
    public originalPosition?: IPointData;

    constructor(pawn: PAWN) {
        super(Texture.from(PATH_TO_PAWNS + pawn.color + pawn.name + ".png"));
        this.figure = pawn.name;
        this.color = pawn.color;

        Pawn.makeOptions(this)

        const dragHandler: { Start: ListenerFn, Move: ListenerFn, End: ListenerFn } = DragHandler(this);
        this
            .on('pointerdown', dragHandler.Start)
            .on('pointerup', dragHandler.End)
            .on('pointermove', dragHandler.Move);

    }

    public validateMove?(position: IPointData): boolean


    public getOffsetPosition(x: number, y: number): IPointData {
        return { x: this.originalPosition!!.x+x*100, y: this.originalPosition!!.y+y*100 }
    }

    public  getOffsetPawn(x: number, y: number): DisplayObject | undefined {
        const offsetPawn: DisplayObject | undefined = this.parent.children.find(e => e.x == this.originalPosition!!.x + x*100 && e.y == this.originalPosition!!.y + y*100);

        return offsetPawn;
    }

    static matchPositions(pos1: ObservablePoint<any> | IPointData, pos2: ObservablePoint<any> | IPointData): boolean {

        return pos1.x == pos2.x && pos1.y == pos2.y;
    }

    static makeOptions(pawn: Pawn | Sprite) {
        pawn.height = PAWN_SIZE;
        pawn.width = PAWN_SIZE;
        pawn.anchor.set(.5);
        pawn.interactive = true;
        pawn.buttonMode = true;
    }

    static fromTexture(texture: Texture): Sprite {
        const sprite = new Sprite(texture)
        Pawn.makeOptions(sprite)

        return sprite
    }

    static inBounds(position: IPointData): boolean {
        return position.x <= 800 && position.x >= 0 && position.y <= 800 && position.y >= 0
    }

}

export class DefaultPawn extends Pawn {
    private firstMove: boolean = true;

    constructor(color: PawnColors| string) {
        super({ name: PawnNames.DEFAULT, color: color });
    }

    public validateMove(position: IPointData): boolean {
        if(!Pawn.inBounds(position)) return false;

        if(!this.originalPosition) return false;

        let yOffset = this.color == PawnColors.WHITE ? -1 : 1

        const eatsLeft: DisplayObject | undefined = this.getOffsetPawn(-1, yOffset);
        const eatsRight: DisplayObject | undefined = this.getOffsetPawn(1, yOffset);

        let result = false;

        if (
            (eatsLeft && Pawn.matchPositions(eatsLeft.position, position)) ||
            (eatsRight && Pawn.matchPositions(eatsRight.position, position))
        ) result = true;

        const oneBlock = this.getOffsetPawn(0, yOffset);
        const twoBlocks = this.getOffsetPawn(0, yOffset*2);

        if (
            (!oneBlock && Pawn.matchPositions(this.getOffsetPosition(0, yOffset), position)) ||
            (this.firstMove && !twoBlocks && Pawn.matchPositions(this.getOffsetPosition(0, yOffset*2), position) && !oneBlock)
        ) result = true;

        if(result) this.firstMove = false;

        return result;
    }
}

export class RookPawn extends Pawn {

    constructor(color: PawnColors | string) {
        super({ name: PawnNames.ROOK, color: color });
    }

    public validateMove(position: IPointData): boolean {
        if(!Pawn.inBounds(position)) return false; 

        if(!this.originalPosition) return false;

        if(this.originalPosition.x != position.x && this.originalPosition.y != position.y) return false;

        if(this.originalPosition.x == position.x) {
            const yOffset = position.y > this.originalPosition.y ? 1 : -1;

            for(let i = 1; i <= Math.abs(this.originalPosition.y-position.y)/100-1; i++) {
                const encounteredPawn: DisplayObject | undefined = this.getOffsetPawn(0, yOffset*i);
                if (encounteredPawn && encounteredPawn instanceof Pawn) return false; 
            }
        } else {
            const xOffset = position.x > this.originalPosition.x ? 1 : -1;

            for(let i = 1; i <= Math.abs(this.originalPosition.x-position.x)/100-1; i++) {
                const encounteredPawn: DisplayObject | undefined = this.getOffsetPawn(xOffset*i, 0);
                if (encounteredPawn && encounteredPawn instanceof Pawn) return false; 
            }
        }

        return true;
    }
}