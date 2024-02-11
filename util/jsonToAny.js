import exportFromJSON from 'export-from-json'

export const exportData = (data, fileName,type) => {
    const exportType =  exportFromJSON.types[type]
    return exportFromJSON({ data, fileName, exportType })
}