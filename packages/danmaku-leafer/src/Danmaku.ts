import { Leafer } from "leafer-ui";
import { Bullet } from "./Bullet";

export class Danmaku {
  app: Leafer;
  currentTime: number;
  waitingQueue: Array<Bullet>;
  finishedQueue: Array<Bullet>;
  timer = 0;

  _fireInterval: number;

  constructor(view: string) {
    this.app = new Leafer({ view });
    this.currentTime = 0;
    this.waitingQueue = [];
    this.finishedQueue = [];
    this._fireInterval = 500;
  }

  start() {
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.fire();
      this.currentTime += this._fireInterval;

    }, this._fireInterval);
  }

  pause() {
    clearInterval(this.timer);
  }

  fire() {
    for (const bullet of [...this.waitingQueue]) {
      if (bullet.ctime < this.currentTime) {
        bullet.display(this.app);
        this.waitingQueue.shift();
        this.finishedQueue.push(bullet);
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
    if (bullet.ctime < this.currentTime) {
      console.warn("Insert a expired bullet");
    }
    this.waitingQueue.push(bullet);
  }

  removeBullet(id: string) {
    this.finishedQueue = this.finishedQueue.filter(bullet => bullet._id !== id);
  }

  clearBullet() {
    this.finishedQueue.splice(0);
    this.waitingQueue.splice(0);
  }

}