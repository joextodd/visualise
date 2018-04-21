import Waveform from './visualisers/waveform';
import './index.scss';

const context = new (window.AudioContext || window.webkitAudioContext)()
const canvas = document.getElementById('visualiser')
const scopeContext = canvas.getContext('2d')
const visualisers = new Array(Waveform)
let vIndex = 0

navigator.mediaDevices.getUserMedia({ audio: true, video: false, echoCancellation: true })
.then(function (stream) {
  const source = context.createMediaStreamSource(stream)
  const processor = context.createScriptProcessor(0, 1, 1)
  const analyser = context.createAnalyser()

  source.connect(processor)
  source.connect(analyser)
  processor.connect(context.destination)

  canvas.width = analyser.frequencyBinCount
  canvas.height = window.innerHeight

  processor.onaudioprocess = function(e) {
    visualisers[vIndex].process(e.inputBuffer.getChannelData(0))
    e.outputBuffer.getChannelData(0).forEach((v) => v = 0)
  }
})
.catch((err) => window.alert(err))

canvas.onclick = () => {
  scopeContext.clearRect(0, 0, canvas.width, canvas.height)
  vIndex = (vIndex + 1) % visualisers.length
  console.log('next visualiser')
}