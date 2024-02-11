import { download } from './download'
import * as ExcelJS from 'exceljs'

/* sample data and you can also send data without sheet field and which means all will be in one sheet named SHEET1
let data = [
  { name: 'mika', sheet: 'sheet1', age: 50 },
  { name: 'ben', age: 23, sheet: 'sheet2' },
  { name: 'dan', age: 78, sheet: 'sheet1' },
  { name: 'mika', age: 10, sheet: 'sheet2' }
]

or

let data = [
  { name: 'mika', age: 50 },
  { name: 'ben', age: 23,  },
  { name: 'dan', age: 78,  },
  { name: 'mika', age: 10,  }
]


generateExcel(data) */

export const generateExcel = async (data, sheets = []) => {
  console.log("SHEEEEEEE",data)
  const workbook = workbookFactory()
  sheets =
    sheets.length > 0 ? sheets : [...new Set(data.map(item => item.sheet))]
  if (data.length > 0 && data[0].sheet == undefined) {
    var worksheet = workbook.addWorksheet('SHEET1')
    let sheetData = data
    worksheet = buildWorksheet(worksheet, sheetData)
  } else
    sheets.forEach(sheet => {
      var worksheet = workbook.addWorksheet(sheet.toUpperCase())
      let sheetData = data.filter(row => row.sheet == sheet)
      worksheet = buildWorksheet(worksheet, sheetData)
    })

  downloadExcel(workbook)
}

export const generateTAGVHExcel = async (data, sheets = []) => {
  const workbook = workbookFactory()
  sheets =
    sheets.length > 0 ? sheets : [...new Set(data.map(item => item.sheet))]
  if (data[0].sheet == undefined) {
    var worksheet = workbook.addWorksheet('DATA')
    let sheetData = data
    worksheet = buildWorksheet(worksheet, sheetData)
  } else
    sheets.forEach(sheet => {
      var worksheet = workbook.addWorksheet(sheet.toUpperCase())

      let sheetData = data.filter(row => row.sheet == sheet)
      worksheet = buildWorksheet(worksheet, sheetData)

      worksheet.eachRow(function (row, rowNumber) {
        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
          if (checkSector(cell, 'shelter')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffffa6' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else if (checkSector(cell, 'displaced')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffffd7' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else if (checkSector(cell, 'health')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffdbb6' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else if (checkSector(cell, 'agriculture')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffd7d7' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else if (checkSector(cell, 'food')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'e0c2cd' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else if (checkSector(cell, 'wash')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'dedce6' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else if (checkSector(cell, 'logistics')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'dee7e5' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else if (checkSector(cell, 'environment')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'dde8cb' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else if (checkSector(cell, 'livelihoods')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'f6f9d4' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else if (checkSector(cell, 'nutrition')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'e8f2a1' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else if (checkSector(cell, 'protection')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'd4ea6b' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else if (checkSector(cell, 'education')) {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffaa95' }
            }
            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          } else {
            worksheet.getCell(cell.address).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'eeeeee' }
            }

            worksheet.getCell(cell.address).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          }
        })
      })
    })

  downloadExcel(workbook)
}

const checkSector = (cell, val) => {
  return cell._column._header.toUpperCase().includes(val.toUpperCase())
}

const buildWorksheet = (worksheet, sheetData) => {
  let sheetHeaders = []

  Object.keys(sheetData[0]).forEach(item =>
    item != 'sheet'
      ? sheetHeaders.push({
          header: item.toUpperCase(),
          key: item,
          width: item.length + 1
        })
      : ''
  )
  worksheet.columns = sheetHeaders
  var rows = sheetData
  worksheet.addRows(rows)

  worksheet.columns.forEach(function (column) {
    var dataMax = 0
    column.eachCell({ includeEmpty: true }, function (cell) {
      var columnLength = cell.value ? cell.value.length : 0
      if (columnLength > dataMax) {
        dataMax = columnLength
      }
    })
    let maxWidth = dataMax < 10 ? 10 : dataMax

    column.width = column.width > maxWidth ? column.width : maxWidth
  })

  return worksheet
}

const downloadExcel = workbook => {
  let blobType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

  workbook.xlsx.writeBuffer().then(data => {
    const blob = new Blob([data], { type: blobType })
    download(blob, 'xlsx')
  })
}

const workbookFactory = () => {
  let workbook = new ExcelJS.Workbook()
  workbook.creator = 'DRMIS System'
  workbook.created = new Date()
  return workbook
}
