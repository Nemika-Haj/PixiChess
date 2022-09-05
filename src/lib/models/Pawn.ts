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

        this.height = PAWN_SIZE;
        this.width = PAWN_SIZE;
        this.anchor.set(.5);
        this.interactive = true;
        this.buttonMode = true;

        const dragHandler: { Start: ListenerFn, Move: ListenerFn, End: ListenerFn } = DragHandler(this);
        this
            .on('pointerdown', dragHandler.Start)
            .on('pointerup', dragHandler.End)
            .on('pointerupoutside', dragHandler.End)
            .on('pointermove', dragHandler.Move);

    }
}