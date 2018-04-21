const canvas = document.getElementById('visualiser')
const scopeContext = canvas.getContext('2d')

export default {

  process: (analyser) => {
    const waveform = new Float32Array(analyser.frequencyBinCount)
    analyser.getFloatTimeDomainData(waveform)

    scopeContext.clearRect(0, 0, canvas.width, canvas.height)
    scopeContext.beginPath()
    for (let x = 0; x < waveform.length; x++) {
      const y = (0.5 + waveform[x] / 2) * canvas.height;
      x == 0 ? scopeContext.moveTo(x, y) : scopeContext.lineTo(x, y)
    }
    scopeContext.stroke()
  }

}
