import { getAudioUrl, getNextVideo, getAudioStream } from  './api';
// import { Equaliser } from './visualisers/equaliser';
// import { CircleOfLife } from './visualisers/speaker';
import Waveform from './visualisers/waveform';
import './index.scss';

const loadButton = document.querySelector('.load');
const urlInput = document.querySelector('input');
const titleText = document.querySelector('video-title');
const nextButton = document.querySelector('.arrow-right');
const audio = document.querySelector('audio');
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// const visualisers = new Array();
const context = new (window.AudioContext || window.webkitAudioContext)();
const analyser = context.createAnalyser();
const source = context.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(context.destination);

Waveform(analyser);

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

audio.onended = () => nextAudio()

/*
 * Load next visualiser.
 */
// nextButton.onclick = () => {
//   clearScene();
//   vision = (vision + 1) % visualisers.length;
//   visualisers[vision].init();
//   visualisers[vision].draw(scene);
// };