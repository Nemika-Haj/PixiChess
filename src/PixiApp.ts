import * as PIXI from "pixi.js";
import type { PAWN } from "./lib/types"
import { PAWN_COLORS, PAWN_NAMES } from "./lib/enums"
import { Pawn } from "./lib/models/Pawn";

const FRAME_SIZE: number = 800;
const WHITE_COLOR: number = 0xdbdbdb;
const BLACK_COLOR: number = 545454;
const BOX_SIZE: number = 100;

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

export function initializePixiStageManager(): void {

  // Create the new Pixi Application with specific dimensions and properties
  const app = new PIXI.Application({
    antialias: true,
    autoDensity: true,
    transparent: true,
    height: FRAME_SIZE,
    width: window.innerWidth,
  })

  // Create a Pixi Container for the pawns and the board tiles
  const pawnContainer: PIXI.Container = new PIXI.Container();
  pawnContainer.x = app.view.width / 4;

  const boardContainer: PIXI.Container = new PIXI.Container();
  boardContainer.x = app.view.width / 4;

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

    if(block.x < 800) {
      boardContainer.addChild(block);
    }
  })

  // Add Pixi Containers in Stage of Pixi Application
  app.stage.addChild(boardContainer);
  app.stage.addChild(pawnContainer);

  // Append the app in HTML <div id="app" />
  document.getElementById("app")?.appendChild(app.view);

  // Create Front Pawns
  Array(16).fill(true).forEach((_, i) => {
    const pawnColor = i > 7 ? PAWN_COLORS.WHITE : PAWN_COLORS.BLACK;

    const pawnSprite: Pawn = new Pawn({ name: PAWN_NAMES.DEFAULT, color: pawnColor });

    const yOffSet: number = i > 7 ? 6 : 1;

    pawnSprite.position.set(50 + 100 * (i % 8), 50 + 100 * yOffSet);

    pawnContainer.addChild(pawnSprite);
    
  });

  // Create Back Pawns
  pawns.forEach((pawn, i) => {

    const pawnSprite: Pawn = new Pawn(pawn);

    const yOffSet: number = i > 7 ? 7 : 0;

    pawnSprite.position.set(50 + 100 * (i % 8), 50 + 100 * yOffSet);

    pawnContainer.addChild(pawnSprite);
  });
}