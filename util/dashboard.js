import { Screenshot } from './Screenshot'
import { download, all_district_summaryCSV } from './download'
import { Visibility } from './Visibility'
import { generateCSV } from './generateCSV'
import { generateExcel } from './generateExcel'

export default {
  Screenshot: new Screenshot(),
  download,
  generateCSV,
  generateExcel,
  all_district_summaryCSV,
  Visibility: new Visibility()
}
