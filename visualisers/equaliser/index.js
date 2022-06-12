const canvas = document.getElementById('visualiser')
const ctx = canvas.getContext('2d')
let pixelWidth = 0

export default {

  init: (analyser) => {
    analyser.spectrum = new Uint8Array(analyser.frequencyBinCount)
    pixelWidth = Math.ceil(window.innerWidth / analyser.frequencyBinCount)
    canvas.width = analyser.frequencyBinCount
    canvas.height = window.innerHeight / 2
    canvas.style.height = '50vh';
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  },

  process: (analyser) => {
    analyser.getByteFrequencyData(analyser.spectrum)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < analyser.spectrum.length; i++) {
      ctx.fillRect(
        i * pixelWidth, window.innerHeight / 2 - analyser.spectrum[i],
        pixelWidth, window.innerHeight / 2
      )
    }
  },

}