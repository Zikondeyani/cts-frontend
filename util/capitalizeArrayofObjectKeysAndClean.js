export const capitalizeArrayOfObjectsKeysAndClean = data => {
  data = data.map(item =>
    Object.keys(item).reduce((accumulator, key) => {
      if (key.indexOf('__') !== -1)
        accumulator[key.replace(/_/g, ' ').replace(/_/g, ' ')] = item[key]
      else {
        accumulator[key.toUpperCase().replace(/_/g, ' ')] = item[key]
      }
      return accumulator
    }, {})
  )
  return data
}
