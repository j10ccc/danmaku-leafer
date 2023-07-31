import { Group } from "leafer-ui";
import { Bullet } from "./Bullet";
import type { Layer } from "./Layer";

interface ConstructorProps {
  index: number;

  /** Host layer */
  host: Layer;
};

/**
 * Channel is a virtual tool to help address bullet in y axis.
 */
export class Channel {
  index: number;
  bullets: Bullet[];
  // lastBullet?: Bullet;
  host: Layer;

  constructor({
    index,
    host
  }: ConstructorProps) {
    this.index = index;
    this.host = host;
    this.bullets = [];
  }

  /**
   * Get channel position in y axis
   */
  getPosition(order: "order" | "reverse") {

    const height = this.host.channelHeight;
    const view = this.host.instance;
    const capacity = Math.floor(view.height / height);

    let y = 0;

    if (order === "order") {
      y = (this.index % capacity) * height;
    } else {
      y = (capacity - 1 - this.index % capacity) * height;
    }

    return y;
  }

  pushBullet(bullet: Bullet) {
    this.bullets.push(bullet);
    bullet.channel = this;
  }

  shiftBullet() {
    this.bullets.shift();
  }
}