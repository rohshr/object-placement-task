import { Container, Sprite, Assets, FederatedPointerEvent } from "pixi.js";

export interface DraggableObjectOptions {
  imagePath: string;
  x: number;
  y: number;
  scale?: number;
  correctTargetId: number;
  onDragStart?: (obj: DraggableObject) => void;
  onDragMove?: (obj: DraggableObject) => void;
  onDragEnd?: (obj: DraggableObject) => void;
}

export class DraggableObject extends Container {
  private sprite: Sprite;
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private onDragStartCallback?: (obj: DraggableObject) => void;
  private onDragMoveCallback?: (obj: DraggableObject) => void;
  private onDragEndCallback?: (obj: DraggableObject) => void;
  public correctTargetId: number;
  public objectName?: string;

  constructor(sprite: Sprite, options: DraggableObjectOptions) {
    super();

    this.sprite = sprite;
    this.addChild(this.sprite);

    this.position.set(options.x, options.y);
    if (options.scale) {
      this.sprite.scale.set(options.scale);
    }

    this.onDragStartCallback = options.onDragStart;
    this.onDragMoveCallback = options.onDragMove;
    this.onDragEndCallback = options.onDragEnd;

    this.correctTargetId = options.correctTargetId;
    this.objectName = options.imagePath.split("/").pop()?.replace(".png", "");

    this.setupInteractivity();
  }

  private setupInteractivity() {
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", this.onPointerDown);
  }

  private onPointerDown = (event: FederatedPointerEvent) => {
    this.isDragging = true;

    // Calculate offset between pointer and object position
    const globalPos = event.global;
    this.dragOffset.x = this.x - globalPos.x;
    this.dragOffset.y = this.y - globalPos.y;

    // Bring to front
    if (this.parent) {
      this.parent.setChildIndex(this, this.parent.children.length - 1);
    }

    // Listen to global pointer events
    this.parent?.on("pointermove", this.onPointerMove);
    this.parent?.on("pointerup", this.onPointerUp);
    this.parent?.on("pointerupoutside", this.onPointerUp);

    this.onDragStartCallback?.(this);
  };

  private onPointerMove = (event: FederatedPointerEvent) => {
    if (this.isDragging) {
      const globalPos = event.global;
      this.x = globalPos.x + this.dragOffset.x;
      this.y = globalPos.y + this.dragOffset.y;

      this.onDragMoveCallback?.(this);
    }
  };

  private onPointerUp = () => {
    if (this.isDragging) {
      this.isDragging = false;

      // Remove global listeners
      this.parent?.off("pointermove", this.onPointerMove);
      this.parent?.off("pointerup", this.onPointerUp);
      this.parent?.off("pointerupoutside", this.onPointerUp);

      this.onDragEndCallback?.(this);
    }
  };

  static async create(
    options: DraggableObjectOptions,
  ): Promise<DraggableObject> {
    const texture = await Assets.load(options.imagePath);
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);

    return new DraggableObject(sprite, options);
  }
}
