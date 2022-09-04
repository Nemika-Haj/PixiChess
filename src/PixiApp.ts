import type { ListenerFn } from "eventemitter3";
import * as PIXI from "pixi.js";
import DragHandler from "./lib/handlers/DragHandler";
import type { PAWN } from "./lib/types"
import { PAWN_COLORS, PAWN_NAMES } from "./lib/enums"

const FRAME_SIZE: number = 800;
const WHITE_COLOR: number = 0xdbdbdb;
const BLACK_COLOR: number = 545454;
const PAWN_SIZE: number = 80;
const BOX_SIZE: number = 100;
const PATH_TO_PAWNS: String = "assets/images/pawns/";

const pawns: Array<PAWN> = [
  { name: PAWN_NAMES.ROOK, color: PAWN_COLORS.BLACK },
  { name: PAWN_NAMES.KNIGHT, color: PAWN_COLORS.BLACK },
  { name: PAWN_NAMES.BISHOP, color: PAWN_COLORS.BLACK },
  { name: PAWN_NAMES.QUEEN, color: PAWN_COLORS.BLACK },
  { name: PAWN_NAMES.KING, color: PAWN_COLORS.BLACK },
  { name: PAWN_NAMES.BISHOP, color: PAWN_COLORS.BLACK },
  { name: PAWN_NAMES.KNIGHT, color: PAWN_COLORS.BLACK },
  { name: PAWN_NAMES.ROOK, color: PAWN_COLORS.BLACK },
  { name: PAWN_NAMES.ROOK, color: PAWN_COLORS.WHITE },
  { name: PAWN_NAMES.KNIGHT, color: PAWN_COLORS.WHITE },
  { name: PAWN_NAMES.BISHOP, color: PAWN_COLORS.WHITE },
  { name: PAWN_NAMES.QUEEN, color: PAWN_COLORS.WHITE },
  { name: PAWN_NAMES.KING, color: PAWN_COLORS.WHITE },
  { name: PAWN_NAMES.BISHOP, color: PAWN_COLORS.WHITE },
  { name: PAWN_NAMES.KNIGHT, color: PAWN_COLORS.WHITE },
  { name: PAWN_NAMES.ROOK, color: PAWN_COLORS.WHITE },
];

function createPawnSprite(piece: String): PIXI.Sprite {

  // Import images and create the Textures
  const texture = PIXI.Texture.from(PATH_TO_PAWNS + "" + piece + ".png");

  // Create the Sprite from Texture
  const sprite = new PIXI.Sprite(texture);

  // Set some properties for Sprite
  sprite.height = PAWN_SIZE;
  sprite.width = PAWN_SIZE;
  sprite.anchor.set(.5);
  sprite.interactive = true;
  sprite.buttonMode = true;

  const dragHandler: { Start: ListenerFn, Move: ListenerFn, End: ListenerFn } = DragHandler(sprite);
  sprite
    .on('pointerdown', dragHandler.Start)
    .on('pointerup', dragHandler.End)
    .on('pointerupoutside', dragHandler.End)
    .on('pointermove', dragHandler.Move);

  return sprite;
}

export function initializePixiStageManager(): void {

  // Create the new Pixi Application with specific dimensions and properties
  const app = new PIXI.Application({
    antialias: true,
    autoDensity: true,
    backgroundColor: WHITE_COLOR,
    height: FRAME_SIZE,
    width: FRAME_SIZE
  })

  // Create Pixi Container
  const container: PIXI.Container = new PIXI.Container();

  // Form Grid
  Array(70).fill(true).forEach((_, i) => {
    if ((i + 1) % 2 != 0) return

    const block: PIXI.Container = new PIXI.Container();
    const blockGraphics: PIXI.Graphics = new PIXI.Graphics();

    blockGraphics.beginFill(BLACK_COLOR);
    blockGraphics.drawRect(0, 0, BOX_SIZE, BOX_SIZE);
    blockGraphics.endFill();

    block.addChild(blockGraphics);


    block.x = BOX_SIZE * (i % 9);
    block.y = BOX_SIZE * Math.floor(i / 9);

    container.addChild(block);

  })

  // Add Pixi Container in Stage of Pixi Application
  app.stage.addChild(container);

  // Append the app in HTML <div id="app" />
  document.getElementById("app")?.appendChild(app.view);

  // Create Front Pawns
  Array(16).fill(true).forEach((_, i) => {
    const pawnColor = i > 7 ? PAWN_COLORS.WHITE : PAWN_COLORS.BLACK;

    const pawnSprite: PIXI.Sprite = createPawnSprite(pawnColor+PAWN_NAMES.DEFAULT);
    pawnSprite.height = PAWN_SIZE;
    pawnSprite.width = PAWN_SIZE;

    const yOffSet: number = i > 7 ? 6 : 1;
    
    pawnSprite.position.set(50+100*(i%8), 50+100*yOffSet);

    app.stage.addChild(pawnSprite);

  });

  // Create Back Pawns
  pawns.forEach((pawn, i) => {

    const pawnSprite: PIXI.Sprite = createPawnSprite(pawn.color+pawn.name);
    pawnSprite.height = PAWN_SIZE;
    pawnSprite.width = PAWN_SIZE;

    const yOffSet: number = i > 7 ? 7 : 0;
    
    pawnSprite.position.set(50+100*(i%8), 50+100*yOffSet);

    app.stage.addChild(pawnSprite);

  });

}