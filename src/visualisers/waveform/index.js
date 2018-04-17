
export default (analyser) => {
  const waveform = new Float32Array(analyser.frequencyBinCount)
  analyser.getFloatTimeDomainData(waveform)

  ;(function updateWaveform() {
    requestAnimationFrame(updateWaveform)
    analyser.getFloatTimeDomainData(waveform)
  })()

  const canvas = document.getElementById('visualiser')
  canvas.width = waveform.length
  canvas.height = window.innerHeight - 138
  const scopeContext = canvas.getContext('2d')

  ;(function drawOscilloscope() {
    requestAnimationFrame(drawOscilloscope)
    scopeContext.clearRect(0, 0, canvas.width, canvas.height)
    scopeContext.beginPath()
    for (let i = 0; i < waveform.length; i++) {
      const x = i
      const y = (0.5 + waveform[i] / 2) * canvas.height;
      i == 0 ? scopeContext.moveTo(x, y) : scopeContext.lineTo(x, y)
    }
    scopeContext.stroke()
  })()
}
