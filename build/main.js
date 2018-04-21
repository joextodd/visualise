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

const canvas$1 = document.getElementById('visualiser');
const scopeContext$1 = canvas$1.getContext('2d');

var Waveform = {

  process: (data) => {
    scopeContext$1.clearRect(0, 0, canvas$1.width, canvas$1.height);
    scopeContext$1.beginPath();
    for (let x = 0; x < data.length; x++) {
      const y = (0.5 + data[x] / 2) * canvas$1.height;
      x == 0 ? scopeContext$1.moveTo(x, y) : scopeContext$1.lineTo(x, y);
    }
    scopeContext$1.stroke();
  }

};

__$styleInject("\nbody {\n    margin: 0;\n    font-family: sans-serif;\n}\n\ncanvas {\n    z-index: 0;\n    width: 100%;\n    height: 100vh;\n}\n\ninput {\n    flex: 100%;\n    height: 50px;\n    background: transparent;\n    outline: none;\n    border: none;\n    border-bottom: 1px solid black;\n    font-size: 1rem;\n    color: black;\n}\n\nbutton {\n    width: 90px;\n    height: 50px;\n    border: 1px solid black;\n    background: transparent;\n    font-size: .8rem;\n    color: black;\n    margin-left: 20px;\n    text-transform: uppercase;\n    outline: none;\n    cursor: pointer;\n}\n\nbutton:hover {\n    border: 2px solid white;\n    font-size: .85rem;\n}\n\nbutton:disabled {\n    color: grey;\n}",undefined);

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const context = new (window.AudioContext || window.webkitAudioContext)();
const canvas = document.getElementById('visualiser');
const scopeContext = canvas.getContext('2d');
const visualisers = new Array(Waveform);
let vIndex = 0;

navigator.mediaDevices.getUserMedia({ audio: true, video: false, echoCancellation: true })
.then(function (stream) {
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(0, 1, 1);
  const analyser = context.createAnalyser();

  source.connect(processor);
  source.connect(analyser);
  processor.connect(context.destination);

  canvas.width = analyser.frequencyBinCount;
  canvas.height = window.innerHeight;

  processor.onaudioprocess = function(e) {
    visualisers[vIndex].process(e.inputBuffer.getChannelData(0));
    e.outputBuffer.getChannelData(0).forEach((v) => v = 0);
  };
})
.catch((err) => window.alert(err));

canvas.onclick = () => {
  scopeContext.clearRect(0, 0, canvas.width, canvas.height);
  vIndex = (vIndex + 1) % visualisers.length;
  console.log('next visualiser');
};

}());
