/*
 * Three.js Visualiser
 */
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { getAudioUrl, getNextVideo, getAudioStream } from  './api';
import { Equaliser } from './visualisers/equaliser';
import './index.scss';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / (window.innerHeight - 80), 0.1, 1000);
const renderer = new WebGLRenderer();

const loadButton = document.querySelector('#load');
const urlInput = document.querySelector('#url');
const audio = document.querySelector('audio');
audio.crossOrigin = 'anonymous';

const context = new (window.AudioContext || window.webkitAudioContext)();
const eq = new Equaliser(scene);
const analyser = context.createAnalyser();
analyser.fftSize = 32;
const source = context.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(context.destination);

let nextVideo = null;
let data = new Uint8Array(analyser.frequencyBinCount);

document.body.style.display = 'block';
renderer.setSize(window.innerWidth, window.innerHeight - 160);
document.body.appendChild(renderer.domElement);

camera.position.x = 32;
camera.position.y = 20;
camera.position.z = 50;

/*
 * Load audio into a buffer, and start playing.
 * Once playing get the next suggested video from YouTube.
 */
const loadSound = (id, url) => {

  if (!audio.paused) {
    audio.pause();
  }

  audio.src = url;
  audio.play();

  getNextVideo(id)
  .then((upNext) => {
    nextVideo = upNext;
    console.log('next video = ' + upNext);
  });
};

/*
 * On click get video audio stream.
 */
loadButton.onclick = () => {
  const id = urlInput.value.includes('youtube.com/watch') ?
             urlInput.value.split('watch?v=')[1].split('&')[0] :
             urlInput.value;
  getAudioUrl(id)
  .then((url) => loadSound(id, getAudioStream(url)));
};

/*
 * When audio has finished, load next song.
 * Only load next if we are not paused.
 */
audio.onended = () => {
  if (!audio.paused) {
    audio.pause();
  }
  getAudioUrl(nextVideo)
  .then((url) => loadSound(nextVideo, getAudioStream(url)));
};

/*
 * Render scene with camera.
 */
const render = () => {
  requestAnimationFrame(render);

  analyser.getByteFrequencyData(data);
  eq.update(data);

  renderer.render(scene, camera);
};

render();
