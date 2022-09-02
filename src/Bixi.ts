import * as PIXI from "pixi.js"
import DragHandler from "./handlers/DragHandler"

// OPTS

const PAWN_SIZE = 80
const FRAME_SIZE = 800
const WHITE_COLOR = 0xdbdbdb
const BLACK_COLOR = 545454

// OPTS

function init() {
  function createPawnSprite(piece: String): PIXI.Sprite {
    const texture = PIXI.Texture.from(`images/Pieces/${piece}.png`)
    const sprite = new PIXI.Sprite(texture)
    sprite.height = PAWN_SIZE
    sprite.width = PAWN_SIZE
    sprite.anchor.set(.5)
  
    sprite.interactive = true
    sprite.buttonMode = true
  
    return sprite
  }
  
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
  
  
  const app = new PIXI.Application({
    antialias: true,
    autoDensity: true,
    backgroundColor: WHITE_COLOR,
    height: FRAME_SIZE,
    width: FRAME_SIZE
  })
  
  const container = new PIXI.Container()
  
  
  app.stage.addChild(container)
  
  
  
  document.getElementById("app")?.appendChild(app.view)
}

export default init