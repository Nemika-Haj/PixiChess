import { ObservablePoint, type DisplayObject, type InteractionData, type InteractionEvent, type IPointData } from "pixi.js";
import { PAWN_COLORS } from "../enums";
import { DeathContainer } from "../models/DeathContainer";
import { Pawn, DefaultPawn } from "../models/Pawn";

function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max)
}

export default function DragHandler(sprite: Pawn) {
    let data: null | InteractionData = null;
    let dragging: boolean = false;
    let originalIndex: number = 0;
    let originalPosition: ObservablePoint<any>;

    function Start(event: InteractionEvent) {
        data = event.data;
        dragging = true;
        sprite.alpha = .5;
        originalPosition = new ObservablePoint(() => null, sprite.position.scope, sprite.x, sprite.y);
        
        // Save initial pawn index
        originalIndex = sprite.parent.getChildIndex(sprite);

        // Set pawn on top for a clearer view
        sprite.parent.setChildIndex(sprite, sprite.parent.children.length-1);
    }

    function End() {
        dragging = false;
        sprite.alpha = 1;
        data = null;

        // Find the closest container middle X and Y, clamp values so they remain in bounds 
        const snapX = clamp(Math.floor(sprite.x / 100)*100+50, 50, 750);
        const snapY = clamp(Math.floor(sprite.y / 100)*100+50, 50, 750);

        console.log("Call")

        if(sprite instanceof DefaultPawn) {
            
            if(!sprite.validateMove(originalPosition, { x: snapX, y: snapY })) {
                sprite.position.set(originalPosition.x, originalPosition.y);
                return;
            }

            
        }

        sprite.position.set(snapX, snapY);

        // Return pawn's original index
        sprite.parent.setChildIndex(sprite, originalIndex);

        // Check if the moved pawn overlapped another
        const deadPawn: DisplayObject | undefined = sprite.parent.children.filter(child => child instanceof Pawn && child != sprite).find(pawn => Pawn.matchPositions(sprite.position, pawn.position));

        if(deadPawn instanceof Pawn) {
            if (deadPawn.color == sprite.color) {
                // If deadPawn is the same color as the dragged pawn, deletion
                sprite.position.set(originalPosition.x, originalPosition.y);
            } else {

                deadPawn.removeAllListeners();
                deadPawn.buttonMode = false;

                // Otherwise delete object
                sprite.parent.removeChild(deadPawn);

                const deathContainer: DisplayObject | undefined = sprite.parent.parent.children.find(e => e instanceof DeathContainer);
                if(deathContainer instanceof DeathContainer) {
                    deathContainer.add(deadPawn, deadPawn.color == PAWN_COLORS.BLACK)
                }
            }
        }
    }

    function Move() {
        if (dragging) {
            const newPos: IPointData | undefined = data?.getLocalPosition(sprite.parent);
            if (newPos) {
                sprite.position.set(newPos.x, newPos.y);
            }
        }
    }

    return {
        Start, End, Move
    }
}