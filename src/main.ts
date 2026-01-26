import { Application, Assets, Sprite, Text } from "pixi.js";
import { DraggableObject } from "./ui/DraggableObject";
import { TargetArea } from "./ui/TargetArea";


// Load font before use
await Assets.load({
    src: 'fonts/Inter-VariableFont_opsz,wght.ttf',
    data: {
        family: 'Inter', // optional
    }
});

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#dadada", resizeTo: window });

  // Enable global pointer events on the stage
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load textures
  const mapTexture = await Assets.load("/assets/map.png");

  // Create draggable objects
  const draggableAssets = [
    "basketball.png",
    "cat-statue.png",
    "fire-extinguisher.png",
    "guitar.png",
    "lamp.png",
    "plant.png",
    "school-chair.png",
    "stove.png",
    "suitcase.png",
    "treasure-chest.png",
    "vase.png",
    "watermelon.png",
  ];

   const targetAreas = [
    new TargetArea({ x: 1000, y: 160 }),
    new TargetArea({ x: 1275, y: 150 }),
    new TargetArea({ x: 1000, y: 200 }),
    new TargetArea({ x: 800, y: 300 }),
    new TargetArea({ x: 900, y: 300 }),
    new TargetArea({ x: 1000, y: 300 }),
    new TargetArea({ x: 800, y: 400 }),
    new TargetArea({ x: 900, y: 400 }),
    new TargetArea({ x: 1000, y: 400 }),
    new TargetArea({ x: 800, y: 500 }),
    new TargetArea({ x: 900, y: 500 }),
    new TargetArea({ x: 1000, y: 500 }),
  ];

  const objectGapX = 180;
  const objectGapY = 180;
  const objectStartX = 280;
  const objectStartY = 250;

  // Create draggable objects (stacked down the left side)
  const draggableObjects = await Promise.all(
    draggableAssets.map(async (filename, index) =>
      DraggableObject.create({
        imagePath: `/assets/${filename}`,
        x: objectStartX + (index % 3) * objectGapX,
        y: objectStartY + Math.floor(index / 3) * objectGapY,
        scale: 0.1,
        onDragStart: (obj) => {
          // Release from any target area
          targetAreas.forEach(area => {
            if (area.occupiedBy === obj) {
              area.releaseObject();
            }
          });
        },
        onDragMove: (obj) => {
          // Highlight nearby targets
          targetAreas.forEach(area => {
            area.setHighlight(area.isNearby(obj, 100));
          });
        },
        onDragEnd: (obj) => {
          // Find nearest target and snap if close enough
          let snapped = false;
          for (const area of targetAreas) {
            if (area.isNearby(obj, 60) && !area.isOccupied) {
              area.snapObject(obj);
              snapped = true;
              break;
            }
            area.setHighlight(false);
          }
          console.log(`${filename} ${snapped ? 'snapped' : 'not snapped'}`);
        },
      })
    )
  );

  // Text elements
  const instructions = new Text({
    text: 'Drag and drop the objects on the left to the yellow targets on the map.\nThe yellow Targets represent the possible locations of the objects in the maze. \nPlace the objects in the location you remember seeing them in the maze.',
    style: {
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: '400',
      lineHeight: 28,
      fill: '#000000',
    },
    anchor: 0.5
  });

  // Create sprites
  const map = new Sprite(mapTexture);

  // Sprite anchor points
  map.anchor.set(0.5);
  instructions.anchor.set(0);

  // Scale down the sprites
  map.scale.set(0.4);

  // Sprite positions
  map.position.set(app.screen.width * 7 / 10, app.screen.height / 2);
  instructions.position.set(56, 56);

  // Add sprites to the stage
  app.stage.addChild(map);
  app.stage.addChild(instructions);
  draggableObjects.forEach(obj => app.stage.addChild(obj));
  targetAreas.forEach(area => app.stage.addChild(area));

  // Listen for animate update
  // app.ticker.add((time) => {
  //   // Just for fun, let's rotate mr rabbit a little.
  //   // * Delta is 1 if running at 100% performance *
  //   // * Creates frame-independent transformation *
  //   // bunny.rotation += 0.1 * time.deltaTime;
  // });
})();
