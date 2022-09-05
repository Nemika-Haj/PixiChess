import type { ListenerFn } from "eventemitter3";
import { Application, Sprite, Texture } from "pixi.js";
import type { PAWN } from "../types";
import DragHandler from "../handlers/DragHandler";

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
            .on('pointerupoutside', dragHandler.End)
            .on('pointermove', dragHandler.Move);

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