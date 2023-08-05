import { AnimateEvent, IEventListenerId, App } from "leafer-ui";
import { Bullet } from "./Bullet";
import type { ConstructorProps as BulletConstructorProps } from "./Bullet";
import { Layer, BulletLayers } from "./Layer";
import { Mode } from "./Mode";

interface ConstructorProps {
  view: string;
  fireInterval?: number;
}

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

  private _state: "started" | "pause" | "stop";

  public get state() {
    return this._state;
  }

  private _timer: number;

  private _frameListener: IEventListenerId | null;

  private _bulletLayers: BulletLayers;

  private _waitingQueue: Array<Bullet>;
  private _flyingQueue: Set<Bullet>;
  private _finishedQueue: Array<Bullet>;

  private _fireInterval: number;

  public constructor({
    view,
    fireInterval = 500
  }: ConstructorProps) {
    this._app = new App({ view, type: "user" });
    this._currentTime = 0;
    this._state = "stop";
    this._fireInterval = fireInterval;
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

    this._state = "started";
  }

  public pause(): void {
    clearInterval(this._timer);
    if (this._frameListener) this._app.off_(this._frameListener);
    this._state = "pause";
  }

  /**
   * Reset all state of Danmaku, and clear all
   * bullets in screen, finally stop the app in initial time
   */
  public reset(): void {
    clearInterval(this._timer);
    if (this._frameListener) this._app.off_(this._frameListener);
    this._currentTime = 0;
    this.clearScreen();
    this._finishedQueue.forEach(bullet => bullet.destroy());

    this._state = "stop";
  }

  public destroy(): void {
    clearInterval(this._timer);
    if (this._frameListener) this._app.off_(this._frameListener);
    this._currentTime = 0;

    // this._flyingQueue.forEach(bullet => bullet.exit());

    this._app.destroy();
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
   * Load danmaku data before start, it will reset app,
   * all data passed will be sorted by `ctime`
   *
   * @param props Bullets to be loaded
   */
  public preloadBullets(props: Array<BulletConstructorProps>): Bullet[] {
    if (this._state === "started") this.reset();
    const newValue = props
      .sort((a, b) => a.ctime - b.ctime)
      .map(item => new Bullet(item));

    this._waitingQueue = newValue;
    return newValue;
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

  /**
   * Clear all bullets in screen at current time,
   * and move them from flying queue to finished
   * queue
   */
  public clearScreen(): void {
    this._flyingQueue.forEach(bullet => {
      bullet.exit();
    });
    this._finishedQueue = this._finishedQueue.concat(
      [...this._flyingQueue].sort((a, b) => a.ctime - b.ctime)
    );
    this._flyingQueue.clear();
  }
}