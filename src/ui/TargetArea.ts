import { Container, Graphics } from 'pixi.js';

export interface TargetAreaOptions {
  x: number;
  y: number;
  size?: number;
  borderWidth?: number;
  borderColor?: number;
  fillColor?: number;
  fillAlpha?: number;
}

export class TargetArea extends Container {
  private graphics: Graphics;
  private areaSize: number;
  public isOccupied: boolean = false;
  public occupiedBy: Container | null = null;

  constructor(options: TargetAreaOptions) {
    super();

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
  public isNearby(obj: Container, snapDistance?: number): boolean {
    const distance = snapDistance ?? this.areaSize / 2;
    const dx = obj.x - this.x;
    const dy = obj.y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= distance;
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
}