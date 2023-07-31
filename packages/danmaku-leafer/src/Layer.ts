import { Leafer } from "leafer-ui";
import { Channel } from "./Channel";
import type { Bullet } from "./Bullet";
import { Mode } from "./Bullet";
import type { Danmaku } from "./Danmaku";

// export type BulletLayerName = "moving" | "steady";

export type BulletLayers = {
  [key in Mode]: Layer
}

interface ConstructorProps {
  name: string;
  instance?: Leafer;
  channelHeight?: number;
  host: Danmaku;
  bulletGap?: number;
}

export class Layer {
  name: string;
  instance: Leafer;
  channels: Channel[];
  channelHeight: number;
  host: Danmaku;
  bulletGap: number;

  constructor({
    name,
    instance,
    channelHeight = 20,
    host,
    bulletGap = 200
  }: ConstructorProps) {
    this.name = name;
    this.instance = instance || new Leafer();
    this.channelHeight = channelHeight;
    this.channels = [];
    this.host = host;
    this.bulletGap = bulletGap;
  }

  /**
   * Place the bullet in appropriate position.
   * In x axis, place it out of screen.
   * In y axis, place it in a spare channel
   *
   * @param bullet
   */
  placeBullet(bullet: Bullet) {
    const view = this.instance;
    let order: "order" | "reverse" = "order";

    // Calculate x axis position
    if (bullet.mode === Mode.Normal) {
      bullet.instance.x = view.width;
      console.log(view.width);
      order = "order";
    } else if (bullet.mode === Mode.Top) {
      bullet.instance.x = (view.width - bullet.instance.getBounds("content").width) / 2;
      order = "order";
    } else if (bullet.mode === Mode.Bottom) {
      bullet.instance.x = (view.width - bullet.instance.getBounds("content").width) / 2;
      order = "reverse";
    }

    // Calculate y axis position
    const target = this.channels.find(channel => {
      if (channel.bullets.length === 0) {
        return true;
      } else {
        const lastBullet = channel.bullets.slice(-1)[0];
        if (bullet.mode === Mode.Normal) {
          const distance = ((this.host.currentTime - lastBullet.ctime) / 1000) * 60 * lastBullet.speed;
          if (distance > this.bulletGap) {
            // TODO: provide speed bound calculate formula
            /* const screenWidth = this.host.app.getBounds("content").width;
            const speedBound = channel.lastBullet.speed / (1 - (this.host.currentTime - channel.lastBullet.ctime) * channel.lastBullet.speed / screenWidth);
            console.log(distance); */
            return true;
          }
        }
      }
      return false;
    });

    if (target) {
      target.pushBullet(bullet);
      bullet.instance.y = target.getPosition(order);
    } else {
      const newChannel = new Channel({ index: this.channels.length, host: this });
      this.channels.push(newChannel);
      newChannel.pushBullet(bullet);
      bullet.instance.y = newChannel.getPosition(order);
    }
  }
}