import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
} from "pixi.js";
import { DraggableObject } from "./ui/DraggableObject";
import { TargetArea } from "./ui/TargetArea";

async function sendGameData(
  participantId: string,
  studyResults: {
    participant_id: string;
    objects: { [key: string]: 0 | 1 };
    total_correct: number;
    total_objects: number;
  }
) {
  const API_URL = import.meta.env.VITE_API_URL;

  const payload = {
    participant_id: participantId,
    data: studyResults,
  };

  isSavingData = true;
  console.log("Saving data...");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (response.ok) {
      document.getElementById("success-message")!.style.display = "flex";
      console.log("S3 Upload Success:", result);
    } else {
      throw new Error("Server responded with an error");
    }
  } catch (error) {
    alert(
      "Error saving data. Please do not close this tab and contact the researcher.",
    );
    console.error("Upload failed:", error);
  } finally {
    isSavingData = false;
  }
}

let isSavingData = false;

window.addEventListener("beforeunload", (event) => {
  if (isSavingData) {
    event.preventDefault();
  }
});

(async () => {
  // Load font before use
  await Assets.load({
    src: "fonts/Inter-VariableFont_opsz,wght.ttf",
    data: {
      family: "Inter", // optional
    },
  });

  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#dadada", resizeTo: window });

  // Enable global pointer events on the stage
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);
  // Create participant ID input
  const participantIdContainer = document.createElement("div");
  participantIdContainer.style.cssText = `
    position: absolute;
    top: 24px;
    left: 56px;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    font-family: Inter, sans-serif;
  `;

  const idLabel = document.createElement("label");
  idLabel.textContent = "Participant ID: ";
  idLabel.style.cssText = `
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-right: 8px;
  `;

  const idInput = document.createElement("input");
  idInput.type = "text";
  idInput.placeholder = "Enter ID";
  idInput.style.cssText = `
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    font-family: Inter, sans-serif;
  `;

  participantIdContainer.appendChild(idLabel);
  participantIdContainer.appendChild(idInput);
  document
    .getElementById("pixi-container")!
    .appendChild(participantIdContainer);

  let participantId = "";
  idInput.addEventListener("change", (e) => {
    participantId = (e.target as HTMLInputElement).value;
    console.log("Participant ID set to:", participantId);
  });

  // Text elements
  const instructions = new Text({
    text: "Drag and drop the objects on the left to the yellow targets on the map.\nThe yellow Targets represent the possible locations of the objects in the maze. \nPlace the objects in the location you remember seeing them in the maze.",
    style: {
      fontFamily: "Inter",
      fontSize: 20,
      fontWeight: "400",
      lineHeight: 28,
      fill: "#000000",
    },
    anchor: 0.5,
  });

  instructions.anchor.set(0);
  instructions.position.set(56, 100);

  // Load textures
  const mapTexture = await Assets.load("/assets/map.png");

  // Create draggable objects
  const draggableAssets = [
    { filename: "basketball.png", correctTargetId: 4 },
    { filename: "cat-statue.png", correctTargetId: 5 },
    { filename: "fire-extinguisher.png", correctTargetId: 2 },
    { filename: "guitar.png", correctTargetId: 1 },
    { filename: "lamp.png", correctTargetId: 10 },
    { filename: "plant.png", correctTargetId: 11 },
    { filename: "school-chair.png", correctTargetId: 6 },
    { filename: "stove.png", correctTargetId: 3 },
    { filename: "suitcase.png", correctTargetId: 0 },
    { filename: "treasure-chest.png", correctTargetId: 7 },
    { filename: "vase.png", correctTargetId: 8 },
    { filename: "watermelon.png", correctTargetId: 9 },
  ];

  const targetAreas = [
    new TargetArea({
      id: 0,
      x: app.screen.width * 0.52,
      y: app.screen.height * 0.18,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
    new TargetArea({
      id: 1,
      x: app.screen.width * 0.66,
      y: app.screen.height * 0.15,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
    new TargetArea({
      id: 2,
      x: app.screen.width * 0.76,
      y: app.screen.height * 0.18,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
    new TargetArea({
      id: 3,
      x: app.screen.width * 0.86,
      y: app.screen.height * 0.14,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
    new TargetArea({
      id: 4,
      x: app.screen.width * 0.52,
      y: app.screen.height * 0.58,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
    new TargetArea({
      id: 5,
      x: app.screen.width * 0.7,
      y: app.screen.height * 0.46,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
    new TargetArea({
      id: 6,
      x: app.screen.width * 0.78,
      y: app.screen.height * 0.38,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
    new TargetArea({
      id: 7,
      x: app.screen.width * 0.68,
      y: app.screen.height * 0.66,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
    new TargetArea({
      id: 8,
      x: app.screen.width * 0.76,
      y: app.screen.height * 0.66,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
    new TargetArea({
      id: 9,
      x: app.screen.width * 0.88,
      y: app.screen.height * 0.66,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
    new TargetArea({
      id: 10,
      x: app.screen.width * 0.58,
      y: app.screen.height * 0.78,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
    new TargetArea({
      id: 11,
      x: app.screen.width * 0.82,
      y: app.screen.height * 0.86,
      size: Math.min(app.screen.width, app.screen.height) * 0.12,
    }),
  ];

  const objectGapX = Math.min(app.screen.width, app.screen.height) * 0.16;
  const objectGapY = objectGapX;
  const objectStartX = 280;
  const objectStartY = instructions.height + 180;

  const draggableObjects = await Promise.all(
    draggableAssets.map(async (asset, index) =>
      DraggableObject.create({
        imagePath: `/assets/${asset.filename}`,
        x: objectStartX + (index % 3) * objectGapX,
        y: objectStartY + Math.floor(index / 3) * objectGapY,
        scale: objectGapX / 1500,
        correctTargetId: asset.correctTargetId,
        onDragStart: (obj) => {
          // Release from any target area
          targetAreas.forEach((area) => {
            if (area.occupiedBy === obj) {
              area.releaseObject();
            }
          });
        },
        onDragMove: (obj) => {
          // Highlight nearby targets
          targetAreas.forEach((area) => {
            area.setHighlight(area.isOverlapping(obj));
          });
        },
        onDragEnd: (obj) => {
          // Find nearest target and snap if close enough
          let snapped = false;
          for (const area of targetAreas) {
            if (area.isOverlapping(obj) && !area.isOccupied) {
              area.snapObject(obj);
              snapped = true;
              const isCorrect = area.id === obj.correctTargetId;
              console.log(
                `${asset.filename} snapped to target ${area.id} - ${isCorrect ? "CORRECT" : "INCORRECT"}`,
              );
              break;
            }
            area.setHighlight(false);
          }
          console.log(
            `${asset.filename} ${snapped ? "snapped" : "not snapped"}`,
          );
          checkAllSnapped();
        },
      }),
    ),
  );

  const submitButton = new Container();
  const buttonBg = new Graphics()
    .roundRect(0, 0, 200, 60, 10)
    .fill({ color: 0x4caf50 });

  const buttonText = new Text({
    text: "Submit",
    style: {
      fontFamily: "Inter",
      fontSize: 24,
      fontWeight: "600",
      fill: "#ffffff",
    },
  });

  buttonText.anchor.set(0.5);
  buttonText.position.set(100, 30);

  submitButton.addChild(buttonBg);
  submitButton.addChild(buttonText);
  submitButton.position.set(65, app.screen.height - 120);
  submitButton.eventMode = "static";
  submitButton.cursor = "pointer";
  submitButton.visible = false;

  submitButton.on("pointerdown", () => {
    if (!participantId) {
      alert("Please enter the Participant ID before submitting.");
      return;
    }

    // Calculate and log results
    let correctCount = 0;
    const objectResults: { [key: string]: 0 | 1 } = {};
    targetAreas.forEach((area) => {
      const placedObject = area.occupiedBy as DraggableObject | null;
      if (placedObject && placedObject.correctTargetId === area.id) {
        objectResults[placedObject.objectName!] = 1;
        correctCount++;
        area.setCorrectness(true);
      } else if (placedObject) {
        objectResults[placedObject.objectName!] = 0;
        area.setCorrectness(false);
      }
    });

    const allCollectedData = {
      participant_id: participantId,
      objects: objectResults,
      total_correct: correctCount,
      total_objects: draggableAssets.length,
    };

    console.log("Submitted!");
    console.log("Participant ID:", participantId);
    console.log(`Score: ${correctCount} / ${draggableAssets.length}`);
    console.log("All data:", allCollectedData);

    // Update instruction text with score
    instructions.text = `You got ${correctCount} out of ${draggableAssets.length} correct.`;
    instructions.style = { fontWeight: "600" };
    submitButton.visible = false;

    sendGameData(participantId, allCollectedData);
  });

  // Function to check if all objects are snapped
  function checkAllSnapped() {
    const allSnapped = targetAreas.every((area) => area.isOccupied);
    submitButton.visible = allSnapped;
  }

  const map = new Sprite(mapTexture);
  map.anchor.set(0.5);
  map.scale.set((app.screen.height / map.height) * 0.9);
  map.position.set((app.screen.width * 7) / 10, app.screen.height / 2);

  // Add sprites to the stage
  app.stage.addChild(map);
  app.stage.addChild(instructions);
  draggableObjects.forEach((obj) => app.stage.addChild(obj));
  targetAreas.forEach((area) => app.stage.addChild(area));
  app.stage.addChild(submitButton);
})();
