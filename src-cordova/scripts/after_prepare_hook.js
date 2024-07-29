const fs = require('fs');
const path = require('path');

const sourceFile = path.resolve(__dirname, '../electron-main.js');
const destinationFile = path.resolve(__dirname, '../../platforms/electron/electron-main.js');

fs.copyFileSync(sourceFile, destinationFile);
console.log('Copied electron-main.js after build.');
