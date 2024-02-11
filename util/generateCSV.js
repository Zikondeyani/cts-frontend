import { d3 } from 'dc.leaflet'

import { capitalizeArrayOfObjectsKeysAndClean } from './capitalizeArrayofObjectKeysAndClean'
export const generateCSV = (newdata, columns) => {
  let data = [...newdata]
  //capitalize the headers and remove the under scores
  data = capitalizeArrayOfObjectsKeysAndClean(data)
  columns =
    columns && columns.length > 0
      ? columns.map(item => item.toUpperCase().replace(/_/g, ' '))
      : undefined
  data = d3.csvFormat(data, columns)
  if (!data.match(/^data:text\/csv/i)) {
    data = 'data:text/csv;charset=utf-8,' + data
  }
  return encodeURI(data)
}
