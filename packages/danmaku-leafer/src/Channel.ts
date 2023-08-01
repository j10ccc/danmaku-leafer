import { Bullet } from "./Bullet";
import type { Layer } from "./Layer";

interface ConstructorProps extends Partial<Channel> {
  index: number;
  host: Layer;
};

/**
 * Channel is a virtual tool to help address bullet in y axis.
 */
export class Channel {
  private _index: number;

  /** Index is used to address the channel in layer */
  public get index(): number {
    return this._index;
  }

  private _bullets: Bullet[];

  /** Bullets existing in the channel */
  public get bullets(): readonly Bullet[] {
    return this._bullets;
  }

  /** Host layer */
  private _host: Layer;

  public constructor({
    index,
    host
  }: ConstructorProps) {
    this._index = index;
    this._host = host;
    this._bullets = [];
  }

  /**
   * Get channel position in y axis
   */
  public getPosition(order: "order" | "reverse") {
    const height = this._host.channelHeight;
    const view = this._host.instance;
    const capacity = Math.floor(view.height / height);
    let y = 0;
    if (order === "order") {
      y = (this.index % capacity) * height;
    } else {
      y = (capacity - 1 - this.index % capacity) * height;
    }

    return y;
  }

  public pushBullet(bullet: Bullet) {
    this._bullets.push(bullet);
    bullet.channel = this;
  }

  public shiftBullet() {
    this._bullets.shift();
  }
}