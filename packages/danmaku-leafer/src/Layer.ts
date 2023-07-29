import { Leafer } from "leafer-ui";

export type BulletLayerName = "moving" | "steady";

export type BulletLayers = {
  [key in BulletLayerName]: Layer
}

interface ConstructorProps {
  name: string;
  instance?: Leafer;
}

export class Layer {
  name: string;
  instance: Leafer;

  constructor({ name, instance }: ConstructorProps) {
    this.name = name;
    this.instance = instance || new Leafer();
  }
}