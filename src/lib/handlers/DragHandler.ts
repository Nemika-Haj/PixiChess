import type { InteractionData, InteractionEvent, IPointData, Sprite } from "pixi.js";

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

        const snapX = Math.floor(sprite.x / 100)
        const snapY = Math.floor(sprite.y / 100)

        console.log(snapX, snapY)

        sprite.position.set(snapX*100+50, snapY*100+50)

    }

    function Move() {
        if (dragging) {
            const newPos: IPointData | undefined = data?.getLocalPosition(sprite.parent)
            if (newPos) {

                sprite.position.set(newPos.x, newPos.y)
            }
        }
    }

    return {
        Start, End, Move
    }

}