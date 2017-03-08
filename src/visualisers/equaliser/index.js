/*
 * Graphic Equaliser
 */
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

class Bar {
  /*
   * A bar in a graphic equaliser
   */
  constructor() {
    this.geometry = new BoxGeometry(1, 0.5, 10, 10, 10, 10);
    this.material = new MeshBasicMaterial({
      wireframe: false,
      morphTargets: true
    });
    this.bar = new Mesh(this.geometry, this.material);
  }

  setHeight(y) {
    this.bar.position.y = (y / 4);
    this.bar.scale.y = y;
  }

  setColour(v) {
    const r = ((v & 0b11100000) >> 5) / 7.0;
    const g = ((v & 0b00011100) >> 2) / 7.0;
    const b = (v & 0b00000011) / 3.0;
    this.bar.material.color.setRGB(r, g, b);
  }

}

/*
 * A graphic equaliser
 */
export class Equaliser {

  constructor(scene) {
    this.numBars = 32;
    this.bars = new Array();
    this.init(scene);
  }

  init(scene) {
    for (let i = 0; i < this.numBars; i++) {
      this.bars.push(new Bar(i));
      this.bars[i].bar.position.x = i * 2;
      scene.add(this.bars[i].bar);
    }
  }

  update(freqArray) {
    for (let i = 0; i < this.numBars; i++) {
      this.bars[i].setHeight((freqArray[i] / 4) + 1);
      this.bars[i].setColour(freqArray[i]);
    }
  }

}
