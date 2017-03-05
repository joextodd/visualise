/*
 * Three.js Visualiser
 */
import { Scene, PerspectiveCamera, WebGLRenderer, AudioListener, Audio, AudioLoader, AudioAnalyser } from 'three';
import { getAudioUrl, getAudioStream } from  './api';
import { Equaliser } from './visualisers/equaliser';
import './index.scss';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / (window.innerHeight - 140), 0.1, 1000);
const renderer = new WebGLRenderer();
const listener = new AudioListener();
const sound = new Audio(listener);
const loader = new AudioLoader();

const playButton = document.querySelector('#play');
const loadButton = document.querySelector('#load');
const urlInput = document.querySelector('#url');

document.body.style.display = 'block';
renderer.setSize(window.innerWidth, window.innerHeight - 160);
document.body.appendChild(renderer.domElement);

camera.position.x = 32;
camera.position.y = 20;
camera.position.z = 50;

camera.add(listener);

const loadSound = (url) => {
  loader.load(url, (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();

    playButton.disabled = false;
    playButton.innerHTML = 'Pause';
  });
};

loadButton.onclick = () => {
  const url = urlInput.value.includes('youtube.com/watch') ?
              urlInput.value.split('watch?v=')[1] :
              urlInput.value;
  getAudioUrl(url)
  .then((url) => loadSound(getAudioStream(url)));
};

playButton.onclick = () => {
  if (sound.isPlaying) {
    sound.pause();
    playButton.innerHTML = 'Play';
  } else {
    sound.play();
    playButton.innerHTML = 'Pause';
  }
};

const eq = new Equaliser(scene);
const analyser = new AudioAnalyser(sound, eq.numBars * 2);

/*
 * Render scene with camera.
 */
const render = () => {
  requestAnimationFrame(render);

  analyser.getFrequencyData();
  eq.update(analyser.data);

  renderer.render(scene, camera);
};

render();
