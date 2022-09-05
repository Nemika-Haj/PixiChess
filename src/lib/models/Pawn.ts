import type { ListenerFn } from "eventemitter3";
import { DisplayObject, ObservablePoint, Sprite, Texture, type IPointData } from "pixi.js";
import type { PAWN } from "../types";
import DragHandler from "../handlers/DragHandler";
import { PAWN_COLORS, PAWN_NAMES } from "../enums";

const PATH_TO_PAWNS: String = "assets/images/pawns/";
const PAWN_SIZE: number = 80;

export class Pawn extends Sprite {
    public figure: string;
    public color: string;

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

    public getOffsetPosition(originPos: IPointData, x: number, y: number): IPointData {
        return { x: originPos.x+x*100, y: originPos.y+y*100 }
    }

    public getOffsetPawn(originPos: IPointData, x: number, y: number): DisplayObject | undefined {
        const offsetPawn: DisplayObject | undefined = this.parent.children.find(e => e.x == originPos.x + x*100 && e.y == originPos.y + y*100);

        return offsetPawn
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

}

export class DefaultPawn extends Pawn {
    private firstMove: boolean = true;

    constructor(color: PAWN_COLORS) {
        super({ name: PAWN_NAMES.DEFAULT, color: color });
    }

    public validateMove(originalPosition: IPointData, newPosition: IPointData) {
        if(newPosition.y < 0 || newPosition.y > 800 || newPosition.x < 0 || newPosition.x > 800) return false;

        let yOffset = this.color == PAWN_COLORS.WHITE ? -1 : 1

        const eatsLeft: DisplayObject | undefined = this.getOffsetPawn(originalPosition, -1, yOffset);
        const eatsRight: DisplayObject | undefined = this.getOffsetPawn(originalPosition, 1, yOffset);

        let result = false;

        if (
            (eatsLeft && Pawn.matchPositions(eatsLeft.position, newPosition)) ||
            (eatsRight && Pawn.matchPositions(eatsRight.position, newPosition))
        ) result = true;

        const oneBlock = this.getOffsetPawn(originalPosition, 0, yOffset);
        const twoBlocks = this.getOffsetPawn(originalPosition, 0, yOffset*2);

        if (
            (!oneBlock && Pawn.matchPositions(this.getOffsetPosition(originalPosition, 0, yOffset), newPosition)) ||
            (this.firstMove && !twoBlocks && Pawn.matchPositions(this.getOffsetPosition(originalPosition, 0, yOffset*2), newPosition))
        ) result = true;

        if(result) this.firstMove = false

        return result;
    }

}