import type { InteractionData, InteractionEvent, IPointData, Sprite } from "pixi.js";

function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max)
}

export default function DragHandler(sprite: Sprite) {
    let data: null | InteractionData = null;
    let dragging: boolean = false;

    function Start(event: InteractionEvent) {
        data = event.data;
        dragging = true;
        sprite.alpha = .5;
    }

    function End() {
        dragging = false;
        sprite.alpha = 1;
        data = null;

        // Find the closest container middle X and Y, clamp values so they remain in bounds 
        const snapX = clamp(Math.floor(sprite.x / 100)*100+50, 50, 750);
        const snapY = clamp(Math.floor(sprite.y / 100)*100+50, 50, 750);

        sprite.position.set(snapX, snapY);
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