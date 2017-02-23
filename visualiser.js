/*
 * Three.js Visualiser
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight - 140), 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);
const loader = new THREE.AudioLoader();

let url = 'https://s3-eu-west-1.amazonaws.com/joextodd/media/test.mp3';
const playButton = document.querySelector('#play');

renderer.setSize(window.innerWidth, window.innerHeight - 160);
document.body.appendChild(renderer.domElement);

camera.position.x = 32;
camera.position.y = 20;
camera.position.z = 50;

camera.add(listener);

/*
 * A bar in a graphic equaliser
 */
class Bar {

  constructor(y) {
    this.geometry = new THREE.BoxGeometry(1, 0.5, 10, 10, 10, 10);
    this.material = new THREE.MeshNormalMaterial({
      wireframe: false,
      morphTargets: true
    });
    this.bar = new THREE.Mesh(this.geometry, this.material);
  }

  setHeight(y) {
    this.bar.position.y = (y / 4);
    this.bar.scale.y = y;
  }

}

/*
 * A graphic equaliser
 */
class Equaliser {

  constructor() {
    this.numBars = 32;
    this.bars = new Array();
    this.init();
  }

  init() {
    for (let i = 0; i < this.numBars; i++) {
      this.bars.push(new Bar(i * 2));
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

/*
 * Load sound
 */
loader.load(url, (buffer) => {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();

  playButton.disabled = false;
  playButton.innerHTML = 'Pause';
});

playButton.onclick = () => {
  if (sound.isPlaying) {
    sound.pause();
    playButton.innerHTML = 'Play';
  } else {
    sound.play();
    playButton.innerHTML = 'Pause';
  }
}

const eq = new Equaliser();
const analyser = new THREE.AudioAnalyser(sound, eq.numBars * 2);

/*
 * Render scene with camera.
 */
const render = () => {
  requestAnimationFrame(render);

  analyser.getFrequencyData();
  eq.update(analyser.data);

  renderer.render(scene, camera);
}

render();