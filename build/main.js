(function () {
function __$styleInject (css, returnValue) {
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

const canvas$1 = document.getElementById('visualiser');
const ctx = canvas$1.getContext('2d');
let pixelWidth = 0;

var Equaliser = {

  init: (analyser) => {
    pixelWidth = Math.ceil(window.innerWidth / analyser.frequencyBinCount);
    canvas$1.width = analyser.frequencyBinCount;
    canvas$1.height = window.innerHeight / 2;
    canvas$1.style.height = '50vh';
    ctx.clearRect(0, 0, canvas$1.width, canvas$1.height);
  },

  process: (analyser) => {
    const spectrum = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(spectrum);

    ctx.clearRect(0, 0, canvas$1.width, canvas$1.height);
    for (var i = 0; i < spectrum.length; i++) {
      ctx.fillRect(
        i * pixelWidth, window.innerHeight / 2 - spectrum[i],
        pixelWidth, window.innerHeight / 2
      );
    }
  },

};

const canvas$2 = document.getElementById('visualiser');
const ctx$1 = canvas$2.getContext('2d');
let offset = 0;

var Spectrum = {

  init: analyser => {
    canvas$2.width = window.innerWidth;
    canvas$2.height = analyser.frequencyBinCount;
    canvas$2.style.height = '100vh';
    ctx$1.clearRect(0, 0, canvas$2.width, canvas$2.height);
    offset = canvas$2.width;
  },

  process: analyser => {
    let spectrum = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(spectrum);

    const slice = ctx$1.getImageData(offset, 0, 1, canvas$2.height);
    for (let i = 0; i < spectrum.length; i++) {
      slice.data[4 * i + 0] = spectrum[spectrum.length - i];  // R
      slice.data[4 * i + 1] = spectrum[spectrum.length - i];  // G
      slice.data[4 * i + 2] = spectrum[spectrum.length - i];  // B
      slice.data[4 * i + 3] = 255;          // A
    }
    ctx$1.putImageData(slice, offset, 0);
    offset += 1;
    offset %= canvas$2.width;
  }

};

const canvas$3 = document.getElementById('visualiser');
const ctx$2 = canvas$3.getContext('2d');

var Waveform = {

  init: (analyser) => {
    const waveform = new Float32Array(analyser.frequencyBinCount);
    canvas$3.width = waveform.length;
    canvas$3.height = window.innerHeight;
    canvas$3.style.height = '100vh';
    ctx$2.clearRect(0, 0, canvas$3.width, canvas$3.height);
  },

  process: (analyser) => {
    const waveform = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatTimeDomainData(waveform);

    ctx$2.clearRect(0, 0, canvas$3.width, canvas$3.height);
    ctx$2.beginPath();
    for (let x = 0; x < waveform.length; x++) {
      const y = (0.5 + waveform[x] / 2) * canvas$3.height;
      x == 0 ? ctx$2.moveTo(x, y) : ctx$2.lineTo(x, y);
    }
    ctx$2.stroke();
  }

};

__$styleInject("\nbody {\n    margin: 0;\n    font-family: sans-serif;\n    width: 100%;\n    cursor: pointer;\n    background: #DBD5C9;\n}\n\ncanvas {\n    z-index: 0;\n    width: 100%;\n    height: 100vh;\n}\n\ninput {\n    flex: 100%;\n    height: 50px;\n    background: transparent;\n    outline: none;\n    border: none;\n    border-bottom: 1px solid black;\n    font-size: 1rem;\n    color: black;\n}\n\nbutton {\n    position: absolute;\n    top: calc(50% - 25px);\n    left: calc(50% - 60px);\n    width: 120px;\n    height: 50px;\n    border: 1px solid black;\n    background: transparent;\n    font-size: .8rem;\n    color: black;\n    text-transform: uppercase;\n    outline: none;\n    cursor: pointer;\n}\n\nbutton:hover {\n    border: 2px solid white;\n    color: white;\n    font-size: .85rem;\n}\n\nbutton:disabled {\n    color: grey;\n}",undefined);

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const canvas = document.getElementById('visualiser');
const visualisers = new Array(Waveform, Equaliser, Spectrum);
isSafari ? visualisers.shift() : visualisers;
let vIndex = 0;
let analyser;

navigator.mediaDevices.getUserMedia({ audio: true, video: false, echoCancellation: true })
.then(function (stream) {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const processor = context.createScriptProcessor(0, 1, 1);
  const source = context.createMediaStreamSource(stream);
  analyser = context.createAnalyser();

  source.connect(processor);
  source.connect(analyser);
  processor.connect(context.destination);

  visualisers[vIndex].init(analyser);
  processor.onaudioprocess = function(e) {
    visualisers[vIndex].process(analyser);
    e.outputBuffer.getChannelData(0).forEach((v) => v = 0);
  };
})
.catch(err => window.alert(err));

const next = () => {
  vIndex = (vIndex + 1) % visualisers.length;
  visualisers[vIndex].init(analyser);
};

document.body.onclick = e => next();

}());
