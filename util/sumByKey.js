import _ from "lodash"

export const sumByKey=(array, key)=>{
  return _.sumBy(array, item => {
        return (+item[key] || 0);
  })
}