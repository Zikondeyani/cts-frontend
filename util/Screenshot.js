const domtoimage = require('dom-to-image')

export class Screenshot {
  async take (div) {
    let dataUrl = await domtoimage.toJpeg(div, {
      quality: 1,
      bgcolor: 'white'
    })
    return dataUrl
  }
}
