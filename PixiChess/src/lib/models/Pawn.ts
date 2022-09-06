import type { ListenerFn } from "eventemitter3";
import { DisplayObject, ObservablePoint, Sprite, Texture, type IPointData } from "pixi.js";
import type { PAWN } from "../types";
import DragHandler from "../handlers/DragHandler";
import { PawnColors, PawnNames } from "../enums";
import { v4 as makeId } from "uuid";

const PATH_TO_PAWNS: String = "assets/images/pawns/";
const PAWN_SIZE: number = 80;

export class Pawn extends Sprite {
    public figure: string;
    public color: string;
    public originalPosition?: IPointData;
    public id: string;
    public dragHandler: { Start: ListenerFn, Move: ListenerFn, End: ListenerFn };

    constructor(pawn: PAWN) {
        super(Texture.from(PATH_TO_PAWNS + pawn.color + pawn.name + ".png"));
        this.figure = pawn.name;
        this.color = pawn.color;
        this.id = makeId();

        Pawn.makeOptions(this)

        this.dragHandler  = DragHandler(this);
        this
            .on('pointerdown', this.dragHandler.Start)
            .on('pointerup', this.dragHandler.End)
            .on('pointermove', this.dragHandler.Move);

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
                if (encounteredPawn) return false; 
            }
        } else {
            const xOffset = position.x > this.originalPosition.x ? 1 : -1;

            for(let i = 1; i <= Math.abs(this.originalPosition.x-position.x)/100-1; i++) {
                const encounteredPawn: DisplayObject | undefined = this.getOffsetPawn(xOffset*i, 0);
                if (encounteredPawn) return false; 
            }
        }

        return true;
    }
}

export class BishopPawn extends Pawn {

    constructor(color: PawnColors | string) {
        super({ name: PawnNames.BISHOP, color: color });
    }

    public validateMove(position: IPointData): boolean {
        if(!Pawn.inBounds(position)) return false; 

        if(!this.originalPosition) return false;

        if(this.originalPosition.x == position.x || this.originalPosition.y == position.y) return false;
        if(Math.abs(this.originalPosition.x-position.x) != Math.abs(this.originalPosition.y-position.y)) return false;

        const blocksMoved: number = (this.originalPosition.y - position.y)/50;

        let yOffset: number = blocksMoved > 0 ? -1 : 1;
        let xOffset: number = (this.originalPosition.x - position.x)/50 > 0 ? -1 : 1;
        
        for(let i = 1; i < Math.abs(blocksMoved)-2; i++) {
            let encounteredPawn: DisplayObject | undefined = this.getOffsetPawn(i*xOffset, i*yOffset);

            console.log(i, encounteredPawn)

            if(encounteredPawn) return false;
        }

        return true;
    }
}

export class QueenPawn extends Pawn {
    
    constructor(color: PawnColors | string) {
        super({ name: PawnNames.QUEEN, color: color });
    }

    public validateMove(position: IPointData): boolean {
        let movementPawn = new RookPawn(this.color);
        movementPawn.visible = false;
        this.parent.addChild(movementPawn);
        movementPawn.originalPosition = this.originalPosition;
        if(movementPawn.validateMove(position)) {
            console.log("MOVE")
            this.parent.removeChild(movementPawn);
            return true;
        }

        movementPawn = new BishopPawn(this.color);
        movementPawn.visible = false;
        this.parent.addChild(movementPawn);
        movementPawn.originalPosition = this.originalPosition;
        if(movementPawn.validateMove(position)) {
            console.log("MOVE")
            this.parent.removeChild(movementPawn);
            return true;
        }

        return false;
    }

}

export class KingPawn extends Pawn {

    constructor(color: PawnColors | string) {
        super({ name: PawnNames.KING, color: color })
    }

    public validateMove(position: IPointData): boolean {
        if(
            Math.abs( this.originalPosition!!.x - position.x ) > 100 ||
            Math.abs( this.originalPosition!!.y - position.y ) > 100
        ) return false;

        return true;

    }
}

export class KnightPawn extends Pawn {
    constructor(color: PawnColors | string) {
        super({ name: PawnNames.KNIGHT, color: color })
    }

    public validateMove(position: IPointData): boolean {
        if(
            (Math.abs( this.originalPosition!!.x - position.x ) == 200 && Math.abs( this.originalPosition!!.y - position.y ) == 100) ||
            (Math.abs( this.originalPosition!!.y - position.y ) == 200 && Math.abs( this.originalPosition!!.x - position.x ) == 100)
        ) return true;

        return false;

    }
}