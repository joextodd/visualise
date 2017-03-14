/*
 * Graphic Equaliser
 */
import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three';

class Bar {
  /*
   * A bar in a graphic equaliser
   */
  constructor() {
    this.geometry = new BoxGeometry(1, 0.5, 10, 10, 10, 10);
    this.material = new MeshNormalMaterial({
      wireframe: false,
      morphTargets: true
    });
    this.bar = new Mesh(this.geometry, this.material);
  }

  setHeight(y) {
    this.bar.position.y = (y / 4);
    this.bar.scale.y = y;
  }

}

/*
 * A graphic equaliser
 */
export class Equaliser {

  constructor() {
    this.numBars = 32;

    this.init();
  }

  init() {
    this.bars = new Array();
    for (let i = 0; i < this.numBars; i++) {
      this.bars.push(new Bar(i));
    }
  }

  draw(scene) {
    for (let i = 0; i < this.numBars; i++) {
      this.bars[i].bar.position.x = i * 2;
      scene.add(this.bars[i].bar);
    }
  }

  update(freqArray) {
    for (let i = 0; i < this.numBars; i++) {
      this.bars[i].setHeight((freqArray[i] / 4) + 1);
    }
  }

}
