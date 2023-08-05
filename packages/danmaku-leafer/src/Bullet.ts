import { Text } from "leafer-ui";
import { nanoid } from "nanoid";
import { Channel } from "./Channel";
import type { BulletLayers } from "./Layer";
import { Mode } from "./Mode";

export interface ConstructorProps extends Partial<Bullet> {
  text: string;
  ctime: number;
  residenceTime?: number;
  mode?: Mode;
  fontSize?: number;
  fontFamily?: string;
};

export class Bullet {
  private _id: string;

  public get id(): string {
    return this._id;
  }

  private _residenceTime: number;

  /** Time(ms) bullet residents in layer, only apply for Top/Bottom Mode */
  public get residenceTime(): number {
    return this._residenceTime;
  }

  private _mode: Mode;

  /** Bullet position preset */
  public get mode(): Mode {
    return this._mode;
  }

  /** Leafer Text instance */
  private _instance: Text;

  public get instance(): Text {
    return this._instance;
  }

  private _ctime: number;

  /** Time bullet creates in time line */
  public get ctime(): number {
    return this._ctime;
  }

  private _fontSize: number;

  public get fontSize(): number {
    return this._fontSize;
  }

  private _fontFamily: string;

  public get fontFamily(): string {
    return this._fontFamily;
  }

  private _text: string;

  public get text(): string {
    return this._text;
  }

  public color: string;

  public opacity: number;

  /** The distance bullet moves in one frame */
  public speed: number;

  public channel: Channel | null;

  public constructor({
    mode = Mode.Normal,
    residenceTime = 3000,
    text,
    color = "rgb(0, 0, 0)",
    opacity = .8,
    ctime,
    fontSize = 16,
    fontFamily = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"",
    speed = 2,
  }: ConstructorProps) {
    this._id = nanoid();
    this._mode = mode;
    this._residenceTime = residenceTime;
    this._fontSize = fontSize;
    this._fontFamily = fontFamily;
    this._ctime = ctime;
    this._text = text;
    this._instance = new Text({
      fill: color,
      text,
      opacity,
      fontSize,
      fontFamily
    });

    this.color = color;
    this.opacity = opacity;
    this.speed = speed;
    this.channel = null;
  }

  public set(props: Partial<Bullet>): void {
    this._instance.set({
      fill: props.color ?? this.color,
      opacity: props.opacity ?? this.opacity
    });
  }

  public setPosition(props: { x?: number, y?: number }): void {
    this._instance.set(props);
  }

  public getBounds() {
    return this._instance.getBounds("content");
  }

  /**
   * Place the bullet and add bullet to appropriate
   * layer, layer depends on mode
   *
   * @param layers layers
   */
  public fire(layers: BulletLayers): void {
    const layer = layers[this._mode];
    layer.placeBullet(this);
  }

  public destroy(): void {
    this._instance.destroy();
  }

  /**
   * Bullet animate action
   *
   * @param currentTime
   *
   * @returns should animate end
   */
  public animate(currentTime: number): boolean {
    if (this._mode === Mode.Normal) {
      this._instance.move(-1 * this.speed, 0);
      const textWidth = this._instance.getBounds("content", "inner").width;
      if (this._instance.x + textWidth < 0) {
        return true;
      } else return false;
    } else if (this._mode === Mode.Bottom || this._mode === Mode.Top) {
      // Pinned bullet should't move, it display few seconds and exit
      if (currentTime - this.ctime < this._residenceTime) return false;
      else return true;
    } else {
      return false;
    }
  }

  /**
   * Exit from the view it exits
   * @param layers
   */
  public exit(): void {
    this.channel?.shiftBullet();
  }
}
