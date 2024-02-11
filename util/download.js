import * as FileSaver from 'file-saver'

export const download = (dataUrl, ext = 'jpg',title="download") => {
 FileSaver.saveAs(dataUrl, `${title}${Date.now()}.${ext}`)
}

export const all_district_summaryCSV = (dataUrl, ext = 'jpg') => {
  FileSaver.saveAs(dataUrl, `Cummulative Number of Disasters${Date.now()}.${ext}`)
}

export const downloadFromUrl = (url, ext,title) => {
  fetch(url).then(function (t) {
    return t.blob().then(b => {
      download(URL.createObjectURL(b), ext,title)
    })
  })
}