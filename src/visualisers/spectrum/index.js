const canvas = document.getElementById('visualiser')
const ctx = canvas.getContext('2d')
let offset = 0

export default {

  init: (analyser) => {
    canvas.width = analyser.frequencyBinCount
    canvas.height = window.innerHeight
    canvas.style.height = '100vh';
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  },

  process: (analyser) => {
    const spectrum = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(spectrum)

    const slice = ctx.getImageData(0, offset, canvas.width, 1)
    for (let i = 0; i < spectrum.length; i++) {
      slice.data[4 * i + 0] = spectrum[i]  // R
      slice.data[4 * i + 1] = spectrum[i]  // G
      slice.data[4 * i + 2] = spectrum[i]  // B
      slice.data[4 * i + 3] = 255          // A
    }
    ctx.putImageData(slice, 0, offset)
    offset += 1
    offset %= canvas.height
  }

}