const canvas = document.getElementById('visualiser')
const ctx = canvas.getContext('2d')
let offset = 0

export default {

  init: analyser => {
    analyser.spectrum = new Uint8Array(analyser.frequencyBinCount)
    canvas.width = window.innerWidth
    canvas.height = analyser.frequencyBinCount
    canvas.style.height = '100vh'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    offset = canvas.width
  },

  process: analyser => {
    analyser.getByteFrequencyData(analyser.spectrum)

    const slice = ctx.getImageData(offset, 0, 1, canvas.height)
    for (let i = 0; i < analyser.spectrum.length; i++) {
      slice.data[4 * i + 0] = analyser.spectrum[analyser.spectrum.length - i]  // R
      slice.data[4 * i + 1] = analyser.spectrum[analyser.spectrum.length - i]  // G
      slice.data[4 * i + 2] = analyser.spectrum[analyser.spectrum.length - i]  // B
      slice.data[4 * i + 3] = 255                            // A
    }
    ctx.putImageData(slice, offset, 0)
    offset += 1
    offset %= canvas.width
  }

}