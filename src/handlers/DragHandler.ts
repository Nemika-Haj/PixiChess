import type { InteractionData, InteractionEvent, Sprite } from "pixi.js";

export default function DragHandler(sprite: Sprite) {
    let data: null | InteractionData = null
    let dragging: boolean = false

    function Start(event: InteractionEvent) {
        data = event.data
        dragging = true
        sprite.alpha = .5
    }

    function End() {
        dragging = false
        sprite.alpha = 1
        data = null
    }

    function Move() {
        if(dragging) {
            const newPos = data?.getLocalPosition(sprite.parent)
            if(newPos) {
                sprite.position.set(newPos.x, newPos.y)
            }
        }
    }

    return {
        Start, End, Move
    }

}