/*
 * Three.js Visualiser
 */
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { getAudioUrl, getNextVideo, getAudioStream } from  './api';
import { Equaliser } from './visualisers/equaliser';
import { CircleOfLife } from './visualisers/speaker';
import './index.scss';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / (window.innerHeight - 138), 0.1, 1000);
const renderer = new WebGLRenderer();

const loadButton = document.querySelector('.load');
const urlInput = document.querySelector('input');
const titleText = document.querySelector('video-title');
const nextButton = document.querySelector('.arrow-right');
const audio = document.querySelector('audio');
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

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
let autoplay = true;
let nextVideo = null;
let data = new Uint8Array(analyser.frequencyBinCount);

document.body.style.display = 'block';
renderer.setSize(window.innerWidth, window.innerHeight - 138);
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
 * Load next track.
 */
const nextAudio = () => {
  audio.paused ? audio : audio.pause();
  if (autoplay) {
    getAudioUrl(nextVideo)
    .then((data) => loadAudio(nextVideo, getAudioStream(data.url), data.title));
  }
};

/*
 * Grab video id from query param.
 */
const loadVideoUrl = () => {
  const videoId = window.location.href.split('id=');
  if (videoId.length > 1 && videoId[1].length === 11) {
    getAudioUrl(videoId[1])
    .then((data) => loadAudio(videoId[1], getAudioStream(data.url), data.title));
  }
};

/*
 * Get autoplay from query param.
 */
const loadAutoplay = () => {
  const autoParam = window.location.href.split('autoplay=');
  autoplay = !(autoParam.length > 1 && autoParam[1] === 'false');
};

/*
 * iOS seems to add a length of silence
 * at the end of the stream, so load next
 * track when we are passed half way.
 */
audio.ontimeupdate = () => {
  if (iOS && audio.currentTime > audio.duration / 2) {
    nextAudio();
  }
};

/*
 * On click get video audio stream.
 */
loadButton.onclick = () => {
  const re = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  const match = urlInput.value.match(re);

  if (match.length > 1) {
    getAudioUrl(match[1])
    .then((data) => loadAudio(match[1], getAudioStream(data.url), data.title));
  } else {
    window.alert('Not a valid YouTube URL');
  }
};

/*
 * When audio has finished, load next song.
 */
audio.onended = () => {
  nextAudio();
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
loadVideoUrl();
loadAutoplay();