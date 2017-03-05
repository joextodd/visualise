/*
 * Three.js Visualiser
 */
import { Scene, PerspectiveCamera, WebGLRenderer, AudioListener, Audio, AudioLoader, AudioAnalyser } from 'three';
import { getAudioUrl, getNextVideo, getAudioStream } from  './api';
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

let nextVideo = null;

document.body.style.display = 'block';
renderer.setSize(window.innerWidth, window.innerHeight - 160);
document.body.appendChild(renderer.domElement);

camera.position.x = 32;
camera.position.y = 20;
camera.position.z = 50;

camera.add(listener);

/*
 * Load audio into a buffer, and start playing.
 * Once playing get the next suggested video from YouTube.
 */
const loadSound = (id, url) => {
  if (sound.isPlaying) {
    sound.stop();
  }
  loader.load(url, (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(0.5);
    sound.play();

    playButton.disabled = false;
    playButton.innerHTML = 'Pause';

    getNextVideo(id)
    .then((id) => {
      nextVideo = id;
      console.log('next video = ' + id);
    });
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
sound.onEnded = () => {
  if (playButton.innerHTML === 'Pause') {
    sound.stop();
    getAudioUrl(nextVideo)
    .then((url) => loadSound(nextVideo, getAudioStream(url)));
  }
};

/*
 * Play/Pause audio.
 */
playButton.onclick = () => {
  if (sound.isPlaying) {
    sound.pause();
    playButton.innerHTML = 'Play';
  } else {
    sound.play();
    playButton.innerHTML = 'Pause';
  }
};

/*
 * Set up visualiser.
 */
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
