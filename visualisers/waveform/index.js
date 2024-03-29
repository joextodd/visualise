const canvas = document.getElementById('visualiser')
const ctx = canvas.getContext('2d')

export default {

  init: (analyser) => {
    analyser.waveform = new Float32Array(analyser.frequencyBinCount)
    canvas.width = analyser.waveform.length
    canvas.height = window.innerHeight
    canvas.style.height = '100vh';
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  },

  process: (analyser) => {
    analyser.getFloatTimeDomainData(analyser.waveform)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    for (let x = 0; x < analyser.waveform.length; x++) {
      const y = (0.5 + analyser.waveform[x] / 2) * canvas.height;
      x == 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

}
