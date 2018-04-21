const canvas = document.getElementById('visualiser')
const scopeContext = canvas.getContext('2d')
let offset = 0

export default {

  process: (analyser) => {
    const spectrum = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(spectrum)

    const slice = scopeContext.getImageData(0, offset, canvas.width, 1)
    for (let i = 0; i < spectrum.length; i++) {
      slice.data[4 * i + 0] = spectrum[i]  // R
      slice.data[4 * i + 1] = spectrum[i]  // G
      slice.data[4 * i + 2] = spectrum[i]  // B
      slice.data[4 * i + 3] = 255          // A
    }
    scopeContext.putImageData(slice, 0, offset)
    offset += 1
    offset %= canvas.height
  }

}