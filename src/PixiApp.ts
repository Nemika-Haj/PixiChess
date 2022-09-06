import * as PIXI from "pixi.js";
import type { PAWN } from "./lib/types"
import { PawnColors, PawnNames } from "./lib/enums"
import { BishopPawn, KingPawn, Pawn, QueenPawn, RookPawn } from "./lib/models/Pawn";
import { ContainerHandler } from "./lib/handlers/ContainerHandler";
import { DefaultPawn } from "./lib/models/Pawn"

const FRAME_SIZE: number = 800;
const BLACK_COLOR: number = 545454;
const BOX_SIZE: number = 100;

const pawns: Array<PAWN> = [
  { name: PawnNames.ROOK, color: PawnColors.BLACK },
  { name: PawnNames.KNIGHT, color: PawnColors.BLACK },
  { name: PawnNames.BISHOP, color: PawnColors.BLACK },
  { name: PawnNames.QUEEN, color: PawnColors.BLACK },
  { name: PawnNames.KING, color: PawnColors.BLACK },
  { name: PawnNames.BISHOP, color: PawnColors.BLACK },
  { name: PawnNames.KNIGHT, color: PawnColors.BLACK },
  { name: PawnNames.ROOK, color: PawnColors.BLACK },
  { name: PawnNames.ROOK, color: PawnColors.WHITE },
  { name: PawnNames.KNIGHT, color: PawnColors.WHITE },
  { name: PawnNames.BISHOP, color: PawnColors.WHITE },
  { name: PawnNames.QUEEN, color: PawnColors.WHITE },
  { name: PawnNames.KING, color: PawnColors.WHITE },
  { name: PawnNames.BISHOP, color: PawnColors.WHITE },
  { name: PawnNames.KNIGHT, color: PawnColors.WHITE },
  { name: PawnNames.ROOK, color: PawnColors.WHITE },
];

export function initializePixiStageManager(): void {

  // Create the new Pixi Application with specific dimensions and properties
  const app = new PIXI.Application({
    antialias: true,
    autoDensity: true,
    transparent: true,
    height: FRAME_SIZE,
    width: window.innerWidth,
  });

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
    const pawnColor = i > 7 ? PawnColors.WHITE : PawnColors.BLACK;

    const pawnSprite: DefaultPawn = new DefaultPawn(pawnColor);

    const yOffSet: number = i > 7 ? 6 : 1;

    pawnSprite.position.set(50 + 100 * (i % 8), 50 + 100 * yOffSet);

    pawnContainer.addChild(pawnSprite);
    
  });

  // Create Back Pawns
  pawns.forEach((pawn, i) => {

    let pawnSprite: Pawn;

    switch(pawn.name) {
      case PawnNames.ROOK: 
        pawnSprite = new RookPawn(pawn.color);
        break;
      case PawnNames.BISHOP:
        pawnSprite = new BishopPawn(pawn.color);
        break;
      case PawnNames.QUEEN:
        pawnSprite = new QueenPawn(pawn.color);
        break;
      case PawnNames.KING:
        pawnSprite = new KingPawn(pawn.color);
        break;
      default: pawnSprite = new Pawn(pawn);
    }

    const yOffSet: number = i > 7 ? 7 : 0;

    pawnSprite.position.set(50 + 100 * (i % 8), 50 + 100 * yOffSet);

    pawnContainer.addChild(pawnSprite);
  });

  (new ContainerHandler(app)).setupDeathContainer();
}