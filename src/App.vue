<script setup lang="ts">
import * as PIXI from "pixi.js"
import { ref, onMounted } from "vue"
import DragHandler from "./handlers/DragHandler";

const pixiCanvas = ref()

function createPawnSprite(piece: String): PIXI.Sprite {
  const texture = PIXI.Texture.from(`images/Pieces/${piece}.png`)
  const sprite = new PIXI.Sprite(texture)
  sprite.height = BOX_SIZE
  sprite.width = BOX_SIZE
  sprite.anchor.set(.5)

  sprite.interactive = true
  sprite.buttonMode = true

  return sprite
}

const FRAME_SIZE = 800
const BOX_SIZE = 85
const XY_MARGIN = 85

const PAWNS = [
  "Rook",
  "Knight",
  "Bishop",
  "King",
  "Queen",
  "Bishop",
  "Knight",
  "Rook"
]

// DECLARE PAWNS

const EMPTY_SPOTS = Array(8).fill(false).map(e => Array(8).fill(e))


const app = new PIXI.Application({
  antialias: true,
  autoDensity: true,
  backgroundColor: 0x0D0B26,
  height: FRAME_SIZE,
  width: FRAME_SIZE
})

const container = new PIXI.Container()

const background = new PIXI.Sprite(PIXI.Texture.from("images/ChessBoard.png"))
background.width = FRAME_SIZE
background.height = FRAME_SIZE

container.addChild(background)

for(let i = 0; i<16; i++) {
  const sprite = createPawnSprite(i > 7 ? "WhitePawn" : "BlackPawn")

  const dragHandler = DragHandler(sprite)

  if(i <= 7) {
    sprite.position.set(XY_MARGIN+((XY_MARGIN+5)*i), XY_MARGIN*2.1)
    EMPTY_SPOTS[1][i] = true
  } else {
    sprite.position.set(XY_MARGIN+((XY_MARGIN+5)*(i-8)), (FRAME_SIZE-XY_MARGIN)/1.15)
    EMPTY_SPOTS[6][i-8] = true
  }

  sprite
    .on('pointerdown', dragHandler.Start)
    .on('pointerup', dragHandler.End)
    .on('pointerupoutside', dragHandler.End)
    .on('pointermove', dragHandler.Move)

  container.addChild(sprite)
}

PAWNS.forEach((pawn, i) => {
  const blackSprite = createPawnSprite("Black"+pawn)

  const dragHandlerBlack = DragHandler(blackSprite)

  blackSprite.position.set(XY_MARGIN+((XY_MARGIN+5)*i), XY_MARGIN)
  EMPTY_SPOTS[0][i] = true

  blackSprite
    .on('pointerdown', dragHandlerBlack.Start)
    .on('pointerup', dragHandlerBlack.End)
    .on('pointerupoutside', dragHandlerBlack.End)
    .on('pointermove', dragHandlerBlack.Move)

  container.addChild(blackSprite)


  const whiteSprite = createPawnSprite("White"+pawn)

  const dragHandlerWhite = DragHandler(whiteSprite)

  whiteSprite.position.set(XY_MARGIN+((XY_MARGIN+5)*i), (FRAME_SIZE-XY_MARGIN))
  EMPTY_SPOTS[0][i] = true

  whiteSprite
    .on('pointerdown', dragHandlerWhite.Start)
    .on('pointerup', dragHandlerWhite.End)
    .on('pointerupoutside', dragHandlerWhite.End)
    .on('pointermove', dragHandlerWhite.Move)

  container.addChild(whiteSprite)

})



app.stage.addChild(container)



onMounted(() => {
  // Append APP to pixi container once the component is mounted
  pixiCanvas.value.appendChild(app.view)
})

</script>

<template>
  <center>
    <h1>PixiJS Chess</h1>

    <div ref="pixiCanvas">
    </div>
  </center>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

</style>
