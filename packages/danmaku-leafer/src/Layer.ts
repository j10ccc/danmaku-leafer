import { Leafer } from "leafer-ui";
import { Channel } from "./Channel";
import type { Bullet } from "./Bullet";
import { Mode } from "./Bullet";
import type { Danmaku } from "./Danmaku";

export type BulletLayers = {
  [key in Mode]: Layer
}

interface ConstructorProps extends Partial<Layer> {
  name: string;
  instance: Leafer;
  channelHeight?: number;
  host: Danmaku;
  bulletGap?: number;
}

export class Layer {
  private _name: string;

  public get name(): string {
    return this._name;
  }

  private _instance: Leafer;

  private _channelHeight: number;

  public get channelHeight(): number {
    return this._channelHeight;
  }

  private _bulletGap: number;

  public get bulletGap(): number {
    return this._bulletGap;
  }

  private _channels: Channel[];

  public get channels(): readonly Channel[] {
    return this._channels;
  }

  private _host: Danmaku;

  constructor({
    name,
    instance,
    channelHeight = 20,
    host,
    bulletGap = 200
  }: ConstructorProps) {
    this._name = name;
    this._instance = instance;
    this._channelHeight = channelHeight;
    this._bulletGap = bulletGap;
    this._channels = [];
    this._host = host;
  }

  public getBounds() {
    return { width: this._instance.width, height: this._instance.height };
  }

  /**
   * Place the bullet in appropriate position,
   * and place it to stage.
   * In x axis, place it out of screen.
   * In y axis, place it in a spare channel.
   *
   * @param bullet
   */
  public placeBullet(bullet: Bullet): void {
    const view = this._instance;
    let order: "order" | "reverse" = "order";

    // Calculate x axis position
    if (bullet.mode === Mode.Normal) {
      bullet.setPosition({ x: view.width });
      order = "order";
    } else if (bullet.mode === Mode.Top) {
      bullet.setPosition({ x: (view.width - bullet.getBounds().width) / 2 });
      order = "order";
    } else if (bullet.mode === Mode.Bottom) {
      bullet.setPosition({ x: (view.width - bullet.getBounds().width) / 2 });
      order = "reverse";
    }

    // Calculate y axis position
    const target = this.channels.find(channel => {
      if (channel.bullets.length === 0) {
        return true;
      } else {
        const lastBullet = channel.bullets.slice(-1)[0];
        if (bullet.mode === Mode.Normal) {
          const distance = ((this._host.currentTime - lastBullet.ctime) / 1000) * 60 * lastBullet.speed;
          if (distance > this.bulletGap) {
            return true;
          }
        }
      }
      return false;
    });

    if (target) {
      target.pushBullet(bullet);
      bullet.setPosition({ y: target.getPosition(order) });
    } else {
      const newChannel = new Channel({ index: this.channels.length, host: this });
      this._channels.push(newChannel);
      newChannel.pushBullet(bullet);
      bullet.setPosition({ y: newChannel.getPosition(order) });
    }

    this._instance.add(bullet.instance);
  }

  /**
   * Remove bullet from stage
   * @param bullet
   */
  public removeBullet(bullet: Bullet): void {
    this._instance.remove(bullet.instance);
  }
}