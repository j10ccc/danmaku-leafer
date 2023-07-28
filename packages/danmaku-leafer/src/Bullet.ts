import { Group, Text, Rect } from "leafer-ui";
import { nanoid } from "nanoid";

export enum Mode {
  Normal = 1,
  Top,
  Bottom,
}

interface ConstructorProps extends Partial<Bullet> {};

export class Bullet {
  _id: string;

  text: string;
  color: string;
  opacity: number;
  mode: Mode;
  ctime: number;
  fontSize: number;
  rotate: number;
  speed: number;
  _pinnedResidenceTime: number;

  instance: Text;

  constructor({
    text = "",
    color = "rgb(0, 0, 0)",
    opacity = 0,
    mode = Mode.Normal,
    ctime = 0,
    fontSize = 16,
    rotate = 0,
    speed = 1,
    _pinnedResidenceTime = 3000
  }: ConstructorProps) {
    this._id = nanoid();

    this.text = text;
    this.color = color;
    this.opacity = opacity;
    this.mode = mode;
    this.ctime = ctime;
    this.fontSize = fontSize;
    this.rotate = rotate;
    this.speed = speed;
    this._pinnedResidenceTime = 3000;

    this.instance = new Text({
      fill: color,
      text
    });

  }


  /**
   * Fire the bullet
   *
   * Place the bullet and add bullet to app
   *
   * @param view leafer app
   */
  fire(view: Group) {
    // place out of screen
    if (this.mode === Mode.Normal) {
      this.instance.x = view.width;
      this.instance.y = 0;
    } else if (this.mode === Mode.Top) {
      this.instance.x = (view.width - this.instance.getBounds("content").width) / 2;
      this.instance.y = 0;
    } else if (this.mode === Mode.Bottom) {
      this.instance.x = (view.width - this.instance.getBounds("content").width) / 2;
      this.instance.y = view.height - this.instance.getBounds("content").height;
    }

    view.add(this.instance);
    console.log("display bullet: ", this.text);
  }

  /**
   * Bullet animate action
   *
   * @params currentTime
   *
   * @returns should animate end
   */
  animate(currentTime: number): boolean {
    if (this.mode === Mode.Normal) {
      this.instance.move(-2, 0);
      const textWidth = this.instance.getBounds("content", "inner").width;
      if (this.instance.x + textWidth < 0) {
        return true;
      } else return false;
    } else if (this.mode === Mode.Bottom || this.mode === Mode.Top) {
      // Pinned bullet should't move, it display few seconds and exit
      if (currentTime - this.ctime < this._pinnedResidenceTime) return false;
      else return true;
    } else {
      return false;
    }
  }
}
