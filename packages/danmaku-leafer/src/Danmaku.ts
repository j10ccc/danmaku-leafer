import { AnimateEvent, IEventListenerId, App } from "leafer-ui";
import { Bullet } from "./Bullet";
import type { ConstructorProps as BulletConstructorProps } from "./Bullet";
import { Layer, BulletLayers } from "./Layer";
import { Mode } from "./Mode";

export class Danmaku {
  private _app: App;
  private _currentTime: number;

  /** Time(ms) in time line */
  public get currentTime(): number {
    return this._currentTime;
  }

  public set currentTime(value: number) {
    this._currentTime = value;
  }

  private _timer: number;

  private _frameListener: IEventListenerId | null;

  private _bulletLayers: BulletLayers;

  private _waitingQueue: Array<Bullet>;
  private _flyingQueue: Set<Bullet>;
  private _finishedQueue: Array<Bullet>;

  private _fireInterval: number;

  public constructor(view: string) {
    this._app = new App({ view, type: "user" });
    this._currentTime = 0;
    this._fireInterval = 500;
    this._frameListener = null;
    this._timer = 0;

    this._waitingQueue = [];
    this._flyingQueue = new Set<Bullet>();
    this._finishedQueue = [];

    this._bulletLayers = {
      [Mode.Normal]: new Layer({ name: Mode.Normal, host: this, instance: this._app.addLeafer()}),
      [Mode.Top]: new Layer({ name: Mode.Top, host: this, instance: this._app.addLeafer()}),
      [Mode.Bottom]: new Layer({ name: Mode.Bottom, host: this, instance: this._app.addLeafer()}),
    };
  }

  /**
   * Start time line and all animation
   * in danmaku app
   */
  public start(): void {
    clearInterval(this._timer);

    // The unique frame event
    // Execute animate action of items in flying queue
    // Then check if animate end, if it is, move to finished queue
    this._frameListener = this._app.on_(AnimateEvent.FRAME, () => {
      [...this._flyingQueue].forEach(item => {
        const shouldFinish = item.animate(this.currentTime);
        if (shouldFinish) {
          this._flyingQueue.delete(item);
          this._finishedQueue.push(item);
          item.exit();
        }
      });
    });

    // check waitingQueue
    this._timer = setInterval(() => {
      this.fire();
      this._currentTime += this._fireInterval;
    }, this._fireInterval);
  }

  public pause(): void {
    clearInterval(this._timer);
    if (this._frameListener) this._app.off_(this._frameListener);
  }

  /**
   * Fire ready bullets in waiting queue
   */
  public fire(): void {
    for (const bullet of [...this._waitingQueue]) {
      if (bullet.ctime < this.currentTime) {
        bullet.fire(this._bulletLayers);
        this._waitingQueue.shift();
        this._flyingQueue.add(bullet);
      } else {
        break;
      }
    }
  }

  /**
   * Load danmaku data before start, It will
   * sort all data by `ctime`
   *
   * @param bullets
   */
  public preloadBullets(props: Array<BulletConstructorProps>): void {
    this._waitingQueue = props
      .sort((a, b) => a.ctime - b.ctime)
      .map(item => new Bullet(item));
  }

  /**
   * Insert a bullet to waitingQueue, it will
   * display after a `_fireInterval` time
   * @param props Base properties of a bullet
   */
  public insertBullet(props: Omit<BulletConstructorProps, "ctime">): Bullet {
    const newValue = new Bullet({
      ctime: this._currentTime + this._fireInterval,
      ...props
    });
    this._waitingQueue.push(newValue);
    return newValue;
  }

  /**
   * Delete a bullet in stage
   *
   * @param bullet The bullet
   */
  public deleteBullet(bullet: Bullet): void {
    // TODO: Find and remove it from three queues
    bullet.exit();
  }

  public clearBullet(): void {
    this._finishedQueue.splice(0);
    this._waitingQueue.splice(0);
  }

}