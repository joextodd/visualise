import Equaliser from './visualisers/equaliser'
import Spectrum from './visualisers/spectrum'
import Waveform from './visualisers/waveform'

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
const canvas = document.getElementById('visualiser')
const visualisers = new Array(Waveform, Equaliser, Spectrum)
let vIndex = 0
let analyser

navigator.mediaDevices.getUserMedia({ audio: true, video: false, echoCancellation: true })
.then(function (stream) {
  const context = new (window.AudioContext || window.webkitAudioContext)()
  const processor = context.createScriptProcessor(0, 1, 1)
  const source = context.createMediaStreamSource(stream)
  analyser = context.createAnalyser()

  source.connect(processor)
  source.connect(analyser)
  processor.connect(context.destination)

  visualisers[vIndex].init(analyser)
  processor.onaudioprocess = function(e) {
    visualisers[vIndex].process(analyser)
    e.outputBuffer.getChannelData(0).forEach((v) => v = 0)
  }
})
.catch(err => window.alert(err))

const next = () => {
  vIndex = (vIndex + 1) % visualisers.length
  visualisers[vIndex].init(analyser)
}

document.body.onclick = e => next()
