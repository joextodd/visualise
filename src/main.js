import Equaliser from './visualisers/equaliser'
import Spectrum from './visualisers/spectrum'
import Waveform from './visualisers/waveform'
import './index.scss'

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
const context = new (window.AudioContext || window.webkitAudioContext)()
const canvas = document.getElementById('visualiser')
const visualisers = new Array(Waveform, Equaliser, Spectrum)
isSafari ? visualisers.shift() : visualisers
let vIndex = 0

const processor = context.createScriptProcessor(0, 1, 1)
const analyser = context.createAnalyser()

navigator.mediaDevices.getUserMedia({ audio: true, video: false, echoCancellation: true })
.then(function (stream) {
  const source = context.createMediaStreamSource(stream)
  source.connect(processor)
  source.connect(analyser)
  processor.connect(context.destination)

  visualisers[vIndex].init(analyser)
  processor.onaudioprocess = function(e) {
    visualisers[vIndex].process(analyser)
    e.outputBuffer.getChannelData(0).forEach((v) => v = 0)
  }
})
.catch((err) => window.alert(err))

document.body.onclick = () => {
  vIndex = (vIndex + 1) % visualisers.length
  visualisers[vIndex].init(analyser)
}