const canvas = document.getElementById('visualiser')
const ctx = canvas.getContext('2d')

export default {

  init: (analyser) => {
    canvas.width = analyser.frequencyBinCount
    canvas.height = window.innerHeight / 2
    canvas.style.height = '50vh';
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  },

  process: (analyser) => {
    const spectrum = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(spectrum)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < spectrum.length; i++) {
      ctx.fillRect(i * 3, window.innerHeight / 2 - spectrum[i], 1, window.innerHeight / 2)
    }
  },

}