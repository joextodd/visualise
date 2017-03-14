/*
 * Three.js Visualiser
 */
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { getAudioUrl, getNextVideo, getAudioStream } from  './api';
import { Equaliser } from './visualisers/equaliser';
import { CircleOfLife } from './visualisers/speaker';
import './index.scss';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / (window.innerHeight - 125), 0.1, 1000);
const renderer = new WebGLRenderer();

const loadButton = document.querySelector('.load');
const urlInput = document.querySelector('input');
const titleText = document.querySelector('video-title');
const nextButton = document.querySelector('.arrow-right');
const audio = document.querySelector('audio');

const context = new (window.AudioContext || window.webkitAudioContext)();
const visualisers = new Array();
const analyser = context.createAnalyser();
analyser.fftSize = 64;
const source = context.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(context.destination);

visualisers.push(new CircleOfLife());
visualisers.push(new Equaliser());

let vision = 0;
let nextVideo = null;
let data = new Uint8Array(analyser.frequencyBinCount);

document.body.style.display = 'block';
renderer.setSize(window.innerWidth, window.innerHeight - 125);
document.body.appendChild(renderer.domElement);

camera.position.x = 32;
camera.position.y = 20;
camera.position.z = 50;

visualisers[vision].draw(scene);

/*
 * Load audio into a buffer, and start playing.
 * Once playing get the next suggested video from YouTube.
 */
const loadAudio = (id, url, title) => {

  audio.paused ? audio : audio.pause();
  audio.src = url;
  audio.play();

  titleText.innerHTML = title;

  getNextVideo(id)
  .then((upNext) => {
    nextVideo = upNext;
  });
};

/*
 * On click get video audio stream.
 */
loadButton.onclick = () => {
  const id = urlInput.value.indexOf('youtube.com/watch') >= 0 ?
             urlInput.value.split('watch?v=')[1].split('&')[0] :
             urlInput.value;
  getAudioUrl(id)
  .then((data) => loadAudio(id, getAudioStream(data.url), data.title));
};

/*
 * When audio has finished, load next song.
 * Only load next if we are not paused.
 */
audio.onended = () => {
  audio.paused ? audio : audio.pause();
  getAudioUrl(nextVideo)
  .then((data) => loadAudio(nextVideo, getAudioStream(data.url), data.title));
};

/*
 * Load next visualiser.
 */
nextButton.onclick = () => {
  clearScene();
  vision = (vision + 1) % visualisers.length;
  visualisers[vision].init();
  visualisers[vision].draw(scene);
};

/*
 * Clear the scene.
 */
const clearScene = () => {
  for (var i = scene.children.length - 1; i >= 0; i--) {
    scene.remove(scene.children[i]);
  }
};

/*
 * Render scene with camera.
 */
const render = () => {
  requestAnimationFrame(render);

  analyser.getByteFrequencyData(data);
  visualisers[vision].update(data);

  renderer.render(scene, camera);
};

render();
