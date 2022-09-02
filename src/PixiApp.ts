import * as PIXI from "pixi.js";
import DragHandler from "./handlers/DragHandler";

const FRAME_SIZE: number = 800;
const WHITE_COLOR: number = 0xdbdbdb;
const BLACK_COLOR: number = 545454;
const PAWN_SIZE: number = 80;
const PATH_TO_PAWNS: String = "assets/images/pawns/";

type PAWN = {
  name: String,
  color: String
};

enum PAWN_NAMES {
  ROOK = "Rook",
  KNIGHT = "Knight",
  BISHOP = "Bishop",
  KING = "King",
  QUEEN = "Queen"
}

enum PAWN_COLORS {
  BLACK = "Black",
  WHITE = "White"
}

const pawns: Array<PAWN> = [
  {name: PAWN_NAMES.ROOK, color: PAWN_COLORS.BLACK}, 
  {name: PAWN_NAMES.KNIGHT, color: PAWN_COLORS.BLACK}, 
  {name: PAWN_NAMES.BISHOP, color: PAWN_COLORS.BLACK}, 
  {name: PAWN_NAMES.KING, color: PAWN_COLORS.BLACK}, 
  {name: PAWN_NAMES.QUEEN, color: PAWN_COLORS.BLACK}, 
  {name: PAWN_NAMES.ROOK, color: PAWN_COLORS.WHITE}, 
  {name: PAWN_NAMES.KNIGHT, color: PAWN_COLORS.WHITE}, 
  {name: PAWN_NAMES.BISHOP, color: PAWN_COLORS.WHITE}, 
  {name: PAWN_NAMES.KING, color: PAWN_COLORS.WHITE}, 
  {name: PAWN_NAMES.QUEEN, color: PAWN_COLORS.WHITE}, 
];

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

  // Add Pixi Container in Stage of Pixi Application
  app.stage.addChild(container);

  // Append the app in HTML <div id="app" />
  document.getElementById("app")?.appendChild(app.view);

  // Create Pawn Sprites
  pawns.forEach(pawn => {
    // console.log(pawn);
    let aSprite: PIXI.Sprite = createPawnSprite(pawn.color+""+pawn.name);
    container.addChild(aSprite);
  });
}

function createPawnSprite(piece: String): PIXI.Sprite {
  
  // Import images and create the Textures
  const texture = PIXI.Texture.from(PATH_TO_PAWNS+""+piece+".png");

  // Create the Sprite from Texture
  const sprite = new PIXI.Sprite(texture);

  // Set some properties for Sprite
  sprite.height = PAWN_SIZE;
  sprite.width = PAWN_SIZE;
  sprite.anchor.set(.5);
  sprite.interactive = true;
  sprite.buttonMode = true;

  return sprite;
}