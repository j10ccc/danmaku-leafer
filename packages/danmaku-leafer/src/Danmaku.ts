import { AnimateEvent, IEventListenerId, App } from "leafer-ui";
import { Bullet } from "./Bullet";
import { Layer, BulletLayers } from "./Layer";

export class Danmaku {
  app: App;
  currentTime: number;
  waitingQueue: Array<Bullet>;
  flyingQueue: Set<Bullet>;
  finishedQueue: Array<Bullet>;
  timer: number;
  event: IEventListenerId | null;

  bulletLayers: BulletLayers;

  _fireInterval: number;

  constructor(view: string) {
    this.app = new App({ view, type: "user" });
    this.currentTime = 0;
    this.waitingQueue = [];
    this.flyingQueue = new Set<Bullet>();
    this.finishedQueue = [];
    this._fireInterval = 500;
    this.event = null;
    this.timer = 0;

    this.bulletLayers = {
      1: new Layer({ name: "Normal", host: this, instance: this.app.addLeafer()}),
      2: new Layer({ name: "Top", host: this, instance: this.app.addLeafer()}),
      3: new Layer({ name: "Bottom", host: this, instance: this.app.addLeafer()}),
    };
  }

  start() {
    clearInterval(this.timer);

    // The unique frame event
    // Execute animate action of items in flying queue
    // Then check if animate end, if it is, move to finished queue
    this.event = this.app.on_(AnimateEvent.FRAME, () => {
      [...this.flyingQueue].forEach(item => {
        const shouldFinish = item.animate(this.currentTime);
        if (shouldFinish) {
          this.flyingQueue.delete(item);
          this.finishedQueue.push(item);
          item.exit(this.bulletLayers);
        }
      });
    });

    // check waitingQueue
    this.timer = setInterval(() => {
      this.fire();
      this.currentTime += this._fireInterval;
    }, this._fireInterval);
  }

  pause() {
    clearInterval(this.timer);
    if (this.event) this.app.off_(this.event);
  }

  /**
   * Fire ready bullets in waiting queue
   */
  fire() {
    for (const bullet of [...this.waitingQueue]) {
      if (bullet.ctime < this.currentTime) {
        bullet.fire(this.bulletLayers);
        this.waitingQueue.shift();
        this.flyingQueue.add(bullet);
      } else {
        break;
      }
    }
  }

  resetCurrentTime(time = 0) {
    this.currentTime = time;
  }

  preloadBullets(bullets: Bullet[]) {
    this.waitingQueue = bullets.sort((a, b) => a.ctime - b.ctime);
  }

  insertBullets(bullet: Bullet) {
    if (bullet.ctime > this.currentTime) {
      this.waitingQueue.push(bullet);
    } else {
      this.finishedQueue.push(bullet);
    }
  }

  removeBullet(id: string) {
    this.finishedQueue = this.finishedQueue.filter(bullet => bullet.id !== id);
  }

  clearBullet() {
    this.finishedQueue.splice(0);
    this.waitingQueue.splice(0);
  }

}