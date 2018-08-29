const canvas = document.getElementById('visualiser')
const ctx = canvas.getContext('2d')
let offset = 0

export default {

  init: analyser => {
    canvas.width = window.innerWidth
    canvas.height = analyser.frequencyBinCount
    canvas.style.height = '100vh'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    offset = canvas.width
  },

  process: analyser => {
    let spectrum = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(spectrum)

    const slice = ctx.getImageData(offset, 0, 1, canvas.height)
    for (let i = 0; i < spectrum.length; i++) {
      slice.data[4 * i + 0] = spectrum[spectrum.length - i]  // R
      slice.data[4 * i + 1] = spectrum[spectrum.length - i]  // G
      slice.data[4 * i + 2] = spectrum[spectrum.length - i]  // B
      slice.data[4 * i + 3] = 255          // A
    }
    ctx.putImageData(slice, offset, 0)
    offset += 1
    offset %= canvas.width
  }

}