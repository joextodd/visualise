/*
 * Music of Spheres
 */
import { RingGeometry, Mesh, MeshBasicMaterial } from 'three';

class Circle {
  /*
   * A sphere
   */
  constructor(r) {
    this.geometry = new RingGeometry(r - 1, r, 32);
    this.material = new MeshBasicMaterial({
      wireframe: false,
      morphTargets: true,
      color: 0xffff00
    });
    this.circle = new Mesh(this.geometry, this.material);
  }

  setColour(v) {
    const r = ((v & 0b11100000) >> 5) / 7.0;
    const g = ((v & 0b00011100) >> 2) / 7.0;
    const b = (v & 0b00000011) / 3.0;
    this.circle.material.color.setRGB(r, g, b);
  }

}

/*
 * Circle of Life Visualiser
 */
export class CircleOfLife {

  constructor() {
    this.numBins = 32;
    this.init();
  }

  init() {
    this.circles = new Array();
    for (let i = 0; i < this.numBins; i++) {
      this.circles.push(new Circle(i + 5));
    }
  }

  draw(scene) {
    for (let i = 0; i < this.numBins; i++) {
      this.circles[i].circle.position.x = 32;
      this.circles[i].circle.position.y = 20;
      scene.add(this.circles[i].circle);
    }
  }

  update(freqArray) {
    for (let i = 0; i < this.numBins; i++) {
      this.circles[i].setColour(freqArray[i]);
    }
  }

}
