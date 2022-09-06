import type { DisplayObject, InteractionData, InteractionEvent, IPointData } from "pixi.js";
import { PawnColors } from "../enums";
import { MultiUserManager, otherUserDrag, socket } from "../Manager";
import { DeathContainer } from "../models/DeathContainer";
import { Pawn } from "../models/Pawn";

function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max)
}

export default function DragHandler(sprite: Pawn) {
    let data: undefined | InteractionData;
    let dragging: boolean = false;
    let originalIndex: number = 0;

    function Start(event?: InteractionEvent) {
        if(MultiUserManager.using) return;
        MultiUserManager.setUsing(true);
        data = event?.data;
        dragging = true;
        sprite.alpha = .5;
        sprite.originalPosition = { x: sprite.x, y: sprite.y }

        // Save initial pawn index
        originalIndex = sprite.parent.getChildIndex(sprite);

        // Set pawn on top for a clearer view
        sprite.parent.setChildIndex(sprite, sprite.parent.children.length-1);
    }

    function End() {
        MultiUserManager.setUsing(false);

        dragging = false;
        sprite.alpha = 1;
        data = undefined;

        // Find the closest container middle X and Y, clamp values so they remain in bounds 
        const snapX = clamp(Math.floor(sprite.x / 100)*100+50, 50, 750);
        const snapY = clamp(Math.floor(sprite.y / 100)*100+50, 50, 750);

        if(sprite.validateMove && !sprite.validateMove({ x: snapX, y: snapY })) {
            sprite.position.set(sprite.originalPosition?.x, sprite.originalPosition?.y);
            return;
        }

        sprite.position.set(snapX, snapY);
        socket.emit('movePawn', { x: sprite.originalPosition!!.x, y: sprite.originalPosition!!.y }, { x: snapX, y: snapY })

        // Return pawn's original index
        sprite.parent.setChildIndex(sprite, originalIndex);

        // Check if the moved pawn overlapped another
        const deadPawn: DisplayObject | undefined = sprite.parent.children.filter(child => child instanceof Pawn && child != sprite).find(pawn => Pawn.matchPositions(sprite.position, pawn.position));

        if(deadPawn instanceof Pawn) {
            if (deadPawn.color == sprite.color) {
                // If deadPawn is the same color as the dragged pawn, deletion
                sprite.position.set(sprite.originalPosition?.x, sprite.originalPosition?.y);
            } else {

                deadPawn.removeAllListeners();
                deadPawn.buttonMode = false;

                // Otherwise delete object
                sprite.parent.removeChild(deadPawn);

                const deathContainer: DisplayObject | undefined = sprite.parent.parent.children.find(e => e instanceof DeathContainer);
                if(deathContainer instanceof DeathContainer) {
                    deathContainer.add(deadPawn, deadPawn.color == PawnColors.BLACK)
                }
            }
        }
    }

    function Move(pos: IPointData) {
        if (dragging) {
            const newPos: IPointData | undefined = pos.x ? pos : data?.getLocalPosition(sprite.parent);

            if(!Pawn.inBounds(newPos!!)) {
                sprite.position.set(sprite.originalPosition?.x, sprite.originalPosition?.y)
                End()
                return;
            }

            if (newPos) {
                sprite.position.set(newPos.x, newPos.y);
            }
        }
    }

    return {
        Start, End, Move
    }
}