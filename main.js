(function () {
function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

/*
 * API functions
 */
const baseUrl = 'https://api.audiostream.world';

/*
 * Get a audio stream url for a video.
 * either video id or url can be specified.
 */
const getAudioUrl = (url) => {
  const streamUrl = `${baseUrl}/video/${url}`;
  return new Promise((resolve, reject) => {
    fetch(streamUrl)
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((err) => reject(err));
  });
};

/*
 * Get the next suggested video from YouTube.
 */
const getNextVideo = (id) => {
  const nextUrl = `${baseUrl}/video/${id}/next`;
  return new Promise((resolve, reject) => {
    fetch(nextUrl)
    .then((response) => response.json())
    .then((data) => resolve(data.id))
    .catch((err) => reject(err));
  });
};

/*
 * CORS proxy for audio stream url.
 */
const getAudioStream = (url) => `${baseUrl}/proxy/${url}`;

var Waveform = (analyser) => {
  const waveform = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatTimeDomainData(waveform)

  ;(function updateWaveform() {
    requestAnimationFrame(updateWaveform);
    analyser.getFloatTimeDomainData(waveform);
  })();

  const canvas = document.getElementById('visualiser');
  canvas.width = waveform.length;
  canvas.height = window.innerHeight - 138;
  const scopeContext = canvas.getContext('2d');(function drawOscilloscope() {
    requestAnimationFrame(drawOscilloscope);
    scopeContext.clearRect(0, 0, canvas.width, canvas.height);
    scopeContext.beginPath();
    for (let i = 0; i < waveform.length; i++) {
      const x = i;
      const y = (0.5 + waveform[i] / 2) * canvas.height;
      i == 0 ? scopeContext.moveTo(x, y) : scopeContext.lineTo(x, y);
    }
    scopeContext.stroke();
  })();
};

__$styleInject("/*\n * Visualiser Styles\n */\nbody {\n    margin: 0;\n    font-family: sans-serif;\n}\n\nheader {\n    display: flex;\n    height: 50px;\n    padding: 20px;\n    max-width: 800px;\n    margin: 0 auto;\n}\n\ncanvas {\n    width: 100%;\n    height: 80vh;\n}\n\naudio {\n    width: 100%;\n    bottom: 0;\n    left: 0;\n    position: fixed;\n    padding-top: 25px;\n}\n\nfooter {\n    width: 100%;\n    height: 130px;\n    bottom: 0;\n    position: absolute;\n    text-align: center;\n}\n\nfooter video-title {\n    height: 96px;\n    width: 96%;\n    color: black;\n    display: flex;\n    align-items: flex-end;\n    justify-content: center;\n    margin: 0px 10px 20px 10px;\n    bottom: 30px;\n    left: 0;\n    position: fixed;\n    z-index: 1;\n}\n\ncanvas {\n    z-index: 0;\n}\n\ninput {\n    flex: 100%;\n    height: 50px;\n    background: transparent;\n    outline: none;\n    border: none;\n    border-bottom: 1px solid black;\n    font-size: 1rem;\n    color: black;\n}\n\nbutton {\n    width: 90px;\n    height: 50px;\n    border: 1px solid black;\n    background: transparent;\n    font-size: .8rem;\n    color: black;\n    margin-left: 20px;\n    text-transform: uppercase;\n    outline: none;\n    cursor: pointer;\n}\n\nbutton:hover {\n    border: 2px solid white;\n    font-size: .85rem;\n}\n\nbutton:disabled {\n    color: grey;\n}\n\n\n.arrow-right {\n    cursor: pointer;\n    position: absolute;\n    top: 50%;\n    margin-top: -45px;\n    margin-left: -35px;\n    width: 60px;\n    height: 80px;\n    right: 3%;\n    opacity: 0.9;\n    border: none;\n}\n\n\n.arrow-right:hover {\n    border: none;\n}\n\npolyline {\n    transition: all 250ms ease-in-out;\n}\n\n.arrow-right:hover polyline,\n.arrow-right:focus polyline {\n    stroke-width: 4;\n}\n\n.arrow-right:active polyline {\n    stroke-width: 6;\n    transition: all 100ms ease-in-out;\n}",undefined);

// import { Equaliser } from './visualisers/equaliser';
// import { CircleOfLife } from './visualisers/speaker';
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

audio.onended = () => nextAudio();

/*
 * Load next visualiser.
 */
// nextButton.onclick = () => {
//   clearScene();
//   vision = (vision + 1) % visualisers.length;
//   visualisers[vision].init();
//   visualisers[vision].draw(scene);
// };

}());
