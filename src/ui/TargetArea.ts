import { Container, Graphics } from 'pixi.js';

export interface TargetAreaOptions {
  id: number;
  x: number;
  y: number;
  size?: number;
  borderWidth?: number;
  borderColor?: number;
  fillColor?: number;
  fillAlpha?: number;
}

export class TargetArea extends Container {
  public id: number;
  private graphics: Graphics;
  private areaSize: number;
  public isOccupied: boolean = false;
  public occupiedBy: Container | null = null;

  constructor(options: TargetAreaOptions) {
    super();

    this.id = options.id;
    this.areaSize = options.size ?? 110;
    const borderWidth = options.borderWidth ?? 7;
    const borderColor = options.borderColor ?? 0xFFD700; // Yellow
    const fillColor = options.fillColor ?? 0xFFFFFF;
    const fillAlpha = options.fillAlpha ?? 0.1;

    this.graphics = new Graphics();
    
    // Draw filled rectangle
    this.graphics.rect(
      -this.areaSize / 2,
      -this.areaSize / 2,
      this.areaSize,
      this.areaSize
    );
    this.graphics.fill({ color: fillColor, alpha: fillAlpha });
    
    // Draw border
    this.graphics.rect(
      -this.areaSize / 2,
      -this.areaSize / 2,
      this.areaSize,
      this.areaSize
    );
    this.graphics.stroke({ color: borderColor, width: borderWidth });

    this.addChild(this.graphics);
    this.position.set(options.x, options.y);
  }

  /**
   * Check if a point is within the target area
   */
  public containsPoint(x: number, y: number): boolean {
    const halfSize = this.areaSize / 2;
    return (
      x >= this.x - halfSize &&
      x <= this.x + halfSize &&
      y >= this.y - halfSize &&
      y <= this.y + halfSize
    );
  }

  /**
   * Check if an object is close enough to snap to this target
   */
  public isNearby(obj: Container, threshold: number): boolean {
    const dx = obj.x - this.x;
    const dy = obj.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < threshold;
  }

  public isOverlapping(obj: Container): boolean {
    const objBounds = obj.getBounds();
    const targetBounds = this.getBounds();
    
    return !(
      objBounds.x > targetBounds.x + targetBounds.width ||
      objBounds.x + objBounds.width < targetBounds.x ||
      objBounds.y > targetBounds.y + targetBounds.height ||
      objBounds.y + objBounds.height < targetBounds.y
    );
  }

  /**
   * Snap an object to the center of this target area
   */
  public snapObject(obj: Container): void {
    obj.position.set(this.x, this.y);
    this.isOccupied = true;
    this.occupiedBy = obj;
  }

  /**
   * Release the object from this target area
   */
  public releaseObject(): void {
    this.isOccupied = false;
    this.occupiedBy = null;
  }

  /**
   * Highlight the target area (e.g., when an object is nearby)
   */
  public setHighlight(highlighted: boolean): void {
    this.graphics.clear();
    
    const borderWidth = highlighted ? 7 : 7;
    const borderColor = highlighted ? 0xFFA500 : 0xFFD700; // Orange when highlighted
    const fillAlpha = highlighted ? 0.3 : 0.1;

    // Draw filled rectangle
    this.graphics.rect(
      -this.areaSize / 2,
      -this.areaSize / 2,
      this.areaSize,
      this.areaSize
    );
    this.graphics.fill({ color: 0xFFFFFF, alpha: fillAlpha });
    
    // Draw border
    this.graphics.rect(
      -this.areaSize / 2,
      -this.areaSize / 2,
      this.areaSize,
      this.areaSize
    );
    this.graphics.stroke({ color: borderColor, width: borderWidth });
  }

  public setCorrectness(isCorrect: boolean): void {
    const color = isCorrect ? 0x00ff00 : 0xff0000; // Green or Red
    this.graphics.clear();
    this.graphics.rect(
      -this.areaSize / 2,
      -this.areaSize / 2,
      this.areaSize,
      this.areaSize
    );
    this.zIndex = 1;
    this.graphics.fill({ color: color, alpha: 0.5 });
    this.graphics.stroke({ color: color, width: 3 });
  }
}