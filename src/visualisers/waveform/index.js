const canvas = document.getElementById('visualiser')
const scopeContext = canvas.getContext('2d')

export default {

  process: (data) => {
    scopeContext.clearRect(0, 0, canvas.width, canvas.height)
    scopeContext.beginPath()
    for (let x = 0; x < data.length; x++) {
      const y = (0.5 + data[x] / 2) * canvas.height;
      x == 0 ? scopeContext.moveTo(x, y) : scopeContext.lineTo(x, y)
    }
    scopeContext.stroke()
  }

}
